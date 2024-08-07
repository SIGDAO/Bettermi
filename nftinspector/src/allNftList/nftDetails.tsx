import * as React from "react";
import { CenterLayout } from "./layout";
import { selectedNftInfo } from "./indexAllNftList";
import IPFSImageComponent from "./ipfsImgComponent";
interface AllNftProps {
  imgAddress?: selectedNftInfo;
  setPopUpIcon: (popUpIcon: boolean) => void;
  popUpIcon: boolean;
  disabled?: boolean;
}

const NftDetails: React.FunctionComponent<AllNftProps> = (props) => {
  const { imgAddress, setPopUpIcon, popUpIcon, disabled } = props;

  return (
    <CenterLayout
      noScroll={true}
      content={
        <>
          {imgAddress == null ? (
            <>
              <IPFSImageComponent className="x0-generateFreeNFT" imgAddress={"bafkreigun2emdg5ndaavw2mmvocqwpdct2qcpb6kud7x76awln2cstodda"} />
              {/* <h1 className="text-1">#{nftNumber}</h1> */}

              <div className="x16206">
                <div className="lv-1">LV {}</div>
                <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
                <div className="reward-10">REWARD +{}%</div>
              </div>
              {disabled === true ? <></> : <div className="x0-signa">${} SIGNA</div>}
              <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
              <div onClick={() => setPopUpIcon(false)} className="click-the-area-to-make-it-hidden-again"></div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                <IPFSImageComponent className="x0-generateFreeNFT" imgAddress={imgAddress.imageUrl} />
                <h1 className="text-1">#{imgAddress.nftNumber}</h1>

                <div className="x16206">
                  <div className="lv-1">LV {imgAddress.nftLevel}</div>
                  <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
                  <div className="reward-10">REWARD +{imgAddress.nftReward}%</div>
                </div>
                <div className="x0-signa" style={{ position: "absolute" }}>
                  $0 SIGNA
                </div>
                <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
                <div onClick={() => setPopUpIcon(false)} className="click-the-area-to-make-it-hidden-again"></div>
              </div>
            </>
          )}
        </>
      }
      bgImg={false}
      // noScroll={isOpen}
    />
  );
};

export default NftDetails;
