import React from "react";
import { Dispatch, useEffect } from "react";
import { GuestConnectWallectButton } from "../../components/button";
import "./discordVerification.css"


interface IDiscordVerificationPopUpProp {
    isPopUpNFTDetailWinodow: boolean;
    setIsPopUpNFTDetailWinodow: Dispatch<React.SetStateAction<boolean>>;
    children?: React.ReactNode;
    content: string[];
    buttonComponent?: React.ReactNode;
}
  
export const DiscordVerificationPopUp: React.FunctionComponent<IDiscordVerificationPopUpProp> = ({
  content,
    isPopUpNFTDetailWinodow,
    setIsPopUpNFTDetailWinodow,
    children,
    buttonComponent,
  }) => {
    const guestNFTDetailpopupWindowDisplay: JSX.Element = (
        <>
          <div className="discord-verification-detail-popup-window-container">
          {
            content[0] !== ""? //if the content array[0] is empty, show nothing, otherwise show title 
            <div className="discord-verification-detail-popup-window-title inter-semi-bold-white-18px">{content[0]}</div>
            :<></>
          }
            <div className="discord-verification-detail-popup-window-content">
                {content[1] !== ""?
                <div className="inter-bold-royal-blue-15px">{content[1]}</div>:
                <></>
              }
              {
                content[2] !== "" ?
                <img className="discord-verification-detail-popup-window-mimi" src={`${process.env.PUBLIC_URL}/${content[2]}`} alt="" />:
                <></>
              }
              {
                content[3] !== "" && content[4] !== ""?
              <div className="discord-verification-detail-description inter-normal-cadet-blue-14px line-height-21px">
                Connect your Signum wallet
                <br />& Receive a FREE NFT membership !
            </div>:<></>
            }
           {buttonComponent?buttonComponent:<></>}
          </div>
          </div>
          <div onClick={() => setIsPopUpNFTDetailWinodow(false)} className="click-the-area-to-make-it-hidden-again"></div>
        </>
      );
    return(
    <>{isPopUpNFTDetailWinodow && <div className="hidden-content">{ guestNFTDetailpopupWindowDisplay }</div>}
      {children}
    </>
    );
  }