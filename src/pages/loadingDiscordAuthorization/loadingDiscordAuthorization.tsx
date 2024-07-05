import React, { useState,useContext,useEffect,useRef } from "react";
import "./loadingDiscordAuthorization.css";
import { ButtonWithAction, DisabledButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate,useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
import { AppContext } from "../../redux/useContext";
import { connectWallet } from "../../NftSystem/connectWallet/connectWallet";
import axios from "axios";
import LoadingScreen from "../../template/loadingScreen/loadingScreen";
import { accountSlice } from "../../redux/account";
import { profileSlice } from "../../redux/profile";
import { referrerSlice } from "../../redux/referrer";
import { referrer } from "../../redux/referrer";

export interface ILoadingDiscordAuthorizationProps {
    pathname:string;
}

export default function LoadingDiscordAuthorization(props: ILoadingDiscordAuthorizationProps) {
  const {pathname} = props;
    const navigate = useNavigate();
  const { id } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

console.log(code); // Output: RwBjn8D9IuuukeT8EvBUQUGX2fVCPG
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
  const REDIRECT_URI = process.env.BETTERMI_ENTRANCE_POINT!;
  const codeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace('"', "");
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!.replace('"', ""); // the code hash of the NFT contract
  const assetId = process.env.REACT_APP_TOKEN_ID!.replace('"', "");
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET!;


  console.log("redirect URL is",REDIRECT_URI);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [buttonText,setButtonText] = useState<string>("discordVerification");
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const [userPublicKey,setUserPublicKey] = useState<string>("");
  const [loading,setLoading] = useState<boolean>(false);
  const [ledger,setLedger] = useState<any>({});
  const [count,setCount] = useState<number>(1);

  const verification = async () => {
    console.log(process.env.REACT_APP_NODE_ADDRESS + "/getUserIdAndAuth");
    console.log("the referral code is",code);
    const isNewUser = await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/getUserIdAndAuth", {code:code});
    userConnectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId, navigate);
    console.log(isNewUser.data);
    if(isNewUser.data === false){
        navigate("/errorReferralCode");
    }
    else{
        //navigate("/start");
        navigate("/discordStart");
    }
  }
  const userConnectWallet = async (appName: any, Wallet: any, Ledger: any, codeHashId: string, codeHashIdForNft: string, assetId: string, navigate: any) => {
    try {
      const userInfo = await connectWallet(appName, Wallet, Ledger, codeHashId, codeHashIdForNft, assetId);
      if (userInfo == null) {
        alert("seems like an error has occured. We would be grateful if you could report to core team at discord");
      }

      if ((userInfo!.openedBmiContract === true && userInfo!.userNftStorage.ats[0]) || (userInfo!.userBMIStorage.ats[0] != null && userInfo!.openedNftContract === true)) {
        navigate("/errorReferralCode");
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
        alert("account registered")
        navigate("/errorReferralCode");
      } else {
        console.log("called once");
        navigate("/discordStart");
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
  const Buy = async () => {
    try{
      console.log(userPublicKey)
      console.log("ledger is",ledger);
        const transaction = await ledger.message.sendMessage({
            message: JSON.stringify({
              'bmi': "123",
              'time': new Date(),
            }) ,
            messageIsText: true,
            recipientId: "4572964086056463895",
            feePlanck: "1000000",
            senderPublicKey: userPublicKey,
            deadline: 1440,
          }) ;
        await Wallet.Extension.confirm(transaction.unsignedTransactionBytes);
    }
    catch(error:any){
        console.log("error is",error);
        navigate("/errorReferralCode");
    }
  }
  
  const isAuthorized = useRef(false);


  const discordAuthorization = async () => {
    try{
      await verification();
      setLoading(false);
      if(!code){
        alert("seems authorization failed, returning to home");
        navigate("/");
      }
    }
    catch(e){
      setLoading(false);
      console.log("error is",e);
    }
  }


  useEffect(() => {
    // if (walletConnected.current ) {
    //     return;
    //   }
    //   walletConnected.current = true;
    if (isAuthorized.current) {
        return;
      }
    isAuthorized.current = true;
    discordAuthorization();
    console.log("called useEffect")

  }, []); 
  useEffect(() => {
    //const incrementInterval = 240000 / 96; // Time divided by the number of increments
     const incrementInterval = 5000 / 100;
    const timer = setInterval(() => {

      if (count < 100) {

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
  }, []);


  const content: JSX.Element = (
    <LoadingScreen pathname={pathname} count = {count}></LoadingScreen>
  );

  return content;
}