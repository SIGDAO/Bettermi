import React from 'react';
import '../loadingMinting/loadingMinting.css'
import { CenterLayout } from '../../components/layout';
import { ShortTitleBar } from '../../components/titleBar';
import { useEffect } from 'react';
interface AllNftLoadingProps {
}
const AllNftLoading:React.FC<AllNftLoadingProps> = () => {
  const [count, setCount] = React.useState(1);
  useEffect(() => {
    const incrementInterval = 240000 / 96; // Time divided by the number of increments
    // const incrementInterval = 5000 / 100;
    const timer = setInterval(() => {
      if (count < 100) {
        setCount((prevCount) => prevCount + 1);
      }
      // if (count => 100 ) {
      // } else {
      //   setIsLoading(false);
      //   navigate('/generateFreeNFT');
      //   clearInterval(timer);
      // }
    }, incrementInterval);

    return () => {
      // setIsLoading(false);
      // navigate('/generateFreeNFT');
      clearInterval(timer);
    };
  }, []);

const content: JSX.Element = (
    <>
    <ShortTitleBar title='NFT Marketplace' setting = {false}addSign = {false} aiCoach = {false} filter = {false} importButton = {false} />
    <div className="screen">
    <div className="bettermidapp-generate-free-nft-minting">
      <div className="bg_2-JdJl2l">
          {/* <img className="bg-7ckAMs" src="img/loadingMinting/bg-11@1x.png" alt="BG" /> */}
          {/* <div className="loader-7ckAMs">
            <div className="x001-loading-u5QZHJ">
                <div className="x107-MxmV9X"></div>
                <div className="x108-MxmV9X"></div>
                <div className="x109-MxmV9X"></div>
                <div className="x110-MxmV9X"></div>
                <div className="x111-MxmV9X"></div>
                <div className="x112-MxmV9X"></div>
                <div className="x113-MxmV9X"></div>
                <div className="x114-MxmV9X"></div>
                <div className="x115-MxmV9X"></div>
            </div>
          </div> */}
          {/* <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> */}
          <div className="mimi-loading">
            <img className='mimi-loading-image' src="/img/loadingMinting/mimi-dancing-for-loadin-page.gif" alt="" />
          </div>
          <div className="x50-7ckAMs">{count}%</div>
          {/* <a href="bettermidapp-settings-1.html">
            <div className="ic_settings_24px-7ckAMs ic_settings_24px">
                <img
                  className="ic_settings_24px-alZAUJ ic_settings_24px"
                  src="img/loadingMinting/ic-settings-24px-1@1x.png"
                  alt="ic_settings_24px"
                  />
            </div>
          </a> */}
          {/* <a href="bettermidapp-ai-coach.html">
            <div className="ic_sentiment_very_satisfied_24px-7ckAMs ic_sentiment_very_satisfied_24px">
                <img
                  className="ic_sentiment_very_satisfied_24px-VxvOOd ic_sentiment_very_satisfied_24px"
                  src="img/loadingMinting/ic-sentiment-very-satisfied-24px-1@1x.png"
                  alt="ic_sentiment_very_satisfied_24px"
                  />
            </div>
          </a> */}
      </div>
      {/* <a href="javascript:history.back()">
          <div className="icon-arrow-left-JdJl2l icon-arrow-left">
            <img
                className="icon-arrow-left-cQ3AYZ icon-arrow-left"
                src="img/loadingMinting/icon-arrow-left-10@1x.png"
                alt="icon-arrow-left"
                />
          </div>
      </a> */}
      {/* <div className="bars-status-bar-i-phone-light-JdJl2l">
          <div className="frame-PAFj23"></div>
          <div className="status-bar-PAFj23">
            <div className="battery-9cGPS4">
                <div className="border-IlCvJx"></div>
                <img className="cap-IlCvJx" src="img/loadingMinting/cap-1@1x.png" alt="Cap" />
                <div className="capacity-IlCvJx"></div>
            </div>
            <img className="wifi-9cGPS4" src="img/loadingMinting/wifi-1@1x.png" alt="Wifi" />
            <img className="cellular-connection-9cGPS4" src="img/loadingMinting/cellular-connection-1@1x.png" alt="Cellular Connection" />
            <div className="time-style-9cGPS4">
                <div className="time-fIdwUD sfprotext-semi-bold-white-15px">9:41</div>
            </div>
          </div>
      </div> */}
      <div className="minting-JdJl2l inter-normal-white-15px">Loading Marketplace</div>
      <div className="reminder-text-1 inter-normal-white-15px">Please wait patiently<br/>and do not refresh the page</div>
      {/* <div className="reminder-text-2 inter-normal-white-15px">and do not refresh the page</div> */}
    </div>

    </div>
    </>
  )
  

  return (
    <CenterLayout
      content={content}
      bgImg={false}
    />
  )
};

export default AllNftLoading;
