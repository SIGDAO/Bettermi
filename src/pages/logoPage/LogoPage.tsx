import * as React from 'react';

import { CenterLayout } from '../../components/layout';
// import bettermiIcon from '../../../public/img/logoPage/';
import './logoPage.css';
import { Link } from 'react-router-dom';

// export default function Logo (props: ILogoProps) {
const Logo: React.FC = () => {
  const content: JSX.Element = (
    <Link to='/connectWallet' >
      <div id='logoPage-container' >
        <img 
          id='bettermiio_logo' 
          src={process.env.PUBLIC_URL + '/img/logoPage/bettermi-io-logo@1x.png'}
          alt='bettermi.io logo'
        />
      </div>
    </Link>
  )


  return (
    <CenterLayout
      bgImg={false}
      content={content}
    />
  );
}

export default Logo;