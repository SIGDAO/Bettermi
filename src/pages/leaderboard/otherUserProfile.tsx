import * as React from "react";
import "../profile/profile.css";
import { CenterLayout } from "../../components/layout";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { selectCurrentGender, selectCurrentIsGuest } from "../../redux/profile";
import { accountId } from "../../redux/account";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";
import { GetRewardPercentage } from "../../NftSystem/Reward/getRewardPercentage";
import ProfileTemplate from "../profile/profileTemplate";
import { NFTDetailPopUpWindow } from "../../components/popupWindow";

interface IProfileProps {}

const OtherUserProfileTesting: React.FunctionComponent<IProfileProps> = (props) => {
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const { state } = useLocation();
  const [isPopUpNFTDetailWinodow, setIsPopUpNFTDetailWinodow] = useState<boolean>(false);
  const [isNFTiconLoading, setIsNFTiconLoading] = useState<boolean>(true);
  const [imgAddress, setImgAddress] = useState<string>("");
  const [rewardPercentage, setRewardPercentage] = useState<string>("0");
  const [level,setNFTLevel] = useState<number>(1);

  /* Function to check whether we are updating personal information*/
  // const [isUpdatingUserSetting, setIsUpdatingUserSetting] = useState<boolean>(false);
  // const [isSettingLoading, setIsSettingLoading] = useState<boolean>(true);
  const userAccountId = state.userId;
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const isGuest = useSelector(selectCurrentIsGuest);



  useEffect(() => {
    GetRewardPercentage(ledger2, userAccountId)
      .then((res) => {
        setRewardPercentage(res.rewardPercentage);
        setNFTLevel(res.level);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <CenterLayout
      content={
        <NFTDetailPopUpWindow
          isPopUpNFTDetailWinodow={isPopUpNFTDetailWinodow}
          isNFTiconLoading={isNFTiconLoading}
          imgAddress={imgAddress}
          level={level.toString()}
          rewardPercentage={rewardPercentage}
          setIsPopUpNFTDetailWinodow={setIsPopUpNFTDetailWinodow}
        >
          <div className="screen">
            <ProfileTemplate
              isNFTiconLoading={isNFTiconLoading}
              setIsNFTiconLoading={setIsNFTiconLoading}
              setIsPopUpNFTDetailWinodow={setIsPopUpNFTDetailWinodow}
              isPopUpNFTDetailWinodow={isPopUpNFTDetailWinodow}
              setImgAddress={setImgAddress}
              setRewardPercentage={setRewardPercentage}
              isMyProfile={false}
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

export default OtherUserProfileTesting;
