import { Link } from "react-router-dom";
import { useRef } from "react";
import { useEffect } from "react";
import React from "react";
import HorizontalScrollContainer from "../../components/horizontalScrollContainer";
import { missionList } from "../../data/featureMissionsList";
import SigdaoIcon from "../../components/icon";


const HomeChallengeList: React.FunctionComponent = (props: any) => {
  const missionDisplay = missionList.map((mission) => {
    const { title, isActive, duration, sigdao, missionImgPath, missionNavPath } = mission;
    
    const allowedContent = (
      <Link to={missionNavPath}>
        <div className="home-mission-container">
          <div className="small-image">
            <img className="home-challenge-image" src={missionImgPath} alt="ChallengeX9_banner" />
          </div>
          <div className="home-mission-info-container">
            <div className="home-mission-title inter-medium-white-15px">
              {title}
            </div>
            <div className="inter-normal-cadet-blue-12px">{duration}</div>
            <div className="home-mission-sigdao-score">
              <div className="x10-HEHiSw x10 inter-semi-bold-keppel-14px">{sigdao}</div>
              <SigdaoIcon width="17px" height="17px" />
            </div>
          </div>
        </div>
      </Link>
    )

    const lockedContent = (
      <div className="home-mission-container-inactive">
        <div className="home-mission-content-inactive">
          <div className="small-image">
            <img className="home-challenge-image" src={missionImgPath} alt="Meditation_banner" />
          </div>
          <div className="home-mission-info-container">
            <div className="inter-medium-white-15px">{title}</div>
            <div className="saturday-only-3kbxqV inter-semi-bold-keppel-12px">coming soon..</div>
          </div>
        </div>
        <div className="home-locked-image-overlay">
          <img src="/img/ic-locked-1@1x.png" className="lock-image" alt="" />
        </div>
      </div>
    )

    return isActive ? allowedContent : lockedContent;
  })

  return (
    <HorizontalScrollContainer inputClassName="home-missions-scroll-container">
      <div className="home-missions-scroll">
        {missionDisplay}
      </div>
    </HorizontalScrollContainer>
  );
};
export default HomeChallengeList;
