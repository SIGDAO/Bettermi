import React, { useState, useContext, useEffect } from "react";
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
import { GuestConnectWallectButton, DiscordVerificationButton } from "../../components/button";
import ReferralWarningPopupWindow from "./referralWarningPopupWindow";
import { checkEquippedBettermiNFT } from "../../NftSystem/UserLevel/checkUserLevel";
import { useDispatch } from "react-redux";

export interface IReferralCodeProps {}

export default function ReferralCode(props: IReferralCodeProps) {
  localStorage.clear(); //Guess we need to clear out all local storage after connecting account
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { referralCode } = useParams();
  console.log("referral code is", referralCode);
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPopUpNFTDetailWinodow, setIsPopUpNFTDetailWinodow] = useState<boolean>(false);
  const [isPopupReferralWarning, setIsPopupReferralWarning] = useState<boolean>(false);

  const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace('"', "");
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!.replace('"', ""); // the code hash of the NFT contract
  const assetId = process.env.REACT_APP_TOKEN_ID!.replace('"', "");
  // store.dispatch({ type: "USER_LOGOUT" });

  const userConnectWallet = async (appName: any, Wallet: any, Ledger: any, codeHashId: string, codeHashIdForNft: string, assetId: string, navigate: any, referralCode: string) => {
    try {
      store.dispatch({ type: "USER_LOGOUT" });
      const userInfo = await connectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId);
      if (userInfo == null) {
        alert("seems like an error has occured. We would be grateful if you could report to core team at discord");
      }

      console.log(checkIfUserExists(Ledger, referralCode));

      const equippedBettermiNft = await checkEquippedBettermiNFT(userInfo?.ledger, userInfo!.loginedAcctID);

      // situation:
      // all contract is created, but one or more contract still unconfirmed
      // or, not enqiuped NFT, then navigate to loadingMinting
      if (
        !equippedBettermiNft &&
        ((userInfo!.openedBmiContract === true && userInfo!.openedNftContract === true) ||
          (userInfo!.userBMIStorage.ats[0] != null && userInfo!.openedNftContract === true) ||
          (userInfo!.openedBmiContract === true && userInfo!.userNftStorage.ats[0] != null) ||
          (userInfo!.userBMIStorage.ats[0] != null && userInfo!.userNftStorage.ats[0] != null))
      ) {
        dispatch(profileSlice.actions.setIsNewUser(true));
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

        dispatch(profileSlice.actions.authenticated());
        navigate("/home");
      } else {
        console.log("called once");
        if (!userInfo?.loginedAcctID) {
          alert("User's AccountId does not exist");
          navigate("/errorReferralCode");
        }
        const referrerObj: referrer = { referrerAccountId: referralCode, refereeAccountId: userInfo?.loginedAcctID! };
        store.dispatch(referrerSlice.actions.setReferrerAccountId(referrerObj));
        store.dispatch(referrerSlice.actions.setRefereeAccountId(referrerObj));
        console.log("referrerObj is", referrerObj);
        dispatch(profileSlice.actions.setIsNewUser(true));
        setIsPopUpNFTDetailWinodow(true);
        // navigate(`/discordVerification/${referralCode}`);
      }
    } catch (error: any) {
      if (error.message === "Failed to fetch IPFS JSON") {
        alert("Cannot connect wallet, failed to fetch IPFS JSON. Please try again !\nIf the problem persists, please contact core team through discord !");
      }

      if (error.name === "InvalidNetworkError") {
        alert(
          "It looks like you are not connecting to the correct signum node in your XT-Wallet, currently in our beta version we are using Europe node, please change your node to Europe node and try again",
        );
      }
      if (error.name === "NotFoundWalletError") {
        window.location.href = "https://chrome.google.com/webstore/detail/signum-xt-wallet/kdgponmicjmjiejhifbjgembdcaclcib/";
      }
    }
  };


  useEffect(() => {
    store.dispatch({ type: "USER_LOGOUT" });
    localStorage.clear(); //Guess we need to clear out all local storage after connecting account
  }, []);

  const content: JSX.Element = (
    <>
      <DiscordVerificationPopUp
        isPopUpNFTDetailWinodow={isPopUpNFTDetailWinodow}
        setIsPopUpNFTDetailWinodow={setIsPopUpNFTDetailWinodow}
      />
      <ReferralWarningPopupWindow isPopupReferralWarning={isPopupReferralWarning} setIsPopupReferralWarning={setIsPopupReferralWarning} />
      <div className="referralCode-layout">
        <div id="referralCode-container">
          <div className="referralCodeTitle">
            <h1 className="EntranceTitle">Lucky You !</h1>
            <div className="EntranceContent">Get Sigdao Rewards From Your Friend !</div>
          </div>
          {/* <EntranceLogo setIsLoading={setIsLoading} isLoading = {isLoading}></EntranceLogo> */}
          <ReferralCodeLogo imagePath={"/img/entranceScreenTemplate/mimi_io_inviting.png"}></ReferralCodeLogo>
          <div className="referralCodeButtonContainter">
            <EntranceScreenTemplate
              upperButtonFunction={() => userConnectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId, navigate, referralCode!)}
              // upperButtonFunction={() => setIsPopUpNFTDetailWinodow(true)}
              lowerButtonFunction={() => setIsPopupReferralWarning(true)}
              haveLowerButton={true}
              haveGuestEntrance={true}
              upperButtonText="XT Wallet"
              lowerButtonText="Phoenix Wallet"
            />
          </div>
        </div>
      </div>
    </>
  );

  return content;
}
