import * as React from "react";
import "./home.css";
import UserIcon from "../../components/loadUserIcon";
import { Link } from "react-router-dom";
import { Dispatch } from "react";
import SigdaoIcon from "../../components/icon";

interface IUserInfoContainerProps {
  isGuest: boolean;
  setIsPopUpNFTDetailWinodow: Dispatch<React.SetStateAction<boolean>>;
  userAccountId: string;
  setRewardPercentage: Dispatch<React.SetStateAction<string>>;
  setImgAddress: Dispatch<React.SetStateAction<string>>;
  level: string;
  rewardPercentage: string;
  loading: boolean;
  Token: string;
}

const UserInfoContainer: React.FunctionComponent<IUserInfoContainerProps> = ({
  isGuest,
  setIsPopUpNFTDetailWinodow,
  userAccountId,
  setRewardPercentage,
  setImgAddress,
  level,
  rewardPercentage,
  loading,
  Token,
}) => {
  const activeUserInfo = (
    <div className="greetings-RoXPLo">
      <div className="home-user-icon-container">
        {isGuest ? (
          <img onClick={() => setIsPopUpNFTDetailWinodow(true)} className="nft_-avatar-2ZgxSS" src={`${process.env.PUBLIC_URL}/img/mimi_guest_sample_stamp_small.png`} alt="" />
        ) : (
          <UserIcon
            setIsPopUpNFTDetailWinodow={setIsPopUpNFTDetailWinodow}
            home={true}
            userAccountId={userAccountId}
            setRewardPercentage={setRewardPercentage}
            setEnlargeImageAddress={setImgAddress}
          />
        )}
      </div>
      <div className="home-user-info-container">
        <div className="home-info-first-row">
          <div className="hello-msg-container">
            <h1 className="title-2ZgxSS">Hello ! </h1>
            <Link to="/profile">
              <div className="ic_next-2ZgxSS">
                <img className="ic_chevron_right_24px-LRB8nH" src={`${process.env.PUBLIC_URL}/img/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
              </div>
            </Link>
          </div>
          <div className="home-user-info-nav">
            <Link to="/aiCoachSelect">
              <div className="home-ai-select-icon-container">
                <img className="home-ai-select-icon" src={`${process.env.PUBLIC_URL}/img/ai_coach.svg`} />
              </div>
            </Link>
            <Link to="/setting">
              <img className="home-setting-icon" src={`${process.env.PUBLIC_URL}/img/ic-settings-24px-1@1x.png`} alt="" />
            </Link>
          </div>
        </div>
        <div className="home-info-second-row">
          <div className="lv_-reward-2ZgxSS">
            {isGuest ? (
              <div className="inter-semi-bold-white-15px">Get your FREE NFT now !</div>
            ) : (
              <>
                <div className="lv-1-b5x63m inter-semi-bold-keppel-15px">LV {level}</div>
                <img className="seperate-line-b5x63m" src={`${process.env.PUBLIC_URL}/img/seperate-line-1@1x.png`} alt="seperate line" />
                <div className="nft-reward-10-b5x63m inter-semi-bold-white-15px">REWARD +{rewardPercentage}%</div>
              </>
            )}
          </div>
          <div className="home-sigdao-display-container">
            {isGuest ? (
              <Link to="/">
                <div className="inter-semi-bold-keppel-15px">CONNECT WALLET &gt;&gt;&gt;</div>
              </Link>
            ) : (
              <>
                <div className="sigdao-2ZgxSS inter-semi-bold-white-15px">SIGDAO:</div>
                <div className="score-bar_3-2ZgxSS">
                  <div className="sigdao-score-iPTNDG sigdao-score">
                    <div className="x10-kxjIEt x10 inter-semi-bold-keppel-15px">{loading ? <div>loading...</div> : Token}</div>
                    <SigdaoIcon />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return activeUserInfo;
};

export default UserInfoContainer;
