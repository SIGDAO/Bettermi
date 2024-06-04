import React, { useState } from "react";
import "./discordVerification.css";
import { ButtonWithAction, DisabledButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate,useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
export interface IReferralCodeProps {}

export default function DiscordVerification(props: IReferralCodeProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("id is",123);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [buttonText,setButtonText] = useState<string>("Verification");


  const logo: JSX.Element = (
    <div className="newUserDiscordVerification-bg-img-container">
      {isLoading && <img className="newUserDiscordVerification-bg-img" src={process.env.PUBLIC_URL + "/img/connectWallet/freeze_bettermi_logo.png"} />}
      <img 
        className="newUserDiscordVerification-bg-img" 
        src={process.env.PUBLIC_URL + "/img/connectWallet/Bettermi.io_dAPP_Landing_Animation_compassed.gif"} 
        onLoad={() => setIsLoading(false)} 
        style={{ display: isLoading ? 'none' : 'inline-block' }}  
      />
    </div>
  );

  const content: JSX.Element = (
    <div className="newUserDiscordVerification-layout">
      <div id="newUserDiscordVerification-container">
        {logo}
        <BackButton></BackButton>
        <div className="newUserDiscordVerification-option-container">
          <div id="newUserDiscordVerification-button-container">
            <ButtonWithAction
              text = {buttonText}
              action={() => {
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