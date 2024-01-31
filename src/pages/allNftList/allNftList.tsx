import MyNft from "../myNftList/myNft";
import MyNftList, { myNftList } from "../myNftList/myNftList";
import React from "react";
import CSS from 'csstype';
import { ShortTitleBar } from "../../components/titleBar";
import AllNft from "./allNft";
import { all } from "axios";
import { nftInfo } from "./indexAllNftList";
import { selectedNftInfo } from "./indexAllNftList";
export interface IAllNftListProps{
    CustomModel?:React.FC<any>;
    openModel?:boolean;
    setOpenModel?:(openModel:boolean) => void;
    nftInfoArray:nftInfo[];
    setSelectedNftId?:(nftId:string) => void;
    isPopUpIcon?:boolean;
    setIsPopUpIcon:(isPopUpIcon:boolean) => void;
    setSelectedImageAddress?:(selectedImageAddress:selectedNftInfo) => void;
}

const AllNftList:React.FC <IAllNftListProps>= (props) => {
    const {CustomModel,openModel,setOpenModel,nftInfoArray,isPopUpIcon,setIsPopUpIcon,setSelectedImageAddress} = props;
    //const{myNfts} = props;
    const mobile = process.env.REACT_APP_MOBILE === 'true';
    const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
    let height: string | number;
    let width: string | number;
    const bgStyle: CSS.Properties = mobile ?
    {
      'background': `transparent`,
    }
    :
    {
      'position': 'fixed',
      'background': `linear-gradient(112deg, #221D4B 0%, #171717 100%)`,
      'boxShadow': '0px 3px 30px var(--royal-blue)',
      'width': '100vw',
      'minHeight': '100vh',
      'height': '100%',
      // 'overflowY': `${isOpenPopup ? 'hidden' : 'auto'}`,
      'overflowY': 'auto',
      'zIndex': '1',
      'overflowX': 'hidden',
      'display': 'flex!important',
    }
    if (mobile) {
        height = "844px";
        width = "390px";
        // display in ipad air size
      } else {
        height = "100vh";
        width = "820px";
      }
  const centerLayoutStyle: CSS.Properties = {
    // 'backgroundPosition': 'center',
    'minHeight': `${height}`, // ipad size
    'width': `min(100vw,${width})`, // ipad size
    'height': '100%',
    //'margin': 'auto',
    'display': 'flex',
    //'justifyContent': 'center',
    //'alignItems': 'center',
    //'backgroundColor': 'green',
    'flexDirection': 'column',
  }
  const allNftList:number[] = [1,2,3,4];
  const displayMyNft = nftInfoArray.map((nft) => {
    if(nft.contractOwner === nftDistributor || nft.nftStatus === "Not For Sale" || nft.nftStatus === "15" || nft.imageUrl === ''){
    return (
       <></>
    )
    }
    return(
      <AllNft nftReward={nft.nftReward} setNftSelectedImage={setSelectedImageAddress} nftId = {nft.contractId} nftIndex = {nft.nftNumber} nftStatus = {nft.nftStatus} nftNumber = {nft.contractId} nftLevel = {nft.nftLevel} nftOwner = {nft.contractOwner} nftPrice = {nft.contractPrice} imageAddress={nft.imageUrl} openModel = {openModel} setOpenModel={setOpenModel}/>
    )
    });
    return (
        <div style={bgStyle}>
            <div style={centerLayoutStyle} className='bettermidapp-mimi-nfts-send-address-1'>
            <ShortTitleBar title='NFT Marketplace' addSign = {false} aiCoach = {false} filter = {false} backButton = {true} />
              <div className = "containerMyNftList">
                <div className = "containerMyNftList2">
                    {displayMyNft}     
                </div>
              </div>
              <div>
                {/* {(CustomModel&&openModel)?(<CustomModel level = {"1"} setIsOpen = {setOpenModel} isOpen = {openModel} ></CustomModel>):(<div>nope</div>)} */}
              </div>
            </div>
        </div>
    );
    }
export default AllNftList;