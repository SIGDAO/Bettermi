import React from "react";
import { Dispatch, useEffect } from "react";
import { DiscordVerificationButton, GuestConnectWallectButton } from "../../components/button";
import "./discordVerification.css";
import { PopupWindowTemplate } from "../../components/popupWindow";

interface IDiscordVerificationPopUpProp {
  isPopUpNFTDetailWinodow: boolean;
  setIsPopUpNFTDetailWinodow: Dispatch<React.SetStateAction<boolean>>;
  // children?: React.ReactNode;
  // content: string[];
  // buttonComponent?: React.ReactNode;
}

export const DiscordVerificationPopUp: React.FunctionComponent<IDiscordVerificationPopUpProp> = ({ content, isPopUpNFTDetailWinodow, setIsPopUpNFTDetailWinodow }) => {
  const screenContent: string[] = ["Discord Verification", "", "img/referralCode/discordLogo.png", "Use connected wallet for Discord API.", "Ensure you have a Discord account"];

  const upperContent: JSX.Element = (
    <>
      <p className="inter-semi-bold-white-18px">Discord Verification</p>
    </>
  );

  const lowerContent: JSX.Element = (
    <div className="discord-verification-detail-popup-window-below-content">
      <img className="discord-verification-detail-popup-window-mimi" src={`${process.env.PUBLIC_URL}/img/referralCode/discordLogo.png`} alt="" />
      <div className="inter-normal-white-14px line-height-21px">
        Use connected wallet for Discord API.
        <br />
        Ensure you have a Discord account !
      </div>
    </div>
  );

  // Remove the existing declaration of 'buttonComponent'
  // const buttonComponent: JSX.Element = (
  //   <DiscordVerificationButton className="guest-take-selfie-button-container" height="56px" width="248px" />);

  // Declare 'buttonComponent' only once
  const buttonComponent: JSX.Element = <DiscordVerificationButton className="guest-take-selfie-button-container" height="56px" width="248px" />;

  const guestNFTDetailpopupWindowDisplay: JSX.Element = (
    <>
      <PopupWindowTemplate upperContent={upperContent} lowerContent={lowerContent} buttonComponent={buttonComponent} />
      <div onClick={() => setIsPopUpNFTDetailWinodow(false)} className="click-the-area-to-make-it-hidden-again"></div>
    </>
  );

  // const guestNFTDetailpopupWindowDisplay: JSX.Element = (
  //   <>
  //     <div className="discord-verification-detail-popup-window-container">
  //       {content[0] !== "" ? ( //if the content array[0] is empty, show nothing, otherwise show title
  //         <div className="discord-verification-detail-popup-window-title inter-semi-bold-white-18px">{content[0]}</div>
  //       ) : (
  //         <></>
  //       )}
  //       <div className="discord-verification-detail-popup-window-content">
  //         {content[1] !== "" ? <div className="inter-bold-royal-blue-15px">{content[1]}</div> : <></>}
  //         {content[2] !== "" ? <img className="discord-verification-detail-popup-window-mimi" src={`${process.env.PUBLIC_URL}/${content[2]}`} alt="" /> : <></>}
  //         {content[3] !== "" && content[4] !== "" ? (
  //           <div className="discord-verification-detail-description inter-normal-cadet-blue-14px line-height-21px">
  //             {content[3]}
  //             <br />
  //             {content[4]}
  //           </div>
  //         ) : (
  //           <></>
  //         )}
  //         {buttonComponent ? buttonComponent : <></>}
  //       </div>
  //     </div>
  //     <div onClick={() => setIsPopUpNFTDetailWinodow(false)} className="click-the-area-to-make-it-hidden-again"></div>
  //   </>
  // );
  return <>{isPopUpNFTDetailWinodow && <div className="hidden-content">{guestNFTDetailpopupWindowDisplay}</div>}</>;
};
