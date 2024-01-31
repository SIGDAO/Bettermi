import * as React from "react";
import "./profile.css";
import { CenterLayout } from "../../components/layout";
import AnimaGenContent from "./animaGenContent";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { selectCurrentGender } from "../../redux/profile";
import { accountId } from "../../redux/account";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isBackButton, setIsBackButton] = useState<boolean>(true);
  const { state } = useLocation();
  const [isPopUpIcon, setIsPopUpIcon] = useState<boolean>(false);
  const [isNFTiconLoading, setIsNFTiconLoading] = useState<boolean>(true);
  const [imgAddress, setImgAddress] = useState<string>("");

  useEffect(() => {
    if (state?.previousPath === "/customizeYourProfile") {
      setIsOpen(true);
      setIsBackButton(false);
      window.history.replaceState({}, document.title);
    }
  }, []);

  /* Function to check whether we are updating personal information*/
  const [isUpdatingUserSetting, setIsUpdatingUserSetting] = useState<boolean>(false);
  const [isSettingLoading, setIsSettingLoading] = useState<boolean>(true);
  const userAccountId = useSelector(accountId);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const checkIsLoading = async () => {
    const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);
    console.log(messages);
    for (var i = 0; i < messages.unconfirmedTransactions.length; i++) {
      if (messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId) {
        console.log("the user is updating personal info");
        setIsUpdatingUserSetting(true);
        setIsSettingLoading(false);
        return;
      }
    }

    setIsUpdatingUserSetting(false);
    setIsSettingLoading(false);
  };

  useEffect(() => {
    checkIsLoading();
  }, []);

  /* Function to check whether we are updating personal information*/

  return (
    <CenterLayout
      noScroll={true}
      content={
        <>
          {isPopUpIcon && (
            <div className="hidden-content">
              {isNFTiconLoading ? (
                <div className="x0"></div>
              ) : (
                <>
                  <img className="x0-generateFreeNFT" src={`https://ipfs.io/ipfs/${imgAddress}`} alt="0" />
                  {/* <h1 className="text-1">#{nftNumber}</h1> */}
                </>
              )}
              <div className="x16206">
                <div className="lv-1">LV 1</div>
                <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
                <div className="reward-10">REWARD +5%</div>
              </div>
              {/* <div className="x0-signa">$0 SIGNA</div> */}
              <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
              <div onClick={() => setIsPopUpIcon(false)} className="click-the-area-to-make-it-hidden-again"></div>
            </div>
          )}
          <div className="screen">
            <AnimaGenContent
              isNFTiconLoading={isNFTiconLoading}
              setIsNFTiconLoading={setIsNFTiconLoading}
              setIsPopUpIcon={setIsPopUpIcon}
              isPopUpIcon={isPopUpIcon}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isBackButton={isBackButton}
              setIsBackButton={setIsBackButton}
              isUpdatingUserSetting={isUpdatingUserSetting}
              setImgAddress={setImgAddress}
            />
          </div>
        </>
      }
      bgImg={false}
      // noScroll={isOpen}
    />
  );
};

export default Profile;
