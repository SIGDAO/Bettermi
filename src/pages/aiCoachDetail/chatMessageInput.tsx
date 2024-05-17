import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatHistory, aiCoachSlice, selectCurrentAiMsg } from "../../redux/aiCoach";
import { generateDotIoMessage, generateMimiMessage } from "../../components/randomGenerater";

interface IChatMessageInputProps {
  msgInput: string;
  setMsgInput: React.Dispatch<React.SetStateAction<string>>;
  id: string | undefined;
  handleUserSendMsg: () => void;
}

const ChatMessageInput: React.FunctionComponent<IChatMessageInputProps> = ({ msgInput, setMsgInput, id, handleUserSendMsg }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocusToEnd = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length, 
        inputRef.current.value.length
      );
    }
  };

  const handleRandomQuestion = () => {
    if (id === "1") {
      setMsgInput(generateMimiMessage);
    }

    if (id === "2") {
      setMsgInput(generateDotIoMessage);
    }
    handleFocusToEnd();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission on Enter key press
      handleUserSendMsg();
    }
  };

  return (
    <div className="message-input-container">
      <div className="coach-typing-reminder"></div>
      <div className="message-input-area">
        <input
          className="chat-message-input inter-normal-15px"
          ref={inputRef}
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="I need help..."
        />
        <div className="random-message-generate" onClick={handleRandomQuestion}>
          <img className="ic_casino_24px-dF0TP0" src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/ic-casino-24px-1@1x.png`} alt="ic_casino_24px" />
        </div>
      </div>
      <img className="ic_send-qbYILs ic_send" onClick={handleUserSendMsg} src={`${process.env.PUBLIC_URL}/img/aiCoachDetail/ic-send-1@1x.png`} alt="ic_send" />
    </div>
  );
};

export default ChatMessageInput;
