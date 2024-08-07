import React, { useState, useContext } from "react";
import "./discordStart.css";
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

export interface IDiscordStartProps {}

export default function DiscordStart(props: IDiscordStartProps) {
    const { appName, Wallet, Ledger } = useContext(AppContext);
    const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace('"', "");
    const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!.replace('"', ""); // the code hash of the NFT contract
    const assetId = process.env.REACT_APP_TOKEN_ID!.replace('"', "");
    const navigate = useNavigate();
    const referralCode = useSelector(referrer);
    const userPublicKey = useSelector(accountPublicKey);
 
    const nodeHost = useSelector(selectWalletNodeHost);
    const ledger2 = LedgerClientFactory.createClient({ nodeHost });
    const userConnectWallet = async (appName: any, Wallet: any, Ledger: any, codeHashId: string, codeHashIdForNft: string, assetId: string, navigate: any) => {
      try {
        const userInfo = await connectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId);
        if (userInfo == null) {
          alert("seems like the wallet lost connection. We would be grateful if you could report to core team at discord");
        }
  
        if ((userInfo!.openedBmiContract === true && userInfo!.userNftStorage.ats[0]) || (userInfo!.userBMIStorage.ats[0] != null && userInfo!.openedNftContract === true)) {
          navigate("/errorReferralCode");
          return;
        }
        if (userInfo!.userBMIStorage.ats[0] != null && userInfo!.userNftStorage.ats[0] != null) {
          store.dispatch(accountSlice.actions.setNftContractStorage(userInfo!.userNftStorage.ats[0].at));
  
          var description = userInfo!.userBMIStorage.ats[0].description;
  
          if (description.includes("Female") === true) {
            store.dispatch(profileSlice.actions.setGender("Female"));
          } else if (description.includes("Male") === true) {
            store.dispatch(profileSlice.actions.setGender("Male"));
          } else {
            store.dispatch(profileSlice.actions.setGender("Male"));
          }
          alert("account registered");
          navigate("/errorReferralCode");
        }
        if(userInfo?.loginedAcctID == null){
          navigate("/errorReferralCode");
        }
        // return userInfo?.loginedAcctID
        navigate("/discordStartLoading")
        
      } catch (error: any) {
        if (error.name === "InvalidNetworkError") {
          alert(
            "It looks like you are not connecting to the correct signum node in your XT-Wallet, currently in our beta version we are using Europe node, please change your node to Europe node and try again"
          );
        }
        if (error.name === "NotFoundWalletError") {
          window.location.href = "https://chrome.google.com/webstore/detail/signum-xt-wallet/kdgponmicjmjiejhifbjgembdcaclcib/";
        }
      }
    };

  const content: JSX.Element = (
      <div className="referralCode-layout">
        <div id="discord-start-container">
          {/* <EntranceLogo setIsLoading={setIsLoading} isLoading = {isLoading}></EntranceLogo> */}
          <ReferralCodeLogo imagePath="/img/logoPage/bettermi-io-logo@1x_compressed.png"></ReferralCodeLogo>
          <div className="discord-start-button-containter">
            <EntranceScreenTemplate
              upperButtonFunction={() => {navigate("/discordStartLoading")}}
              // upperButtonFunction={() => {userConnectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId, navigate)}}
              // upperButtonFunction={() => setIsPopUpNFTDetailWinodow(true)}
              lowerButtonFunction={ () => {}}
              haveLowerButton = {false}
              haveGuestEntrance = {false}
              upperButtonText="Start"
              lowerButtonText="Phoenix Wallet"
            ></EntranceScreenTemplate>
          </div>
        </div>
      </div>

    // <div className="referralCode-layout">
    //   <div id="referralCode-container">
    //     {logo}
    //     <BackButton/>
    //     <div className="referralCode-option-container">
    //       <div id="referralCode-button-container">
    //         <ButtonWithAction
    //           text="XT wallet"
    //           action={() => {
    //             // if(referralCode){
    //                 userConnectWallet(appName,Wallet,Ledger,codeHashId,codeHashIdForNft,assetId,navigate,referralCode!);
    //             // }
    //             // else{
    //             //     alert("Its not a valid referral link")
    //             //     navigate("/");
    //             // }

    //         }} // TODO: add action to connect wallet
    //           height="56px"
    //           width="248px"
    //         />
    //         <Link to="http://localhost:8080/auth/discord">
    //           <DisabledButton text="testing original flow" height="56px" width="248px" />
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );

  return content;
  // return <CenterLayout bgImg={false} content={content} />;
}
