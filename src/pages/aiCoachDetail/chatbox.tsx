import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatHistory, aiCoachSlice, selectCurrentAiMsg } from "../../redux/aiCoach";

interface IChatboxProps {
  text: string | null;
  time: Date;
  isUser: boolean;
  id: number;
  pageId: string | undefined;
  streamPath: string | null;
}

const Chatbox: React.FunctionComponent<IChatboxProps> = ({ text, time, isUser, id, streamPath, pageId }) => {
  const dispatch = useDispatch();
  const [streamMsg, setStreamMsg] = useState<string>("");
  const [isStreamStart, setIsStreamStart] = useState<boolean>(false);
  const [isStreamDone, setIsStreamDone] = useState<boolean>(false);
  const [isStreamMsgInit, setStreamIsStreamMsgInit] = useState<boolean>(false);
  const stringTime: string = time?.toTimeString().split(' ')[0].substring(0, 5);


  const handleStreamDoneMsg = () => {
    const changedObject: ChatHistory = {
      id: id,
      text: streamMsg,
      isUser: isUser,
      time: time,
      streamPath: streamPath,
    }

    if (pageId === "1") dispatch(aiCoachSlice.actions.changeMimiMsg(changedObject))
    if (pageId === "2") dispatch(aiCoachSlice.actions.changeIoMsg(changedObject))

  }


  useEffect(() => {
    if (!isStreamDone) return;

    handleStreamDoneMsg();

    setIsStreamDone(false);
  }, [isStreamDone, streamMsg])

  useEffect(() => {
    if (!streamPath || text || isStreamStart) return;
    setIsStreamStart(true);

    const eventSource = new EventSource(streamPath);
    console.log(streamPath, "thePath");

    eventSource.addEventListener("output", (evt) => {
      setStreamIsStreamMsgInit(true);
      setStreamMsg((prevStreamMsg) => prevStreamMsg + evt.data);
    });

    eventSource.addEventListener("done", () => {
      setIsStreamDone(true);
      setIsStreamStart(false);
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, []);

  const handleTextDisplay = (): string => {
    if (!streamPath || text) return text ?? "";

    if (!isStreamMsgInit) return "Loading...";

    return streamMsg
  }

  return (
    <div className={isUser ? "ai-chatbox-container" : "user-chatbox-container"}>
      <div className="ai-chat-content inter-normal-white-15px">{handleTextDisplay()}</div>
      <div className="icon-read-container">
        <img className="icon-read" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/icon-read-1@1x.png`} alt="icon-read" />
      </div>
      <div className="ai-chat-content-time inter-normal-grey-12px">{stringTime}</div>
    </div>
  );
};

export default Chatbox;
