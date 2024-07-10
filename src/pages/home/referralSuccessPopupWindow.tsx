import * as React from "react";
import { GuestConnectWallectButton, ReferralNavToTakeSelfieButton } from "../../components/button";
import SigdaoIcon from "../../components/icon";
import { DiscordVerificationButton } from "../../components/button";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

interface IReferralSuccessPopupWindowProps {
  isPopUpReferralSuccessWindow: boolean;
  setIsPopUpReferralSuccessWindow: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

const ReferralSuccessPopupWindow: React.FunctionComponent<IReferralSuccessPopupWindowProps> = (props) => {
  const { isPopUpReferralSuccessWindow, setIsPopUpReferralSuccessWindow, children } = props;
  const navigate = useNavigate();
  const referralSuccessSigdao = 3;

  const guestNFTDetailpopupWindowDisplay: JSX.Element = (
    <>
      <div className="guest-nft-detail-popup-window-container">
        <div className="guest-nft-detail-popup-window-title inter-semi-bold-white-18px">
          <p className="inter-semi-bold-white-18px">Congratulations !</p>
          <div className="referral-reward-add-container">
            <SigdaoIcon width="16px" height="16px" />
            <p className="inter-semi-bold-keppel-14px">+{referralSuccessSigdao}</p>
          </div>
        </div>
        <div className="guest-nft-detail-popup-window-content">
          {/* <div className="inter-bold-royal-blue-15px">START EARNING SIGDAO</div> */}
          <img className="guest-nft-detail-popup-window-mimi" src={`${process.env.PUBLIC_URL}/img/home/mimi-lying-taking-selfie-2-big-nft-at-back.png`} alt="" />
          <div className="guest-nft-detail-description inter-normal-white-14px line-height-21px">
            Selfie to Earn your FREE
            <br />
            Limited NFT & Web3 Membership.
          </div>
        </div>
        {/* <GuestConnectWallectButton className="guest-nft-detail-popup-window-connect-wallet-button" height="56px" width="248px" /> */}
        {/* <DiscordVerificationButton className="guest-nft-detail-popup-window-connect-wallet-button" height="56px" width="248px"></DiscordVerificationButton> */}
        <div className="referral-nav-to-take-selfie-button-container">
        <ReferralNavToTakeSelfieButton height="56px" width="248px" action={() => navigate("/takeSelfie")} />

        </div>
      </div>
      <div className="click-the-area-to-make-it-hidden-again" onClick={() => alert("You must equip a Bettermi.io NFT to enter")}/>
    </>
  );

  return <>{isPopUpReferralSuccessWindow && <div className="hidden-content">{guestNFTDetailpopupWindowDisplay}</div>}</>;
};

export default ReferralSuccessPopupWindow;
