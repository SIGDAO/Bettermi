import * as React from "react";
import MenuBar from "../../components/menuBar";
import { Link, useNavigate } from "react-router-dom";
import { ShortTitleBar } from "../../components/titleBar";
import { useRef, useState } from "react";
import { useAppSelector } from "../../redux/useLedger";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";
import { useEffect } from "react";
import { accountPublicKey } from "../../redux/account";
import { useDispatch, useSelector } from "react-redux";
import { profileSlice, selectCurrentAboutYourself, selectCurrentDescription, selectCurrentDiscordUsername, selectCurrentUsername } from "../../redux/profile";
import { CustomInput, RandomGenNameInput } from "../../components/input";
import { CustomTextArea } from "../../components/input";
import { selectCurrentGender } from "../../redux/profile";
import { Alert } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { FindLatestTransactionArray, FindLatestTransactionNumber, GetUserNftList, IsUserSettingUpdating, p2pTransferNft } from "../../NftSystem/updateUserNftStorage";
import { getNftContractStorage } from "../../redux/account";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import UserIcon from "../../components/loadUserIcon";
import { useLocation } from "react-router-dom";
import CSS from "csstype";

interface IAnimaGenContentProps {}
interface myNftList {
  level: string;
  image: string;
  nftId: string;
}

const OtherUserProfile: React.FunctionComponent<IAnimaGenContentProps> = (props) => {
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const username = useSelector(selectCurrentUsername);
  const userAccountpublicKey = useSelector(accountPublicKey);
  const discordUsername = useSelector(selectCurrentDiscordUsername);
  const description = useSelector(selectCurrentDescription);
  const aboutYourself = useSelector(selectCurrentAboutYourself);
  const gender = useSelector(selectCurrentGender);
  //const { isOpen, setIsOpen, isBackButton, setIsBackButton,accountId } = props;
  const [imgAddress, setImgAddress] = useState<string>("");
  const [name, setName] = useState<string>(username);
  const [haveNft, setHaveNft] = useState<boolean>(false);
  const [aboutYourselfText, setAboutYourselfText] = useState<string>(aboutYourself);
  const [descriptionText, setDescriptionText] = useState<string>(description);
  const [discordUsernameText, setDiscordUsernameText] = useState<string>(discordUsername);
  const [showStar, setShowStar] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [isPopUpIcon, setIsPopUpIcon] = useState<boolean>(false);
  const [selectedNftId,setSelectedNft] = useState<string>("");
  // const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [count, setCount] = useState(0);
  const location = useLocation();
  const userAccountId = location.state.userId;
  const navigate = useNavigate();
  const handleCopyDiscordUsername = (discordUsername) => {
    navigator.clipboard.writeText(discordUsername);
    setAlert(true);
    setCount(1);
    // todo: display a message to tell the user that the username has been copied to clipboard
    // alert("Copied to clipboard!");
  };

  const [loadingNft, setLoadingNft] = useState<boolean>(true);
  const [myNfts, setMyNfts] = useState<string[]>([]);
  const nftContractStorage = useSelector(getNftContractStorage);
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const nftDistributorPublicKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PUBLIC_KEY!;
  const nftDistributorPrivateKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PRIVATE_KEY!;
  const codeHashIdForNft: string = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const nftListLoaded = useRef(false);
  var nft: myNftList;
  var userNftList: string[] = [];
  const loadNftList = async () => {
    try {
      console.log(userAccountId);
      userNftList = await GetUserNftList(ledger2, userAccountId, nftDistributor, codeHashIdForNft);
      setMyNfts(userNftList);
      console.log(myNfts);
      setLoadingNft(false);
      console.log(userNftList);
      console.log(userNftList[0]);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (nftListLoaded.current === true) {
      console.log("loaded nft");
    } else {
      console.log("loading NFT");
      nftListLoaded.current = true;
      loadNftList();
    }
  }, [userAccountId]);

  const handleScroll = (event: any) => {
    console.log(event);
    const container = document.querySelector("div.profileHorizontalScroll")!;
    console.log(container);
    const scrollAmount = event.deltaY;

    // window.onscroll = function() {
    //   window.scrollTo({left:0, top:-scrollAmount});
    // };
    console.log(container.scrollLeft);
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

  /*Ends here*/

  const handleScroll2 = (event: any) => {
    console.log(event);
    const container = event.target!;
    console.log(container);
    const scrollAmount = event.deltaY;
    console.log(scrollAmount);
    container.scrollTo({
      top: 0,
      left: container.scrollLeft + scrollAmount,
    });
  };

  const [isSettingLoading, setIsSettingLoading] = useState<boolean>(true);
  const [isUpdatingUserSetting, setIsUpdatingUserSetting] = useState<boolean>(false);
  const fetchSetting = async (userAccountId: string) => {
    console.log(userAccountId);
    const isUserSettingUpdating = await IsUserSettingUpdating(ledger2, userAccountId);
    if (isUserSettingUpdating === true) {
      setIsUpdatingUserSetting(true);
      setIsSettingLoading(false);
      return;
    }
    const waitingToBeChangedDescription = await ledger2.account.getAccount({ accountId: userAccountId });
    let newDes = waitingToBeChangedDescription.description === undefined ? {} : JSON.parse(waitingToBeChangedDescription.description);
    if (newDes.nm == null) {
      console.log("called newDes.nm == null here");
      setFetchName("");
    } else {
      console.log("called newDes.nm else here");
      setFetchName(newDes.nm);
    }
    if (newDes.ds == null) {
      console.log("called newDes.ds == null here");
      setFetchDescription("");
    } else {
      console.log("called newDes.ds else here");
      setFetchDescription(newDes.ds);
    }
    if (newDes.sc == null) {
      console.log("called newDes.sc[0] == null here");
      setFetchDiscordUsername("");
    } else {
      console.log("called newDes.sc[0] else here");
      setFetchDiscordUsername(newDes.sc[0]);
    }
    if (newDes.hp == null) {
      console.log("called newDes.hp == null here");
      setFetchAboutYourself("");
    } else {
      console.log("called newDes.hp else here");
      setFetchAboutYourself(newDes.hp);
    }
    console.log("isSetting");
    setIsSettingLoading(false);
  };

  useEffect(() => {
    //while(location.state.accountId == null){console.log("waiting for location.state.accountId");}
    console.log(location.state.userId);
    fetchSetting(userAccountId);
  }, []);

  let height: string | number;
  let width: string | number;
  const mobile = process.env.REACT_APP_MOBILE === "true";

  // display in iphone 12 pro size

  if (mobile) {
    height = "844px";
    width = "390px";
    // display in ipad air size
  } else {
    height = "100vh";
    width = "820px";
  }

  const bgStyle: CSS.Properties = mobile
    ? {
        background: `transparent`,
      }
    : {
        position: "fixed",
        background: `linear-gradient(to bottom right, #221D4B, #171717)`,
        width: "100vw",
        minHeight: "100vh",
        height: "100%",
        overflowY: "auto",
        zIndex: "1",
        overflowX: "hidden",
      };

  const centerLayoutStyle: CSS.Properties = {
    // 'backgroundPosition': 'center',
    minHeight: `${height}`, // ipad size
    width: `${width}`, // ipad size
    height: "100%",
    margin: "auto",
    // 'display': 'flex',
    // 'justifyContent': 'center',
    // 'alignItems': 'center',
  };

  const toUserNftList = () => {
    navigate("/indexMyNftList", { state: { userAccountId: userAccountId } });
  };

  return (
    <div style={bgStyle}>
      <div style={centerLayoutStyle}>
        {isPopUpIcon===false ? (
          <div className="screen">
            <div
              className="bettermidapp-profile-3"
              style={{
                height: `${userAccountId ? "100vh" : "844px"}`,
              }}
              onWheel={handleScroll2}
            >
              <ShortTitleBar title="Profile" />
              {alert && (
                <Alert className="copied-alert" icon={<CheckIcon fontSize="inherit" />} severity="success">
                  Copied!
                </Alert>
              )}

              <div className="overlap-group5">
                <div className="overlap-group1-profile">
                  <img className="layer" src="img/profile/layer-1@1x.png" alt="Layer" />
                  <div className="button_nft-collections" onClick={() => toUserNftList()}>
                    <div className="continue-profile inter-semi-bold-white-15px">My NFT Collections</div>
                  </div>
                  {isSettingLoading === true || isUpdatingUserSetting === true ? (
                    <>
                      <div className="profile_icon_nft_-avatar_empty">
                        <img className="profile_icon_ic_add" src="/img/loadingMinting/mimi-dancing-for-loadin-page.gif" alt="ic_add" />
                      </div>
                      <div className="profile-content">
                        {/* <img
                        src={"/img/loadingMinting/mimi-dancing-for-loadin-page.gif"}
                        style={{
                          width: '152px',
                          height: '217px',
                          marginRight: '10px',
                          zIndex:100,
                        }}
                      /> */}
                        <div className="lds-ring">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="profile-content">
                        <div className="zoe_li">{fetchName ? fetchName : name || "zoe_li"}</div>
                        <div className="perso-container">
                          <p className="im-a-positive-perso" style={description ? {} : { color: "#8e8e8e" }}>
                            {fetchDescription ? fetchDescription : descriptionText || "Please enter DESCRIPTION TO FRIENDS"}
                          </p>
                          <p className="x29-personal-trainer inter-semi-bold-keppel-15px">{fetchAboutYourself ? fetchAboutYourself : aboutYourselfText || `♉️  |  29  |  PERSONAL TRAINER`}</p>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="x16227">
                    <div className="discord-icon">
                      <img className="discord-icon-content" src="img/profile/file---11691@1x.png" />
                    </div>
                    <div className="discord inter-bold-royal-blue-15px">DISCORD</div>
                  </div>

                  <UserIcon setSelectedNft={setSelectedNft} setIsPopUpIcon={setIsPopUpIcon} profile={true} userAccountId={userAccountId}></UserIcon>
                  {isSettingLoading === true || isUpdatingUserSetting === true ? (
                    <div></div>
                  ) : (
                    <div className="discord-card-container">
                      <div
                        className="card-number inter-normal-white-15px"
                        // style={{position: 'absolute',}}
                      >
                        {fetchDiscordUsername ? fetchDiscordUsername : discordUsernameText || "zoeeeee#1234"}
                      </div>

                      <div
                        className="copy-icon"
                        // style={{position: 'absolute',}}
                        onClick={() => handleCopyDiscordUsername(discordUsername)}
                      >
                        <img src="img/profile/file---11690@1x.png" alt="" />
                      </div>
                    </div>
                  )}
                </div>

                {/* This is the new horizontal scroll */}
                <div
                  className="profileHorizontalScroll"
                  style={{
                    backgroundColor: "inherit",
                    width: "390px",
                    height: "400px",
                    overflowY: "scroll",
                  }}
                  onWheel={handleScroll}
                >
                  <div
                    style={{
                      width: "152px",
                      height: "217px",
                      display: "flex",
                    }}
                    onWheel={handleScroll}
                  >
                    <Link to="/allNftList/">
                      <div className="overlap-group-profile">
                        <img className="add" src="img/profile/add-2@1x.png" alt="Add" />
                        <img className="ic_add" src="img/profile/ic-add-2@1x.png" alt="ic_add" />
                      </div>
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
                        onClick = {() => {setIsPopUpIcon(true); setSelectedNft(MyNft);}}
                          src={`https://ipfs.io/ipfs/${MyNft}`}
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
                </div>
              </div>
              <MenuBar />
            </div>
          </div>
        ) : (
          <>
        <img className="x0-generateFreeNFT" src={`https://ipfs.io/ipfs/${selectedNftId}`} alt="0" />
          <h1 className="text-1">#{}</h1>
            <div className="hidden-content">
              <div className="x16206">
                <div className="lv-1">LV 1</div>
                <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
                <div className="reward-10">REWARD +5%</div>
              </div>
              {/* <div className="x0-signa">$0 SIGNA</div> */}
              <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
              <div onClick={() => setIsPopUpIcon(false)} className="click-the-area-to-make-it-hidden-again"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OtherUserProfile;
