import React, { useEffect } from 'react';
import './challengeCountdown.css';
import { CenterLayout } from '../../components/layout';
import { ShortTitleBar } from '../../components/titleBar';
// import { CircularProgress } from '@mui/material';
import CircularWithValueLabel from './circleProgressLoader';
import { useSelector } from 'react-redux';
import { accountId } from '../../redux/account';
import { walletNodeHost } from '../../redux/wallet';
import { TransferToken } from '../../components/transferToken';
import { missionList } from '../../data/featureMissionList';
import { useParams } from 'react-router-dom';

interface IChallengeCountdownProps {
  taskName?: string;
}


const ChallengeCountdown: React.FunctionComponent<IChallengeCountdownProps> = (props) => {
  const id = useParams().id?.toString() || '1';
  const [time, setTime] = React.useState(32);
  const userAccountId = useSelector(accountId);
  const userWalletNodeHost = useSelector(walletNodeHost);
  const displayMission = missionList.find((mission, index) => index === parseInt(id)-1) || missionList[0];


  const displayTime = (function () {
    const minutes: number = parseInt(displayMission.duration.split(' ')[0]);
    return minutes * 60;
  })()

  const [timeBeforeStart, setTimeBeforeStart] = React.useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeBeforeStart((prevCount) => prevCount - 1);
    }, 1000);

    // Stop the countdown after 3 seconds
    setTimeout(() => {
      // setTimeBeforeStart("Start!");
      clearInterval(timer);
      console.log("Countdown stopped.");
    }, 4000);

    // Clean up the timer on component unmount
    return () => clearInterval(timer);
  }, []);

  const timerStyles: React.CSSProperties = {
    fontFamily: "var(--font-family-inter)",
    width: 390,
    height: 200,
    lineHeight: "200px",
    fontSize: 100,
    border: "none",
    textAlign: "center",
    margin: "100px auto",
    position: "absolute",
    zIndex: 99,
    top: "116px", 
    color: "#cdcdcd",
  };
  
  const showTimeBeforeStart = () => {
    if (timeBeforeStart === 0) return "Start!"
    if (timeBeforeStart < 0) return ""
    return timeBeforeStart
  }


  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-challenges-countdown-1">
        <ShortTitleBar title={displayMission.title} backButton={true} aiCoach={false} />
        {/* <img className="bg-oEaurv" src={`${process.env.PUBLIC_URL}/img/challengeCountdown/bg-10@1x.png`} alt="BG" /> */}
        <div style={timerStyles}>{showTimeBeforeStart()}</div>
        <img
          style={timeBeforeStart >= 0? {opacity: 0.2} : {opacity: 1}}
          className="x1-hello-bae-gradient-bg-oEaurv"
          // src={`${process.env.PUBLIC_URL}/img/challengeCountdown/1hellobae-gradientbg@1x.png`}
          src={displayMission.missionImgPath}
          alt="1HelloBae-GradientBg"
        />
        <div className="challenge-content-oEaurv">
          <img className="layer-D6xMU2" src={`${process.env.PUBLIC_URL}/img/challengeCountdown/layer@1x.png`} alt="Layer" />
          <div className="countdown-D6xMU2">
            <CircularWithValueLabel timeBeforeStart={timeBeforeStart} time={displayTime} reward={parseFloat(displayMission.sigdao)} />
            {/* <div className="t-countdown-YGwjuf">
              <div className="bg-C3TEa1"></div>
              <img className="process-circle-C3TEa1" src={`${process.env.PUBLIC_URL}/img/challengeCountdown/process-circle@1x.png`} alt="Process circle" />
            </div>
            <div className="x0023-YGwjuf inter-semi-bold-white-18px">00:23</div> */}
          </div>
          <p className="straighten-your-arms-D6xMU2 inter-normal-white-14px">
            Straighten your arms &amp; Shake them outwardly.
          </p>
          <div className="challenge-guide-D6xMU2 inter-semi-bold-royal-blue-15px">CHALLENGE GUIDE</div>
          {/* <div className="ic_next-D6xMU2">
            <img
              className="ic_chevron_right_24px-0Ajecm"
              src={`${process.env.PUBLIC_URL}/img/challengeCountdown/ic-chevron-right-24px-1@1x.png`}
              alt="ic_chevron_right_24px"
              />
          </div> */}
          {/* <div className="ic_previous-D6xMU2">
            <img className="ic_chevron_left_24px-hZsyDr" src={`${process.env.PUBLIC_URL}/img/challengeCountdown/ic-chevron-left-24px@1x.png`} alt="ic_chevron_left_24px" />
          </div> */}
          <div className="sigdao-score-D6xMU2">
            <div className="x10-ajiZIc inter-semi-bold-keppel-14px">{displayMission.sigdao}</div>
            <div className="signdao_tokengradient-ajiZIc">
              <div className="x441-8JkMaQ"></div>
              <div className="x442-8JkMaQ"></div>
              <img className="x880-8JkMaQ" src={`${process.env.PUBLIC_URL}/img/challengeCountdown/file---880-1x-png-10@1x.png`} alt="880" />
            </div>
          </div>
          <div className="goal-sets-D6xMU2">
            <div className="x895-ku5xY4"></div>
            <div className="x250-ku5xY4 inter-semi-bold-keppel-14px">10 x 6 sets</div>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <CenterLayout 
      content={content}
      bgImg={false}
    />
  );
};

export default ChallengeCountdown;
