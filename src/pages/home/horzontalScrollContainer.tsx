import { Link } from "react-router-dom";
import { useRef } from "react";
import { useEffect } from "react";
import React from "react";

function handleScrollHorizontally(event: any) {
    console.log(event);   
    const container = document.querySelector("div.missions-scroll-RoXPLo.x-")!;
    //const container = event.target;
    const delta = Math.max(-1, Math.min(1, (event.deltaY || -event.detail)));
    console.log(container);
    const scrollTop = event.pageYOffset || document.documentElement.scrollTop;
    container.scrollLeft -= (delta * 40); // Adjust scrolling speed here
    event.preventDefault();
  
  }
  
  const HorizontalScrollContainerMission :React.FunctionComponent= (props: any) => {
    const containerRef = useRef(null);
  
    return (
      <div
        className='missions-scroll-RoXPLo x-'
        ref={containerRef}
        style={{ overflowX: 'auto' }}
        onWheel={handleScrollHorizontally}
      >
                  <Link to="/missionChallenge">
            <div className="challenges-x9-hacks-GEWAL1">
              <div className="small-image">
                <img className="challenge-x9_banner-UqALvc" src={`${process.env.PUBLIC_URL}/img/home/challengex9-banner@1x.png`} alt="ChallengeX9_banner" />
              </div>
              <div className="challengesx-9-hacks-ewZMRw inter-medium-white-15px">Challenges<br />x 9 hacks</div>
              <div className="x1-3mins-each-ewZMRw inter-normal-cadet-blue-12px">1-3mins/ each</div>
              <div className="sigdao-score-ewZMRw sigdao-score">
                <div className="x10-HEHiSw x10 inter-semi-bold-keppel-14px">+5.25 - 15.75</div>
                <div className="signdao_tokengradient-HEHiSw signdao_tokengradient">
                  <div className="x441-giFx9O x441"></div>
                  <div className="x442-giFx9O x442"></div>
                  <img className="x880-giFx9O x880" src={`${process.env.PUBLIC_URL}/img/file---880-1x-png-10@1x.png`} alt="880" />
                </div>
              </div>
            </div>
          </Link>
          <div className="meditations-GEWAL1">
            <div className="home-meditation-content">
              <div className="small-image">
                <img className="meditation_banner-dLbFgX" src={`${process.env.PUBLIC_URL}/img/home/meditation-banner@1x.png`} alt="Meditation_banner" />
              </div>
              <div className="weekly-meditation-3kbxqV inter-medium-white-15px">Weekly Meditation</div>
              <div className="saturday-only-3kbxqV inter-normal-cadet-blue-12px">Saturday only</div>
              <div className="sigdao-score-3kbxqV sigdao-score">
                <div className="x10-UyxTRp x10 inter-semi-bold-keppel-14px">+20</div>
                <div className="signdao_tokengradient-UyxTRp signdao_tokengradient">
                  <div className="x441-ozHgg7 x441"></div>
                  <div className="x442-ozHgg7 x442"></div>
                  <img className="x880-ozHgg7 x880" src={`${process.env.PUBLIC_URL}/img/file---880-1x-png-10@1x.png`} alt="880" />
                </div>
              </div>
            </div>
            <div className="meditations-overlay">
              <img src="/img/ic-locked-1@1x.png" className='lock-image' alt="" />
            </div>
          </div>
          <div className="step-counts-GEWAL1">
            <div className="home-meditation-content">
              <div className="small-image">
                <img className="step_count_banner-45Wblr" src={`${process.env.PUBLIC_URL}/img/home/step-count-banner@1x.png`} alt="Step_count_banner" />
              </div>
              <div className="walking-mission-7hGHU0 inter-medium-white-15px">Walking Mission</div>
              <div className="step-count-7hGHU0 inter-normal-cadet-blue-12px">Step Count</div>
              <div className="sigdao-score-7hGHU0 sigdao-score">
                <div className="x10-SMcg87 x10 inter-semi-bold-keppel-14px">+20</div>
                <div className="signdao_tokengradient-SMcg87 signdao_tokengradient">
                  <div className="x441-JHyhgs x441"></div>
                  <div className="x442-JHyhgs x442"></div>
                  <img className="x880-JHyhgs x880" src={`${process.env.PUBLIC_URL}/img/file---880-1x-png-10@1x.png`} alt="880" />
                </div>
              </div>
            </div>
            <div className="meditations-overlay">
              <img src="/img/ic-locked-1@1x.png" className='lock-image' alt="" />
            </div>

          </div>

      </div>
    );
  }
  export default HorizontalScrollContainerMission;