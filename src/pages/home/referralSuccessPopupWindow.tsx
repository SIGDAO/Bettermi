import * as React from "react";
import { GuestConnectWallectButton, ReferralNavToTakeSelfieButton } from "../../components/button";
import SigdaoIcon from "../../components/icon";
import { DiscordVerificationButton } from "../../components/button";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { PopupWindowTemplate } from "../../components/popupWindow";
import { useDispatch, useSelector } from "react-redux";
import { profileSlice } from "../../redux/profile";

interface IReferralSuccessPopupWindowProps {}

const ReferralSuccessPopupWindow: React.FunctionComponent<IReferralSuccessPopupWindowProps> = (props) => {
  // const { isPopUpReferralSuccessWindow, setIsPopUpReferralSuccessWindow, children } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const referralSuccessSigdao = 3;

  const referralSuccessPopupWindowUpperContent: JSX.Element = (
    <>
      <p className="inter-semi-bold-white-18px">Congratulations !</p>
      <div className="referral-reward-add-container">
        <SigdaoIcon width="16px" height="16px" />
        <p className="inter-semi-bold-keppel-14px">+{referralSuccessSigdao}</p>
      </div>
    </>
  );

  const referralSuccessPopupWindowLowerContent: JSX.Element = (
    <div className="referral-congrat-popup-window-container">
      {/* <div className="inter-bold-royal-blue-15px">START EARNING SIGDAO</div> */}
      <img className="referral-congrat-popup-window-mimi" src={`${process.env.PUBLIC_URL}/img/home/mimi-lying-taking-selfie-2-big-nft-at-back.png`} alt="" />
      <div className="inter-normal-white-14px line-height-21px">
        Selfie to Earn your FREE
        <br />
        Limited NFT & Web3 Membership.
      </div>
    </div>
  );

  const guestNFTDetailpopupWindowDisplay: JSX.Element = (
    <>
      <PopupWindowTemplate
        upperContent={referralSuccessPopupWindowUpperContent}
        lowerContent={referralSuccessPopupWindowLowerContent}
        buttonComponent={
          <ReferralNavToTakeSelfieButton
            className="referral-nav-to-take-selfie-button-container"
            height="56px"
            width="248px"
            action={() => {
              dispatch(profileSlice.actions.authenticated());
              navigate("/takeSelfie");
            }}
          />
        }
      />
      <div className="click-the-area-to-make-it-hidden-again" onClick={() => alert("You must equip a Bettermi.io NFT to enter")} />
    </>
  );

  return <div className="hidden-content">{guestNFTDetailpopupWindowDisplay}</div>;
};

export default ReferralSuccessPopupWindow;
