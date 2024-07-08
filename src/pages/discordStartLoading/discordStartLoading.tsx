import React, { useState, useContext } from "react";
import "./discordStartLoading.css";
import { store } from "../../redux/reducer";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../redux/useContext";
import { connectWallet } from "../../NftSystem/connectWallet/connectWallet";
import { accountSlice } from "../../redux/account";
import { profileSlice } from "../../redux/profile";
import { checkIfUserExists } from "../../NftSystem/verifyUser/checkIfUserAccountExists";
import { referrer, referrerSlice } from "../../redux/referrer";
import EntranceScreenTemplate from "../entranceScreenTemplate/entranceScreenTemplate";
import ReferralCodeLogo from "../entranceScreenTemplate/referralCodeLogo";
import { useSelector } from "react-redux";
import { LedgerClientFactory } from "@signumjs/core";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { accountPublicKey } from "../../redux/account";

export interface IDiscordStartLoadingProps {}

export default function DiscordStartLoading(props: IDiscordStartLoadingProps) {
    const { appName, Wallet, Ledger } = useContext(AppContext);
    const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace('"', "");
    const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!.replace('"', ""); // the code hash of the NFT contract
    const assetId = process.env.REACT_APP_TOKEN_ID!.replace('"', "");
    const navigate = useNavigate();
    const referralCode = useSelector(referrer);
    const userPublicKey = useSelector(accountPublicKey);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const nodeHost = useSelector(selectWalletNodeHost);
    const ledger2 = LedgerClientFactory.createClient({ nodeHost });
    const logo: JSX.Element = (
      // <div className="connectWallet-bg-img-container">
      //   {isLoading && <img className="connectWallet-bg-img" src={process.env.PUBLIC_URL + "/img/connectWallet/Bettermi.io-dAPP-LandingAnimation-ScreenSize.jpg"} />}
      //   <img
      //     className="connectWallet-bg-img"
      //     src={process.env.PUBLIC_URL + "/img/connectWallet/Bettermi.io_dAPP_Landing_Animation_compassed_addition_ver2.gif"}
      //     onLoad={() => setIsLoading(false)}
      //     style={{ display: isLoading ? 'none' : 'inline-block' }}
      //   />
      // </div>
      // <div className="connectWallet-bg-img-container">
        <>
        {isLoading && <img className="connectWallet-bg-img" src={process.env.PUBLIC_URL + "/img/connectWallet/preview_logo.jpg"} />}
        <img
          className="connectWallet-bg-img"
          src={process.env.PUBLIC_URL + "/img/connectWallet/Bettermi.io-dAPP-Landing-Animation-V2_compressed.gif"}
          onLoad={() => setIsLoading(false)}
          style={{ display: isLoading ? "none" : "inline-block" }}
        />
        </>
      // </div>
    );
  


  const content: JSX.Element = (
    <div className="discord-start-loading-layout">
    <div id="discord-start-loading-container">
      {logo}
      {/* <EntranceLogo setIsLoading={setIsLoading} isLoading = {isLoading}></EntranceLogo> */}
      <div className = "discord-start-loading-progress">50%</div>
      <div className="discord-start-loading-button-container">
        <EntranceScreenTemplate
          upperButtonFunction={() => {}}
          // upperButtonFunction={() => setIsPopUpNFTDetailWinodow(true)}
          lowerButtonFunction={() => {}}
          haveLowerButton = {false}
          haveGuestEntrance = {false}
          upperButtonText="Start"
          lowerButtonText="Phoenix Wallet"
        ></EntranceScreenTemplate>
      </div>
      <div className = "discord-start-loading-instruction inter-normal-white-15px">Please wait patiently</div>
      <div className = "inter-normal-white-15px">and do not refresh the page...</div>
    </div>
  </div>


  );

  return content;
}
