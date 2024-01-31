import * as React from 'react';
import './menuBar.css';
import { Link } from 'react-router-dom';

export interface IMenuBarProps {
}

const MenuBar: React.FC<IMenuBarProps> = (props) => {
  
  return (
    <div className="menu-bar-layout">
      <div className="menu-bar-RoXPLo">
        {/* <img className="menu_bar_bg-j7gIYx" src={`${process.env.PUBLIC_URL}/img/menuBar/menu-bar-bg-1@1x.png`} alt="menu_bar_bg" /> */}
        <Link to={'/featureMissions'} >
          <div className="ic_-missions-container">
            <img className="ic_-missions-img" src={`${process.env.PUBLIC_URL}/img/menuBar/ic-missions-1@1x.png`} alt="ic_Missions" />
          </div>
        </Link>
        <Link to={'/selfieToEarn'}>
          <div className="ic_-selfie-container">
            <img className="ic_-selfie-img" src={`${process.env.PUBLIC_URL}/img/menuBar/ic-selfie-2@1x.png`} alt="ic_Selfie" />
          </div>
        </Link>
        <Link to={'/home'}>
          <div className="ic_home-container">
            <img className="ic_home-img" src={`${process.env.PUBLIC_URL}/img/menuBar/ic-home-1@1x.png`} alt="ic_home" />
          </div>
        </Link>
        <Link to='/marketplace'>
          {/* the reward icon */}
          <div className="ic_rewards-container">
            <img className="reward-icon" src={`${process.env.PUBLIC_URL}/img/menuBar/ic_rewards.png`} alt="11659"/>
          </div>
        </Link>
        <Link to={'/profile'}>
          <div className="ic_profile-container">
            <img className="ic_profile-img" src={`${process.env.PUBLIC_URL}/img/menuBar/ic-profile-1@1x.png`} alt="ic_profile" />
          </div>
        </Link>
        {/* <img className="seperat-line-j7gIYx" src={`${process.env.PUBLIC_URL}/img/menuBar/seperat-line-11@1x.png`} alt="Seperat line" /> */}

      </div>
    </div>

  );
}

export default MenuBar;