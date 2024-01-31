import * as React from 'react';
import './aiCoachDetail.css';
import { useParams } from 'react-router-dom';
import { CenterLayout } from '../../components/layout';
import { BackButton } from '../../components/button';
import { ShortTitleBar } from '../../components/titleBar';
import { useEffect } from 'react';

interface IAiCoachDetailListProps {
  coachName: string,
  coachID: string,
  coachImagePath: string,
  startingString: string,
  coachUserName: string,
}

interface IAiCoachDetailProps {
}

const coachList: IAiCoachDetailListProps[] = [
  {
    coachID: `1`,
    coachImagePath:  `ai-chatbot-mimi-1@1x.png`,
    coachName: `Mimi`,
    coachUserName: `mental coach`,
    startingString: `Hi, I am your Mimi coach, how can I help? 😘`,
  },
  {
    coachID: `2`,
    coachImagePath:  `ai-chatbot-io@1x.png`,
    coachName: `.io`,
    coachUserName: `fitness coach`,
    startingString: `Hi, I am your .io coach, how can I help? 😘`,
  },
]

const AiCoachDetail: React.FunctionComponent<IAiCoachDetailProps> = (props) => {
  const { id } = useParams();
  const displayCoach: IAiCoachDetailListProps = coachList.find((coach) => coach.coachID === id) || coachList[0];




  const content: JSX.Element = (
    <div className="screen">
        <div className="bettermidapp-ai-coach-mimi">
    {/* <img className="bg-QyTK2J bg" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/bg-2@1x.png`} alt="BG" /> */}
    <img className="ai-chatbot_-mimi-QyTK2J" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/${displayCoach.coachImagePath}`} alt="Ai Chatbot_Mimi" />
    {/* <div className="title-bar-QyTK2J">
      <div className="icon-arrow-left-ztRADx icon-arrow-left">
        <img
          className="icon-arrow-left-oL2KA8 icon-arrow-left"
          src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/icon-arrow-left-10@1x.png`}
          alt="icon-arrow-left"
          />
      </div>
      <div className="bars-status-bar-i-phone-light-ztRADx">
        <div className="frame-BsK5I0"></div>
        <div className="status-bar-BsK5I0">
          <div className="battery-atbmQW">
            <div className="border-UJmPXA"></div>
            <img className="cap-UJmPXA" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/cap-1@1x.png`} alt="Cap" />
            <div className="capacity-UJmPXA"></div>
          </div>
          <img className="wifi-atbmQW" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/wifi-1@1x.png`} alt="Wifi" />
          <img
            className="cellular-connection-atbmQW"
            src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/cellular-connection-1@1x.png`}
            alt="Cellular Connection"
            />
          <div className="time-style-atbmQW">
            <div className="time-aB2kbx sfprotext-semi-bold-white-15px">9:41</div>
          </div>
        </div>
      </div>
      <a href="javascript:history.back()">
        <div className="icon-arrow-left-xLNLoh icon-arrow-left">
          <img
            className="icon-arrow-left-CGlvVY icon-arrow-left"
            src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/icon-arrow-left-10@1x.png`}
            alt="icon-arrow-left"
            />
        </div>
      </a>
      <a href="bettermidapp-settings-1.html">
        <div className="ic_settings_24px-ztRADx ic_settings_24px">
          <img
            className="ic_settings_24px-ETFSlr ic_settings_24px"
            src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/ic-settings-24px-1@1x.png`}
            alt="ic_settings_24px"
            />
        </div>
      </a>
    </div> */}
    <ShortTitleBar title='' aiCoach={false} transparent={true} />
    <img className="bg-xQomhb bg" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/bg-1@1x.png`} alt="BG" />
    <div className="write-msg-QyTK2J">
      <div className="chat-input-Jhcaae">
        <div className="x123-5CVdzB"></div>
        <div className="random-dice-5CVdzB">
          <img className="ic_casino_24px-dF0TP0" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/ic-casino-24px-1@1x.png`} alt="ic_casino_24px" />
        </div>
      </div>
      <div className="ic_send-Jhcaae ic_send">
        <img className="ic_send-qbYILs ic_send" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/ic-send-1@1x.png`} alt="ic_send" />
      </div>
      <div className="i-need-help-Jhcaae">I need help….</div>
      <div className="typing-indicator-Jhcaae"><img className="x17-bZDT7w" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/file---17@1x.png`} alt="17" /></div>
    </div>
    <div className="goal-data-QyTK2J">
      <div className="x893-j4PYH5"></div>
      <div className="goal-j4PYH5">
        <div className="x0-ota7Zj inter-semi-bold-keppel-14px">0</div>
        <div className="x3-ota7Zj">/ 3</div>
      </div>
    </div>
    <div className="home-indicator-QyTK2J">
      <div className="home-indicator-fzxG7C"></div>
    </div>
    <div className="ic_scroll-QyTK2J">
      <div className="x458-QxTHrC"></div>
      <img
        className="ic_chevron_right_24px-QxTHrC"
        src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/ic-chevron-right-24px-1@1x.png`}
        alt="ic_chevron_right_24px"
        />
    </div>
    <div className="time-indicator-QyTK2J">
      <img className="x15-QfL0xm" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/file---16@1x.png`} alt="15" />
      <div className="today-QfL0xm inter-normal-white-12px-2">Today</div>
      <img className="x16-QfL0xm" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/file---16@1x.png`} alt="16" />
    </div>
    <div className="size-QyTK2J size">
      <div className="talking-container">
        <div className="x425"></div>
      </div>
      <p className="i-need-help-in-dating-JihrCh inter-normal-white-15px">I need help in dating.</p>
      <div className="x1114 inter-normal-white-12px">11:14</div>
      <div className="icon-read-JihrCh icon-read">
        <img className="icon-read-c002x0 icon-read" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/icon-read-1@1x.png`} alt="icon-read" />
      </div>
    </div>
    <div className="size-xQomhb size">
      <div className="talking-container">
        <div className="x425"></div>
      </div>
      <p className="hi-i-am-your-mimi-coach-how-can-i-help-oKUDMc inter-normal-white-15px">
        {displayCoach.startingString}
      </p>
      <div className="x1114 inter-normal-white-12px">11:14</div>
      <div className="icon-read-oKUDMc icon-read">
        <img className="icon-read-EwLvtX icon-read" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/icon-read-1@1x.png`} alt="icon-read" />
      </div>
    </div>
    <h1 className="title-QyTK2J">{displayCoach.coachName} coach</h1>
    <div className="mental-coach-QyTK2J inter-normal-white-15px">@{displayCoach.coachUserName}</div>
    <div className="mimi-is-typing-QyTK2J inter-normal-white-15px">{displayCoach.coachName} is typing……</div>
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

export default AiCoachDetail;
