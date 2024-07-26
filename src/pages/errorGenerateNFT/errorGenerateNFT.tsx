import * as React from "react";
import "./errorGenerateNFT.css";
import { CenterLayout } from "../../components/layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BackButton, PurpleButton, ReferralNavToTakeSelfieButton } from "../../components/button";
import { useDispatch, useSelector } from "react-redux";
import { referrer } from "../../redux/referrer";
import { profileSlice } from "../../redux/profile";

interface IErrorGenerateNFTProps {}

const ErrorGenerateNFT: React.FunctionComponent<IErrorGenerateNFTProps> = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [buttonText, setButtonText] = React.useState<string>("");
  const [navigatePath, setNavigatePath] = React.useState<string | number>("");
  const referrerAccountID = useSelector(referrer);
  console.log("referrerAccountID is", referrerAccountID);
  useEffect(() => {
    switch (location.pathname) {
      case "/errorGenerateNFT":
        setErrorMsg("This NFT has been snatched up by someone else. Go ahead and mint another Free NFT now !");
        setButtonText("Mint again");
        setNavigatePath("/generateBMINFTImport");
        break;
      case "/errorGenerateNFTNotGrantedWallet":
        setErrorMsg("Looks like something went wrong. Let's try again !");
        setButtonText("Try again");
        setNavigatePath("/generateBMINFTImport");
        break;
      case "/errorTakeSelfieNoFace":
        setErrorMsg("Please make sure that your face is visible in the frame.");
        setButtonText("Selfie again");
        setNavigatePath("/takeSelfie");
        break;
      case "/errorTakeSelfieTooManyFace":
        setErrorMsg("Please make sure that only your face is visible in the frame.");
        setButtonText("Selfie again");
        setNavigatePath("/takeSelfie");
        break;
      case "/errorTakeSelfie":
        setErrorMsg("Looks like something went wrong. Let's try again !");
        setButtonText("Selfie again");
        setNavigatePath("/takeSelfie");
        break;
      case "/errorCustomizeYourProfile":
        setErrorMsg("Looks like something went wrong.\n Let's try again !");
        setButtonText("Try again");
        setNavigatePath("/customizeYourProfile");
        break;
      case "/errorNotEnoughFunds":
        setErrorMsg("Looks like you don't have enough signa to mint NFT.");
        setButtonText("Get tokens");
        setNavigatePath("https://discord.com/invite/MATW3Dcdcw");
        break;
      case "/errorReferralCode":
        setErrorMsg("Looks like something went wrong. \nLet's try again !");
        setButtonText("Try again");
        setNavigatePath(window.location.origin + "/referralCode/" + referrerAccountID);
        break;
      case "/errorReferralCodeUsedAccount":
        setErrorMsg("The Discord account is already in use. \nLet's start earning !");
        setButtonText("Continue");
        setNavigatePath(window.location.origin + "/referralGiveReward");
        break;
      case "/errorReferralCodeNetworkError":
        setErrorMsg("Looks like we have failed to authenticate.\n Let's try again !");
        setButtonText("Try again");
        setNavigatePath(window.location.origin + "/referralCode/" + referrerAccountID);
        break;
      case "/errorReferralCodeIncorrectRecipient":
        setErrorMsg("Looks like we have an incorrect recipient.\n Let's try again !");
        setButtonText("Try again");
        setNavigatePath(window.location.origin + "/referralCode/" + referrerAccountID);
        break;
      default:
        break;
    }
  }, []);

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-generate-free-nft-error">
        {location.pathname === "/errorNotEnoughFunds" && <BackButton />}
        <div className="x16220-lme0fw">
          <img className="ic_sentiment_very_dissatisfied_24px" src={process.env.PUBLIC_URL + "/img/errorGenerateNFT/mimi_error_.png"} alt="ic_sentiment_very_dissatisfied_24px" />
          <div className="error-message-container">
            <h1 className="title-RYas9d inter-semi-bold-white-28px">Oh Dear…</h1>
            <p className="inter-normal-hot-magenta-15px this-nft-has-been-sn-RYas9d">{errorMsg}</p>
          </div>
        </div>
        {/* change it to selfie button */}
        {location.pathname === "/errorReferralCodeUsedAccount" ? (
          <ReferralNavToTakeSelfieButton
            // className="referral-nav-to-take-selfie-button-container"
            height="56px"
            width="248px"
            action={() => {
              navigate("/takeSelfie");
            }}
          />
        ) : (
          <Link
            to={navigatePath}
            target={navigatePath === "https://discord.com/invite/MATW3Dcdcw" ? "_blank" : undefined}
            rel={navigatePath === "https://discord.com/invite/MATW3Dcdcw" ? "noopener noreferrer" : undefined}
          >
            <PurpleButton text={buttonText} height="56px" width="248px" />
          </Link>
        )}
      </div>
    </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default ErrorGenerateNFT;
