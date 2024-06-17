import * as React from "react";
import "./myNftList.css";
import { useSelector } from "react-redux";
import { accountId, accountPublicKey } from "../../redux/account";
import { useState } from "react";
import { useEffect } from "react";
import { useAppSelector } from "../../redux/useLedger";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";
import { useLocation, useNavigate } from "react-router-dom";
import MyNftList from "./myNftList";
import { FindLatestTransactionArray, FindLatestTransactionNumber } from "../../NftSystem/updateUserNftStorage";
import { getNftContractStorage } from "../../redux/account";
import { useRef } from "react";
import LoadingMinting from "../loadingMinting/loadingMinting";
import LoadingMintingMyNftList from "./loadMintingMyNftList";
import { ShortTitleBar } from "../../components/titleBar";
import { IsUserUpdatingIcon } from "../../NftSystem/updateUserNftStorage";
import { GetEquippedNftId } from "../../NftSystem/updateUserNftStorage";
import { selectedNftInfo } from "../allNftList/indexAllNftList";
import NftDetails from "../../components/nftDetails";
import { NFTDetailPopUpWindow } from "../../components/popupWindow";

interface MyNftProps {
  userId?: string;
}

interface myNftList {
  level: string;
  image: string;
  nftId: string;
}

const IndexMyNftList: React.FunctionComponent<MyNftProps> = (props) => {
  const location = useLocation();

  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const userAccountId: string = useSelector(accountId);
  const userId = location.state == null ? userAccountId : location.state.userAccountId;

  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingNft, setLoadingNft] = useState<boolean>(true);
  const [selectedNft, setSelectedNft] = useState<selectedNftInfo>();
  const [openModel, setOpenModel] = useState<boolean>(false);
  const nftLoaded = useRef(false);
  const dataFetchedRef = useRef(false);
  const [myNfts, setMyNfts] = useState<myNftList[]>([]);
  const [equippedNftIpfsAddress, setEquippedNftIpfsAddress] = useState<string>("");
  var isOtherUser = true;
  if (location.state == null) {
    isOtherUser = false;
  }

  const checkIsLoading = async () => {
    // const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);

    // for (var i = 0; i < messages.unconfirmedTransactions.length; i++){
    //     if(messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId){

    //         setIsUpdating(true);
    //         setIsLoading(false);
    //         return;
    //     }
    // }
    try {
      const equippedNftId = await GetEquippedNftId(ledger2, userId);
      setEquippedNftIpfsAddress(equippedNftId);
      const isUserUpdatingIcon = await IsUserUpdatingIcon(ledger2, userId);
      if (isUserUpdatingIcon === true) {
        setIsUpdating(true);
        setIsLoading(false);
        return;
      }

      setIsUpdating(false);
      setIsLoading(false);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkIsLoading();
  }, []);

  return (
    <>
      {isLoading === true || loadingNft === true ? (
        // loading screen
        <>
          <ShortTitleBar title="Loading NFT collections..." />
          <LoadingMintingMyNftList loadingNft={loadingNft} userId={userId} setLoadingNft={setLoadingNft} myNfts={myNfts} setMyNfts={setMyNfts} isOtherUser={isOtherUser}></LoadingMintingMyNftList>
        </>
      ) : (
        // content
        <NFTDetailPopUpWindow
          isPopUpNFTDetailWinodow={openModel}
          isNFTiconLoading={isUpdating}
          imgAddress={selectedNft?.imageUrl || ""}
          level={selectedNft?.nftLevel || ""}
          rewardPercentage={selectedNft?.nftReward || ""}
          setIsPopUpNFTDetailWinodow={setOpenModel}
        >
          <MyNftList
            setSelectedNft={setSelectedNft}
            setOpenModel={setOpenModel}
            setIsUpdatingDescription={setIsUpdating}
            isUpdatingDescription={isUpdating}
            myNfts={myNfts}
            isOtherUser={isOtherUser}
            equippedNftIpfsAddress={equippedNftIpfsAddress || ""}
          />
        </NFTDetailPopUpWindow>
      )}
    </>
  );
  // ) : openModel ? (
  //   <NftDetails disabled={true} imgAddress={selectedNft} setPopUpIcon={setOpenModel} popUpIcon={openModel}></NftDetails>
  // ) : (
  // // ) : isOtherUser === true ? (
  // //   <MyNftList
  // //     setSelectedNft={setSelectedNft}
  // //     setOpenModel={setOpenModel}
  // //     setIsUpdatingDescription={setIsUpdating}
  // //     isUpdatingDescription={isUpdating}
  // //     myNfts={myNfts}
  // //     isOtherUser={isOtherUser}
  // //   ></MyNftList>
  // // ) : (
  // //   <MyNftList
  // //     setSelectedNft={setSelectedNft}
  // //     setOpenModel={setOpenModel}
  // //     setIsUpdatingDescription={setIsUpdating}
  // //     isUpdatingDescription={isUpdating}
  // //     myNfts={myNfts}
  // //     isOtherUser={false}
  // //     equippedNftIpfsAddress={equippedNftIpfsAddress}
  // //   ></MyNftList>
  // )}
  // </>

  // return (
  //   <CenterLayout
  //     content={content}
  //     bgImg={false}
  //   />
  // );"{"version":1,"descriptor":"QmNhdiqCRXzoVm3pn5eaqvudAjbWsavwqi6a6Bs7ZL5WeE"}"
};

export default IndexMyNftList;
