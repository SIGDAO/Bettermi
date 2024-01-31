import * as React from 'react';
import './allMission.css'
import CSS from 'csstype';
import { BackButton } from '../../components/button';
import { useNavigate } from 'react-router-dom';
import MenuBar from '../../components/menuBar';
import { ShortTitleBar } from '../../components/titleBar';

interface IChallengeCompletedProps {
}

const ChallengeCompleted: React.FunctionComponent<IChallengeCompletedProps> = (props) => {
  const mobile = process.env.REACT_APP_MOBILE === 'true';
  const navigate = useNavigate();
  let height : string | number
  let width : string | number;
  if (mobile) { 
    height = "844px";
    width = "390px";
  // display in ipad air size
  } else {
    height = "100vh";
    width = "820px";
  }
  const bgStyle : CSS.Properties = mobile ? 
  {
    'background': `transparent`,
  }
  :
  {
    'position': 'fixed',
    'background': `linear-gradient(112deg, #221D4B 0%, #171717 100%)`,
    'boxShadow': '0px 3px 30px var(--royal-blue)',
    'width': '100vw',
    'minHeight': '100vh',
    'height': '100%',
    'overflowY': 'auto',
    'zIndex': '1',
    'overflowX': 'hidden',
    'display':'flex!important',
  }
  const centerLayoutStyle : CSS.Properties = {
    // 'backgroundPosition': 'center',
    'minHeight': `${height}`, // ipad size
    'width': `min(100vw,${width})`, // ipad size
    'height': '100%',
    'margin': 'auto',
     'display': 'flex',
     //'justifyContent': 'center',
     //'alignItems': 'center',
    //'backgroundColor': 'green',
    'flexDirection' : 'column',
  }
  const customStyle: CSS.Properties = {
    'alignItems': 'flex-start',
    'cursor': 'pointer',
    'display': 'flex',
    'height': '44px',
    'left': '16px',
    'minWidth': '44px',
    'paddingLeft': '14px',
    'position': 'relative',
    'top': '44px',
  }

  return (
    <div style={bgStyle}>
      <div style={centerLayoutStyle}>
      <ShortTitleBar title='Feature Missions' backPath='/home'/>
{/* The body part, which are the buttons */}
    <div className  = "mission-body-container">
        <div className = "mission-body">
          <div className = "rewardTitle inter-semi-bold-royal-blue-15px">EARNING REWARDS</div>
          <button className = "challengeCompletedLink" onClick = {() => navigate("/missionChallenge")}>
            <img className = "buttonIconChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/nft-avatar-1@1x.png`} alt="Card_bg"></img>
            <div className = "descriptionChallengeCompleted">
              <div className = "descriptionTitleChallengeCompleted">
                  Challenge X9 Hacks
                </div>
                <div className = "descriptionBodyChallengeCompleted">
                  1-3 Mins Each
                </div>
                <div className = "descriptionBottomBodyChallengeCompleted">
                <div className="sigdao_tokengradient">
                                  <div className="x441"></div>
                                  <div className="x442"></div>
                                  <img className="x880" src="img/missionChallenge/file---880-1x-png-10@1x.png" alt="880" />
                                </div>
                    <div className = "sigdaoChallengeCompleted">
                    +5.25 ~ 15.75
                  </div>
                  <img className = "arrowChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/ic-chevron-right-24px-1@1x.png`}></img>
                </div>
            </div>
          </button>
          <button className = "challengeCompletedLinkDisabled" disabled = {true} style = {{}}>
            <img src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} className='lock-image' alt="" /> 
            <div className="mission-button-content" >
              <img className = "buttonIconChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/nft-avatar-2@1x.png`} alt="Card_bg"></img>
              <div className = "descriptionChallengeCompleted">
                <div className = "descriptionTitleChallengeCompleted">
                  Weekly Meditation Session
                  </div>
                  <div className = "descriptionBodyChallengeCompleted">
                    Saturday Only
                  </div>
                  <div className = "descriptionBottomBodyChallengeCompleted">
                  <div className="sigdao_tokengradient">
                                  <div className="x441"></div>
                                  <div className="x442"></div>
                                  <img className="x880" src="img/missionChallenge/file---880-1x-png-10@1x.png" alt="880" />
                                </div>
                      <div className = "sigdaoChallengeCompleted">
                        +5.25 ~ 5.00
                    </div>
                    <img className = "arrowChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/ic-chevron-right-24px-1@1x.png`}></img>
                  </div>
              </div>
            </div>
          </button>
          <button disabled = {true} style = {{}} className = "challengeCompletedLinkDisabled">
            <img src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} className='lock-image' alt="" /> 
            <div className="mission-button-content" >
              <img className = "buttonIconChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/Talk-to-mi-Square-Cover.png`} alt="Card_bg"></img>
              <div className = "descriptionChallengeCompleted">
                <div style = {{display:"flex", flexDirection:"row"}} className = "descriptionTitleChallengeCompleted">
                  <div>Secret Coach - Talk To mi </div>
                  {/* <img  style = {{width:"15px", height:"20px",paddingLeft:"10px"}} src={`${process.env.PUBLIC_URL}/img/allMission/ic-locked-1@1x.png`}></img> */}
                  </div>
                  <div className = "descriptionBodyChallengeCompleted">
                  Secret Coach - Talk To mi 
                  </div>
                  <div className = "descriptionBottomBodyChallengeCompleted">
                  <div className="sigdao_tokengradient">
                                  <div className="x441"></div>
                                  <div className="x442"></div>
                                  <img className="x880" src="img/missionChallenge/file---880-1x-png-10@1x.png" alt="880" />
                                </div>
                      <div className = "sigdaoChallengeCompleted">
                      +5.25 ~ 15.75
                    </div>
                    <img className = "arrowChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/ic-chevron-right-24px-1@1x.png`}></img>
                  </div>
              </div>
            </div>
          </button>
        
          {/* <button className = "challengeCompletedLink">
            <img className = "buttonIconChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/nft-avatar-1@1x.png`} alt="Card_bg"></img>
            <div className = "descriptionChallengeCompleted">
              <div className = "descriptionTitleChallengeCompleted">
                Challenge X9 Hacks
                </div>
                <div className = "descriptionBodyChallengeCompleted">
                  1-3 Mins Each
                </div>
                <div className = "descriptionBottomBodyChallengeCompleted">
                  <div className = "sigdaoIconChallengeCompleted">
                    <img src = {`${process.env.PUBLIC_URL}/img/allMission/file---880-1x-png-10@1x.png`}></img>
                    </div>
                    <div className = "sigdaoChallengeCompleted">
                    +5.25 ~ 15.75
                  </div>
                  <img className = "arrowChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/ic-chevron-right-24px-1@1x.png`}></img>
                </div>
            </div>
          </button>
          <button className = "challengeCompletedLink">
            <img className = "buttonIconChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/nft-avatar-1@1x.png`} alt="Card_bg"></img>
            <div className = "descriptionChallengeCompleted">
              <div className = "descriptionTitleChallengeCompleted">
                Challenge X9 Hacks
                </div>
                <div className = "descriptionBodyChallengeCompleted">
                  1-3 Mins Each
                </div>
                <div className = "descriptionBottomBodyChallengeCompleted">
                  <div className = "sigdaoIconChallengeCompleted">
                    <img src = {`${process.env.PUBLIC_URL}/img/allMission/file---880-1x-png-10@1x.png`}></img>
                    </div>
                    <div className = "sigdaoChallengeCompleted">
                    +5.25 ~ 15.75
                  </div>
                  <img className = "arrowChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/ic-chevron-right-24px-1@1x.png`}></img>
                </div>
            </div>
          </button> */}
        </div>
        <MenuBar/>

      </div>

      </div>
    </div>
  );
}

export default ChallengeCompleted;
