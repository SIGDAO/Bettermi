import React, { useState, useContext } from "react";
import "./referralCode.css";
import { ButtonWithAction, DisabledButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
import { AppContext } from "../../redux/useContext";
import { connectWallet } from "../../NftSystem/connectWallet/connectWallet";
import { accountSlice } from "../../redux/account";
import { profileSlice } from "../../redux/profile";
import { checkIfUserExists } from "../../NftSystem/verifyUser/checkIfUserAccountExists";
import { Store } from "redux";
import { referrer, referrerSlice } from "../../redux/referrer";
import EntranceScreenTemplate from "../entranceScreenTemplate/entranceScreenTemplate";
import EntranceLogo from "../entranceScreenTemplate/EntranceLogo";
import ReferralCodeLogo from "../entranceScreenTemplate/referralCodeLogo";
import { DiscordVerificationPopUp } from "../entranceScreenTemplate/discordVerification";
import { GuestConnectWallectButton,DiscordVerificationButton } from "../../components/button";

export interface IReferralCodeProps {}

export default function ReferralCode(props: IReferralCodeProps) {
  localStorage.clear(); //Guess we need to clear out all local storage after connecting account
  const navigate = useNavigate();
  const { referralCode } = useParams();
  console.log("referral code is", referralCode);
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPopUpNFTDetailWinodow, setIsPopUpNFTDetailWinodow] = useState<boolean>(false);

  const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace('"', "");
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!.replace('"', ""); // the code hash of the NFT contract
  const assetId = process.env.REACT_APP_TOKEN_ID!.replace('"', "");
  // store.dispatch({ type: "USER_LOGOUT" });
  const screenContent: string[] = ["Discord Verification", "","img/referralCode/discordLogo.png", "Use connected wallet for Discord API.", "Ensure you have a Discord account"];

  const userConnectWallet = async (appName: any, Wallet: any, Ledger: any, codeHashId: string, codeHashIdForNft: string, assetId: string, navigate: any, referralCode: string) => {
    try {
      store.dispatch({ type: "USER_LOGOUT" });
      const userInfo = await connectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId);
      if (userInfo == null) {
        alert("seems like an error has occured. We would be grateful if you could report to core team at discord");
      }

      console.log(checkIfUserExists(Ledger, referralCode));

      if ((userInfo!.openedBmiContract === true && userInfo!.userNftStorage.ats[0]) || (userInfo!.userBMIStorage.ats[0] != null && userInfo!.openedNftContract === true)) {
        navigate("/loadingMinting");
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
        navigate("/home");
      } else {
        console.log("called once");
        const referrerObj: referrer = { referrerAccountId: referralCode };
        store.dispatch(referrerSlice.actions.setReferrerAccountId(referrerObj));
        console.log("referrerObj is",referrerObj)
        setIsPopUpNFTDetailWinodow(true)
        // navigate(`/discordVerification/${referralCode}`);
      }
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
    <DiscordVerificationPopUp
      isPopUpNFTDetailWinodow={isPopUpNFTDetailWinodow}
      setIsPopUpNFTDetailWinodow={setIsPopUpNFTDetailWinodow}
      content={screenContent}
      buttonComponent={<DiscordVerificationButton className="guest-take-selfie-button-container" height="56px" width="248px" />}
    >
      <div className="referralCode-layout">
        <div id="referralCode-container">
          <div className="referralCodeTitle">
            <h1 className="EntranceTitle">Lucky You!</h1>
            <div className="EntranceContent">Get Sigdao Reward From Your Friend !</div>
          </div>
          {/* <EntranceLogo setIsLoading={setIsLoading} isLoading = {isLoading}></EntranceLogo> */}
          <ReferralCodeLogo imagePath = {"/img/entranceScreenTemplate/mimi_io_inviting.png"}></ReferralCodeLogo>
          <div className="referralCodeButtonContainter">
            <EntranceScreenTemplate
              upperButtonFunction={() => userConnectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId, navigate, referralCode!)}
              // upperButtonFunction={() => setIsPopUpNFTDetailWinodow(true)}
              lowerButtonFunction={() => navigate("http://localhost:8080/auth/discord")}
              haveLowerButton = {true}
              haveGuestEntrance = {true}
              upperButtonText="XT Wallet"
              lowerButtonText="Phoenix Wallet"
            ></EntranceScreenTemplate>
          </div>
        </div>
      </div>
    </DiscordVerificationPopUp>

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
