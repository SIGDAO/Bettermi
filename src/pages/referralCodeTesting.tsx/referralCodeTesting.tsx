import React, { useState,useContext,useEffect,useRef } from "react";
import "./referralCodeTesting.css";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { ButtonWithAction, DisabledButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate,useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
import { AppContext } from "../../redux/useContext";
import { connectWallet } from "../../NftSystem/connectWallet/connectWallet";
import { accountSlice } from "../../redux/account";
import { profileSlice } from "../../redux/profile";
import { checkIfUserExists } from "../../NftSystem/verifyUser/checkIfUserAccountExists";
import { LedgerClientFactory } from "@signumjs/core";

export interface IReferralCodeProps {}

export default function ReferralCodeTesting(props: IReferralCodeProps) {
  const navigate = useNavigate();
  const { referralCode } = useParams();
  console.log("referral code is",referralCode);
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace('"', "");
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!.replace('"', ""); // the code hash of the NFT contract
  const assetId = process.env.REACT_APP_TOKEN_ID!.replace('"', "");
  const walletConnected = useRef(false);


  useEffect(() => {
    // if (walletConnected.current ) {
    //     return;
    //   }
    //   walletConnected.current = true;
    connectWallet(appName, Wallet, Ledger,codeHashId,codeHashIdForNft,assetId);
  }, []); 


  const Buy = async () => {
    try{
        await ledger2.message.sendMessage({
            message: JSON.stringify({
              'bmi': "123",
              'time': new Date(),
            }) ,
            messageIsText: true,
            recipientId: "8886251522354342618",
            feePlanck: "1000000",
            senderPublicKey: "041f3b333d93ba9b24eaf324d1090f763f7c78ed0b7922d2d3eaeecaf440501c",
            senderPrivateKey:"83a4a4e95bc8da68a9c00b7b86523d576b967236ac67a7c0bfb98b3c5d19df0e",
            deadline: 1440,
          }) ;
    }
    catch(error:any){
        console.log("error is",error);
    }
  }

  const logo: JSX.Element = (
    <div className="referralCode-bg-img-container">
      {isLoading && <img className="referralCode-bg-img" src={process.env.PUBLIC_URL + "/img/connectWallet/freeze_bettermi_logo.png"} />}
      <img 
        className="referralCode-bg-img" 
        src={process.env.PUBLIC_URL + "/img/connectWallet/Bettermi.io_dAPP_Landing_Animation_compassed.gif"} 
        onLoad={() => setIsLoading(false)} 
        style={{ display: isLoading ? 'none' : 'inline-block' }}  
      />
    </div>
  );

  const content: JSX.Element = (
    <div className="referralCode-layout">
      <div id="referralCode-container">
        {logo}
        <BackButton></BackButton>
        <div className="referralCode-option-container">
          <div id="referralCode-button-container">
            <ButtonWithAction
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
            <Link to="https://phoenix-wallet.rocks/">
              <DisabledButton text="Phoenix wallet" height="56px" width="248px" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return content;
  // return <CenterLayout bgImg={false} content={content} />;
}