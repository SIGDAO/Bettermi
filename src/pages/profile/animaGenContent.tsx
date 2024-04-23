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

interface myNftProfile {
  imageAddress: string;
  rewardPercentage: string;
}
interface IAnimaGenContentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isBackButton: boolean;
  setIsBackButton: (isBackButton: boolean) => void;
  isUpdating?: boolean;
  isUpdatingUserSetting?: boolean;
  setIsPopUpIcon: Function;
  isPopUpIcon?: boolean;
  setIsNFTiconLoading: Function;
  isNFTiconLoading?: boolean;
  setImgAddress: Function;
  setRewardPercentage: (rewardPercentage: string) => void;
}
interface myNftList {
  level: string;
  image: string;
  nftId: string;
}

const AnimaGenContent: React.FunctionComponent<IAnimaGenContentProps> = (props) => {
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const userId = useSelector(accountId);
  const username = useSelector(selectCurrentUsername);
  const userAccountpublicKey = useSelector(accountPublicKey);
  const discordUsername = useSelector(selectCurrentDiscordUsername);
  const description = useSelector(selectCurrentDescription);
  const aboutYourself = useSelector(selectCurrentAboutYourself);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gender = useSelector(selectCurrentGender);
  const userAccountId = useSelector(accountId);
  const { isOpen, setIsOpen, isBackButton, setIsBackButton, isPopUpIcon, setIsPopUpIcon, isNFTiconLoading, setIsNFTiconLoading, setImgAddress, setRewardPercentage } = props;
  const [name, setName] = useState<string>(username);
  const [haveNft, setHaveNft] = useState<boolean>(false);
  const [aboutYourselfText, setAboutYourselfText] = useState<string>(aboutYourself);
  const [descriptionText, setDescriptionText] = useState<string>(description);
  const [discordUsernameText, setDiscordUsernameText] = useState<string>(discordUsername);
  const [showStar, setShowStar] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  // const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const countdown = () => {
      if (count > 0) {
        setCount((prevCount) => prevCount - 1);
      }
      if (count === 0) {
        setAlert(false);
      }
    };

    const timer = setInterval(countdown, 1000);

    return () => clearInterval(timer);
  }, [count]);

  const uploadToChain = async () => {
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

  const handleSave = async () => {
    if (name.length === 0 || aboutYourselfText.length === 0 || descriptionText.length === 0 || discordUsernameText.length === 0) {
      setShowStar(true);
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

  const handleCopyDiscordUsername = (discordUsername) => {
    navigator.clipboard.writeText(discordUsername);
    setAlert(true);
    setCount(1);
    // todo: display a message to tell the user that the username has been copied to clipboard
    // alert("Copied to clipboard!");
  };

  const handleCancel = () => {
    setIsOpen((prev) => !prev);
  };

  const [loadingNft, setLoadingNft] = useState<boolean>(true);
  const [myNfts, setMyNfts] = useState<myNftProfile[]>([]);
  const nftContractStorage = useSelector(getNftContractStorage);
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const codeHashIdForNft: string = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const nftLoaded = useRef(false);
  var nft: myNftList;
  var userNftList: myNftProfile[] = [];
  const loadNftList = async () => {
    try {
      userNftList = await GetUserNftList(ledger2, userAccountId, nftDistributor, codeHashIdForNft);
      setMyNfts(userNftList);
      setLoadingNft(false);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (nftLoaded.current === true) {
    } else {
      nftLoaded.current = true;
      loadNftList();
    }
  }, [nftContractStorage]);

  const handleScroll = (event: any) => {
    const container = document.querySelector("div.profileHorizontalScroll")!;
    const scrollAmount = event.deltaY;

    // window.onscroll = function() {
    //   window.scrollTo({left:0, top:-scrollAmount});
    // };
    container.scrollTo({
      top: 0,
      left: container.scrollLeft + scrollAmount,
    });
  };

  //Set and fetch info from the chain
  const [fetchDescription, setFetchDescription] = useState<string>("");
  const [fetchName, setFetchName] = useState<string>("");
  const [fetchAboutYourself, setFetchAboutYourself] = useState<string>("");
  const [fetchDiscordUsername, setFetchDiscordUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmptyProfile, setIsEmptyProfile] = useState<boolean>(false);

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

  const fetchProfile = async () => {
    const account = await ledger2.account.getAccount({
      accountId: userAccountId,
    });

    //    let newDes =waitingToBeChangedDescription.description===undefined?"":JSON.parse(waitingToBeChangedDescription.description);
    if (account.description === undefined) {
      setIsLoading(false);
      setIsEmptyProfile(true);
    } else {
      const description = JSON.parse(account.description);
      setFetchName(description.nm);
      setFetchAboutYourself(description.hp);
      setFetchDiscordUsername(description.sc[0]);
      setFetchDescription(description.ds);
      setIsLoading(false);
    }
  };

  /*Ends here*/

  const handleScroll2 = (event: any) => {
    const container = event.target!;
    const scrollAmount = event.deltaY;
    container.scrollTo({
      top: 0,
      left: container.scrollLeft + scrollAmount,
    });
  };

  const [isSettingLoading, setIsSettingLoading] = useState<boolean>(true);
  const [isUpdatingUserSetting, setIsUpdatingUserSetting] = useState<boolean>(false);
  //const [isUpdatingUserDescription, setIsUpdatingUserDescription] = useState<boolean>(false);
  const [isUpdatingUserIcon, setIsUpdatingUserIcon] = useState<boolean>(false);
  const [isUserIconLoading, setIsUserIconLoading] = useState<boolean>(true);
  const fetchSetting = async () => {
    //  const isUserSettingUpdating = await IsUserSettingUpdating(ledger2,userAccountId);
    const isUserUpdatingDescription = await IsUserUpdatingDescription(ledger2, userAccountId);
    const isUserUpdatingUserIcon = await IsUserUpdatingIcon(ledger2, userAccountId);
    if (isUserUpdatingUserIcon === true) {
      setIsUpdatingUserIcon(true);
      setIsUserIconLoading(false);
    } else {
      setIsUserIconLoading(false);
    }
    if (isUserUpdatingDescription === true) {
      setIsUpdatingUserSetting(true);
      setIsSettingLoading(false);
    }
    // if(isUserSettingUpdating === true){
    //   setIsUpdatingUserSetting(true);
    //   setIsSettingLoading(false);
    //   return;
    // }
    const waitingToBeChangedDescription = await ledger2.account.getAccount({
      accountId: userAccountId,
    });
    let newDes = waitingToBeChangedDescription.description === undefined ? {} : JSON.parse(waitingToBeChangedDescription.description);

    if (newDes.nm == null) {
      setFetchName("");
    } else {
      setFetchName(newDes.nm);
    }
    if (newDes.ds == null) {
      setFetchDescription("");
    } else {
      setFetchDescription(newDes.ds);
    }
    if (newDes.sc == null) {
      setFetchDiscordUsername("");
    } else {
      setFetchDiscordUsername(newDes.sc[0]);
    }
    if (newDes.hp == null) {
      setFetchAboutYourself("");
    } else {
      setFetchAboutYourself(newDes.hp);
    }
    setIsSettingLoading(false);
  };

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
                  <div className="zoe_li">{fetchName ? fetchName : name || "Enter your name"}</div>
                  <div className="perso-container">
                    <p className="x29-personal-trainer inter-semi-bold-keppel-15px">{fetchAboutYourself ? fetchAboutYourself : aboutYourselfText || `♉️  |  29  |  PERSONAL TRAINER`}</p>
                    <p className="im-a-positive-perso" style={description ? {} : { color: "#8e8e8e" }}>
                      {fetchDescription ? fetchDescription : descriptionText || "Please enter DESCRIPTION TO FRIENDS"}
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
                  <div className="card-number inter-normal-white-15px">{fetchDiscordUsername ? fetchDiscordUsername : discordUsernameText || "Signum#1234"}</div>
                  <div className="copy-icon" onClick={() => handleCopyDiscordUsername(discordUsername)}>
                    <img src="img/profile/file---11690@1x.png" alt="" />
                  </div>
                </div>
              </>
            )}
            <Link to="/indexMyNftList">
              <div className="button_nft-collections">
                <div className="continue-profile inter-semi-bold-white-15px">My NFT Collection</div>
              </div>
            </Link>
            <div className="ic_edit" onClick={() => setIsOpen(!isOpen)}>
              <img className="ic_edit-content" src="img/profile/ic-edit-1@1x.png" alt="" />
            </div>
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
                <img className="profileBuyNft" src="img/profile/NftMarketplaceBanner.png">
                  {/* <img className="ic_add" src="img/profile/ic-add-2@1x.png" alt="ic_add" /> */}
                  {/* <p className="inter-semi-bold-white-12px ">Buy NFT</p> */}
                </img>
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

        {/* <div className="x3">
          <Link to="/allNftList/">
            <div className="overlap-group-profile">
              <img className="add" src="img/profile/add-2@1x.png" alt="Add" />
              <img
                className="ic_add"
                src="img/profile/ic-add-2@1x.png"
                alt="ic_add"
              />
            </div>
          </Link>
          <div className="x24">
            <img
              className="x24-item"
              src="img/profile/nft-1@1x.png"
              alt="NFT"
            />
            <img
              className="x24-item"
              src="img/profile/nft-1@1x.png"
              alt="NFT"
            />
            <img
              className="x24-item"
              src="img/profile/nft-1@1x.png"
              alt="NFT"
            />
          </div>
        </div> */}
      </div>
      {isOpen && (
        <div className="edit-profile-layer">
          <div className="icon-arrow-left-1-popup icon-arrow-left-3-popup" onClick={() => handleCancel()}>
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
                {/* <p className="card-number-3 inter-semi-bold-keppel-15px">
                  ♉️&nbsp;&nbsp;|&nbsp;&nbsp;29&nbsp;&nbsp;|&nbsp;&nbsp;PERSONAL TRAINER
                </p> */}
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
                {/* <p className="card-number-4 inter-normal-white-15px">I'm a positive person. I love to travel and eat.</p> */}
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
                {/* <div className="card-number-5 inter-normal-white-15px">zoeeeee#1234</div> */}
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

export default AnimaGenContent;
