import React, { useEffect, useRef } from "react";
import CSS from "csstype";
import { LedgerClientFactory } from "@signumjs/core";
import AllNftList from "./allNftList";
import { useSelector } from "react-redux";
import { walletNodeHost } from "../../redux/wallet";
import { GetAllNftList } from "../../NftSystem/displayNft/displayNfts";
import { useState } from "react";
import { getContract } from "../../NftSystem/displayNft/getAllNftList";
import { json } from "stream/consumers";
import AllNft from "./allNft";
import LoadingMintingMyNftList from "../myNftList/loadMintingMyNftList";
import { CustomModel } from "./allNftModel";
import { ContractDataView } from "@signumjs/contracts";
import PopupModal from "./modelTrial";
import AllNftLoading from "./allNftLoading";
import NftDetails from "../../components/nftDetails";
import { convertWordToNumber } from "../../NftSystem/Reward/getRewardPercentage";
import { NFTDetailPopUpWindow } from "../../components/popupWindow";
import { getDomains } from "../../components/ipfsImgComponent";
import { fetchIPFSJSON } from "../../NftSystem/updateUserNftStorage";

interface IINDEXAllNftListProps {}
export interface nftImage {
  imageUrl: string;
  nftLevel: any;
}
export interface nftObject {
  contractId: string;
  contractPrice: string;
  contractOwner: string;
  contractStatus: string;
}

export interface nftInfo {
  contractId: string;
  contractPrice: string;
  contractOwner: string;
  imageUrl: string;
  nftLevel: string;
  nftStatus: string;
  nftNumber: number;
  nftReward: string;
}
export interface urlObject {
  url: string;
  nftId: string;
  index: number;
}
export interface selectedNftInfo {
  imageUrl: string;
  nftLevel: string;
  nftPrice: string;
  nftReward: string;
  nftNumber: string;
}

const getNFTstatus = (nftStatus: string) => {
  switch (nftStatus) {
    case "15":
      return "Not For Sale";
    case "16":
      return "For Sale in Signa";
    case "17":
      return "BUY";
    case "18":
      return "For Sale in Sigdao and Signa";
    case "19":
      return "For Auction in Signa";
    case "20":
      return "Auction";
    default:
      return "";
  }
};

export const IndexAllNftList: React.FC<IINDEXAllNftListProps> = (props) => {
  const nodeHost = useSelector(walletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const newNftCodeHashId = process.env.REACT_APP_NEW_NFT_CONTRACT_CODE_ID!;
  //const newNftCodeHashId = "15155055045342098571";
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const [allNftList, setAllNftList] = useState<number[]>([]);
  const [selectedNftInfo, setSelectedNftInfo] = useState<selectedNftInfo>();
  const [nftInfo, setNftInfo] = useState<nftInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [nftSelectedImage, setNftSelectedImage] = useState<string>("");
  const [selectedImageAddress, setSelectImageAddress] = useState<string>("");
  const [isPopUpNFTDetailWinodow, setIsPopUpNFTDetailWinodow] = useState<boolean>(false);
  const isTestnet = process.env.REACT_APP_NODE_ADDRESS?.includes("testnet");
  const hasRendered = useRef(false);
  const sleep = (delay: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };

  // async function getNFTdetail(nftInfo: urlObject) {
  //   ledger2.contract
  //   .getContract(nftInfo.nftId)
  //   .then((res) => {
  //     var nftContract = new ContractDataView(res);
  //     var nftStatus = nftContract.getVariableAsDecimal(10);
  //     // add the nft info to the merged array
  //     mergedArray[nftStorage.index] = {
  //       ...mergedArray[nftStorage.index],
  //       contractId: nftStorage.nftId,
  //       contractPrice: nftContract.getVariableAsDecimal(9),
  //       contractOwner: nftContract.getVariableAsDecimal(5),
  //       nftStatus: getNFTstatus(nftStatus),
  //       nftNumber: nftStorage.index,
  //     };
  //     // nftInfo.push({
  //     //   contractId: nftStorage.nftId,
  //     //   contractPrice: nftContract.getVariableAsDecimal(10),
  //     //   contractOwner: nftContract.getVariableAsDecimal(6),
  //     //   contractStatus:nftStatus,
  //     // });
  //   })
  //   .catch((err) => {
  //     mergedArray[nftStorage.index] = {
  //       ...mergedArray[nftStorage.index],
  //       contractId: nftStorage.nftId,
  //       contractPrice: "0",
  //       contractOwner: "0",
  //       nftStatus: "15",
  //       nftReward: "0"
  //     };
  //   }),
  // }

  async function getIPFSInfo(info: urlObject, mergedItem: nftInfo): Promise<nftInfo> {
    const domain = getDomains(info.url);
    const returnObject = { ...mergedItem };

    for (let address of domain) {
      fetch(address)
        .then((res) => res.text())
        .then((res) => {
          try {
            const text = JSON.parse(res);
            const levelNumber = text.description.match(/Level (\d+)/)?.[1];
            const level = convertWordToNumber(text.attributes[6].value);
            const reward = isNaN(level) ? "" : (level / 3).toFixed(2).toString();
            const string = text.name;
            const regex = /#(\d+)/;
            const match = string.match(regex);
            const number = match ? parseInt(match[1]) : -1;
            returnObject.imageUrl = text.media[0].social;
            returnObject.nftLevel = levelNumber;
            returnObject.nftNumber = number;
            returnObject.nftReward = reward;
            return returnObject;
          } catch (e) {
            console.log(e);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    returnObject.imageUrl = "";
    returnObject.nftLevel = "1";
    returnObject.nftNumber = -1;
    returnObject.nftReward = "0";
    return returnObject;
  }

  async function getNftList() {
    // const nftList = await ledger2.contract.getContractsByAccount({
    //     accountId: nftDistributor,
    //     machineCodeHash: newNftCodeHashId,
    // });

    var nftList = await ledger2.contract.getAllContractsByCodeHash({
      machineCodeHash: newNftCodeHashId,
      includeDetails: true,
      firstIndex: 0,
      lastIndex: 500,
    });

    // var nftList2 = await ledger2.contract.getAllContractsByCodeHash({
    //   machineCodeHash: newNftCodeHashId,
    //   includeDetails: true,
    //   firstIndex: 500,
    //   lastIndex: 1000,
    // });
    // //await sleep(2000);
    // var nftList3 = await ledger2.contract.getAllContractsByCodeHash({
    //   machineCodeHash: newNftCodeHashId,
    //   includeDetails: true,
    //   firstIndex: 1000,
    //   lastIndex: 1100,
    // });

    let nftStorages = nftList.ats;
    // let nftStorages2 = nftList2.ats;
    // let nftStorages3 = nftList3.ats;
    // Array.prototype.push.apply(nftStorages, nftStorages2);
    // Array.prototype.push.apply(nftStorages, nftStorages3);
    console.log("nft Storages is",nftStorages);
    var index = 0;
    var InfoJson: urlObject[] = [];
    for (var i = 0; i < nftStorages.length; i++) {
      try {
        const des = JSON.parse(nftStorages[i].description).descriptor;
        const info: urlObject = {
          url: des,
          nftId: nftStorages[i].at,
          index: i,
        };
        InfoJson.push(info);
      } catch {
        const info: urlObject = { url: "", nftId: "123", index: i };
        InfoJson.push(info);
      }
    }
    console.log("infoJson is",InfoJson);
    var urls: string[] = [];
    var nftInfo: nftObject[] = [];
    var mergedArray: nftInfo[] = new Array(nftStorages.length).fill({}) as nftInfo[];
    const requests: Promise<void>[] = [];

    InfoJson.map((nftStorage) => {
      if (nftStorage.nftId !== "123") {
        requests.push(
          ledger2.contract
            .getContract(nftStorage.nftId)
            .then((res) => {
              var nftContract = new ContractDataView(res);
              var nftStatus = nftContract.getVariableAsDecimal(10);
              console.log("isTestnet",isTestnet);
              console.log("process is",process.env.REACT_APP_NODE_ADDRESS);
              console.log("is testnet",process.env.REACT_APP_NODE_ADDRESS?.includes("testnet"));
              // add the nft info to the merged array
              if(isTestnet === true ){
                mergedArray[nftStorage.index] = {
                  ...mergedArray[nftStorage.index],
                  contractId: nftStorage.nftId,
                  contractPrice: nftContract.getVariableAsDecimal(9),
                  contractOwner: process.env.REACT_APP_NFT_DISTRIBUTOR!,
                  nftStatus: "Not For Sale",
                  nftNumber: nftStorage.index,
                };
              }
              else{
              mergedArray[nftStorage.index] = {
                ...mergedArray[nftStorage.index],
                contractId: nftStorage.nftId,
                contractPrice: nftContract.getVariableAsDecimal(9),
                contractOwner: nftContract.getVariableAsDecimal(5),
                nftStatus: getNFTstatus(nftStatus),
                nftNumber: nftStorage.index,
              };
            }
              // nftInfo.push({
              //   contractId: nftStorage.nftId,
              //   contractPrice: nftContract.getVariableAsDecimal(10),
              //   contractOwner: nftContract.getVariableAsDecimal(6),
              //   contractStatus:nftStatus,
              // });
            })
            .catch((err) => {
              mergedArray[nftStorage.index] = {
                ...mergedArray[nftStorage.index],
                contractId: nftStorage.nftId,
                contractPrice: "0",
                contractOwner: "0",
                nftStatus: "15",
                nftReward: "0",
              };
            }),
        );
      }
    });
    await Promise.all(requests);
    const requests2: Promise<void>[] = [];

    InfoJson.forEach((info) => {
      const mergedItem = mergedArray[info.index];
      if (mergedItem.contractOwner === nftDistributor) {
        requests2.push(
          fetchIPFSJSON(info.url)
            .then((text) => {
              try {
                const levelNumber = text.description.match(/Level (\d+)/)?.[1];
                var reward = "0";
                const level = convertWordToNumber(text.attributes[6].value);
                console.log("level is", level);
                if (isNaN(level) === false) {
                  console.log((level / 3).toString());
                  reward = (level / 3).toFixed(2).toString();
                } else {
                  reward = "";
                }
                const string = text.name;
                const regex = /#(\d+)/;
                const match = string.match(regex);
                var number = -1;
                if (match) {
                  number = parseInt(match[1]); // this is the nft number
                }

                mergedArray[info.index] = { ...mergedArray[info.index], imageUrl: text.media[0].social, nftLevel: levelNumber, nftNumber: number, nftReward: reward };
              } catch (e) {
                mergedArray[info.index] = { ...mergedArray[info.index], imageUrl: "", nftLevel: "1", nftNumber: -1, nftReward: "0" };
              }
            })
            .catch((err) => {
              mergedArray[info.index] = { ...mergedArray[info.index], imageUrl: "", nftLevel: "1", nftNumber: -1, nftReward: "0" };
            }),

          // getIPFSInfo(info, mergedItem).then((result) => {
          //   mergedArray[info.index] = result;
          // }),
        );
      }
    });

    try {
      await Promise.all(requests2);
    } catch (error) {
      console.log(error);
    }
    console.log("merged Array is",mergedArray);
    setNftInfo(mergedArray);
    setLoading(false);

    // try {
    //   InfoJson.forEach((info) => {

    //     if (info != null && info != "error") {
    //       urls.push(`https://ipfs.io/ipfs/${info}`);
    //     } else {
    //       urls.push(``);
    //     }
    //   });
    //   var imageUrl: nftImage[] = [];
    //   const requests = urls.map((url) =>
    //     fetch(url)
    //       .then((res) => res.text())
    //       .then((res) => {
    //         try {
    //           const text = JSON.parse(res);
    //           const levelNumber = text.description.match(/Level (\d+)/)?.[1];

    //           imageUrl.push({ imageUrl: text.media[0].social, nftLevel: levelNumber });
    //         } catch (e) {

    //           imageUrl.push({ imageUrl: "", nftLevel: "" });
    //         }
    //       }).catch((err) => {

    //         imageUrl.push({ imageUrl: "", nftLevel: "" });
    //       })
    //   );
    //   nftStorages.forEach((nftStorage) => {
    //     requests.push(
    //       ledger2.contract.getContract(nftStorage.at).then((res) => {
    //         var nftContract = new ContractDataView(res);
    //         var nftStatus = nftContract.getVariableAsDecimal(11) ;
    //         if(nftStatus === "15"){
    //           nftStatus = "Not For Sell";
    //         }
    //         if(nftStatus === "16"){
    //           nftStatus = "For Sell in Signa";
    //         }
    //         if(nftStatus === "17"){
    //           nftStatus = "Buy";
    //         }
    //         if(nftStatus === "18"){
    //           nftStatus = "For Sell in SIGDAO and Signa";
    //         }
    //         if(nftStatus === "19"){
    //           nftStatus = "For Auction in Signa";
    //         }
    //         if(nftStatus === "20"){
    //           nftStatus = "Auction";
    //         }
    //         nftInfo.push({
    //           contractId: nftStorage.at,
    //           contractPrice: nftContract.getVariableAsDecimal(10),
    //           contractOwner: nftContract.getVariableAsDecimal(6),
    //           contractStatus:nftStatus,
    //         });
    //       })
    //       .catch((err) => {
    //         nftInfo.push({
    //           contractId: "error",
    //           contractPrice: "error",
    //           contractOwner: "error",
    //           contractStatus:"15",
    //         });
    //       }
    //       )
    //     );
    //   });

    //   // requests.push(
    //   //     const account = ledger2.contract.getContract(nftStorages[0].at);

    //   //     var nftContract = new ContractDataView(account);

    //   // );
    //   await Promise.all(requests);

    //   const account = await ledger2.contract.getContract(nftStorages[0].at);

    //   var nftContract = new ContractDataView(account);

    //   //const results = await Promise.all(promises);
    //   //const array = getContract(ledger2,nftStorages);
    //   const mergedArray: nftInfo[] = [];
    //   for (var i = 0; i < nftInfo.length; i++) {
    //     mergedArray.push({
    //       contractId: nftInfo[i].contractId,
    //       contractPrice: nftInfo[i].contractPrice,
    //       contractOwner: nftInfo[i].contractOwner,
    //       imageUrl: imageUrl[i].imageUrl,
    //       nftLevel: imageUrl[i].nftLevel,
    //       nftStatus:nftInfo[i].contractStatus,
    //     });
    //   }

    //   setNftInfo(mergedArray);
    //   setLoading(false);
    //   // responses.forEach(res => console.log(res));
    // } catch (e) {
    //   console.log(e);
    // }
  }

  useEffect(() => {
    if (hasRendered.current === false) {
      console.log("testing for the first time");

      hasRendered.current = true;
      getNftList();
    }
  }, []);
  return (
    <>
      {loading ? (
        <AllNftLoading />
      ) : (
        <NFTDetailPopUpWindow
          isPopUpNFTDetailWinodow={openModel}
          isNFTiconLoading={false}
          imgAddress={selectedNftInfo?.imageUrl ?? ""}
          level={selectedNftInfo?.nftLevel ?? ""}
          rewardPercentage={selectedNftInfo?.nftReward ?? ""}
          setIsPopUpNFTDetailWinodow={setOpenModel}
        >
          <AllNftList
            setSelectedImageAddress={setSelectedNftInfo}
            isPopUpNFTDetailWinodow={isPopUpNFTDetailWinodow}
            setIsPopUpNFTDetailWinodow={setIsPopUpNFTDetailWinodow}
            nftInfoArray={nftInfo}
            CustomModel={PopupModal}
            setOpenModel={setOpenModel}
            openModel={openModel}
          />
        </NFTDetailPopUpWindow>
      )}
    </>
  );
};
