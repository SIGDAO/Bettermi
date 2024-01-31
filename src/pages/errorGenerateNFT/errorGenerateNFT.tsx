import * as React from 'react';
import './errorGenerateNFT.css';
import { CenterLayout } from '../../components/layout';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';


interface IErrorGenerateNFTProps {
}

const ErrorGenerateNFT: React.FunctionComponent<IErrorGenerateNFTProps> = (props) => {
  const location = useLocation();
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [buttonText, setButtonText] = React.useState<string>("");
  const [navigatePath, setNavigatePath] = React.useState<string>("");

  useEffect(() => {
    if (location.pathname === '/errorGenerateNFT') {
      setErrorMsg('This NFT has been snatched up by someone else. Go ahead and mint another Free NFT now !');
      setButtonText('Mint again');
      setNavigatePath('/generateBMINFTImport')
    } else if (location.pathname === '/errorTakeSelfie') {
      setErrorMsg('Please make sure that only your face is visible in the frame.');
      setButtonText('Selfie again');
      setNavigatePath('/takeSelfie')
    } else if (location.pathname === '/errorCustomizeYourProfile') {
      setErrorMsg('Looks like something went wrong.\n Let\'s try again!');
      setButtonText('Try again');
      setNavigatePath('/customizeYourProfile')
    }
  }, [])

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-generate-free-nft-error">
        <div className="bg_2-FumncE">
          <img className="bg-lme0fw" src="img/errorGenerateNFT/bg-10@1x.png" alt="BG" />
          <div className="x16220-lme0fw">
            <p className="this-nft-has-been-sn-RYas9d">
              {errorMsg}
            </p>
            <h1 className="title-RYas9d inter-semi-bold-white-28px">すみません!</h1>
            <div className="ic_sentiment_very_dissatisfied_24px-RYas9d ic_sentiment_very_dissatisfied_24px">
              <img
                className="ic_sentiment_very_dissatisfied_24px-TVetTD ic_sentiment_very_dissatisfied_24px"
                src="img/errorGenerateNFT/mimi_for_error_page.png"
                alt="ic_sentiment_very_dissatisfied_24px"
                />
            </div>
          </div>
        </div>
        <a href="javascript:history.back()">
          <div className="icon-arrow-left-FumncE icon-arrow-left">
            <img
              className="icon-arrow-left-xF1oog icon-arrow-left"
              src="img/errorGenerateNFT/icon-arrow-left-10@1x.png"
              alt="icon-arrow-left"
              />
          </div>
        </a>
        <Link to={navigatePath} >
          <div className="bottom-controls-FumncE">
            <div className="button_-mintagain-QHnb0b">
              {/* <div className="button1-7FeCxk"></div> */}
              <div className="mintagain-7FeCxk inter-semi-bold-white-15px">{buttonText}</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
  

  return (
    <CenterLayout
      content={content}
      bgImg={false}
    />
  )
};

export default ErrorGenerateNFT;
