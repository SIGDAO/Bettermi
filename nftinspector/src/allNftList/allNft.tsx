import * as React from "react";
import "./myNftList.css";
import "./allNftList.css";
import { selectedNftInfo } from "./indexAllNftList";

interface AllNftProps {
  imageAddress: string;
  openModel?: boolean;
  setOpenModel?: (openModel: boolean) => void;
  nftOwner?: string;
  nftNumber?: string;
  nftLevel?: string;
  nftPrice?: string;
  nftStatus?: string;
  nftId?: string;
  nftIndex: number;
  setNftSelectedImage?: (nftSelectedImage: selectedNftInfo) => void;
  nftReward?:string;
}

const AllNft: React.FunctionComponent<AllNftProps> = (props) => {
  const { imageAddress, openModel, setOpenModel, nftOwner, nftNumber, nftLevel, nftPrice, nftStatus, nftId, nftIndex, setNftSelectedImage,nftReward } = props;

  const Buy = async () => {

  };
  return (
    <>
      {/* {loading?(<div>loading</div>):(
          imgAddress === ""?(<div>loading</div>):( */}

      <div className="myNftList">
        <img
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
          className="myNftImage"
          // src={`https://ipfs.io/ipfs/${imageAddress}`}
          src={`https://fuchsia-magnificent-koala-653.mypinata.cloud/ipfs/QmXXwAZtz1x6DwpbQGFXkfbbiHcurs7xmfh6kNo9uMcfkU?pinataGatewayToken=ocyauUQ6QJQEcidhvbp6MDqNJayYP20yaSIVcAh7142GuV2ColRsR-RfbMjZ8NnU`}
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
            <div className="inter-normal-white-12px">Reward + 10%</div>
          </div>
          <div className="myNftPrice">${nftPrice?(parseInt(nftPrice)/1000000).toString():""} SIGDAO</div>
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
            <button className="allNftButton" onClick={Buy}>
              {nftStatus}
            </button>
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
