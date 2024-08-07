import * as React from "react";

import MenuBar from "../../components/menuBar";
import { Link, useNavigate } from "react-router-dom";
import { ShortTitleBar } from "../../components/titleBar";
import { Dispatch, useRef, useState } from "react";
import { useAppSelector } from "../../redux/useLedger";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  profileSlice,
  selectCurrentAboutYourself,
  selectCurrentDescription,
  selectCurrentDiscordUsername,
  selectCurrentIsGuest,
  selectCurrentIsNewUser,
  selectCurrentUsername,
} from "../../redux/profile";
import { Alert } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import UserIcon from "../../components/loadUserIcon";
import { GetUserNftList } from "../../NftSystem/updateUserNftStorage";
import { IsUserUpdatingDescription } from "../../NftSystem/updateUserNftStorage";
import { IsUserUpdatingIcon } from "../../NftSystem/updateUserNftStorage";
import { UpdateUserDescription } from "../../NftSystem/updateUserNftStorage";
import HorizontalScrollContainer from "../../components/horizontalScrollContainer";
import IPFSImageComponent from "../../components/ipfsImgComponent";
import EditProfilePopUpWindow from "./editProfilePopUpWindow";
import ProfileUserInfoContainer from "./profileUserInfoContainer";
import UserNFTList from "./userNFTList";
import { BlackAlert } from "../../components/alert";

interface IProfileTemplateProps {
  previousPath?: string;
  userAccountId: string;
  setIsPopUpNFTDetailWinodow: Dispatch<React.SetStateAction<boolean>>;
  isPopUpNFTDetailWinodow?: boolean;
  setIsNFTiconLoading: Dispatch<React.SetStateAction<boolean>>;
  isNFTiconLoading?: boolean;
  setImgAddress: Dispatch<React.SetStateAction<string>>;
  setRewardPercentage: Dispatch<React.SetStateAction<string>>;
  isMyProfile: boolean;
}

interface NftProfile {
  imageAddress: string;
  rewardPercentage: string;
}

export async function getUserUpdatingDescription(ledger2: any, userAccountId: string): Promise<object> {
  const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);
  //console.log(messages);
  for (var i = 0; i < messages.unconfirmedTransactions.length; i++) {
    if (messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId) {
      const newDescription = JSON.parse(messages.unconfirmedTransactions[i].attachment.description);
      return newDescription;
    }
  }
  return {};
}

export const getTheContentOfArray = (array: any) => {
  const str = JSON.stringify(array); // Convert array to string
  const match = str.match(/"([^"]+)"/); // Use regex to match the value within double quotes
  const value = match ? match[1] : "";
  return value;
};

const ProfileTemplate: React.FunctionComponent<IProfileTemplateProps> = (props) => {
  const { previousPath, userAccountId, isPopUpNFTDetailWinodow, setIsPopUpNFTDetailWinodow, isNFTiconLoading, setIsNFTiconLoading, setImgAddress, setRewardPercentage, isMyProfile } = props;

  const isGuest = useAppSelector(selectCurrentIsGuest);
  const isNewUser = useSelector(selectCurrentIsNewUser);

  // signum related
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });

  // initialize hooks from library
  const dispatch = useDispatch();

  // pop up window related
  const [isOpen, setIsOpen] = useState<boolean>(false); // is open profile edit pop up window
  const [isBackButton, setIsBackButton] = useState<boolean>(false); // set if BackButton is display in profile edit window

  // fetch data boolean
  const [isSettingLoading, setIsSettingLoading] = useState<boolean>(true);
  const [isUpdatingUserSetting, setIsUpdatingUserSetting] = useState<boolean>(false);
  // const [loadingNft, setLoadingNft] = useState<boolean>(true);

  // profile info related variable
  const fetchDescription = useSelector(selectCurrentDescription);
  const fetchName = useSelector(selectCurrentUsername);
  const fetchAboutYourself = useSelector(selectCurrentAboutYourself);
  const fetchDiscordUsername = useSelector(selectCurrentDiscordUsername);

  // user hold NFTs
  const [myNfts, setMyNfts] = useState<NftProfile[]>([]);

  // fetch/update function
  const fetchSetting = async () => {
    let newDes: object = {};
    const isUserUpdatingDescription = await IsUserUpdatingDescription(ledger2, userAccountId);

    // const isUserSettingUpdating = await IsUserSettingUpdating(ledger2,userAccountId);
    // const isUserUpdatingUserIcon = await IsUserUpdatingIcon(ledger2, userAccountId);
    // if (isUserUpdatingUserIcon === true) {
    //   // may add it to profile icon loading?
    //   setIsUpdatingUserIcon(true);
    //   setIsUserIconLoading(false);
    // } else {
    //   setIsUserIconLoading(false);
    // }

    // if user is updating description, show the unconfirmed transaction description first
    // if not, show the confirmed transaction description
    if (isUserUpdatingDescription === true) {
      newDes = await getUserUpdatingDescription(ledger2, userAccountId);
      // setIsUpdatingUserSetting(true);
      // setIsSettingLoading(false);
    } else {
      const waitingToBeChangedDescription = await ledger2.account.getAccount({
        accountId: userAccountId,
      });
      newDes = waitingToBeChangedDescription.description === undefined ? {} : JSON.parse(waitingToBeChangedDescription.description);
    }

    if (!newDes || Object.keys(newDes).length === 0) {
      // error handling for no fetch data
      setIsSettingLoading(false);
      return;
    }

    // set profile info, if no data, set to empty string
    dispatch(profileSlice.actions.setUsername((newDes as { nm?: string }).nm ?? ""));
    dispatch(profileSlice.actions.setDescription((newDes as { ds?: string }).ds ?? ""));
    dispatch(profileSlice.actions.setAboutYourself((newDes as { hp?: string }).hp ?? ""));

    // hot fix for discord username is array
    if (newDes.hasOwnProperty("sc") && typeof newDes.sc === "object") {
      dispatch(profileSlice.actions.setDiscordUsername(getTheContentOfArray(newDes.sc)));
    } else {
      dispatch(profileSlice.actions.setDiscordUsername((newDes as { sc?: string }).sc ?? ""));
    }

    setIsSettingLoading(false);
  };

  const fetchUserIcon = async () => {
    const isUserSettingUpdating = await IsUserUpdatingIcon(ledger2, userAccountId);
    if (isUserSettingUpdating) {
      setIsNFTiconLoading(false);
    } else {
      ledger2.account
        .getAccount({ accountId: userAccountId })
        .then((account) => {
          const description = JSON.parse(account.description);

          setImgAddress(Object.keys(description.av)[0]);
          setIsNFTiconLoading(false);
        })
        .catch((error) => {
          setIsNFTiconLoading(false);
        });
    }
  };


  // open the profile edit pop up window if the previous path is customizeYourProfile
  const checkIsPrevPathIsCustomizeYourProfile = () => {

    console.log("isNewUser", isNewUser);
    // if (previousPath && previousPath === "/customizeYourProfile") {
    if (isNewUser) {
      setIsOpen(true);
      setIsBackButton(false);
      dispatch(profileSlice.actions.clearIsNewUser());
      return;
      // window.history.replaceState({}, document.title);
    }
    setIsBackButton(true);
  };

  useEffect(() => {
    // don't fetch data if user is guest
    if (isGuest && isMyProfile) return;

    fetchSetting();
    fetchUserIcon();
    checkIsPrevPathIsCustomizeYourProfile();
  }, []);


  return (
    <div
      className="bettermidapp-profile-3"
      style={{
        overflowY: `${isOpen ? "hidden" : "scroll"}`,
      }}
    >
      <ShortTitleBar title="Profile" aiCoach={true} setting={true} />
      <BlackAlert />
      <div className="overlap-design-layout">
        <ProfileUserInfoContainer
          isUpdatingUserSetting={isUpdatingUserSetting}
          isSettingLoading={isSettingLoading}
          userAccountId={userAccountId}
          fetchName={fetchName}
          fetchAboutYourself={fetchAboutYourself}
          fetchDescription={fetchDescription}
          fetchDiscordUsername={fetchDiscordUsername}
          setIsPopUpNFTDetailWinodow={setIsPopUpNFTDetailWinodow}
          setRewardPercentage={setRewardPercentage}
          setImgAddress={setImgAddress}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          isMyProfile={isMyProfile}
        />
        <UserNFTList
          userAccountId={userAccountId}
          ledger2={ledger2}
          setIsPopUpNFTDetailWinodow={setIsPopUpNFTDetailWinodow}
          setImgAddress={setImgAddress}
          setRewardPercentage={setRewardPercentage}
          isMyProfile={isMyProfile}
        />
      </div>
      {/* render the EditProfilePopUpWindow only when this is login user and this is not other user profile */}
      {!isGuest && isMyProfile && (
        <EditProfilePopUpWindow
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isBackButton={isBackButton}
          setIsBackButton={setIsBackButton}
          fetchDescription={fetchDescription}
          fetchName={fetchName}
          fetchAboutYourself={fetchAboutYourself}
          fetchDiscordUsername={fetchDiscordUsername}
          ledger2={ledger2}
          userAccountId={userAccountId}
          Wallet={Wallet}
        />
      )}
      <MenuBar />
    </div>
  );
};

export default ProfileTemplate;
