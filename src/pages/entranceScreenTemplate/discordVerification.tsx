import React from "react";
import { Dispatch, useEffect } from "react";
import { DiscordVerificationButton, GuestConnectWallectButton } from "../../components/button";
import "./discordVerification.css";
import { PopupWindowTemplate } from "../../components/popupWindow";
import { store } from "../../redux/reducer";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import { GenericExtensionWallet } from "@signumjs/wallets";

interface IDiscordVerificationPopUpProp {
  isPopUpNFTDetailWinodow: boolean;
  setIsPopUpNFTDetailWinodow: Dispatch<React.SetStateAction<boolean>>;
  // children?: React.ReactNode;
  // content: string[];
  // buttonComponent?: React.ReactNode;
}

export const DiscordVerificationPopUp: React.FunctionComponent<IDiscordVerificationPopUpProp> = ({ isPopUpNFTDetailWinodow, setIsPopUpNFTDetailWinodow }) => {
  const screenContent: string[] = ["Discord Verification", "", "img/referralCode/discordpng.png", "Use connected wallet for Discord API.", "Ensure you have a Discord account"];
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const upperContent: JSX.Element = <p className="inter-semi-bold-white-18px">Discord Verification</p>;

  const lowerContent: JSX.Element = (
    <div className="discord-verification-detail-popup-window-below-content">
      <img className="discord-verification-detail-popup-window-mimi" src={`${process.env.PUBLIC_URL}/img/referralCode/discordpng.png`} alt="" />
      <div className="inter-normal-white-14px line-height-21px">
        Use connected wallet for Discord API.
        <br />
        Ensure you have a Discord account !
      </div>
    </div>
  );

  // Remove the existing declaration of 'buttonComponent'
  // const buttonComponent: JSX.Element = (
  //   <DiscordVerificationButton className="guest-take-selfie-button-container" height="56px" width="248px" />);

  // Declare 'buttonComponent' only once
  const buttonComponent: JSX.Element = <DiscordVerificationButton className="guest-take-selfie-button-container" height="56px" width="248px" />;

  const guestNFTDetailpopupWindowDisplay: JSX.Element = (
    <>
      <PopupWindowTemplate upperContent={upperContent} lowerContent={lowerContent} buttonComponent={buttonComponent} />
      <div onClick={() => {setIsPopUpNFTDetailWinodow(false);store.dispatch({ type: "USER_LOGOUT" });Wallet.Extension = new GenericExtensionWallet();}} className="click-the-area-to-make-it-hidden-again"></div>
    </>
  );

  return <>{isPopUpNFTDetailWinodow && <div className="hidden-content">{guestNFTDetailpopupWindowDisplay}</div>}</>;
};
