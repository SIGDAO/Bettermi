import * as React from "react";

import MenuBar from "../../components/menuBar";
import { Link, useNavigate } from "react-router-dom";
import { ShortTitleBar } from "../../components/titleBar";
import { useRef, useState } from "react";
import { useAppSelector } from "../../redux/useLedger";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";
import { useEffect } from "react";
import { accountId, accountPublicKey } from "../../redux/account";
import { useDispatch, useSelector } from "react-redux";
import { profileSlice, selectCurrentAboutYourself, selectCurrentDescription, selectCurrentDiscordUsername, selectCurrentUsername } from "../../redux/profile";
import { CustomInput, RandomGenNameInput } from "../../components/input";
import { CustomTextArea } from "../../components/input";
import { selectCurrentGender } from "../../redux/profile";
import { Alert } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { FindLatestTransactionArray, FindLatestTransactionNumber, IsUserSettingUpdating, p2pTransferNft } from "../../NftSystem/updateUserNftStorage";
import { getNftContractStorage } from "../../redux/account";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import UserIcon from "../../components/loadUserIcon";
import { GetUserNftList } from "../../NftSystem/updateUserNftStorage";
import { IsUserUpdatingDescription } from "../../NftSystem/updateUserNftStorage";
import { IsUserUpdatingIcon } from "../../NftSystem/updateUserNftStorage";
import { UpdateUserDescription } from "../../NftSystem/updateUserNftStorage";
import HorizontalScrollContainer from "../../components/horizontalScrollContainer";
import IPFSImageComponent from "../../components/ipfsImgComponent";

interface IProfileTemplateProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  userAccountId: string;
  setIsPopUpIcon: Function;
  isPopUpIcon?: boolean;
  setIsNFTiconLoading: Function;
  isNFTiconLoading?: boolean;
  setImgAddress: Function;
  setRewardPercentage: (rewardPercentage: string) => void;
  isMyProfile: boolean;
}

interface NftProfile {
  imageAddress: string;
  rewardPercentage: string;
}

const ProfileTemplate: React.FunctionComponent<IProfileTemplateProps> = (props) => {
  const { userAccountId, isPopUpIcon, setIsPopUpIcon, isNFTiconLoading, setIsNFTiconLoading, setImgAddress, setRewardPercentage, isMyProfile } = props;

  // signum related
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const codeHashIdForNft: string = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const userAccountpublicKey = useSelector(accountPublicKey);

  // ini
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // pop up related
  const [alert, setAlert] = useState<boolean>(false); // copy alert
  const [copyAlertCount, setCopyAlertCount] = useState(0);

  const [isOpen, setIsOpen] = useState<boolean>(false); // is open profile edit pop up window
  const [isBackButton, setIsBackButton] = useState<boolean>(false); // set if BackButton is display in profile edit window
  const [isShowStar, setIsShowStar] = useState<boolean>(false);

  // fetch data boolean
  const [isSettingLoading, setIsSettingLoading] = useState<boolean>(true);
  const [isUpdatingUserSetting, setIsUpdatingUserSetting] = useState<boolean>(false);
  const [loadingNft, setLoadingNft] = useState<boolean>(true);
  const [isUpdatingUserIcon, setIsUpdatingUserIcon] = useState<boolean>(false);
  const [isUserIconLoading, setIsUserIconLoading] = useState<boolean>(true);

  //

  // profile info related variable
  const discordUsername = useSelector(selectCurrentDiscordUsername);
  const description = useSelector(selectCurrentDescription);
  const [name, setName] = useState<string>("");
  const [aboutYourselfText, setAboutYourselfText] = useState<string>("");
  const [descriptionText, setDescriptionText] = useState<string>("");
  const [discordUsernameText, setDiscordUsernameText] = useState<string>("");
  const [fetchDescription, setFetchDescription] = useState<string>(""); // Set and fetch info from the chain
  const [fetchName, setFetchName] = useState<string>("");
  const [fetchAboutYourself, setFetchAboutYourself] = useState<string>("");
  const [fetchDiscordUsername, setFetchDiscordUsername] = useState<string>("");
  const nullInfoDisplay = isMyProfile ? {
    nullNameString: "Enter Your Name",
    nullDescriptString: "Please enter DESCRIPTION TO FRIENDS",
    nullAboutyourself: "♉️  |  29  |  PERSONAL TRAINER",
    nullDiscordUsername: "Signum#1234"
  } : {
    nullNameString: "Anonymous",
    nullDescriptString: "",
    nullAboutyourself: "",
    nullDiscordUsername: ""
  }

  // user hold NFTs
  const [myNfts, setMyNfts] = useState<NftProfile[]>([]);

  // fetch/update function
  const fetchSetting = async () => {
    //  const isUserSettingUpdating = await IsUserSettingUpdating(ledger2,userAccountId);
    const isUserUpdatingDescription = await IsUserUpdatingDescription(ledger2, userAccountId);
    const isUserUpdatingUserIcon = await IsUserUpdatingIcon(ledger2, userAccountId);
    if (isUserUpdatingUserIcon === true) {
      // may add it to profile icon loading?
      setIsUpdatingUserIcon(true);
      setIsUserIconLoading(false);
    } else {
      setIsUserIconLoading(false);
    }
    if (isUserUpdatingDescription === true) {
      setIsUpdatingUserSetting(true);
      setIsSettingLoading(false);
    }
    const waitingToBeChangedDescription = await ledger2.account.getAccount({
      accountId: userAccountId,
    });
    let newDes = waitingToBeChangedDescription.description === undefined ? {} : JSON.parse(waitingToBeChangedDescription.description);

    if (!newDes) {
      // error handling for no fetch data
      setIsSettingLoading(false);
      return;
    }

    setFetchName(newDes.nm);
    setFetchDescription(newDes.ds);
    setFetchDiscordUsername(newDes.sc);
    setFetchAboutYourself(newDes.hp);

    setName(newDes.nm);
    setDescriptionText(newDes.ds);
    setDiscordUsernameText(newDes.sc);
    setAboutYourselfText(newDes.hp);

    setIsSettingLoading(false);
  };

  const fetchUserIcon = async () => {
    const isUserSettingUpdating = await IsUserUpdatingIcon(ledger2, userAccountId);
    if (isUserSettingUpdating === true) {
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

  const loadNftList = async () => {
    try {
      const userNftList: NftProfile[] = await GetUserNftList(ledger2, userAccountId, nftDistributor, codeHashIdForNft);
      console.log("userNftList is ", userNftList);
      setMyNfts(userNftList);
      setLoadingNft(false);
    } catch (e: any) {
      console.log(e);
    }
  };

  const uploadToChain = async () => {
    // upload the changed user info to chain
    try {
      const waitingToBeChangedDescription = await ledger2.account.getAccount({
        accountId: userAccountId,
      });
      let newDes = {};
      newDes = Object.assign(newDes, { vs: 1 });
      newDes = Object.assign(newDes, { nm: name });
      newDes = Object.assign(newDes, { ds: aboutYourselfText });
      newDes = Object.assign(newDes, { hp: descriptionText });
      newDes = Object.assign(newDes, { sc: [discordUsernameText] });
      await UpdateUserDescription(ledger2, newDes, userAccountId, userAccountpublicKey, Wallet, name);
    } catch (e: any) {
      console.log(e);
    }
  };

  // function
  const handleCopyDiscordUsername = (discordUsername) => {
    navigator.clipboard.writeText(discordUsername);
    setAlert(true);
    setCopyAlertCount(1);
  };

  const handleSave = async () => {
    if (name.length === 0 || aboutYourselfText.length === 0 || descriptionText.length === 0 || discordUsernameText.length === 0) {
      setIsShowStar(true);
      return;
    }

    if (name === fetchName && aboutYourselfText === fetchAboutYourself && descriptionText === fetchDescription && discordUsernameText === fetchDiscordUsername) {
      setIsOpen((prev) => !prev);
      setIsBackButton(true);
      return;
    }

    uploadToChain();
    dispatch(profileSlice.actions.setUsername(name));
    dispatch(profileSlice.actions.setAboutYourself(aboutYourselfText));
    dispatch(profileSlice.actions.setDescription(descriptionText));
    dispatch(profileSlice.actions.setDiscordUsername(discordUsernameText));
    setIsOpen((prev) => !prev);
    setIsBackButton(true);
  };

  const toUserNftList = () => {
    if (!isMyProfile) {
      navigate("/indexMyNftList", { state: { userAccountId: userAccountId } });
      return;
    }
    navigate("/indexMyNftList");
  };

  const displayName = () => {
    if (isMyProfile) {
      return fetchName || name || "Enter Your Name"
    }
    return 
  }

  // useEffect
  useEffect(() => {
    const countdown = () => {
      if (copyAlertCount > 0) {
        setCopyAlertCount((prevCount) => prevCount - 1);
      }
      if (copyAlertCount === 0) {
        setAlert(false);
      }
    };

    const timer = setInterval(countdown, 1000);

    return () => clearInterval(timer);
  }, [copyAlertCount]);

  useEffect(() => {
    try {
      if (userAccountId && loadingNft) {
        loadNftList();
      }
    } catch (error) {
      console.log("");
    }
  }, [userAccountId]);

  useEffect(() => {
    fetchSetting();
    fetchUserIcon();
  }, []);

  return (
    <div
      className="bettermidapp-profile-3"
      style={{
        height: `${isOpen ? "100vh" : "844px"}`,
      }}
      // onWheel={handleScroll2}
    >
      <ShortTitleBar title="Profile" />
      {alert && (
        <Alert className="copied-alert" icon={<CheckIcon fontSize="inherit" />} severity="success">
          Copied!
        </Alert>
      )}

      <div className="overlap-group5">
        <div className="overlap-design-layout">
          <div className="profile-description-bg">
            {isUpdatingUserSetting === true || isSettingLoading === true ? (
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
            ) : (
              <>
                <UserIcon setIsPopUpIcon={setIsPopUpIcon} profile={true} userAccountId={userAccountId} setRewardPercentage={setRewardPercentage} setEnlargeImageAddress={setImgAddress}></UserIcon>
                {/* <div className="profile-content-container">
            </div> */}
                <div className="profile-content">
                  <div className="zoe_li">{fetchName ? fetchName : name || nullInfoDisplay.nullNameString }</div>
                  <div className="perso-container">
                    <p className="x29-personal-trainer inter-semi-bold-keppel-15px">{fetchAboutYourself ? fetchAboutYourself : aboutYourselfText || nullInfoDisplay.nullAboutyourself}</p>
                    <p className="im-a-positive-perso" style={description ? {} : { color: "#8e8e8e" }}>
                      {fetchDescription ? fetchDescription : descriptionText || nullInfoDisplay.nullDescriptString}
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
                  <div className="card-number inter-normal-white-15px">{fetchDiscordUsername ? fetchDiscordUsername : discordUsernameText || nullInfoDisplay.nullDiscordUsername }</div>
                  {fetchDiscordUsername && 
                  <div className="copy-icon" onClick={() => handleCopyDiscordUsername(discordUsername)}>
                    <img src="img/profile/file---11690@1x.png" alt="" />
                  </div>}
                </div>
              </>
            )}
              <div className="button_nft-collections" onClick={() => toUserNftList()}>
                <div className="continue-profile inter-semi-bold-white-15px">{isMyProfile ? "My NFT Collection" : "NFT Collection"}</div>
              </div>
            {isMyProfile && (
              <div className="ic_edit" onClick={() => setIsOpen(!isOpen)}>
                <img className="ic_edit-content" src="img/profile/ic-edit-1@1x.png" alt="" />
              </div>
            )}
          </div>
          {/* This is the new horizontal scroll */}
          <HorizontalScrollContainer
            inputClassName="profileHorizontalScroll"
            style={{
              backgroundColor: "inherit",
              width: "390px",
              height: "45%",
              overflowY: "scroll",
            }}
            // onWheel={handleScroll}
          >
            <div
              style={{
                width: "152px",
                height: "217px",
                display: "flex",
              }}
              // onWheel={handleScroll}
            >
              <Link to="/allNftList/">
                <img className="profileBuyNft" src="img/profile/NftMarketplaceBanner.png"></img>
              </Link>
              {loadingNft === true ? (
                <>
                  <img
                    src={"/img/loadingMinting/mimi-dancing-for-loadin-page.gif"}
                    style={{
                      width: "152px",
                      height: "217px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  {/* <div className="minting-JdJl2l inter-normal-white-15px">loading your NFTs</div>
            <div className="reminder-text-1 inter-normal-white-15px">Please wait patiently<br/>and do not refresh the page</div> */}
                </>
              ) : (
                myNfts.map((MyNft) => (
                  <img
                    onClick={() => {
                      setIsPopUpIcon(true);
                      setImgAddress(MyNft.imageAddress);
                      setRewardPercentage(MyNft.rewardPercentage);
                    }}
                    src={`https://ipfs.io/ipfs/${MyNft.imageAddress}`}
                    style={{
                      width: "152px",
                      height: "217px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                ))
              )}
            </div>
          </HorizontalScrollContainer>
        </div>

        {/* This is the old horizontal scroll */}
      </div>
      {isOpen && isMyProfile && (
        <div className="edit-profile-layer">
          <div className="icon-arrow-left-1-popup icon-arrow-left-3-popup" onClick={() => setIsOpen((prev) => !prev)}>
            {isBackButton && <img className="icon-arrow-left-popup" src="img/profile/icon-arrow-left-1@1x.png" alt="icon-arrow-left" />}
          </div>
          <div className="edit-profile">
            <div className="overlap-group-1-popup inter-bold-royal-blue-15px">
              <img className="seperate-line" src="img/profile/seperate-line-1@1x.png" alt="Seperate line" />
              <img className="bg" src="img/profile/bg-7@1x.png" alt="BG" />
              <img className="seperat-line" src="img/profile/seperat-line-3@1x.png" alt="Seperat line" />
              <div className="pick-a-username">PICK A USERNAME</div>
              <div className="about-yourself">ABOUT YOURSELF</div>
              <div className="description-to-friends">DESCRIPTION TO FRIENDS</div>
              <div className="rewards">
                <div className="ic_edit-1">
                  <img className="ic_edit-1-content" src="img/profile/ic-edit-1@1x.png" alt="" />
                </div>
                <div className="edit-profile-1 inter-semi-bold-white-18px">Edit Profile</div>
              </div>
              <div className="search_bar">
                <RandomGenNameInput
                  name={name}
                  setName={setName}
                  width={300}
                  // ref={(el) => (inputRefs.current[0] = el)}
                />
              </div>
              <div className="search_bar-1 search_bar-4">
                <CustomTextArea
                  importClassName="inter-semi-bold-keppel-15px"
                  text={aboutYourselfText}
                  setText={setAboutYourselfText}
                  width={300}
                  placeholder="♉️  |  29  |  PERSONAL TRAINER"
                  // ref={(el) => (inputRefs.current[1] = el)}
                />
              </div>
              <div className="search_bar-2 search_bar-4">
                <CustomTextArea
                  importClassName="inter-normal-white-15px"
                  text={descriptionText}
                  setText={setDescriptionText}
                  width={300}
                  placeholder="I'm a positive person. I love to travel and eat."
                  // ref={(el) => (inputRefs.current[2] = el)}
                />
              </div>
              <div className="search_bar-3 search_bar-4">
                <CustomInput
                  importClassName={"inter-normal-white-15px"}
                  text={discordUsernameText}
                  setText={setDiscordUsernameText}
                  width={300}
                  placeholder="Signum#1234"
                  // ref={(el) => (inputRefs.current[3] = el)}
                />
              </div>
              <div className="button_save" onClick={() => handleSave()}>
                <div className="continue-1 inter-semi-bold-white-15px">Done!</div>
              </div>
              <div className="x16227-1">
                <div className="discord-icon">
                  <img className="discord-icon-content" src="img/profile/file---11691@1x.png" />
                </div>
                <div className="discord-username inter-bold-royal-blue-15px">DISCORD USERNAME</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <MenuBar />
    </div>
  );
};

export default ProfileTemplate;
