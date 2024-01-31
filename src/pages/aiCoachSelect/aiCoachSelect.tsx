import * as React from 'react';
import './aiCoachSelect.css';
import { CenterLayout } from '../../components/layout';
import { ShortTitleBar } from '../../components/titleBar';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface IAiCoachSelectProps {
}

const questionList = [
  {
    question: 'Q:  What is Bettermi.io?',
    ans: "A:  Bettermi.io is a web application designed to enhance users' lifestyles by integrating fitness, wellness, and social elements."
  },
  {
    question: 'Q:  How does Bettermi.io work?',
    ans: "A:  Bettermi.io combines Game-Fi and Social-Fi aspects, motivating users to lead healthier lives while connecting with a community of like-minded individuals."
  },
  {
    question: 'Q:  What are the key features of Bettermi.io?',
    ans: "A:  The key features include fitness tracking, personalized workouts, NFT rewards, social interaction, AI coaching, and goal-setting capabilities."
  },
  {
    question: 'Q:  How can I earn rewards on Bettermi.io?',
    ans: "A:  Bettermi.io takes privacy and data security seriously, we do not store any picture from users. We also implemented measures to protect users' personal information in accordance with relevant privacy laws."
  },
  {
    question: "Q:  Can I connect with other users?",
    ans: "A:  Yes. User could connect to other users through Discord, leaderboards, transfer NFT etc."
  },
  {
    question: "Q:  Is my personal information safe?",
    ans: "A:  Bettermi.io takes privacy and data security seriously, implementing measures to protect users' personal information in accordance with relevant privacy laws."
  },
  {
    question: "Q:  How can I get started?",
    ans: "A:  To get started, simply visit the Bettermi.io website and create an account. From there, you can explore the app's features, set goals, and embark on your wellness journey."
  },
  {
    question: "Q:  What is blockchain technology and how is it used in Bettermi.io?",
    ans: "A:  Blockchain technology is a decentralized and transparent digital ledger that securely records and verifies transactions. In Bettermi.io, blockchain is utilized to power the NFT ecosystem, ensuring authenticity, traceability, and ownership of the NFT rewards and assets."
  },
  {
    question: "Q:  What are NFTs and how do they work in Bettermi.io?",
    ans: "A:  NFTs, or non-fungible tokens, are unique digital assets that represent ownership or proof of authenticity of a specific item or piece of content. In Bettermi.io, NFTs are used as rewards, collectibles, and in-game assets that users can earn and trade within the platform. They would also work as passes to gain access to different events or services in Bettermi.io."
  },
  {
    question: "Q:  What is Signum and how is it integrated into Bettermi.io?",
    ans: "A:  Signum is a blockchain platform that provides the underlying infrastructure for Bettermi.io. It facilitates secure transactions, data storage, and smart contract functionality within the app, enabling seamless interactions and rewards distribution."
  },
  {
    question: "Q:  What is SIGDAO?",
    ans: "A:  SIGDAO is the native cryptocurrency of the Bettermi.io platform. It is a digital token built on the Signum blockchain, specifically designed to fuel the in-app economy and reward system. SIGDAO can be earned by users through various activities such as completing challenges, achieving fitness goals, and participating in the Bettermi.io community."
  },
  {
    question: "Q:  How is SIGDAO connected to the Signum blockchain?",
    ans: "A:  SIGDAO is built on the Signum blockchain, which serves as the underlying infrastructure for the Bettermi.io platform. The Signum blockchain provides the secure and efficient network for SIGDAO transactions, ensuring transparency, immutability, and decentralization. By leveraging Signum's technology, SIGDAO inherits the benefits of a robust blockchain network, enabling seamless transactions and interactions within the Bettermi.io ecosystem."
  },
  {
    question: "Q:  Can you provide more information about the partner collaborations in Bettermi.io?",
    ans: "A:  Bettermi.io has partnered with leading fitness and wellness brands to provide users with a diverse range of products, services, and experiences. These partnerships enhance the user experience by offering access to exclusive discounts, premium content, and unique opportunities."
  }
]


const AiCoachSelect: React.FunctionComponent<IAiCoachSelectProps> = (props) => {
  // const initialArray: any[] = Array.from({ length: 10 }); // Example array with length 10
  const [showQuestion, setshowQuestion] = useState<boolean[]>(Array(questionList.length).fill(false));

  // const [showQuestion, setShowQuestion] = React.useState(false);
  const [answer, setAnswer] = React.useState('');
  const handleExportAns = (questionIndex: number) => {
    setAnswer(questionList[questionIndex].ans);
    console.log(answer);
    // setShowQuestion((prev) => !prev);
    setshowQuestion((prev) => {
      const newArray = [...prev];
      newArray[questionIndex] = !newArray[questionIndex];
      return newArray;
    })
  }

  const questionListContent = questionList.map((question, index) => {
    return (
      <>
        <div
          className="question-box inter-normal-white-15px"
          onClick={(e) => handleExportAns(index)}
        >
          {question.question}
        </div>
        {showQuestion[index] && (
          <div className="ans-container">
            <div className="talking-container" >
              <div className="answer-box inter-normal-white-15px" >
                {question.ans}
              </div>
            </div>
          </div>
        )}
      </>
    );
  })
  

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-ai-coach">
      <ShortTitleBar title='Your AI coaches' />
      <img className="bg-O0wesW" src="img/aiCoachSelect/bg-7@1x.png" alt="BG" />
      <div className="bg-C4VecI"></div>
      <div className="time-indicator-O0wesW">
        <img className="x15-pqjZDK" src="img/aiCoachSelect/file---16@1x.png" alt="15" />
        <div className="today-pqjZDK inter-normal-white-12px-2">Today</div>
        <img className="x16-pqjZDK" src="img/aiCoachSelect/file---16@1x.png" alt="16" />
      </div>
      <p className="know-more-about-bettermiio-O0wesW inter-bold-royal-blue-15px">KNOW MORE ABOUT BETTERMI.IO :</p>
      <div className="x9-O0wesW">
        <div className="bettermi_qa-j4ugSM">
          {questionListContent}
        </div>
      </div>
      <div className="user-O0wesW">
        {/* <Link to="/aiCoachDetail/1"> */}
          <div className="ai-chatbot_-mmi-NgcGm6">
            <div className="bg-Kcwf64"></div>
            <img className="ai-chatbot_-mimi-Kcwf64" src="img/aiCoachSelect/ai-chatbot-mimi-2@1x.png" alt="Ai Chatbot_Mimi" />
            <div className="mental-coach-Kcwf64 inter-normal-white-12px">Mental coach</div>
            <div className="mimi-Kcwf64 inter-semi-bold-white-15px">Mimi</div>
          </div>
        {/* </Link> */}
        {/* <Link to="/aiCoachDetail/2"> */}
          <div className="ai-chatbot_io-NgcGm6 ai-chatbot_io">
            <div className="bg-aeJf5z"></div>
            <img className="ai-chatbot_io-aeJf5z ai-chatbot_io" src="img/aiCoachSelect/ai-chatbot-io@1x.png" alt="Ai Chatbot_io" />
            <div className="physical-coach-aeJf5z inter-normal-white-12px">Physical coach</div>
            <div className="io-aeJf5z inter-semi-bold-white-15px">.io</div>
          </div>
        {/* </Link> */}
      </div>
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

export default AiCoachSelect;
