import React, { useState, useContext, useEffect } from "react";
import "./AuthorizationDone.css";
import { ButtonWithAction, DisabledButton, PurpleButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
import { AppContext } from "../../redux/useContext";
import { connectWallet } from "../../NftSystem/connectWallet/connectWallet";
import axios from "axios";

export interface IReferralCodeProps {}

export default function AuthorizationDone(props: IReferralCodeProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("id is", 123);
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  console.log(code); // Output: RwBjn8D9IuuukeT8EvBUQUGX2fVCPG
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
  // const REDIRECT_URI = process.env.BETTERMI_ENTRANCE_POINT!;
  const REDIRECT_URI = `${window.location.origin}/loadingDiscordAuthorization`;
  const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace('"', "");
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!.replace('"', ""); // the code hash of the NFT contract
  const assetId = process.env.REACT_APP_TOKEN_ID!.replace('"', "");
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET!;

  console.log("redirect URL is", REDIRECT_URI);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [buttonText, setButtonText] = useState<string>("discordVerification");
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const [userPublicKey, setUserPublicKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [ledger, setLedger] = useState<any>({});

  const verification = async () => {
    console.log(process.env.REACT_APP_NODE_ADDRESS + "/getUserIdAndAuth");
    const isNewUser = await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/getUserIdAndAuth", { code: code });
    console.log(isNewUser.data);
  };
  const Buy = async () => {
    try {
      console.log(userPublicKey);
      console.log("ledger is", ledger);
      const transaction = await ledger.message.sendMessage({
        message: JSON.stringify({
          bmi: "123",
          time: new Date(),
        }),
        messageIsText: true,
        recipientId: "4572964086056463895",
        feePlanck: "1000000",
        senderPublicKey: userPublicKey,
        deadline: 1440,
      });
      await Wallet.Extension.confirm(transaction.unsignedTransactionBytes);
    } catch (error: any) {
      console.log("error is", error);
    }
  };

  const discordAuthorization = async () => {
    try {
      await verification();
      setLoading(false);
      if (!code) {
        alert("seems authorization failed, returning to home");
        navigate("/");
      }
    } catch (e) {
      setLoading(false);
      console.log("error is", e);
    }
  };

  useEffect(() => {
    // if (walletConnected.current ) {
    //     return;
    //   }
    //   walletConnected.current = true;
    discordAuthorization();
    console.log("called useEffect");
  }, []);

  const logo: JSX.Element = (
    <div className="newUserdiscordAuthorization-bg-img-container">
      {isLoading && <img className="newUserdiscordAuthorization-bg-img" src={process.env.PUBLIC_URL + "/img/connectWallet/freeze_bettermi_logo.png"} />}
      <img
        className="newUserdiscordAuthorization-bg-img"
        src={process.env.PUBLIC_URL + "/img/connectWallet/Bettermi.io_dAPP_Landing_Animation_compassed.gif"}
        onLoad={() => setIsLoading(false)}
        style={{ display: isLoading ? "none" : "inline-block" }}
      />
    </div>
  );

  const content: JSX.Element = (
    <div className="newUserdiscordAuthorization-layout">
      <div id="newUserdiscordAuthorization-container">
        {logo}
        <BackButton></BackButton>
        <div className="newUserdiscordAuthorization-option-container">
          <div id="newUserdiscordAuthorization-button-container">
            <PurpleButton
              text={"Next"}
              action={async () => {
                if (!loading) {
                  const info = await connectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId);

                  console.log("connected wallet", info);
                  setUserPublicKey(info!.userPublicKey);
                  setLedger(info!.ledger);
                  navigate("/referralGiveReward");
                }
              }} // TODO: add action to connect wallet
              height="56px"
              width="248px"
            />
            {/* <Link to="https://phoenix-wallet.rocks/">
              <DisabledButton text="hihihihi" height="56px" width="248px" />
            </Link> */}
            {/* <ButtonWithAction
                text = {"connect to Home"}
                action={() => {
                  //Buy();
                }} // TODO: add action to connect wallet
                height="56px"
                width="248px"
              /> */}
            <PurpleButton
              text={"connect to Home"}
              action={() => {
                //Buy();
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
