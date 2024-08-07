import * as React from "react";
import "./referralCode.css"
import { PopupWindowTemplate } from "../../components/popupWindow";
import { DarkGreenButton, PurpleButton } from "../../components/button";
import { useNavigate } from "react-router-dom";

interface IReferralWarningPopupWindowProps {
  isPopupReferralWarning: boolean;
  setIsPopupReferralWarning: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReferralWarningPopupWindow: React.FunctionComponent<IReferralWarningPopupWindowProps> = (props) => {
  const { isPopupReferralWarning, setIsPopupReferralWarning } = props;
  const navgiate = useNavigate();

  const upperContent: JSX.Element = <p className="inter-semi-bold-white-18px">Are You Sure ?!</p>;

  const lowerContent: JSX.Element = (
    <div className="referral-pop-up-warn-lower-content">
      <div className="referral-warning-mimi-icon-container">
        <img src={process.env.PUBLIC_URL + "/img/referralCode/mimi_error.png"} alt="" />

      </div>
      <div className="inter-normal-hot-magenta-14px line-height-21px referral-pop-up-warn-description">
        Connect wallet to get SIGDAO,
        <br />
        or You will miss out the reward !
      </div>
    </div>
  );

  const buttonComponent: JSX.Element = (
    <div className="referral-button-container">
      <PurpleButton height="56px" width="248px" text="Connect Wallet" action={() => setIsPopupReferralWarning(false)} />
      <DarkGreenButton height="56px" width="248px" text="Continue as a Guest" action={() => navgiate("/home")} />
    </div>
  );

  return (
    isPopupReferralWarning && (
      <div className="hidden-content">
        <PopupWindowTemplate height="435px" width="332px" upperContent={upperContent} lowerContent={lowerContent} buttonComponent={buttonComponent} />
        <div onClick={() => setIsPopupReferralWarning(false)} className="click-the-area-to-make-it-hidden-again"></div>
      </div>
    )
  );
};

export default ReferralWarningPopupWindow;
