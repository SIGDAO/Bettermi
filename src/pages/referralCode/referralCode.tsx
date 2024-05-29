import React, { useState } from "react";
import "./referralCode.css";
import { ButtonWithAction, DisabledButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate,useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
export interface IReferralCodeProps {}

export default function ReferralCode(props: IReferralCodeProps) {
  localStorage.clear(); //Guess we need to clear out all local storage after connecting account
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("id is",id);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  store.dispatch({ type: "USER_LOGOUT" });



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
              text="XT wallet"
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