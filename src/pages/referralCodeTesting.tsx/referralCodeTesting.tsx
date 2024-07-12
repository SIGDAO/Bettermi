import React, { useState, useContext, useEffect, useRef } from "react";
import "./referralCodeTesting.css";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { ButtonWithAction, DisabledButton, PurpleButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
import { AppContext } from "../../redux/useContext";
import { connectWallet } from "../../NftSystem/connectWallet/connectWallet";
import { accountSlice } from "../../redux/account";
import { profileSlice } from "../../redux/profile";
import { checkIfUserExists } from "../../NftSystem/verifyUser/checkIfUserAccountExists";
import { LedgerClientFactory } from "@signumjs/core";
import { accountPublicKey } from "../../redux/account";

export interface IReferralCodeProps {}

export default function ReferralCodeTesting(props: IReferralCodeProps) {
  const navigate = useNavigate();
  const { referralCode } = useParams();
  console.log("referral code is", referralCode);
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace('"', "");
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!.replace('"', ""); // the code hash of the NFT contract
  const assetId = process.env.REACT_APP_TOKEN_ID!.replace('"', "");
  const walletConnected = useRef(false);
  const [userPublicKey, setUserPublicKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // if (walletConnected.current ) {
    //     return;
    //   }
    //   walletConnected.current = true;
    connectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId)
      .then((info) => {
        console.log(info);
        setUserPublicKey(info!.userPublicKey);
        setLoading(true);
      })
      .catch((e) => {
        setLoading(true);
        console.log("error is", e);
      });
  }, []);

  const Buy = async () => {
    try {
      console.log(userPublicKey);
      const transaction = await ledger2.message.sendMessage({
        message: JSON.stringify({
          bmi: "123",
          time: new Date(),
        }),
        messageIsText: true,
        recipientId: "7549602679371582747",
        feePlanck: "1000000",
        senderPublicKey: userPublicKey,
        deadline: 1440,
      });
      await Wallet.Extension.confirm(transaction.unsignedTransactionBytes);
    } catch (error: any) {
      console.log("error is", error);
    }
  };

  const logo: JSX.Element = (
    <div className="referralCode-bg-img-container">
      {isLoading && <img className="referralCode-bg-img" src={process.env.PUBLIC_URL + "/img/connectWallet/freeze_bettermi_logo.png"} />}
      <img
        className="referralCode-bg-img"
        src={process.env.PUBLIC_URL + "/img/connectWallet/Bettermi.io_dAPP_Landing_Animation_compassed.gif"}
        onLoad={() => setIsLoading(false)}
        style={{ display: isLoading ? "none" : "inline-block" }}
      />
    </div>
  );

  const content: JSX.Element = (
    <div className="referralCode-layout">
      <div id="referralCode-container">
        {logo}
        <BackButton/>
        <div className="referralCode-option-container">
          <div id="referralCode-button-container">
            {loading === true ? (
              // <ButtonWithAction
              //   text="Buy"
              //   action={() => {
              //     // if(referralCode){
              //     Buy();
              //     // }
              //     // else{
              //     //     alert("Its not a valid referral link")
              //     //     navigate("/");
              //     // }
              //   }} // TODO: add action to connect wallet
              //   height="56px"
              //   width="248px"
              // />
              <PurpleButton
                text="Buy"
                action={() => {
                  // if(referralCode){
                  Buy();
                  // }
                  // else{
                  //     alert("Its not a valid referral link")
                  //     navigate("/");
                  // }
                }} // TODO: add action to connect wallet
                height="56px"
                width="248px"
              />
            ) : (
              <div></div>
            )}
            {/* <ButtonWithAction
              text="Connect Wallet"
              action={() => {
                connectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId);
              }} // TODO: add action to connect wallet
              height="56px"
              width="248px"
            /> */}
            <PurpleButton
              text="Connect Wallet"
              action={() => {
                connectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId);
              }} // TODO: add action to connect wallet
              height="56px"
              width="248px"
            />

          </div>
        </div>
      </div>
    </div>
  );

  return content;
  // return <CenterLayout bgImg={false} content={content} />;
}
