import * as React from "react";
import "./aiCoachDetail.css";
import { useParams } from "react-router-dom";
import { CenterLayout } from "../../components/layout";
import { BackButton } from "../../components/button";
import { ShortTitleBar } from "../../components/titleBar";
import { useEffect } from "react";
import { RandomGenNameInput } from "../../components/input";

interface IAiCoachDetailListProps {
  coachName: string;
  coachID: string;
  coachImagePath: string;
  startingString: string;
  coachUserName: string;
}

interface ChatRecord {
  message: string;
  time: Date;
}

interface IAiCoachDetailProps {}

const coachList: IAiCoachDetailListProps[] = [
  {
    coachID: `1`,
    coachImagePath: `ai-chatbot-mimi-1@1x.png`,
    coachName: `Mimi`,
    coachUserName: `mental coach`,
    startingString: `Hi, I am your Mimi coach, how can I help? 😘`,
  },
  {
    coachID: `2`,
    coachImagePath: `ai-chatbot-io@1x.png`,
    coachName: `.io`,
    coachUserName: `fitness coach`,
    startingString: `Hi, I am your .io coach, how can I help? 😘`,
  },
];

const AiCoachDetail: React.FunctionComponent<IAiCoachDetailProps> = (props) => {
  const { id } = useParams();
  const displayCoach: IAiCoachDetailListProps = coachList.find((coach) => coach.coachID === id) || coachList[0];
  const [chatRecordList, setChatRecordList] = React.useState<ChatRecord[]>();
  const [name, setName] = React.useState<string>("");

  const chatMessageInput: JSX.Element = (
    <div className="message-input-container">
      <div className="coach-typing-reminder"></div>
      <div className="message-input-area">
        <input className="chat-message-input" type="text" placeholder="I need help..."/>
        <div className="random-message-generate">
          <img className="ic_casino_24px-dF0TP0" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/ic-casino-24px-1@1x.png`} alt="ic_casino_24px" />
        </div>
      </div>
      <img className="ic_send-qbYILs ic_send" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/ic-send-1@1x.png`} alt="ic_send" />
    </div>
  );

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-ai-coach-mimi">
        <img className="ai-chatbot_-mimi-QyTK2J" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/${displayCoach.coachImagePath}`} alt="Ai Chatbot_Mimi" />
        <ShortTitleBar title="" aiCoach={false} transparent={true} />
        {/* <img className="bg-xQomhb bg" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/bg-1@1x.png`} alt="BG" /> */}
        <div className="coach-chat-container">
          <div className="coach-detail-container">
            <div className="coach-name">{displayCoach.coachName} coach</div>
            <div className="coach-detaill inter-normal-white-15px">@{displayCoach.coachUserName}</div>
          </div>
          <div className="message-container">{chatMessageInput}</div>
          {/* <RandomGenNameInput name={name} setName={setName} /> */}
        </div>
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
          <div className="typing-indicator-Jhcaae">
            <img className="x17-bZDT7w" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/file---17@1x.png`} alt="17" />
          </div>
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
          <img className="ic_chevron_right_24px-QxTHrC" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
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
          <p className="hi-i-am-your-mimi-coach-how-can-i-help-oKUDMc inter-normal-white-15px">{displayCoach.startingString}</p>
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
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default AiCoachDetail;
