import * as React from "react";
import "./titleBar.css";
import { BackButton } from "./button";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

interface IShortTitleBarProps {
  title: string | undefined;
  aiCoach?: boolean;
  help?: boolean;
  transparent?: boolean | undefined;
  filter?: boolean;
  addSign?: boolean;
  setting?: boolean;
  backButton?: boolean;
  importButton?: boolean;
  setIsOpenImport?: (isOpenImport: boolean) => void;
  isOpenImport?: boolean;
  customiseBackButton?: boolean;
  customiseBackButtonLink?: string;
  // isPositionNotFixed?: boolean;
}

export const ShortTitleBar: React.FunctionComponent<IShortTitleBarProps> = (props) => {
  // back button default to true
  const { title, aiCoach, help, transparent, filter, addSign, setting, backButton = true, importButton, setIsOpenImport, isOpenImport, customiseBackButton, customiseBackButtonLink } = props;

  // right first button:
  // ai coach
  // import (not implemented)
  const rightFirstButton: JSX.Element = (
    <>
      <Link to="/aiCoachSelect">
        {aiCoach && (
          <div className="title-bar-ai-coach-icon-container">
            <img src={process.env.PUBLIC_URL + "/img/ai_coach.svg"} alt="" className="title-bar-ai-coach-icon" />
          </div>
        )}
      </Link>
      {/* {importButton && <img src="" alt="" className="title-bar-right-first-button-image" />} */}
    </>
  );

  // right second button:
  // setting
  // store (not implemented)
  const rightSecondButton: JSX.Element = (
    <>
      <Link to="/setting">{setting && <img src={process.env.PUBLIC_URL + "/img/ic-settings-24px-1@1x.png"} alt="" className="title-bar-setting-button-image" />}</Link>
      {/* {store && <img src="" alt="" className="title-bar-right-second-button-image" />} */}
    </>
  );

  return (
    // <div className="title-bar-layout">
      <div
        className={transparent ? "transparent-title-bar-container" : "title-bar-container"}
        // style={isPositionNotFixed ? {position: "relative"} : {}}
        // style={
        //   {
        //     // background: `url(${process.env.PUBLIC_URL}/img/bg-11@1x.png)`,
        //     // backgroundPosition: 'center',
        //     // backgroundSize: 'cover',
        //   }
        // }
      >
        <div className="title-bar-content">
          <div className="title-bar-left-container">
            {backButton && <BackButton customiseBackButtonLink={customiseBackButtonLink} className={"title-bar-back-button-container"} />}
            <div className="title-bar-title inter-semi-bold-white-18px">{title}</div>
          </div>
          <div className="title-bar-right-container">
            {rightFirstButton}
            {rightSecondButton}
          </div>
        </div>
        {/* {keepAsReference} */}
      </div>
    // </div>
  );
};


// const keepAsReference = (
//   <>
//     <div className="title-bar-title inter-semi-bold-white-18px">{title}</div>
//     {/* <img className="title-bar-seperat-line seperat-line" src={process.env.PUBLIC_URL + "/img/seperat-line-11@1x.png"} alt="Seperat line" /> */}
//     {/* first button */}
//     {addSign === true ? (
//       <Link to="/allNftList">
//         <div className="titleBarAddSign">
//           <img className="titleBarAddSignImg" src={process.env.PUBLIC_URL + "/img/NftList/ic-add@1x.png"} />
//         </div>
//       </Link>
//     ) : setting === false ? null : (
//       <Link to="/setting">
//         <div className="title-bar-ic_help_24px ic_help_24px">
//           <img className="title-bar-ic_help_24px-img ic_help_24px" src={process.env.PUBLIC_URL + "/img/ic-settings-24px-1@1x.png"} alt="ic_help_24px" />
//         </div>
//       </Link>
//     )}
//     {/*the filter and the plus sign change this div*/}
//     {backButton === false ? null : (
//       <div
//         onClick={() => {
//           if (customiseBackButtonLink) {
//             navigate(customiseBackButtonLink);
//             return;
//           }
//           navigate(-1);
//         }}
//       >
//         <div className="icon-arrow-left-container icon-arrow-left">
//           <img className="icon-arrow-left-img icon-arrow-left" src={process.env.PUBLIC_URL + "/img/icon-arrow-left-12@1x.png"} alt="icon-arrow-left" />
//         </div>
//       </div>
//     )}
//     {/* {customiseBackButton === false && customiseBackButtonLink == null ? null :
//     <Link to={customiseBackButtonLink!}>
//           <div className="icon-arrow-left-container icon-arrow-left">
//               <img
//                 className="icon-arrow-left-img icon-arrow-left"
//                 src={process.env.PUBLIC_URL + "/img/icon-arrow-left-12@1x.png"}
//                 alt="icon-arrow-left"
//                 />
//           </div>
//         </Link>
//         } */}

//     {
//       aiCoach === false ? null : (
//         <Link to="/aiCoachSelect">
//           <div className="ic_settings_24px-container ic_settings_24px">
//             <img className="ic_settings_24px-img ic_settings_24px" src={process.env.PUBLIC_URL + "/img/ai_coach.svg"} alt="ic_settings_24px" />
//           </div>
//         </Link>
//       )
//       //   :
//       //   (
//       //   <div className="title-bar-ic_help_24px ic_help_24px">
//       //     <img className="title-bar-ic_help_24px-img ic_help_24px" src={process.env.PUBLIC_URL + "/img/ic-help-24px-1@1x.png"} alt="ic_help_24px" />
//       // </div>
//       //  )
//     }
//     {filter != true ? null : (
//       // <div className = "titleBarDropDown">
//       //   <button className = "titleBarFilter">
//       //     <div className = "titleBarFilterName">Free</div>
//       //     <img className = "titleBarFilterArrow" src = {process.env.PUBLIC_URL + "img/NftList/ic-arrow-drop-down@1x.png"}></img>
//       //     <div className="titleBarDropdown-content">
//       //       <a href="#">Link 1</a>
//       //       <a href="#">Link 2</a>
//       //       <a href="#">Link 3</a>
//       //     </div>
//       //   </button>
//       // </div>
//       <div className="dropdown">
//         <button className="dropbtn">
//           <div className="dropbtnDescription">Free</div>

//           <img className="dropbtnArrow" src={process.env.PUBLIC_URL + "img/NftList/ic-arrow-drop-down@1x.png"} />
//         </button>
//         <div className="dropdown-content">
//           <a href="#">Lowest Price</a>
//           <a href="#">Highest Price</a>
//           <a href="#">All</a>
//         </div>
//       </div>
//     )}
//     {importButton === false ? null : setIsOpenImport === undefined ? null : (
//       <Button className="importButton inter-semi-bold-white-15px" onClick={() => setIsOpenImport(!isOpenImport)}>
//         Import NFT
//       </Button>
//     )}

//     {/* <img className="bg-MY4xZJ" src={process.env.PUBLIC_URL + "/img/bg-11@1x.png"} alt="BG" /> */}
//   </>
// );
