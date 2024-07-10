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


  const content: JSX.Element = (
      <div className="referralCode-layout">
        <div id="discord-start-container">
          {/* <EntranceLogo setIsLoading={setIsLoading} isLoading = {isLoading}></EntranceLogo> */}
          <ReferralCodeLogo imagePath="/img/logoPage/bettermi-io-logo@1x_compressed.png"></ReferralCodeLogo>
          <div className="discord-start-button-containter">
            <EntranceScreenTemplate
              upperButtonFunction={() => {navigate("/discordStartLoading")}}
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
