import MyNft from "../myNftList/myNft";
import MyNftList, { myNftList } from "../myNftList/myNftList";
import React from "react";
import CSS from "csstype";
import { ShortTitleBar } from "../../components/titleBar";
import AllNft from "./allNft";
import { all } from "axios";
import { nftInfo } from "./indexAllNftList";
import { selectedNftInfo } from "./indexAllNftList";
import { CenterLayout } from "../../components/layout";
export interface IAllNftListProps {
  CustomModel?: React.FC<any>;
  openModel?: boolean;
  setOpenModel: React.Dispatch<React.SetStateAction<boolean>>;
  nftInfoArray: nftInfo[];
  setSelectedNftId?: (nftId: string) => void;
  isPopUpNFTDetailWinodow?: boolean;
  setIsPopUpNFTDetailWinodow: (isPopUpNFTDetailWinodow: boolean) => void;
  setSelectedImageAddress?: (selectedImageAddress: selectedNftInfo) => void;
}

const AllNftList: React.FC<IAllNftListProps> = (props) => {
  const { CustomModel, openModel, setOpenModel, nftInfoArray, isPopUpNFTDetailWinodow, setIsPopUpNFTDetailWinodow, setSelectedImageAddress } = props;
  //const{myNfts} = props;
  const mobile = process.env.REACT_APP_MOBILE === "true";
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  let height: string | number;
  let width: string | number;
  // const bgStyle: CSS.Properties = mobile
  //   ? {
  //       background: `transparent`,
  //     }
  //   : {
  //       position: "fixed",
  //       background: `linear-gradient(112deg, #221D4B 0%, #171717 100%)`,
  //       boxShadow: "0px 3px 30px var(--royal-blue)",
  //       width: "100vw",
  //       minHeight: "100vh",
  //       height: "100%",
  //       // 'overflowY': `${isOpenPopup ? 'hidden' : 'auto'}`,
  //       overflowY: "auto",
  //       zIndex: "1",
  //       overflowX: "hidden",
  //       display: "flex!important",
  //     };
  // if (mobile) {
  //   height = "844px";
  //   width = "390px";
  //   // display in ipad air size
  // } else {
  //   height = "100vh";
  //   width = "820px";
  // }
  // const centerLayoutStyle: CSS.Properties = {
  //   // 'backgroundPosition': 'center',
  //   minHeight: `${height}`, // ipad size
  //   width: `min(100vw,${width})`, // ipad size
  //   height: "100%",
  //   //'margin': 'auto',
  //   display: "flex",
  //   //'justifyContent': 'center',
  //   //'alignItems': 'center',
  //   //'backgroundColor': 'green',
  //   flexDirection: "column",
  // };
  const allNftList: number[] = [1, 2, 3, 4];
  const displayMyNft = nftInfoArray.map((nft) => {
    // if(nft.contractOwner === nftDistributor || nft.nftStatus === "Not For Sale" || nft.nftStatus === "15" || nft.imageUrl === ''){
    // return (
    //    <></>
    // )
    // }

    console.log("nftdsfijosdifojsdiofjiosdjfiosdjifjpsfj", nft);
    // if (nft.contractOwner !== nftDistributor || nft.imageUrl === undefined || nft.imageUrl === "") {
    //   return <></>;
    // }

    if (nft.imageUrl === undefined || nft.imageUrl === "" || Object.keys(nft).length === 0) {
      return <></>;
    }

    // if( nft.imageUrl === '' || nft.imageUrl === undefined){
    //   return (
    //      <></>
    //   )
    //   }
    return (
      <AllNft
        nftReward={nft.nftReward}
        setNftSelectedImage={setSelectedImageAddress}
        nftId={nft.contractId}
        nftIndex={nft.nftNumber}
        nftStatus={nft.nftStatus}
        nftNumber={nft.contractId}
        nftLevel={nft.nftLevel}
        nftOwner={nft.contractOwner}
        nftPrice={nft.contractPrice}
        imageAddress={nft.imageUrl}
        openModel={openModel}
        setOpenModel={setOpenModel}
      />
    );
  });

  return (
    <CenterLayout
      content={
        <div className="bettermidapp-mimi-nfts-send-address-1">
          <ShortTitleBar title="NFT Marketplace" setting={true} />
          <div className="containerMyNftList">
            <div className="containerMyNftList2">{displayMyNft}</div>
          </div>
        </div>
      }
      bgImg={false}
    />
  );
};
export default AllNftList;
