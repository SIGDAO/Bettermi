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

  // const [isClicked, setIsClicked] = React.useState(false);

  const connectWallet = async (appName: any, Wallet: any, Ledger: any) => {
    //const wallet = new GenericExtensionWallet();
    let key: string;
    
  // await axios.post("http://localhost:8080/testnet/transferNftToUser", {
  //   feePlanck: "1000000",
  //   amountPlanck: "31000000",
  //   contractId: "6669459809144332374",
  //   methodHash: "3",
  //   methodArgs: ["6876604111667823486", "0", "0"],
  // });


    // console.log("isClicked in connectWallet", isClicked);

    // setIsClicked(true);

    // console.log("isClicked in connectWallet after setIsClicked", isClicked);


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
          // asset.accountAssets.map((obj)=>{
          //   console.log(asset);
          //   console.log(import_account.getNumericId());
          //   if(obj.account == import_account.getNumericId()){
          //     store.dispatch(accountSlice.actions.setToken(Number(obj.quantityQNT)));
          //     localStorage.setItem('token',obj.quantityQNT);
          //       console.log(obj.quantityQNT);
          //   }
          // })
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

          if (senderNftStorage.ats[0] != null) {
            store.dispatch(accountSlice.actions.setNftContractStorage(senderNftStorage.ats[0].at));
          }
          if (ourContract.ats[0] != null) {
            var description = ourContract.ats[0].description;

            //description = description.replace(/'/g, '"');
            //description = description.replace(/ /g, '"');
            // description = `"${description}"`
            //  description = JSON.parse(description);
            // console.log(description);
            if (description.includes("Female") === true) {
              store.dispatch(profileSlice.actions.setGender("Female"));
            } else if (description.includes("Male") === true) {
              store.dispatch(profileSlice.actions.setGender("Male"));
            } else {
              store.dispatch(profileSlice.actions.setGender("Male"));
            }
          }

          // Replace single quotes with double quotes

          // store.dispatch(profileSlice.actions.setGender(gender));
          // console.log(gender);
          // console.log(ourContract.ats[0]);
          //navigate('/connectSucceed');
          // setIsClicked(false);
          navigate("/home");
        } else {

          // setIsClicked(false);
          navigate("/connectSucceed");
        }
      })
      // todo: add error handling, and show it to user
      .catch((error: any) => {
        console.log("error", error);
        if (error.name === "InvalidNetworkError") {
          // console.log("wallet", Wallet);
          // console.log(error)
          alert(
            "It looks like you are not connecting to the correct signum node in your XT-Wallet, currently in our beta version we are using Europe node, please change your node to Europe node and try again"
          );
        }
        if (error.name === "NotFoundWalletError") {
          window.location.href = "https://chrome.google.com/webstore/detail/signum-xt-wallet/kdgponmicjmjiejhifbjgembdcaclcib/";
        }
        // setIsClicked(false);
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
                // console.log("isClicked", isClicked);
                // if (isClicked === true) return;
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
