import * as React from 'react';
import './titleBar.css';
import { BackButton } from './button';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

interface IShortTitleBarProps {
  title: string | undefined;
  aiCoach?: boolean;
  help?: boolean;
  transparent?: boolean | undefined;
  filter?: boolean;
  addSign?:boolean;
  setting?: boolean;
  backButton?: boolean;
  importButton?: boolean;
  setIsOpenImport?: (isOpenImport: boolean) => void;
  isOpenImport?: boolean;
  customiseBackButton?:boolean;
  customiseBackButtonLink?:string;
}


const settingIcon: JSX.Element = (
  <div className="ic_settings_24px-sKtgaf ic_settings_24px">
    <img
      className="ic_settings_24px-z3OtfL ic_settings_24px"
      src={`${process.env.PUBLIC_URL}/img/ic-settings-24px-1@1x.png`}
      alt="ic_settings_24px"
    />
  </div>
)

export const ShortTitleBar: React.FunctionComponent<IShortTitleBarProps> = (props) => {
  const { title, aiCoach, help, transparent,filter,addSign, setting, backButton,importButton,setIsOpenImport,isOpenImport,customiseBackButton,customiseBackButtonLink
   } = props;
  const navigate = useNavigate();

  return (
    <div className="title-bar-layout">
      <div className={transparent ? "transparent-title-bar-container" : "title-bar-container"}
        style={{
          // background: `url(${process.env.PUBLIC_URL}/img/bg-11@1x.png)`,
          // backgroundPosition: 'center',
          // backgroundSize: 'cover',
        }}
      >
        <div className="title-bar-title inter-semi-bold-white-18px">{title}</div>
        {/* <img className="title-bar-seperat-line seperat-line" src={process.env.PUBLIC_URL + "/img/seperat-line-11@1x.png"} alt="Seperat line" /> */}
        {addSign === true?
          <Link to='/allNftList'>
            <div className = "titleBarAddSign">
              <img className = "titleBarAddSignImg" src = {process.env.PUBLIC_URL + "/img/NftList/ic-add@1x.png"}/>
            </div>
          </Link>
          :
          setting === false?
            null
            :
            <Link to='/setting'>
              <div className="title-bar-ic_help_24px ic_help_24px">
                <img className="title-bar-ic_help_24px-img ic_help_24px" src={process.env.PUBLIC_URL + "/img/ic-settings-24px-1@1x.png"} alt="ic_help_24px" />
              </div>
            </Link>
        }
        {/*the filter and the plus sign change this div*/}
        {backButton === false ? null :
        <div onClick={() => {
          if (customiseBackButtonLink) {
            navigate(customiseBackButtonLink);
            return;
          };
          navigate(-1);
        }} >
          <div className="icon-arrow-left-container icon-arrow-left">
              <img
                className="icon-arrow-left-img icon-arrow-left"
                src={process.env.PUBLIC_URL + "/img/icon-arrow-left-12@1x.png"}
                alt="icon-arrow-left"
                />
          </div>
        </div>
        }
        {/* {customiseBackButton === false && customiseBackButtonLink == null ? null :
          <Link to={customiseBackButtonLink!}>
                <div className="icon-arrow-left-container icon-arrow-left">
                    <img
                      className="icon-arrow-left-img icon-arrow-left"
                      src={process.env.PUBLIC_URL + "/img/icon-arrow-left-12@1x.png"}
                      alt="icon-arrow-left"
                      />
                </div>
              </Link>
              } */}
        {aiCoach === false ? null :(
          <Link to="/aiCoachSelect">
            <div className="ic_settings_24px-container ic_settings_24px">
              <img
                className="ic_settings_24px-img ic_settings_24px"
                src={process.env.PUBLIC_URL + "/img/home/bxs-Aicoach.svg"}
                alt="ic_settings_24px"
                />
            </div>
          </Link>
        )
      //   :
      //   (
      //   <div className="title-bar-ic_help_24px ic_help_24px">
      //     <img className="title-bar-ic_help_24px-img ic_help_24px" src={process.env.PUBLIC_URL + "/img/ic-help-24px-1@1x.png"} alt="ic_help_24px" />
      // </div>
      //  )
      }
      {filter != true ? null :(
      // <div className = "titleBarDropDown">
      //   <button className = "titleBarFilter">
      //     <div className = "titleBarFilterName">Free</div>
      //     <img className = "titleBarFilterArrow" src = {process.env.PUBLIC_URL + "img/NftList/ic-arrow-drop-down@1x.png"}></img>
      //     <div className="titleBarDropdown-content">
      //       <a href="#">Link 1</a>
      //       <a href="#">Link 2</a>
      //       <a href="#">Link 3</a>
      //     </div>
      //   </button>
      // </div>
        <div className="dropdown">
        <button className="dropbtn">
          <div className = "dropbtnDescription">Free</div>
              
            <img className = "dropbtnArrow" src = {process.env.PUBLIC_URL + "img/NftList/ic-arrow-drop-down@1x.png"}/>

        </button>
        <div className="dropdown-content">
          <a href="#">Lowest Price</a>
          <a href="#">Highest Price</a>
          <a href="#">All</a>
        </div>
      </div>
      
      )}
      {
        importButton === false ? null :
          setIsOpenImport === undefined ? null :
        (
          <Button className = "importButton inter-semi-bold-white-12px" onClick = {() => setIsOpenImport(!isOpenImport)}>Import NFT</Button>
        )
      }

        {/* <img className="bg-MY4xZJ" src={process.env.PUBLIC_URL + "/img/bg-11@1x.png"} alt="BG" /> */}
      </div>
    </div>
  )
};

  // return (
  //   <div className="title-bar-P2i95W">
  //     {/* <img className="bg-sKtgaf bg" src={`${process.env.PUBLIC_URL}/img/bg-11@1x.png`} alt="BG" /> */}
  //     <img className="seperat-line-sKtgaf" src={`${process.env.PUBLIC_URL}/img/seperat-line-11@1x.png`} alt="Seperat line" />
  //     <div className="title-bar-content">
  //       <div className="master-collector-sKtgaf master-collector inter-semi-bold-white-18px">{title}</div>
  //       <a href="javascript:history.back()">
  //         <div className="icon-arrow-left-sKtgaf icon-arrow-left">
  //           <img
  //             className="icon-arrow-left-ywY1Kj icon-arrow-left"
  //             src={`${process.env.PUBLIC_URL}/img/icon-arrow-left-12@1x.png`}
  //             alt="icon-arrow-left"
  //           />
  //         </div>
  //       </a>
  //       {settingIcon}
  //       {/* <BackButton/> */}
  //       <div className="ic_help_24px-sKtgaf ic_help_24px">
  //         <img className="ic_help_24px-m7uK5a ic_help_24px" src={`${process.env.PUBLIC_URL}/img/ic-help-24px-1@1x.png`} alt="ic_help_24px" />
  //       </div>
  //     </div>
  //   </div>
  // );
