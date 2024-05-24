import { Dispatch } from "react";
import { getApiUrls } from "./constants/constant";
import React from "react";
import IPFSImageComponent from "./ipfsImgComponent";

interface INFTDetailPopUpProp {
  isPopUpIcon: boolean;
  isNFTiconLoading: boolean;
  imgAddress: string;
  level: string;
  rewardPercentage: string;
  setIsPopUpIcon: Dispatch<React.SetStateAction<boolean>>;
}

export const NFTDetailPopUpWindow: React.FunctionComponent<INFTDetailPopUpProp> = ({ isPopUpIcon, isNFTiconLoading, imgAddress, level, rewardPercentage, setIsPopUpIcon }) => {

  return (
    <div>
      {isPopUpIcon && (
        <div className="hidden-content">
          {isNFTiconLoading ? (
            <div className="x0"></div>
          ) : (
            <>
              <IPFSImageComponent className={"x0-generateFreeNFT"} imgAddress={imgAddress} />
            </>
          )}
          <div className="x16206">
            <div className="lv-1">LV {level}</div>
            <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
            <div className="reward-10">REWARD +{rewardPercentage}%</div>
          </div>

          <div className="x0-signa">$0 SIGNA</div>
          <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
          <div onClick={() => setIsPopUpIcon(false)} className="click-the-area-to-make-it-hidden-again"></div>
        </div>
      )}
    </div>
  );
};
