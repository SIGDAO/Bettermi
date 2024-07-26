import React, { useState } from "react";
import "./EntranceLogo.css";
import { ButtonWithAction, DisabledButton } from "../../components/button";
import { store } from "../../redux/reducer";
import { useNavigate,useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/button";
export interface IEntranceLogoProps {
    isLoading?:boolean,
    setIsLoading:React.Dispatch<React.SetStateAction<boolean>>,
}

export default function EntranceLogo(props: IEntranceLogoProps) {
  const {isLoading,setIsLoading} = props;
  const logo: JSX.Element = (
    <div className="EntranceLogo-bg-img">
      {isLoading && <img className="EntranceLogo-bg-img" src={process.env.PUBLIC_URL + "/img/connectWallet/freeze_bettermi_logo.png"} />}
      <img 
        className="EntranceLogo-bg-img" 
        src={process.env.PUBLIC_URL + "/img/connectWallet/Bettermi.io_dAPP_Landing_Animation_compassed.gif"} 
        onLoad={() => {if(setIsLoading !== undefined){setIsLoading(false)}}} 
        style={{ display: isLoading ? 'none' : 'inline-block' }}  
      />
    </div>
  );

  return logo;
  // return <CenterLayout bgImg={false} content={content} />;
}