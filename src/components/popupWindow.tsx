import { Dispatch, useEffect } from "react";
import { getApiUrls } from "./constants/constant";
import CSS from "csstype";
import React from "react";
import "./popupWindow.css";
import IPFSImageComponent from "./ipfsImgComponent";
import { Outlet, useNavigate } from "react-router-dom";
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

interface IDiscordVerificationProp {
  isPopUpNFTDetailWinodow: boolean;
  setIsPopUpNFTDetailWinodow: Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  content: string[];
  buttonComponent?: React.ReactNode;
}

interface IPopupWindowTemplateProp {
  style?: CSS.Properties;
  upperContent: JSX.Element;
  lowerContent: JSX.Element;
  buttonComponent: React.ReactNode;
  height?: string;
  width?: string;
}

export const PopupWindowTemplate: React.FunctionComponent<IPopupWindowTemplateProp> = ({ upperContent, lowerContent, buttonComponent, height = "330px", width = "332px", style = {} }) => {
  // <div onClick={() => setIsPopUpNFTDetailWinodow(false)} className="click-the-area-to-make-it-hidden-again"></div>

  return (
    <div className="standard-popup-window-container" style={{ height: height, width: width, ...style }}>
      <div className="standard-popup-window-upper-content inter-semi-bold-white-18px">{upperContent}</div>
      <div className="standard-popup-window-lower-content">{lowerContent}</div>
      {buttonComponent}
    </div>
  );
};

export const TakeSelfieWindow: React.FC = (props) => {
  const navigate = useNavigate();
  const isGuest = useSelector(selectCurrentIsGuest);

  const upperContent: JSX.Element = <p>Selfie to track BMI now !</p>;

  const lowerContent: JSX.Element = (
    <div className="guest-nft-detail-popup-lower-content">
      <p className="inter-bold-royal-blue-15px">START EARNING SIGDAO</p>
      <img className="guest-nft-detail-popup-window-mimi" src={`${process.env.PUBLIC_URL}/img/mimi_popup_window.png`} alt="" />
      <div className="inter-normal-hot-magenta-14px line-height-21px">
        * We value your privacy,
        <br />
        your selfie will NOT be stored
      </div>
    </div>
  );

  return (
    <PopupWindowTemplate
      upperContent={upperContent}
      lowerContent={lowerContent}
      buttonComponent={<GuestConnectWallectButton className="guest-take-selfie-button-container" height="56px" width="248px" />}
    />
  );
};

// pop up window for displaying NFT detail
// can display different NFT detail by changing the imgAddress / rewardPercentage / level
export const NFTDetailPopUpWindow: React.FunctionComponent<INFTDetailPopUpProp> = ({
  isPopUpNFTDetailWinodow,
  isNFTiconLoading,
  imgAddress,
  level,
  rewardPercentage,
  setIsPopUpNFTDetailWinodow,
  children,
}) => {
  const isGuest = useSelector(selectCurrentIsGuest);

  const guestNFTDetailPopupWindowUpperContent: JSX.Element = <p>Get your FREE NFT now !</p>;

  const guestNFTDetailPopupWindowLowerContent: JSX.Element = (
    <div className="guest-nft-detail-popup-lower-content">
      <p className="inter-bold-royal-blue-15px">START EARNING SIGDAO</p>
      <img className="guest-nft-detail-popup-window-mimi" src={`${process.env.PUBLIC_URL}/img/mimi_popup_window.png`} alt="" />
      <div className="guest-nft-detail-description inter-normal-cadet-blue-14px line-height-21px">
        Connect your Signum wallet
        <br />& Receive a FREE NFT membership !
      </div>
    </div>
  );

  const guestNFTDetailpopupWindowDisplay: JSX.Element = (
    <>
      <PopupWindowTemplate
        upperContent={guestNFTDetailPopupWindowUpperContent}
        lowerContent={guestNFTDetailPopupWindowLowerContent}
        buttonComponent={<GuestConnectWallectButton className="guest-nft-detail-popup-window-connect-wallet-button" height="56px" width="248px" />}
      />
      <div onClick={() => setIsPopUpNFTDetailWinodow(false)} className="click-the-area-to-make-it-hidden-again"></div>
    </>
  );

  const loginUserNFTDetailpopupWindowDisplay: JSX.Element = (
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
      {isPopUpNFTDetailWinodow && <div className="hidden-content">{isGuest ? guestNFTDetailpopupWindowDisplay : loginUserNFTDetailpopupWindowDisplay}</div>}
      {children}
    </div>
  );
};
