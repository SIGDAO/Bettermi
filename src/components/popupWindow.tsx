import { Dispatch, useEffect } from "react";
import { getApiUrls } from "./constants/constant";
import React from "react";
import "./popupWindow.css";
import IPFSImageComponent from "./ipfsImgComponent";
import { Outlet } from "react-router-dom";
import { GuestConnectWallectButton } from "./button";
import { useSelector } from "react-redux";
import { selectCurrentIsGuest } from "../redux/profile";

interface INFTDetailPopUpProp {
  isPopUpNFTDetailWinodow: boolean;
  isNFTiconLoading: boolean;
  imgAddress: string;
  level: string;
  rewardPercentage: string;
  setIsPopUpNFTDetailWinodow: Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

export const NFTDetailPopUpWindow: React.FunctionComponent<INFTDetailPopUpProp> = ({ isPopUpNFTDetailWinodow, isNFTiconLoading, imgAddress, level, rewardPercentage, setIsPopUpNFTDetailWinodow, children }) => {
  const isGuest = useSelector(selectCurrentIsGuest);
  
  const nftDetailpopupWindowDisplay: JSX.Element = isGuest ? (
    // interface for guest
    <>
      <div className="guest-nft-detail-popup-window-container">
        <div className="guest-nft-detail-popup-window-title inter-semi-bold-white-18px">Get your FREE NFT now !</div>
        <div className="guest-nft-detail-popup-window-content">
          <div className="inter-bold-royal-blue-15px">START EARNING SIGDAO</div>
          <img className="guest-nft-detail-popup-window-mimi" src={`${process.env.PUBLIC_URL}/img/mimi_Tipping_Hand.svg`} alt="" />
          <div className="inter-normal-cadet-blue-14px">
            Connect your Signum wallet
            <br />& Receive a FREE NFT membership !
          </div>
        </div>
        <GuestConnectWallectButton className="guest-nft-detail-popup-window-connect-wallet-button" height="56px" width="248px" />
      </div>
      <div onClick={() => setIsPopUpNFTDetailWinodow(false)} className="click-the-area-to-make-it-hidden-again"></div>
    </>
  ) : (
    // interface for login user
    <>
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
      <div onClick={() => setIsPopUpNFTDetailWinodow(false)} className="click-the-area-to-make-it-hidden-again"></div>
    </>
  );

  return (
    <div>
      {isPopUpNFTDetailWinodow && <div className="hidden-content">{nftDetailpopupWindowDisplay}</div>}
      {children}
    </div>
  );
};
