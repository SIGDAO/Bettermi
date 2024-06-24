import * as React from "react";
import "../myNftList/myNftList.css";
import "./allNftList.css";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";
import { BuyNft } from "../../NftSystem/BuyNft/buyNft";
import { accountId } from "../../redux/account";
import { accountPublicKey } from "../../redux/account";
import { selectedNftInfo } from "./indexAllNftList";
import IPFSImageComponent from "../../components/ipfsImgComponent";
import { selectCurrentIsGuest } from "../../redux/profile";
import { GuestConnectWallectButton } from "../../components/button";

interface AllNftProps {
  imageAddress: string;
  openModel?: boolean;
  setOpenModel: React.Dispatch<React.SetStateAction<boolean>>;
  nftOwner?: string;
  nftNumber?: string;
  nftLevel?: string;
  nftPrice?: string;
  nftStatus?: string;
  nftId?: string;
  nftIndex: number;
  setNftSelectedImage?: (nftSelectedImage: selectedNftInfo) => void;
  nftReward?: string;
}

const AllNft: React.FunctionComponent<AllNftProps> = (props) => {
  const { imageAddress, openModel, setOpenModel, nftOwner, nftNumber, nftLevel, nftPrice, nftStatus, nftId, nftIndex, setNftSelectedImage, nftReward } = props;
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const userAccountId = useSelector(accountId);
  const codeHashIdForNft = process.env.REACT_APP_NFT_CONTRACT_MACHINE_CODE_HASH!;
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const userAccountPublicKey = useSelector(accountPublicKey);
  const isGuest = useSelector(selectCurrentIsGuest);

  const Buy = async () => {
    if (nftStatus === "BUY") {
      BuyNft(Wallet, ledger2, nftId!, nftPrice!, userAccountId, codeHashIdForNft, nftDistributor, userAccountPublicKey);
    }
  };

  const NFTMarketPlaceButtonDisplay = (): JSX.Element => {
    if (isGuest) {
      return (
        <div
          className="all-nft-list-connect-wallet-button inter-semi-bold-white-10px"
          onClick={() => {
            setOpenModel(true);
            console.log("testing");
          }}
        >
          Connect Wallet
        </div>
      );
    }
    return (
      <button className="allNftButton" onClick={Buy}>
        {nftStatus}
      </button>
    );
  };

  return (
    <>
      {/* {loading?(<div>loading</div>):(
          imgAddress === ""?(<div>loading</div>):( */}

      <div className="myNftList" key={nftId}> 
        <IPFSImageComponent
          className="myNftImage"
          onClick={() => {
            //   setIsOpenPopup((prev) => !prev);
            //   setSelectedAssetId(nftId);
            //   setLevel(nftLevel);

            if (setOpenModel) {
              setOpenModel((prev) => !prev);
            }
            if (setNftSelectedImage && nftLevel && nftPrice && nftIndex && nftReward) {
              const selectedNftInfo: selectedNftInfo = {
                imageUrl: imageAddress,
                nftLevel: nftLevel,
                nftPrice: (parseInt(nftPrice) / 1000000).toString(),
                nftReward: nftReward,
                nftNumber: String(nftIndex).padStart(8, "0"),
              };
              setNftSelectedImage(selectedNftInfo);
            }
          }}
          imgAddress={imageAddress}
        />
        {/* <img
          onClick={() => {
            //   setIsOpenPopup((prev) => !prev);
            //   setSelectedAssetId(nftId);
            //   setLevel(nftLevel);

            if (setOpenModel) {
              setOpenModel((prev) => !prev);
            }
            if (setNftSelectedImage && nftLevel && nftPrice && nftIndex && nftReward) {
              const selectedNftInfo: selectedNftInfo = {
                imageUrl: imageAddress,
                nftLevel: nftLevel,
                nftPrice: (parseInt(nftPrice) / 1000000).toString(),
                nftReward: nftReward,
                nftNumber: String(nftIndex).padStart(8, "0"),
              };
              setNftSelectedImage(selectedNftInfo);
            }
          }}
          className="myNftImage"
          src={`https://rose-peaceful-badger-310.mypinata.cloud/ipfs/${imageAddress}?pinataGatewayToken=ucHcjsImiqy6ENBl5X8Q7kTG3IwrFohD1r_s6qhqhMPkUZpAOiIhCFZ70Cgp-k6L`}
        ></img>
        {/* <IPFSImageComponent
          imgAddress={imageAddress}
          onClick={() => {
            //   setIsOpenPopup((prev) => !prev);
            //   setSelectedAssetId(nftId);
            //   setLevel(nftLevel);

            if (setOpenModel) {
              setOpenModel(!openModel);
            }
            if (setNftSelectedImage && nftLevel && nftPrice && nftIndex && nftReward) {

              const selectedNftInfo: selectedNftInfo = {
                imageUrl: imageAddress,
                nftLevel: nftLevel,
                nftPrice: (parseInt(nftPrice)/1000000).toString(),
                nftReward: nftReward,
                nftNumber:String(nftIndex).padStart(8, "0"),
              };
              setNftSelectedImage(selectedNftInfo);
            }
          }}
          className="allNftImage"
        /> */}
        <div className="myNftDescription">
          <div className="myNftNumber">#0000{nftIndex}</div>
          <div className="myNftBar">
            <div className="myNftLevel">Lv{nftLevel}</div>
            <div className="myNftVerticalLine"></div>
            <div className="inter-normal-white-12px" style={{ fontSize: "11px" }}>
              Reward + {nftReward}%
            </div>
          </div>
          <div className="myNftPrice">${nftPrice ? (parseInt(nftPrice) / 1000000).toString() : ""} SIGDAO</div>
        </div>
        <div className="allNftBottom">
          {/* {isOtherUser === true?(
                      <>
                        <button className = "myNftButtonDisabled" onClick = {equipNft}>AVALIBLE</button>
                        <img 
                          onClick={() => {
                            setIsOpenPopup((prev) => !prev);
                            setSelectedAssetId(nftId);
                            setLevel(nftLevel);
  
                          }} 
                          className = "myNftButtomArrowDisabled" 
                          src  = {`${process.env.PUBLIC_URL}/img/NftList/ic-send@1x.png`}
                        />
                        </>
                    ):( */}
          <>
            {/* <button className="allNftButton" onClick={Buy}>
              {nftStatus}
            </button> */}
            {NFTMarketPlaceButtonDisplay()}
            {/* <img
              onClick={() => {
                //   setIsOpenPopup((prev) => !prev);
                //   setSelectedAssetId(nftId);
                //   setLevel(nftLevel);

                if (setOpenModel) {
                  setOpenModel(!openModel);
                }
                if(setNftSelectedImage && nftLevel && nftPrice && nftIndex){
                  const selectedNftInfo:selectedNftInfo = {
                    imageUrl:imageAddress,
                    nftLevel:nftLevel,
                    nftPrice:nftPrice,
                    nftReward:nftIndex.toString(),
                  }
                  setNftSelectedImage(selectedNftInfo);
                }
              }}
              className="myNftButtomArrow"
              src={`${process.env.PUBLIC_URL}/img/NftList/ic-send@1x.png`}
            /> */}
          </>
          {/* )
                    } */}
        </div>
      </div>
      {/* )
        )

      } */}
    </>
  );

  // return (
  //   <CenterLayout
  //     content={content}
  //     bgImg={false}
  //   />
  // );"{"version":1,"descriptor":"QmNhdiqCRXzoVm3pn5eaqvudAjbWsavwqi6a6Bs7ZL5WeE"}"
};

export default AllNft;
