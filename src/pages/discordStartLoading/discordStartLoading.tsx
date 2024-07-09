import React, { useState, useContext,useEffect } from "react";
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
import { DisabledButton } from "../../components/button";

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
    const [count, setCount] = useState<number>(1);
    const nodeHost = useSelector(selectWalletNodeHost);
    const ledger2 = LedgerClientFactory.createClient({ nodeHost });

    useEffect(() => {
      //const incrementInterval = 240000 / 96; // Time divided by the number of increments
      const incrementInterval = 5000 / 1000;
      const timer = setInterval(() => {
        if (count <= 100) {
          setCount((prevCount) => {
            if (prevCount <= 99) {
              return prevCount + 1;
            }
            return prevCount;
          });
        }
        // if (count => 100 ) {
        // } else {
        //   setIsLoading(false);
        //   navigate('/generateFreeNFT');
        //   clearInterval(timer);
        // }
      }, incrementInterval);
      return () => {
        // setIsLoading(false);
        // navigate('/generateFreeNFT');
        clearInterval(timer);
      };
    }, []);



    const logo: JSX.Element = (
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
      <div className = "discord-start-loading-progress">{count}%</div>
      <div className="discord-start-loading-button-container">
        {count === 100?
              <div className="discord-start-loading-button-container">
        <EntranceScreenTemplate
          upperButtonFunction={() => {navigate("/referralGiveReward")}}
          // upperButtonFunction={() => setIsPopUpNFTDetailWinodow(true)}
          lowerButtonFunction={() => {}}
          haveLowerButton = {false}
          haveGuestEntrance = {false}
          upperButtonText="Start"
          lowerButtonText="Phoenix Wallet"
        ></EntranceScreenTemplate>
        </div>
        :
        (
          <DisabledButton text = {"start"} height = {"56px"} width = {"248px"}></DisabledButton>
        )
}
      </div>
      <div className = "discord-start-loading-instruction inter-normal-white-15px">Please wait patiently</div>
      <div className = "inter-normal-white-15px">and do not refresh the page...</div>
    </div>
  </div>


  );

  return content;
}
