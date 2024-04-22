import React, { useEffect, useRef } from "react";
import CSS from "csstype";
import { LedgerClientFactory } from "@signumjs/core";
import AllNftList from "./allNftList";
import { useState } from "react";
import { ContractDataView } from "@signumjs/contracts";
import PopupModal from "./modelTrial";
import AllNftLoading from "./allNftLoading";
import NftDetails from "./nftDetails";

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
  const ledger2 = LedgerClientFactory.createClient({ nodeHost:"https://europe2.signum.network" });
  const newNftCodeHashId = "15519954399276214446";
  //const newNftCodeHashId = "15155055045342098571";
  const nftDistributor = "4572964086056463895";
  const [selectedNftInfo, setSelectedNftInfo] = useState<selectedNftInfo>();
  const [nftInfo, setNftInfo] = useState<nftInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [isPopUpIcon, setIsPopUpIcon] = useState<boolean>(false);


  const hasRendered = useRef(false);
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

    let nftStorages = nftList.ats;
    let nftStorages2 = nftList2.ats;
    let nftStorages3 = nftList3.ats;
    Array.prototype.push.apply(nftStorages, nftStorages2);
    Array.prototype.push.apply(nftStorages, nftStorages3);

    var index = 0;
    var InfoJson: urlObject[] = [];
    for (var i = 0; i < nftStorages.length; i++) {
      try {
        const des = JSON.parse(nftStorages[i].description).descriptor;
        const info: urlObject = { url: `https://ipfs.io/ipfs/${des}`, nftId: nftStorages[i].at, index: i };
        InfoJson.push(info);
      } catch {

        const info: urlObject = { url: "", nftId: "123", index: i };
        InfoJson.push(info);
      }
    }

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
                contractPrice: nftContract.getVariableAsDecimal(9),
                contractOwner: nftContract.getVariableAsDecimal(5),
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

    InfoJson.map((InfoJson) => {
      //if (mergedArray[InfoJson.index].contractOwner !== nftDistributor) {
        requests2.push(
          fetch(InfoJson.url)
            .then((res) => res.text())
            .then((res) => {
              try {
                const text = JSON.parse(res);

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

                mergedArray[InfoJson.index] = { ...mergedArray[InfoJson.index], imageUrl: text.media[0].social, nftLevel: levelNumber, nftNumber: number,nftReward:reward };
              } catch (e) {

                mergedArray[InfoJson.index] = { ...mergedArray[InfoJson.index], imageUrl: "", nftLevel: "1", nftNumber: -1,nftReward:"0" };
              }
            })
            .catch((err) => {
              console.log(err);
              mergedArray[InfoJson.index] = { ...mergedArray[InfoJson.index], imageUrl: "", nftLevel: "1", nftNumber: -1,nftReward:"0" };
            })
        );
      
    });

    await Promise.all(requests2);

    setNftInfo(mergedArray);
    setLoading(false);


  }

  useEffect(() => {
    if (hasRendered.current === false) {
      hasRendered.current = true;
      getNftList();
    }
  });
  return (
    <>
      {/* {loading ? (
        <AllNftLoading></AllNftLoading>
      ) : openModel ? (
        <>
          <NftDetails imgAddress={selectedNftInfo} setPopUpIcon={setOpenModel} popUpIcon={openModel}></NftDetails>
        </>
      ) : (
        <>
          <AllNftList setSelectedImageAddress={setSelectedNftInfo} isPopUpIcon={isPopUpIcon} setIsPopUpIcon={setIsPopUpIcon} nftInfoArray={nftInfo} CustomModel={PopupModal} setOpenModel={setOpenModel} openModel={openModel}></AllNftList>
        </>
      )} */}



{loading ? (
        <AllNftLoading></AllNftLoading>
      ) : 
        <>
          <AllNftList setSelectedImageAddress={setSelectedNftInfo} isPopUpIcon={isPopUpIcon} setIsPopUpIcon={setIsPopUpIcon} nftInfoArray={nftInfo} CustomModel={PopupModal} setOpenModel={setOpenModel} openModel={openModel}></AllNftList>
        </>
      
      }
    </>
  );
};
