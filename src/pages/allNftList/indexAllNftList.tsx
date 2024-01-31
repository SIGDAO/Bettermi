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

interface IINDEXAllNftListProps {

}
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
  nftReward:string;
}
export interface urlObject {
  url: string;
  nftId: string;
  index: number;
}
export interface selectedNftInfo{
  imageUrl:string,
  nftLevel:string,
  nftPrice:string,
  nftReward:string,
  nftNumber:string,
}

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
  const [selectedImageAddress,setSelectImageAddress] = useState<string>("");
  const [isPopUpIcon, setIsPopUpIcon] = useState<boolean>(false);


  const hasRendered = useRef(false);
  const sleep = (delay: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };
  async function getNftList() {
    // const nftList = await ledger2.contract.getContractsByAccount({
    //     accountId: nftDistributor,
    //     machineCodeHash: newNftCodeHashId,
    // });
    console.log(newNftCodeHashId);
    var nftList = await ledger2.contract.getAllContractsByCodeHash({
      machineCodeHash: newNftCodeHashId,
      includeDetails: true,
      firstIndex: 0,
      lastIndex: 500,
    });
    console.log(nftList);
    var nftList2 = await ledger2.contract.getAllContractsByCodeHash({
      machineCodeHash: newNftCodeHashId,
      includeDetails: true,
      firstIndex: 500,
      lastIndex: 1000,
    });
    //await sleep(2000);
    var nftList3 = await ledger2.contract.getAllContractsByCodeHash({
      machineCodeHash: newNftCodeHashId,
      includeDetails: true,
      firstIndex: 1000,
      lastIndex: 1100,
    });
    console.log(nftList2);
    let nftStorages = nftList.ats;
    let nftStorages2 = nftList2.ats;
    let nftStorages3 = nftList3.ats;
    Array.prototype.push.apply(nftStorages, nftStorages2);
    Array.prototype.push.apply(nftStorages, nftStorages3);
    console.log(nftStorages);
    var index = 0;
    var InfoJson: urlObject[] = [];
    for (var i = 0; i < nftStorages.length; i++) {
      try {
        const des = JSON.parse(nftStorages[i].description).descriptor;
        const info: urlObject = { url: `https://ipfs.io/ipfs/${des}`, nftId: nftStorages[i].at, index: i };
        InfoJson.push(info);
      } catch {
        console.log(nftStorages[i].description);
        const info: urlObject = { url: "", nftId: "123", index: i };
        InfoJson.push(info);
      }
    }
    console.log(InfoJson);
    var urls: string[] = [];
    var nftInfo: nftObject[] = [];
    var mergedArray: nftInfo[] = new Array(nftStorages.length).fill({}) as nftInfo[];
    const requests: Promise<void>[] = [];
    InfoJson.map((nftStorage) => {
      console.log(nftStorage);
      if (nftStorage.nftId !== "123") {
        console.log(nftStorage);
        requests.push(
          ledger2.contract
            .getContract(nftStorage.nftId)
            .then((res) => {
              var nftContract = new ContractDataView(res);
              var nftStatus = nftContract.getVariableAsDecimal(11);
              if (nftStatus === "15") {
                nftStatus = "Not For Sale";
              }
              if (nftStatus === "16") {
                nftStatus = "For Sale in Signa";
              }
              if (nftStatus === "17") {
                nftStatus = "BUY";
              }
              if (nftStatus === "18") {
                nftStatus = "For Sale in Sigdao and Signa";
              }
              if (nftStatus === "19") {
                nftStatus = "For Auction in Signa";
              }
              if (nftStatus === "20") {
                nftStatus = "Auction";
              }
              mergedArray[nftStorage.index] = {
                ...mergedArray[nftStorage.index],
                contractId: nftStorage.nftId,
                contractPrice: nftContract.getVariableAsDecimal(10),
                contractOwner: nftContract.getVariableAsDecimal(6),
                nftStatus: nftStatus,
                nftNumber: nftStorage.index,
              };
              // nftInfo.push({
              //   contractId: nftStorage.nftId,
              //   contractPrice: nftContract.getVariableAsDecimal(10),
              //   contractOwner: nftContract.getVariableAsDecimal(6),
              //   contractStatus:nftStatus,
              // });
            })
            .catch((err) => {
              mergedArray[nftStorage.index] = { ...mergedArray[nftStorage.index], contractId: nftStorage.nftId, contractPrice: "0", contractOwner: "0", nftStatus: "15",nftReward:"0" };
            })
        );
      }
    });
    await Promise.all(requests);
    const requests2: Promise<void>[] = [];
    console.log(mergedArray);
    InfoJson.map((InfoJson) => {
      if (mergedArray[InfoJson.index].contractOwner !== nftDistributor) {
        requests2.push(
          fetch(InfoJson.url)
            .then((res) => res.text())
            .then((res) => {
              try {
                const text = JSON.parse(res);
                console.log(text);
                const levelNumber = text.description.match(/Level (\d+)/)?.[1];
                var reward = "0"
                if(levelNumber === "1"){
                  reward = "5"
                }
                if(levelNumber === "2"){
                  reward = "10"
                }
                if(levelNumber === "3"){
                  reward = "15"
                }
                const string = text.name;
                const regex = /#(\d+)/;
                const match = string.match(regex);
                var number = -1;
                if (match) {
                  number = parseInt(match[1]); // this is the nft number
                }
                console.log(levelNumber);
                mergedArray[InfoJson.index] = { ...mergedArray[InfoJson.index], imageUrl: text.media[0].social, nftLevel: levelNumber, nftNumber: number,nftReward:reward };
              } catch (e) {
                console.log(res);
                mergedArray[InfoJson.index] = { ...mergedArray[InfoJson.index], imageUrl: "", nftLevel: "1", nftNumber: -1,nftReward:"0" };
              }
            })
            .catch((err) => {
              console.log(err);
              mergedArray[InfoJson.index] = { ...mergedArray[InfoJson.index], imageUrl: "", nftLevel: "1", nftNumber: -1,nftReward:"0" };
            })
        );
      }
    });

    await Promise.all(requests2);
    console.log(mergedArray);
    setNftInfo(mergedArray);
    setLoading(false);

    // try {
    //   InfoJson.forEach((info) => {
    //     console.log(info);
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
    //           console.log(levelNumber);
    //           imageUrl.push({ imageUrl: text.media[0].social, nftLevel: levelNumber });
    //         } catch (e) {
    //           console.log(res);
    //           imageUrl.push({ imageUrl: "", nftLevel: "" });
    //         }
    //       }).catch((err) => {
    //         console.log(err);
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
    //   //     console.log(account);
    //   //     var nftContract = new ContractDataView(account);
    //   //     console.log(nftContract.getVariableAsDecimal(6));
    //   // );
    //   await Promise.all(requests);
    //   console.log(nftInfo);
    //   console.log(imageUrl);
    //   //console.log(nftStorages);
    //   const account = await ledger2.contract.getContract(nftStorages[0].at);
    //   console.log(account);
    //   var nftContract = new ContractDataView(account);
    //   console.log(nftContract.getVariableAsDecimal(6));
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
    //   //console.log("results:",results);
    //   console.log(imageUrl);
    //   setNftInfo(mergedArray);
    //   setLoading(false);
    //   // responses.forEach(res => console.log(res));
    // } catch (e) {
    //   console.log(e);
    // }
  }

  useEffect(() => {
    // ledger2.contract.getContractsByAccount({
    //         accountId: nftDistributor,
    //         machineCodeHash: newNftCodeHashId,
    //     }).then((nftList) => {
    //         console.log(nftList);
    //     }).catch((err)=>{
    //         console.log(err);
    //     });
    if (hasRendered.current === false) {
      hasRendered.current = true;
      getNftList();
    }
  });
  return (
    <>
      {loading ? (
        <AllNftLoading></AllNftLoading>
      ) : openModel ? (
        <>
          {/* <CustomModel level={"1"} setOpenModel={setOpenModel} openModel={openModel}></CustomModel> */}
          {/* <PopupModal level = {"1"} isOpen={openModel} setIsOpen={setOpenModel}></PopupModal> */}
          <NftDetails imgAddress={selectedNftInfo} setPopUpIcon={setOpenModel} popUpIcon={openModel}></NftDetails>
        </>
      ) : (
        <>
          <AllNftList setSelectedImageAddress={setSelectedNftInfo} isPopUpIcon={isPopUpIcon} setIsPopUpIcon={setIsPopUpIcon} nftInfoArray={nftInfo} CustomModel={PopupModal} setOpenModel={setOpenModel} openModel={openModel}></AllNftList>
        </>
      )}
      {/* {openModel?(
        <>
            {console.log(openModel)}
            <CustomModel level = {"1"} openModel={openModel} setOpenModel={setOpenModel}></CustomModel>
        </>
        ):(
        <>
        </>
        )} */}
    </>
  );
};
