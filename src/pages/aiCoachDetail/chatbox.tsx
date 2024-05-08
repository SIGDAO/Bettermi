import * as React from 'react';

interface IChatboxProps {
  text: string;
  time: string;
  isUser: boolean;
}

const Chatbox: React.FunctionComponent<IChatboxProps> = ({ text, time, isUser }) => {
  return (
    <div className={isUser ? "ai-chatbox-container" : "user-chatbox-container"}>
      <div className="ai-chat-content inter-normal-white-15px">
        {text}
      </div>
      <div className="ai-chat-content-time inter-normal-grey-12px">
        {time}
      </div>
    </div>
    );
};

export default Chatbox;
