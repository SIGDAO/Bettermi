import * as React from "react";
import "./aiCoachDetail.css";
import { useParams } from "react-router-dom";
import { CenterLayout } from "../../components/layout";
import { BackButton } from "../../components/button";
import { ShortTitleBar } from "../../components/titleBar";
import { useEffect, useRef } from "react";
import { RandomGenNameInput } from "../../components/input";
import Chatbox from "./chatbox";
import { generateDotIoMessage, generateMimiMessage } from "../../components/randomGenerater";
import { useSendIoMsgMutation, useSendMimiMsgMutation } from "../../redux/aiCoachAPI";
import { ChatHistory, aiCoachSlice, selectCurrentAiMsg } from "../../redux/aiCoach";
import { useDispatch, useSelector } from "react-redux";
import { IAiCoachDetailListProps, coachList } from "../../data/aiCoachDetailList";


interface IAiCoachDetailProps {}


const AiCoachDetail: React.FunctionComponent<IAiCoachDetailProps> = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const scrollButtonRef = useRef<HTMLDivElement>(null);

  const displayCoach: IAiCoachDetailListProps = coachList.find((coach) => coach.coachID === id) || coachList[0];
  // const [chatRecordList, setChatRecordList] = React.useState<ChatRecord[]>();
  const [name, setName] = React.useState<string>("");
  const [msgInput, setMsgInput] = React.useState<string>("");
  const [isMsgStartSend, setIsMsgStartSend] = React.useState<boolean>(false);
  const [isMsgSending, setIsMsgSending] = React.useState<boolean>(false);
  const [sendMimiMsg, {isLoading: mimiMsgIsLoading, data: mimiReply}] = useSendMimiMsgMutation();
  const [sendIoMsg, {isLoading: ioMsgIsLoading, data: ioReply}] = useSendIoMsgMutation();
  const chatHistory: ChatHistory[] = useSelector((state) => selectCurrentAiMsg(state, id))

  const scrollToBottom = () => {
    if (scrollButtonRef.current) {
      scrollButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };



  const addMsg = async (message: string | null, isUser: boolean, streamPath: string | null) => {
    const newChatRecord: ChatHistory = {
      id: chatHistory.length + 1,
      text: message,
      isUser: isUser,
      time: new Date,
      streamPath: streamPath,
    }

    if (id === "1") dispatch(aiCoachSlice.actions.addMimiMsg(newChatRecord))
    if (id === "2") dispatch(aiCoachSlice.actions.addIoMsg(newChatRecord))
  }  

  const handleRandomQuestion = () => {
    if (id === "1") setMsgInput(generateMimiMessage);
    if (id === "2") setMsgInput(generateDotIoMessage);
  }

  const handleUserSendMsg = async () => {
    if (isMsgSending) return;
    if (!msgInput) return;

    setIsMsgSending(true);
    setMsgInput("");
    await addMsg(msgInput, true, null);
    scrollToBottom();

    setIsMsgStartSend(true);

    setIsMsgSending(false);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter key press
      handleUserSendMsg();
    }
  }



  const chatMessageInput: JSX.Element = (
    <div className="message-input-container">
      <div className="coach-typing-reminder"></div>
      <div className="message-input-area">
        <input className="chat-message-input inter-normal-15px" value={msgInput} onChange={(e) => setMsgInput(e.target.value)} onKeyDown={handleKeyDown} type="text" placeholder="I need help..."/>
        <div className="random-message-generate" onClick={handleRandomQuestion}>
          <img className="ic_casino_24px-dF0TP0" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/ic-casino-24px-1@1x.png`} alt="ic_casino_24px" />
        </div>
      </div>
      <img className="ic_send-qbYILs ic_send" onClick={handleUserSendMsg} src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/ic-send-1@1x.png`} alt="ic_send" />
    </div>
  );

  const msgDisplay: JSX.Element[] = chatHistory.map((chatRecord, index) => {
    const { text, isUser, time, streamPath, id: chatId } = chatRecord;

    return <Chatbox pageId={id} id={chatId} text={text} time={time} isUser={isUser} streamPath={streamPath} />
  })



  useEffect(() => {
    if (!mimiMsgIsLoading && mimiReply) {
      addMsg(null, false, mimiReply);
    }

    if (!ioMsgIsLoading && ioReply) {
      addMsg(null, false, ioReply);
    }
  }, [mimiMsgIsLoading, ioMsgIsLoading])

  useEffect(() => {
    if (!isMsgStartSend) return;


    if (id === "1") {
      sendMimiMsg(chatHistory)
        .then(()=> {
          scrollToBottom();
        });
    }
    if (id === "2") {
      sendIoMsg(chatHistory)
        .then(()=> {
          scrollToBottom();
        });
    }

    setIsMsgStartSend(false)
  }, [chatHistory, isMsgStartSend])



  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-ai-coach-mimi">
        <img className="ai-chatbot_-mimi-QyTK2J" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/${displayCoach.coachImagePath}`} alt="Ai Chatbot_Mimi" />
        <ShortTitleBar title="" setting={true} aiCoach={false} transparent={true} />
        <div className="coach-chat-container">
          <div className="time-indicator">
            <img className="x15-QfL0xm" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/file---16@1x.png`} alt="15" />
            <div className="today-QfL0xm inter-normal-white-12px">Today</div>
            <img className="x15-QfL0xm" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/file---16@1x.png`} alt="16" />
          </div>
          <div className="coach-detail-container">
            <div className="coach-name">{displayCoach.coachName} coach</div>
            <div className="coach-detaill inter-normal-grey-18px">@{displayCoach.coachUserName}</div>
          </div>
          <div className="ai-chat-msg-history-container">
            <div className="ai-chat-msg-history" ref={scrollButtonRef}>
              {msgDisplay}
            </div>
          </div>
          <div className="message-container">{chatMessageInput}</div>
        </div>

      </div>
    </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default AiCoachDetail;
