import React from "react";
import "./connectWallet.css";
import { CenterLayout } from "../../components/layout";
import { ButtonWithAction, ButtonWithNavigation, DisabledButton } from "../../components/button";
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
import { contractSlice } from "../../redux/contract";
import axios from "axios";
import { checkEquippedBettermiNFT } from "../../NftSystem/UserLevel/checkUserLevel";
import { UpdateUserIconNewVersion } from "../../NftSystem/updateUserNftStorage";
import { FindLatestTransactionNumber } from "../../NftSystem/updateUserNftStorage";
import { FindLatestTransactionArray } from "../../NftSystem/updateUserNftStorage";

export interface IConnectWalletProps {}

export default function ConnectWallet (props: IConnectWalletProps) {
  localStorage.clear();//Guess we need to clear out all local storage after connecting account
  const navigate = useNavigate();
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace('"', '');
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!.replace('"', ''); // the code hash of the NFT contract
  const assetId = process.env.REACT_APP_TOKEN_ID!.replace('"', '');
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!.replace('"', '');
  store.dispatch({ type: "USER_LOGOUT" });



  const connectWallet = async (appName: any, Wallet: any, Ledger: any) => {

    let key: string;


    console.log("wallet", Wallet);
    console.log("appName", appName);
    console.log("networkName", Ledger.Network);
    Wallet.Extension.connect({ appName, networkName: Ledger.Network })
      .then(async (wallet: any) => {

        key = wallet.publicKey;
        const import_account: Address = Address.fromPublicKey(key, Ledger.AddressPrefix);
        const accountinfo: userAccount = {
          accountId: import_account.getNumericId(),
          accountRS: import_account.getReedSolomonAddress(),
          publicKey: import_account.getPublicKey(),
          isWatchOnlyMode: true,
          token: 0,
          level: "1",
          nftContractStorage: "",
        };
        store.dispatch(accountSlice.actions.setAccount(accountinfo));
        store.dispatch(walletSlice.actions.setWalletPublicKey(key));
        store.dispatch(walletSlice.actions.setIsWalletConnected(true));
        store.dispatch(walletSlice.actions.setWalletNodeHost(wallet.currentNodeHost));
        localStorage.setItem("accountId", import_account.getNumericId());
        localStorage.setItem("nodeHost", wallet.currentNodeHost);
        const ledger = LedgerClientFactory.createClient({ nodeHost: wallet.currentNodeHost });

        // check if there is are unconfirmed NFT and BMI contract
        const openedNftContract = await CheckUnconfirmedNewNFTContract(ledger, import_account.getNumericId());
        const openedBmiContract = await CheckUnconfirmedNewBMIContract(ledger, import_account.getNumericId());

        let ourContract = await ledger.contract.getContractsByAccount({
          accountId: accountinfo.accountId,
          machineCodeHash: codeHashId.replace(/['"]+/g, ''),
        });
        ledger.asset.getAssetHolders({ assetId: assetId }).then((asset) => {
          for (var i = 0; i < asset.accountAssets.length; i++) {
            if (asset.accountAssets[i].account === accountinfo.accountId) {
              store.dispatch(accountSlice.actions.setToken(Number(asset.accountAssets[i].quantityQNT) / 1000000));
              localStorage.setItem("token", asset.accountAssets[i].quantityQNT);
              break;
            }
            if (i == asset.accountAssets.length - 1) {
              store.dispatch(accountSlice.actions.setToken(0));
              localStorage.setItem("token", "0");
            }
          }
        });
        const asset = await ledger.asset.getAssetHolders({ assetId: assetId });
        asset.accountAssets.map((obj) => {
          if (obj.account == accountinfo.accountId) {
            store.dispatch(accountSlice.actions.setToken(Number(obj.quantityQNT) / 1000000));
            localStorage.setItem("token", obj.quantityQNT);
          }
        });
        // navigate('/connectSucceed');

        let senderNftStorage = await ledger.contract.getContractsByAccount({
          accountId: accountinfo.accountId,
          machineCodeHash: codeHashIdForNft,
        });

        // set the redux for if needed to recreate the BMI and NFT contract
        store.dispatch(contractSlice.actions.setIsBMIContractBuild((ourContract.ats[0] != null || openedBmiContract === true)))
        store.dispatch(contractSlice.actions.setIsNFTContractBuild((senderNftStorage.ats[0] != null || openedNftContract === true)))

        console.log("openedBmiContract", openedBmiContract)
        console.log("openedNftContract", openedNftContract)

        // if both contract is created
        if ((openedBmiContract === true && senderNftStorage.ats[0]) || (ourContract.ats[0] != null && openedNftContract === true)) {
          navigate('/loadingMinting')
          return
        }

        if (ourContract.ats[0] != null && senderNftStorage.ats[0] != null) {
          console.log("called the if statement");


            store.dispatch(accountSlice.actions.setNftContractStorage(senderNftStorage.ats[0].at));
          

            var description = ourContract.ats[0].description;

            if (description.includes("Female") === true) {
              store.dispatch(profileSlice.actions.setGender("Female"));
            } else if (description.includes("Male") === true) {
              store.dispatch(profileSlice.actions.setGender("Male"));
            } else {
              store.dispatch(profileSlice.actions.setGender("Male"));
            }
          // const equippedBettermiNft = await checkEquippedBettermiNFT(ledger,accountinfo.accountId);
          //   if(equippedBettermiNft === false){
          //     alert("please equip a Bettermi NFT, we will shortly prompt a notification to help you change it");

          //     const name = "ANderson";
          //     let receiverNftStorage = await ledger.contract.getContractsByAccount({
          //       accountId: accountinfo.accountId,
          //       machineCodeHash: codeHashIdForNft,
          //   });
          //   console.log("receiverNftStorage",receiverNftStorage.ats[0].at);
          //     const latestTransactionNumber = await FindLatestTransactionNumber(ledger,receiverNftStorage.ats[0].at,nftDistributor);
          //     const transactionArray = await FindLatestTransactionArray(ledger,receiverNftStorage.ats[0].at,nftDistributor,latestTransactionNumber);
          //     if(transactionArray[0] == "empty"){
          //       alert("we didn't detect any nfts");
          //       navigate("/connectWallet");
          //     }
          //     const nftId = transactionArray[0];
          //     console.log("nftId is",nftId);
          //     const contractDescription = await ledger.contract.getContract(nftId);
          //     const ipfsAddress = JSON.parse(contractDescription.description).descriptor;
          //     console.log(ipfsAddress);
          //     // await fetch(`https://ipfs.io/ipfs/${ipfsAddress}`).then((res) => res.text()).then((res) => {
          //     //   const text = JSON.parse(res);
          //     //   const imgAddress = text.media[0].social
          //     //   UpdateUserIconNewVersion(ledger,imgAddress,nftId, accountinfo.accountId,accountinfo.publicKey,Wallet,name);
          //     // })
          //     const ipfsJson = await fetch(`https://ipfs.io/ipfs/${ipfsAddress}`);
          //     const text = await ipfsJson.text();
          //     const imgAddress = JSON.parse(text).media[0].social;
          //     await  UpdateUserIconNewVersion(ledger,imgAddress,nftId, accountinfo.accountId,accountinfo.publicKey,Wallet,name);
            //   navigate("/connectWallet");
            // }
            // else{
            //   navigate("/home");
            // };
            navigate("/home");
        } else {

          navigate("/connectSucceed");
        }
      })
      // todo: add error handling, and show it to user
      .catch((error: any) => {
        console.log("error", error);
        if (error.name === "InvalidNetworkError") {
          alert(
            "It looks like you are not connecting to the correct signum node in your XT-Wallet, currently in our beta version we are using Europe node, please change your node to Europe node and try again"
          );
        }
        if (error.name === "NotFoundWalletError") {
          window.location.href = "https://chrome.google.com/webstore/detail/signum-xt-wallet/kdgponmicjmjiejhifbjgembdcaclcib/";
        }
      });
  };

  const content: JSX.Element = (
    <div className="connectWallet-layout">
      <div id="connectWallet-container">
        <h1 id="connectWalletTopic" className="default-font-setting">
          Connect Your Wallet
        </h1>
        <p id="connectWalletDisciption" className="default-font-setting">
          Connect your crypto wallet <br />
          &amp; Start your Bettermi Journey!
        </p>
        <div id="img-slider">
          <img className="connect-profilePic-side" src={process.env.PUBLIC_URL + "/img/connectWallet/photo-6@1x.png"} alt="Photo" />
          <img className="connect-profilePic" src={process.env.PUBLIC_URL + "/img/mimi.png"} alt="Photo" />
          <img className="connect-profilePic-side" src={process.env.PUBLIC_URL + "/img/connectWallet/photo-7@1x.png"} alt="photo" />
        </div>
        <div id="collectWallet-button-container">
          <Link to="https://phoenix-wallet.rocks/">
            <DisabledButton text="Phoenix wallet" height="56px" width="150px" />
          </Link>
          <ButtonWithAction
            text="XT wallet"
            action={
              () => {
                connectWallet(appName, Wallet, Ledger)
              }} // TODO: add action to connect wallet
            height="56px"
            width="150px"
          />
        </div>
      </div>
    </div>
  );

  return content;
  // return <CenterLayout bgImg={false} content={content} />;
}
