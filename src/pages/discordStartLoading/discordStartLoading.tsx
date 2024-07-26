import React, { useState, useContext, useEffect, useRef } from "react";
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
  const [clicked, setClicked] = useState<boolean>(false);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const userConnectWallet = async (appName: any, Wallet: any, Ledger: any, codeHashId: string, codeHashIdForNft: string, assetId: string, navigate: any) => {
    try {
      const userInfo = await connectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId);
      if (userInfo == null) {
        alert("seems like the wallet lost connection. We would be grateful if you could report to core team at discord");
        setCount(0);
        setClicked(false);
      } else if (
        (userInfo!.openedBmiContract === true && userInfo!.openedNftContract === true) ||
        (userInfo!.userBMIStorage.ats[0] != null && userInfo!.openedNftContract === true) ||
        (userInfo!.openedBmiContract === true && userInfo!.userNftStorage.ats[0] != null) ||
        (userInfo!.userBMIStorage.ats[0] != null && userInfo!.userNftStorage.ats[0] != null)
      ) {
        alert("seems like the wallet you connected is a registered Bettermi account. Please make sure you are connecting to a correct wallet.");
        setCount(0);
        setClicked(false);
        return;
      } else if (userInfo!.userBMIStorage.ats[0] != null && userInfo!.userNftStorage.ats[0] != null) {
        store.dispatch(accountSlice.actions.setNftContractStorage(userInfo!.userNftStorage.ats[0].at));

        var description = userInfo!.userBMIStorage.ats[0].description;

        if (description.includes("Female") === true) {
          store.dispatch(profileSlice.actions.setGender("Female"));
        } else if (description.includes("Male") === true) {
          store.dispatch(profileSlice.actions.setGender("Male"));
        } else {
          store.dispatch(profileSlice.actions.setGender("Male"));
        }
        alert("seems like the wallet you connected is a registered Bettermi account. Please make sure you are connecting to a correct wallet.");
        setCount(0);
        setClicked(false);
      } else if (userInfo?.loginedAcctID == null) {
        navigate("/errorReferralCode");
      }
      // return userInfo?.loginedAcctID
      else {
        setCount(100);
        navigate("/referralGiveReward");
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

  // const nftIconCheck = useRef(false);

  // useEffect(() => {
  //   if (nftIconCheck.current) {
  //     return;
  //   }
  //   nftIconCheck.current = true;
  //   userConnectWallet(appName,Wallet,Ledger,codeHashId,codeHashIdForNft,assetId,navigate);
  // }, []);

  useEffect(() => {
    //const incrementInterval = 240000 / 96; // Time divided by the number of increments
    const incrementInterval = 50000 / 1000;
    const timer = setInterval(() => {
      if (count < 100 && clicked === true) {
        setCount((prevCount) => {
          if (prevCount < 99) {
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
  }, [clicked]);

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
        <div className="discord-start-loading-progress">{clicked === true ? `${count}%` : ""}</div>
        <div className="discord-start-loading-button-container">
          {clicked === false ? (
            <div className="discord-start-loading-button-container">
              <EntranceScreenTemplate
                // upperButtonFunction={() => {navigate("/referralGiveReward")}}
                upperButtonFunction={() => {
                  setClicked(true);
                  userConnectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId, navigate);
                }}
                lowerButtonFunction={() => {}}
                haveLowerButton={false}
                haveGuestEntrance={false}
                upperButtonText="Start"
                lowerButtonText="Phoenix Wallet"
              ></EntranceScreenTemplate>
            </div>
          ) : (
            <div className="discord-start-loading-button-container">
              <DisabledButton text={"Start"} height={"56px"} width={"248px"}></DisabledButton>
            </div>
          )}
        </div>
        {clicked ? (
          <>
            <div className="discord-start-loading-instruction inter-normal-white-15px">
              Please wait patiently
              <br />
              and do not refresh the page...
            </div>
          </>
        ) : (
          <div className="discord-start-loading-instruction inter-normal-white-15px"></div>
        )}
      </div>
    </div>
  );

  return content;
}
