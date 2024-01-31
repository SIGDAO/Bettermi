import React from "react";
import CSS from 'csstype';
import { CustomTextArea } from "../../components/input";
import { useEffect } from 'react';
import { useState } from "react";
import DropdownMenu from "./dropdownmenu";
import "./allNftList.css";
interface ICUSTOMMODEL{
    level:string;
    openModel:boolean;
    setOpenModel:(openModel:boolean) => void;
}
export const CustomModel:React.FC<ICUSTOMMODEL> = ( props) => {
  const mobile = process.env.REACT_APP_MOBILE === 'true';
  let height: string | number;
  let width: string | number;
  const bgStyle: CSS.Properties = mobile ?
  {
    'background': `transparent`,
  }
  :
  {
    'position': 'fixed',
    'background': `linear-gradient(112deg, #221D4B 0%, #171717 100%)`,
    'boxShadow': '0px 3px 30px var(--royal-blue)',
    'width': '100vw',
    'minHeight': '100vh',
    'height': '100%',
    // 'overflowY': `${isOpenPopup ? 'hidden' : 'auto'}`,
    'overflowY': 'auto',
    'zIndex': '1',
    'overflowX': 'hidden',
    'display': 'flex!important',
  }
  if (mobile) {
      height = "844px";
      width = "390px";
      // display in ipad air size
    } else {
      height = "100vh";
      width = "820px";
    }
const centerLayoutStyle: CSS.Properties = {
  // 'backgroundPosition': 'center',
  'minHeight': `${height}`, // ipad size
  'width': `min(100vw,${width})`, // ipad size
  'height': '100%',
  //'margin': 'auto',
  'display': 'flex',
  //'justifyContent': 'center',
  //'alignItems': 'center',
  //'backgroundColor': 'green',
  'flexDirection': 'column',
}
    const {level,openModel,setOpenModel} = props;
    const [inputAddress, setInputAddress] = React.useState<string>("");
    const [inputValue, setInputValue] = React.useState<string>("");
    return(
      <div style={bgStyle}>
      <div style={centerLayoutStyle} className='bettermidapp-mimi-nfts-send-address-1'>
        <div className="edit-profile-layer" >
          <div className="icon-arrow-left-1-popup icon-arrow-left-3-popup">
            <img className="icon-arrow-left-popup" onClick={() => {console.log(level);console.log(openModel);setOpenModel(!openModel)}} src="img/myNftList/icon-arrow-left-1@1x.png" alt="icon-arrow-left" />
          </div>
          <div className="edit-profile">
            <div className="overlap-group-1">
              <img className="seperate-line-1" src="img/myNftList/seperate-line-1@1x.png" alt="Seperate line" />
              <img className="bg" src="img/myNftList/bg-2@1x.png" alt="BG" />
              <img className="seperat-line-1 seperat-line-3" src="img/myNftList/seperat-line-3@1x.png" alt="Seperat line" />
              <div className="transfer-n-ft inter-bold-royal-blue-15px">TRANSFER NFT</div>
              <div className="recipient inter-bold-royal-blue-15px">RECIPIENT</div>
              <div className="nft-details inter-bold-royal-blue-15px">NFT DETAILS</div>
            {openModel?<div></div>:(<div></div>)}
              <div className="rewards">
                <div className="ic_send-1">
                  <img className="ic_send-1-content" src="img/myNftList/ic-send-1@1x.png" alt="" />
                </div>
                <div className="place inter-semi-bold-white-18px">Send</div>
              </div>
              <div className="search_bar"></div>
              <CustomTextArea 
                text= {inputAddress} 
                setText={setInputAddress} 
                width={300} 
                height={56} 
                importClassName="nftPrice nftBar-1 nftSearchBar-4"
                activeClassName="nftActiveCard nftBar-1 nftSearchBar-4"
                placeholder="e.g. TS-9DJR-MGA2-VH44-5GMXY"
              />
              <CustomTextArea 
                text= {inputAddress} 
                setText={setInputAddress} 
                width={300} 
                height={56} 
                importClassName="card-number-1 search_bar-1 search_bar-4"
                activeClassName="active-card-number-1 search_bar-1 search_bar-4"
                placeholder="e.g. TS-9DJR-MGA2-VH44-5GMXY"
              />
              {/* <textarea
                className="search_bar-1 search_bar-4"
                value={inputAddress}
                onChange={handleAddressChange}
                placeholder="Enter something"
              /> */}
              {/* <div className="search_bar-1 search_bar-4"><p className="card-number">e.g. TS-9DJR-MGA2-VH44-5GMXY or Anderson</p></div> */}

              <div className="button_save" onClick={() => {setOpenModel(!openModel)}}>
                <div className="continue inter-semi-bold-white-15px">Transfer</div>
              </div>
              <p className="address-id-to-send-nft-to">Address, ID to send NFT to.</p>
              <h1 className="text-7">#00000001</h1>
              <div className="x0-signa-1">$0 SIGNA</div>
              <div className="x16228">

                <img className="x6" src="img/myNftList/file---6@1x.png" alt="6" />

              </div>
              <CustomTextArea 
                text= {inputValue} 
                setText={setInputValue} 
                width={300} 
                height={121} 
                importClassName="card-number-1 search_bar-4 search_bar-3"
                activeClassName="active-card-number-1 search_bar-4 search_bar-3"
                placeholder="You may attach some text or binary data to this transaction. Here you also enter the memo required by many exchanges"
              />
              {/* <textarea
                className="search_bar-3 search_bar-4"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="You may attach some text or binary data to this transaction. Here you also enter the memo required by many exchanges"
              /> */}
            {/* <p>Input Value: {inputValue}</p> */}
              {/* <div className="search_bar-3 search_bar-4">
                <p className="card-number-1">
                  You may attach some text or binary data to this transaction. Here you also enter the memo required
                  by many exchanges
                </p>
              </div> */}
              <div className="additional-text inter-bold-royal-blue-15px">ADDITIONAL TEXT</div>
            </div>
          </div>
        </div>
        </div>
        </div>
        )
            }
