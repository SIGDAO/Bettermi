import React, { useState } from "react";
import "./entranceScreenTemplate.css";
import { ButtonWithAction, DisabledButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate,useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
export interface IEntranceScreenTemplateProps {
    upperButtonFunction:(...args: any[]) => void,
    lowerButtonFunction:(...args: any[]) => void,
    isLoading?:boolean,
    setIsLoading:React.Dispatch<React.SetStateAction<boolean>>,
}

export default function EntranceScreenTemplate(props: IEntranceScreenTemplateProps) {
  const {upperButtonFunction,lowerButtonFunction,isLoading,setIsLoading} = props;
  const logo: JSX.Element = (
    <div className="referralCode-bg-img-container">
      {isLoading && <img className="referralCode-bg-img" src={process.env.PUBLIC_URL + "/img/connectWallet/freeze_bettermi_logo.png"} />}
      <img 
        className="referralCode-bg-img" 
        src={process.env.PUBLIC_URL + "/img/connectWallet/Bettermi.io_dAPP_Landing_Animation_compassed.gif"} 
        onLoad={() => {if(setIsLoading !== undefined){setIsLoading(false)}}} 
        style={{ display: isLoading ? 'none' : 'inline-block' }}  
      />
    </div>
  );

  const content: JSX.Element = (
    <div className="entranceScreenTemplate-layout">
      {/* {logo} */}
      <div id="entranceScreenTemplate-container">
        {logo}
        <div className="entranceScreenTemplate-option-container">
          <div id="entranceScreenTemplate-button-container">
            <ButtonWithAction
              text="XT Wallet"
              action={() => {
                upperButtonFunction();
              }} // TODO: add action to connect wallet
              height="56px"
              width="248px"
            />
            {/* <Link to="https://phoenix-wallet.rocks/"> */}
            <DisabledButton text="Phoenix Wallet" height="56px" width="248px" />
            {/* </Link> */}
          </div>
          <div className="guest-explore-container">
            <p className="inter-normal-white-12px">Curious to see what awaits ?</p>
            <div className="inter-normal-keppel-12px guest-explore-button" onClick={() => {lowerButtonFunction()}}>
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