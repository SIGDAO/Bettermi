import { Button } from "@mui/material";
import * as React from "react";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import CSS from "csstype";
import exp from "constants";
import "./button.css";
import { isTodayHaveSelfieRecord } from "./bmiCalculate";
import { accountId } from "../redux/account";
import { useDispatch, useSelector } from "react-redux";
import { useLedger } from "../redux/useLedger";
import { profileSlice, selectCurrentBMI, selectCurrentIsGuest, selectCurrentIsSelfie } from "../redux/profile";
import { selectBMI } from "../redux/userBMI";
import { useEffect, useState } from "react";

interface IButtonProps {
  text?: string;
  height: string;
  width: string;
  fontSize?: string;
  fontWeight?: string;
  action?: () => void;
  navigation?: string;
  style?: CSS.Properties;
  imagePath?: string;
  className?: string;
  imageClassName?: string;
  leftImage?: JSX.Element;
  rightImage?: JSX.Element;
}

// DefaultButton css style
// const defaultButtonStyle = makeStyles<Theme

interface IBackButtonProps {
  top?: string;
  customiseBackButtonLink?: string;
  className?: string;
}

export const PurpleButton: React.FunctionComponent<IButtonProps> = (props) => {
  const { text, height, width, action, navigation, style, leftImage, rightImage } = props;
  const navigate = useNavigate();

  const handleClick = (): void => {
    if (action) {
      action();
    } else if (navigation) {
      navigate(navigation);
    }
  };
  return (
    <div className="purple-button-container" style={style || { height: height, width: width }} onClick={handleClick}>
      {leftImage}
      <p className="inter-semi-bold-white-15px">{text}</p>
      {rightImage}
    </div>
  );
};

export const ReferralNavToTakeSelfieButton: React.FunctionComponent<IButtonProps> = (props) => {
  const { height, width, action } = props;

  const cameraIcon = <img src={process.env.PUBLIC_URL + "/img/selfieToEarn/ic-selfie-1@1x.png"} className="referral-take-selfie-button-icon" />;

  return <PurpleButton text="Take a Selfie and Start !" width={width} height={height} leftImage={cameraIcon} action={action} />;
};

export const ButtonWithNavigation: React.FunctionComponent<IButtonProps> = (props) => {
  const { text, height, width, navigation, style, imagePath, className, imageClassName } = props;
  const customStyle: CSS.Properties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: height,
    width: width,
    color: "white",
    background: "linear-gradient(-90deg, #8743ff 0%, #4136f1 100%)",
    borderRadius: "10px",
    boxShadow: "0px 15px 30px #1466cc29",
    textTransform: "none", // Add an initializer for the 'textTransform' property
  };

  return (
    <Link to={navigation || "/"}>
      <div className={className || ""} style={style || customStyle}>
        {text}
        {imagePath && <img src={`${process.env.PUBLIC_URL}/${imagePath}`} className={imageClassName} alt="" />}
      </div>
    </Link>
  );
};

export const ButtonWithAction: React.FunctionComponent<IButtonProps> = (props) => {
  const { text, height, width, action } = props;

  const CustomButton = styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${height};
    width: ${width};
    font-family: var(--font-family-inter);
    font-size: ${props.fontSize || "15px"};
    font-weight: ${props.fontWeight || "600"};
    background: linear-gradient(-90deg, #8743ff 0%, #4136f1 100%);
    border-radius: 10px;
    color: white;
    box-shadow: 0px 15px 30px #1466cc29;
    padding: 14.5px 21px;
    text-transform: none;
  `;

  return <CustomButton onClick={action}>{text}</CustomButton>;
};

export const DisabledButton: React.FunctionComponent<IButtonProps> = (props) => {
  const { text, height, width } = props;
  //I commented out display: flex as it draws a red line under the button on hover and onClick.
  const CustomButton = styled(Button)`
    //display: flex;
    justify-content: center;
    align-items: center;
    background-color: #221d4b;
    border: 1px solid;
    border-color: var(--royal-blue);
    border-radius: 10px;
    box-shadow: 0px 15px 30px #1466cc29;
    cursor: pointer;
    height: ${height};
    width: ${width};
    font-family: var(--font-family-inter);
    font-size: ${props.fontSize || "15px"};
    font-weight: ${props.fontWeight || "600"};
    color: #4136f1;
    padding: 14.5px 21px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 14px;
    min-height: 21px;
    min-width: 108px;
    text-align: center;
    white-space: nowrap;
    text-transform: none;
  `;

  // .continue {
  //   color: var(--royal-blue);
  //   font-family: var(--font-family-inter);
  //   font-size: var(--font-size-m);
  //   font-weight: 600;
  //   letter-spacing: 0;
  //   line-height: 14px;
  //   min-height: 21px;
  //   min-width: 108px;
  //   text-align: center;
  //   white-space: nowrap;
  // }
  return <CustomButton>{text}</CustomButton>;
};

export const BackButton: React.FunctionComponent<IBackButtonProps> = (props) => {
  const { top, customiseBackButtonLink, className } = props;
  const navigate = useNavigate();

  const customStyle: CSS.Properties = {
    alignItems: "flex-start",
    cursor: "pointer",
    display: "flex",
    height: "44px",
    left: "16px",
    minWidth: "44px",
    paddingLeft: "14px",
    position: "absolute",
    top: top || "44px",
    zIndex: 9999,
  };

  const handleBackButtonOnClick = (): void => {
    if (customiseBackButtonLink) {
      navigate(customiseBackButtonLink);
      return;
    }
    navigate(-1);
  };

  return (
    <div className={className ?? "icon-arrow-left"} style={className ? undefined : customStyle} onClick={() => handleBackButtonOnClick()}>
      <img className="icon-arrow-left-1" src={`${process.env.PUBLIC_URL}/img/connectSucceed/icon-arrow-left-8@1x.png`} alt="icon-arrow-left" />
    </div>
  );
};

export const NavigateToTakeSelfieButton: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tempAccountId = useSelector(accountId);
  // const bmi_fetchedData = useSelector(selectBMI);
  const Ledger2 = useLedger();
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [timeDifference, setTimeDifference] = useState("");
  const isSelfie = useSelector(selectCurrentIsSelfie);
  const isGuest = useSelector(selectCurrentIsGuest);
  // const isSelfie = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  // const [isMidnight, setIsMidnight] = useState(false);

  useEffect(() => {
    const calculateTimeDifference = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const timeDiff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDiff / 1000) % 60);

      // if (hours === 0 && minutes === 0 && seconds === 0) {
      //   setIsMidnight(true);
      // }
      setTimeDifference(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    };

    const interval = setInterval(calculateTimeDifference, 1000);

    return () => clearInterval(interval);
  }, []);

  async function checking(Ledger2: any, tempAccountId: string, bmiHashId: string) {
    const contract = await Ledger2.contract.getContractsByAccount({
      accountId: tempAccountId,
      machineCodeHash: bmiHashId,
    });
  }
  React.useEffect(() => {
    if (isGuest) {
      setIsLoading(false);
      setIsActive(false);
      return;
    }
    isTodayHaveSelfieRecord(tempAccountId, Ledger2)
      .then((result) => {
        // dispatch(profileSlice.actions.setIsSelfie(result));
        setIsActive(result);
        setIsLoading(false);
      })
      .catch((err) => {
        checking(Ledger2, tempAccountId, process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace('"', ""));
      });
  }, []);

  async function handleTakeASelfie() {
    if (!isActive) navigate("/takeSelfie");
  }

  if (isSelfie || isActive) {
    return (
      <div className="lock-button-cover">
        <div className="lock-button">
          <div className="selfie-time-countdown-container">
            <p className="selfie-time-countdown inter-semi-bold-white-15px">{timeDifference}</p>
          </div>
          <img className="lock-icon-NavigateToTakeSelfieButton" src="/img/ic-locked-1@1x.png" alt="" />
        </div>
        <div className="button_-selfie-to-earn-MUU5YC" onClick={() => handleTakeASelfie()}>
          <img className="ic_selfie-u8P1YH" src="/img/selfieToEarn/ic-selfie-1@1x.png" alt="ic_selfie" />
          <p className="take-a-selfie-to-earn-u8P1YH inter-semi-bold-white-15px">Take a Selfie to Earn !</p>
          <img className="ic_arrow_forward-u8P1YH" src="img/selfieToEarn/ic-arrow-forward-1@1x.png" alt="ic_arrow_forward" />
        </div>
      </div>
    );
  } else {
    return isLoading ? null : (
      <div className="button_-selfie-to-earn-MUU5YC" onClick={() => handleTakeASelfie()}>
        <img className="ic_selfie-u8P1YH" src="/img/selfieToEarn/ic-selfie-1@1x.png" alt="ic_selfie" />
        <p className="take-a-selfie-to-earn-u8P1YH inter-semi-bold-white-15px">Take a Selfie to Earn !</p>
        <img className="ic_arrow_forward-u8P1YH" src="img/selfieToEarn/ic-arrow-forward-1@1x.png" alt="ic_arrow_forward" />
      </div>
    );
  }
};

export const GuestConnectWallectButton: React.FC<IButtonProps> = ({ height, width, className }) => {
  const guestButtonStyle: CSS.Properties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: height,
    width: width,
    background: "transparent linear-gradient(90deg, #25817E 0%, #37C9C3 100%) 0% 0% no-repeat padding-box",
    boxShadow: "0px 15px 30px #1466CC29",
    borderRadius: "10px",
    gap: "10px",
  };

  // const connectWalletButton: CSS.Properties = {
  //   dis

  return (
    <ButtonWithNavigation
      text="Connect Wallet"
      height={height}
      width={width}
      imagePath="img/wallet.svg"
      navigation="/"
      className={className ? "inter-semi-bold-white-15px " + className : "inter-semi-bold-white-15px"}
      style={guestButtonStyle}
      imageClassName="wallet-icon"
    />
  );
};

export const DiscordVerificationButton: React.FC<IButtonProps> = ({ height, width, className }) => {
  const guestButtonStyle: CSS.Properties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: height,
    width: width,
    background: "transparent linear-gradient(270deg, #8743FF 0%, ##4136F1 100%) 0% 0% no-repeat padding-box",
    boxShadow: "0px 15px 30px #1466CC29",
    borderRadius: "10px",
    gap: "10px",
  };
  const CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID!;
  const REDIRECT_URI = process.env.REACT_APP_BETTERMI_ENTRANCE_POINT!;
  // const connectWalletButton: CSS.Properties = {
  //   dis

  return (
    <ButtonWithNavigation
      text="Continue"
      height={height}
      width={width}
      navigation={`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`}
      className={className ? "inter-semi-bold-white-15px " + className : "inter-semi-bold-white-15px"}
      style={guestButtonStyle}
    />
  );
};
