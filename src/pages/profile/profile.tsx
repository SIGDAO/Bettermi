import * as React from "react";
import "./profile.css";
import { CenterLayout } from "../../components/layout";
import AnimaGenContent from "./animaGenContent";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { selectCurrentGender, selectCurrentIsGuest } from "../../redux/profile";
import { accountId } from "../../redux/account";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";
import { GetRewardPercentage } from "../../NftSystem/Reward/getRewardPercentage";
import ProfileTemplate from "./profileTemplate";
import { NFTDetailPopUpWindow } from "../../components/popupWindow";

interface IProfileProps {}

const ProfileTesting: React.FunctionComponent<IProfileProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isBackButton, setIsBackButton] = useState<boolean>(true);
  const { state } = useLocation();
  const [isPopUpIcon, setIsPopUpIcon] = useState<boolean>(false);
  const [isNFTiconLoading, setIsNFTiconLoading] = useState<boolean>(true);
  const [imgAddress, setImgAddress] = useState<string>("");
  const [rewardPercentage, setRewardPercentage] = useState<string>("0");

  /* Function to check whether we are updating personal information*/
  const [isUpdatingUserSetting, setIsUpdatingUserSetting] = useState<boolean>(false);
  const [isSettingLoading, setIsSettingLoading] = useState<boolean>(true);
  const userAccountId = useSelector(accountId);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const isGuest = useSelector(selectCurrentIsGuest);

  const checkIsLoading = async () => {
    const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);

    for (var i = 0; i < messages.unconfirmedTransactions.length; i++) {
      if (messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId) {
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

  useEffect(() => {
    if (state?.previousPath === "/customizeYourProfile") {
      setIsOpen(true);
      setIsBackButton(false);
      window.history.replaceState({}, document.title);
    }
    GetRewardPercentage(ledger2, userAccountId)
      .then((res) => {
        setRewardPercentage(res);
      })
      .catch((err) => {});
  }, []);

  /* Function to check whether we are updating personal information*/

  return (
    <CenterLayout
      noScroll={true}
      content={
        <NFTDetailPopUpWindow
          isGuest={isGuest}
          isPopUpIcon={isPopUpIcon}
          isNFTiconLoading={isNFTiconLoading}
          imgAddress={imgAddress}
          level={""}
          rewardPercentage={rewardPercentage}
          setIsPopUpIcon={setIsPopUpIcon}
        >
          <div className="screen">
            <ProfileTemplate
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isNFTiconLoading={isNFTiconLoading}
              setIsNFTiconLoading={setIsNFTiconLoading}
              setIsPopUpIcon={setIsPopUpIcon}
              isPopUpIcon={isPopUpIcon}
              setImgAddress={setImgAddress}
              setRewardPercentage={setRewardPercentage}
              isMyProfile={true}
              userAccountId={userAccountId}
            />
          </div>
        </NFTDetailPopUpWindow>
      }
      bgImg={false}
      // noScroll={isOpen}
    />
  );
};

export default ProfileTesting;
