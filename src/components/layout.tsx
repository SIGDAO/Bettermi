import * as React from 'react';
import CSS from 'csstype';

export interface ICenterLayoutProps {
  bgImg ?: boolean | string;
  content ?: any;
  desktop ?: boolean;
  noScroll ?: boolean | undefined;
}

export function CenterLayout (props: ICenterLayoutProps) {
  const {bgImg, content, desktop, noScroll} = props;
  let height : string | number
  let width : string | number;
  const mobile = process.env.REACT_APP_MOBILE === 'true'

  // display in iphone 12 pro size

  if (mobile) { 
    height = "844px";
    width = "390px";
  // display in ipad air size
  } else {
    height = "100vh";
    width = "820px";
  }



  const bgStyle : CSS.Properties = mobile ? 
  {
    'background': `transparent`,
    'display': 'flex',
    'justifyContent': 'center',
  }
  :
  {
    'position': 'fixed',
    'background': `linear-gradient(to bottom right, #221D4B, #171717)`,
    'width': '100vw',
    'minHeight': '100vh',
    'height': '100%',
    'overflowY': `${noScroll ? 'hidden' : 'auto'}`,
    'zIndex': '1',
    'overflowX': 'hidden',
        'display': 'flex',
    'justifyContent': 'center',
  }

  const centerLayoutStyle : CSS.Properties = {
    // 'backgroundPosition': 'center',
    // 'minHeight': `${height}`, // ipad size
    'minHeight': '730px',
    'width': `${width}`, // ipad size
    'height': '100%',

    'margin': 'auto',
    // 'display': 'flex',
    // 'justifyContent': 'center',
    // 'alignItems': 'center',
  }

  if (typeof bgImg === 'string') {
    centerLayoutStyle.backgroundImage = `url(${bgImg})`
    centerLayoutStyle.backgroundPosition = 'center'
  } else if (mobile) {
    // centerLayoutStyle.backgroundImage = `url(${process.env.PUBLIC_URL}/img/bg.png)`
    // centerLayoutStyle.backgroundPosition = 'center'
    centerLayoutStyle.background = `linear-gradient(to bottom right, #221D4B, #171717)`
  } else {
    // centerLayoutStyle.display = `flex`
    // centerLayoutStyle.justifyContent = `center`
    // centerLayoutStyle.alignItems = `center`
    // centerLayoutStyle.margin = `auto`
  }


  const hihi = () => {
    console.log(process.env.MOBILE)
    return content
  }  
  const handleScroll2 = (event:any) => {
    console.log(event);
    const container = event.target!;
    console.log(container);
    const scrollAmount = event.deltaY;
    console.log(scrollAmount);
    window.onscroll = function() {
      window.scrollTo({left:0, top:-scrollAmount});
    };
    container.scrollTo({
      top: 0,
      left: container.scrollLeft + scrollAmount,

    });
  };

  

  return (
    <div style={bgStyle} >
      <div style={centerLayoutStyle}>
        {typeof content === 'function' ? content() : content}
      </div>
    </div>
  );
}
