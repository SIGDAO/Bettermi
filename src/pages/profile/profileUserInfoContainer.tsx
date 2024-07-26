import * as React from "react";
import UserIcon from "../../components/loadUserIcon";
import { Dispatch } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentIsGuest } from "../../redux/profile";
import { NFTDetailPopUpWindow } from "../../components/popupWindow";
import { GuestConnectWallectButton, PurpleButton } from "../../components/button";
import { displayPopUpMessage } from "../../components/alert";

interface IProfileUserInfoContainerProps {
  isUpdatingUserSetting: boolean;
  isSettingLoading: boolean;
  userAccountId: string;
  fetchName: string;
  fetchAboutYourself: string;
  fetchDescription: string;
  fetchDiscordUsername: string;
  setIsPopUpNFTDetailWinodow: Dispatch<React.SetStateAction<boolean>>;
  setRewardPercentage: Dispatch<React.SetStateAction<string>>;
  setImgAddress: Dispatch<React.SetStateAction<string>>;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  isMyProfile: boolean;
}

export interface NullInfoDisplayProps {
  nullNameString: string;
  nullDescriptString: string;
  nullAboutyourself: string;
  nullDiscordUsername: string;
}

const loadingIcon: JSX.Element = (
  <>
    <div className="profile_icon_nft_-avatar_empty">
      <img className="profile_icon_ic_loading" src="/img/loadingMinting/mimi-dancing-for-loadin-page.gif" alt="ic_add" />
    </div>

    <div className="profile-content-container">
      <div className="profile-content">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  </>
);

const ProfileUserInfoContainer: React.FunctionComponent<IProfileUserInfoContainerProps> = ({
  isUpdatingUserSetting,
  isSettingLoading,
  userAccountId,
  fetchName,
  fetchAboutYourself,
  fetchDescription,
  fetchDiscordUsername,
  setIsPopUpNFTDetailWinodow,
  setRewardPercentage,
  setImgAddress,
  setIsOpen,
  isOpen,
  isMyProfile,
}) => {
  const navigate = useNavigate();
  const isGuest = useSelector(selectCurrentIsGuest);

  const nullInfoDisplay: NullInfoDisplayProps = isMyProfile
    ? {
        nullNameString: "Enter Your Name",
        nullDescriptString: "Please enter DESCRIPTION TO FRIENDS",
        nullAboutyourself: "♉️  |  29  |  PERSONAL TRAINER",
        nullDiscordUsername: "Signum#1234",
      }
    : {
        nullNameString: "Anonymous",
        nullDescriptString: "",
        nullAboutyourself: "",
        nullDiscordUsername: "",
      };

  const toUserNftList = () => {
    if (!isMyProfile) {
      navigate("/indexMyNftList", { state: { userAccountId: userAccountId } });
      return;
    }
    navigate("/indexMyNftList");
  };

  const handleCopyDiscordUsername = (discordUsername) => {
    navigator.clipboard.writeText(discordUsername);
    displayPopUpMessage("Copied !");
  };

  React.useEffect(() => {
    console.log("fetchDiscordUsername", fetchDiscordUsername);
  }, [fetchDiscordUsername]);

  // view for login user
  const loginUserDisplay: JSX.Element = (
    <div className="profile-description-login-user-bg">
      {/* display loading icon when not fetch the user info and userIcon */}
      {/* reminder: fetch the user info and userIcon is going on profileTemplate.tsx */}
      {isUpdatingUserSetting || isSettingLoading ? (
        <>{loadingIcon}</>
      ) : (
        <>
          <UserIcon
            setIsPopUpNFTDetailWinodow={setIsPopUpNFTDetailWinodow}
            profile={true}
            userAccountId={userAccountId}
            setRewardPercentage={setRewardPercentage}
            setEnlargeImageAddress={setImgAddress}
          />
          <div className="profile-content">
            <div className="zoe_li">{fetchName || nullInfoDisplay.nullNameString}</div>
            <div className="perso-container">
              <p className="x29-personal-trainer inter-semi-bold-keppel-15px">{fetchAboutYourself || nullInfoDisplay.nullAboutyourself}</p>
              <p className="im-a-positive-perso" style={fetchDescription ? {} : { color: "#8e8e8e" }}>
                {fetchDescription || nullInfoDisplay.nullDescriptString}
              </p>
            </div>
          </div>
          <div className="x16227">
            <div className="discord-icon">
              <img className="discord-icon-content" src="img/profile/file---11691@1x.png" />
            </div>
            <div className="discord inter-bold-royal-blue-15px">DISCORD</div>
          </div>

          <div className="discord-card-container">
            <div className="card-number inter-normal-white-15px">{fetchDiscordUsername || nullInfoDisplay.nullDiscordUsername}</div>
            {fetchDiscordUsername && (
              <div className="copy-icon" onClick={() => handleCopyDiscordUsername(fetchDiscordUsername)}>
                <img src="img/profile/file---11690@1x.png" alt="" />
              </div>
            )}
          </div>
        </>
      )}
      <div className="button_nft-collections">
        <PurpleButton text={isMyProfile ? "My NFT Collection" : "NFT Collection"} action={() => toUserNftList()} height={"56px"} width={"248px"} />
      </div>
      {isMyProfile && !isSettingLoading && !isUpdatingUserSetting && (
        <div className="ic_edit" onClick={() => setIsOpen(!isOpen)}>
          <img className="ic_edit-content" src="img/profile/ic-edit-1@1x.png" alt="" />
        </div>
      )}
    </div>
  );

  // view for guest
  const guestDisplay: JSX.Element = (
    <div className="profile-description-guest-bg">
      <div className="profile-guest-user-info-image-container" onClick={() => setIsPopUpNFTDetailWinodow(true)}>
        <img src={process.env.PUBLIC_URL + "/img/mimi_guest_sample_stamp_small.png"} alt="" className="profile-guest-user-info-image" />
      </div>
      <div className="inter-semi-bold-white-23px">Get your FREE NFT now !</div>
      <div className="inter-normal-cadet-blue-16px">Receive a FREE NFT membership !</div>
      <div className="profile-guest-user-button-container">
        <GuestConnectWallectButton height={"56px"} width={"248px"} />
        <PurpleButton text={isMyProfile ? "My NFT Collection" : "NFT Collection"} action={() => setIsPopUpNFTDetailWinodow(true)} height={"56px"} width={"248px"} />
      </div>
    </div>
  );

  return isGuest && isMyProfile ? guestDisplay : loginUserDisplay;
};

export default ProfileUserInfoContainer;
