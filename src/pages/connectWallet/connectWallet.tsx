import React, { useEffect, useState } from "react";
import "./connectWallet.css";
// import { LazyLoadImage } from 'react-lazy-load-image-component';
import { CenterLayout } from "../../components/layout";
import { ButtonWithAction, ButtonWithNavigation, DisabledButton, PurpleButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { walletSlice } from "../../redux/wallet";
import { DeeplinkableWallet, GenericExtensionWallet } from "@signumjs/wallets";
import { Address, Ledger } from "@signumjs/core";
import { accountId, userAccount } from "../../redux/account";
import { accountSlice } from "../../redux/account";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import { useNavigate } from "react-router-dom";
import { LedgerClientFactory } from "@signumjs/core";
import { profileSlice } from "../../redux/profile";
import { CheckUnconfirmedNewNFTContract } from "../myNftList/checkNewContract";
import { CheckUnconfirmedNewBMIContract } from "../myNftList/checkNewContract";
import { Link } from "react-router-dom";
import { contractSlice, selectCurrentIsBMIContractBuild, selectCurrentIsNFTContractBuild } from "../../redux/contract";
import axios from "axios";
import { checkEquippedBettermiNFT } from "../../NftSystem/UserLevel/checkUserLevel";
import { UpdateUserIconNewVersion } from "../../NftSystem/updateUserNftStorage";
import { FindLatestTransactionNumber } from "../../NftSystem/updateUserNftStorage";
import { FindLatestTransactionArray } from "../../NftSystem/updateUserNftStorage";
import { connectWallet } from "../../NftSystem/connectWallet/connectWallet";
import { useDispatch, useSelector } from "react-redux";
import { selectWalletNodeHost } from "../../redux/useLedger";

export interface IConnectWalletProps {}

export default function ConnectWallet(props: IConnectWalletProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { appName, Wallet, Ledger } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isIconLoading, setIsIconLoading] = useState<boolean>(true);
  const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace('"', "");
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!.replace('"', ""); // the code hash of the NFT contract
  const assetId = process.env.REACT_APP_TOKEN_ID!.replace('"', "");
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!.replace('"', "");
  const userAccountId = useSelector(accountId);

  // store.dispatch({ type: "USER_LOGOUT" });

  useEffect(() => {
    store.dispatch({ type: "USER_LOGOUT" });
    localStorage.clear(); //Guess we need to clear out all local storage after connecting account
  }, []);

  const userConnectWallet = async (appName: any, Wallet: any, Ledger: any, codeHashId: string, codeHashIdForNft: string, assetId: string, navigate: any) => {
    try {
      if (isLoading) return;

      setIsLoading(true);

      const userInfo = await connectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId);
      if (userInfo == null) {
        alert("seems like an error has occured. We would be grateful if you could report to core team at discord");
      }
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
        setIsLoading(false);

        dispatch(profileSlice.actions.authenticated());
        navigate("/home");
      } else {
        setIsLoading(false);
        dispatch(profileSlice.actions.setIsNewUser(true));
        navigate("/connectSucceed");
      }
    } catch (error: any) {
      // todo: add error handling, and show it to user

      if (error.message === "Failed to fetch IPFS JSON") {
        alert("Cannot connect wallet, failed to fetch IPFS JSON. Please try again !\nIf the problem persists, please contact core team through discord !");
      }

      if (error.name === "InvalidNetworkError") {
        alert(
          "It looks like you are not connecting to the correct signum node in your XT-Wallet, currently in our beta version we are using Europe node, please change your node to Europe node and try again",
        );
      }

      setIsLoading(false);
      if (error.name === "NotFoundWalletError") {
        window.location.href = "https://chrome.google.com/webstore/detail/signum-xt-wallet/kdgponmicjmjiejhifbjgembdcaclcib/";
      }
    }
  };

  const guestExplore = (): void => {
    navigate("/home");
  };

  const logo: JSX.Element = (
    <>
      {isIconLoading && <img className="connectWallet-bg-img" src={process.env.PUBLIC_URL + "/img/connectWallet/preview_logo.jpg"} />}
      <img
        className="connectWallet-bg-img"
        src={process.env.PUBLIC_URL + "/img/connectWallet/Bettermi.io-dAPP-Landing-Animation-V2_compressed.gif"}
        onLoad={() => setIsIconLoading(false)}
        style={{ display: isIconLoading ? "none" : "inline-block" }}
      />
    </>
    // </div>
  );

  const content: JSX.Element = (
    <div className="connectWallet-layout">
      {/* {logo} */}
      <div id="connectWallet-container">
        {logo}
        <div className="connectWallet-option-container">
          <div id="connectWallet-button-container">
            {/* <ButtonWithAction
              text="XT Wallet"
              action={() => {
                userConnectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId, navigate);
              }} // TODO: add action to connect wallet
              height="56px"
              width="248px"
            /> */}
            <PurpleButton
              text="XT Wallet"
              action={() => {
                userConnectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId, navigate);
              }}
              height="56px"
              width="248px"
              // style={{ borderRadius: "10px" }}
            />
            {/* <Link to="https://phoenix-wallet.rocks/"> */}
            <DisabledButton text="Phoenix Wallet" height="56px" width="248px" />
            {/* </Link> */}
          </div>
          <div className="guest-explore-container">
            <p className="inter-normal-white-12px">Curious to see what awaits ?</p>
            <div
              className="inter-normal-keppel-12px guest-explore-button"
              onClick={() => {
                if (isLoading) return;
                setIsLoading(true);
                setIsLoading(false);
                navigate("/home");
              }}
            >
              Explore as a guest
            </div>
          </div>

          {/* <p className="inter-normal-white-15px">or</p>
          <div className="inter-semi-bold-keppel-15px guest-explore-button" onClick={() => navigate("/home")}>
            Explore as a guest
          </div> */}
        </div>
      </div>
    </div>
  );

  return content;
  // return <CenterLayout bgImg={false} content={content} />;
}
