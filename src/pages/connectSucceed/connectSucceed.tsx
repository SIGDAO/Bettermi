import * as React from 'react';
import { CenterLayout } from '../../components/layout';
import './connectSucceed.css'
import { BackButton } from '../../components/button';
import { useNavigate } from 'react-router-dom';
import CSS from 'csstype';


interface IConnectSucceedProps {
}

const tuningGapStyle: CSS.Properties = {
  gap: '128px',
}


const ConnectSucceed: React.FunctionComponent<IConnectSucceedProps> = (props) => {
  const navigate = useNavigate();

  const openCam : () => void = () => {
    console.log("openCam")
    navigate("/takeSelfie")
  }  


  const takeSelfie = () => {
    console.log("takeSelfie")
  }
  const content : JSX.Element = (
    <div className="connectWallet-layout">
      <div id='connectWallet-container' style={tuningGapStyle}>
        <BackButton />
        <div className="success-box">
          <div className="finished-connect-wallet-icon-container">
            <img className="icon-awesome-check" src={`${process.env.PUBLIC_URL}/img/connectSucceed/icon-awesome-check@1x.png`} alt="Icon awesome-check" />
          </div>
          <h1 className="success-connect-wallet-message inter-semi-bold-white-28px">Successful!</h1>
          <p className="your-crypto-wallet-is-connected">Your crypto wallet is connected.</p>
        </div>
        <div className="button_-selfie" onClick={openCam}>
          <img className="ic_selfie" src={`${process.env.PUBLIC_URL}/img/connectSucceed/ic-selfie@1x.png`} alt="ic_selfie" />
          <p className="continue inter-semi-bold-white-15px">Take a Selfie and Start!</p>
        </div>
      </div>
    </div>
  )

  return content;

  return (
    <CenterLayout
      content={content}
      bgImg={false}
    />
  );
};

export default ConnectSucceed;
