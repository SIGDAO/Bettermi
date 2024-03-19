import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { CenterLayout } from "../../components/layout";
import MenuBar from "../../components/menuBar";
import { useSelector } from "react-redux";
import { selectCurrentUsername } from "../../redux/profile";
import { accountToken } from "../../redux/account";
import { store } from "../../redux/reducer";
import { useState } from "react";
import { useAppSelector } from "../../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { useEffect } from "react";
import { accountSlice } from "../../redux/account";
import { isTodayHaveSelfieRecord } from "../../components/bmiCalculate";
import { useLedger } from "../../redux/useLedger";
import { accountId } from "../../redux/account";
import { testing } from "../../redux/characteraiAPI";
import { selectCurrentGender } from "../../redux/profile";
import { NavigateToTakeSelfieButton } from "../../components/button";
import ImageSlider, { Carousel, CarouselItem } from "./Carousel";
import { accountLevel } from "../../redux/account";
import { calRewardSigdaoOnSelfie } from "../../components/selfieToEarnRewardType";
import { TransferToken } from "../../components/transferToken";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import HorizontalScrollContainerMission from "./horzontalScrollContainer";
import { CheckNftOwnerId, IsUserUpdatingIcon } from "../../NftSystem/updateUserNftStorage";
import UserIcon from "../../components/loadUserIcon";
import HorizontalScrollContainer from "../../components/horizontalScrollContainer";
import { convertWordToNumber } from "../../NftSystem/Reward/getRewardPercentage";
import { type } from "os";
import IPFSImageComponent from "../../components/ipfsImgComponent";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const slides = [
    { src: `${process.env.PUBLIC_URL}/img/home/News-Banner.png`, link: "https://www.bettermi.io/", icon: `${process.env.PUBLIC_URL}/img/home/ic-reservation@1x.png` },
    // {'src': `${process.env.PUBLIC_URL}/img/home/Blockchain-Forum-Banner.png`, 'link': '', 'icon': `${process.env.PUBLIC_URL}/img/home/bxs-forum.svg`},
    { src: `${process.env.PUBLIC_URL}/img/home/Leader-Board-Banner.png`, link: "/leaderboard", icon: `${process.env.PUBLIC_URL}/img/home/ic_leaderboard.png` },
    // {'src': `${process.env.PUBLIC_URL}/img/home/Secret-Coach-io-Banner.png`, 'link': ''},
    // {'src': `${process.env.PUBLIC_URL}/img/home/Secret-Coach-mimi-Banner.png`, 'link': ''},
  ];

  // info
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const name = useSelector(selectCurrentUsername);
  const Token: string = useSelector(accountToken);
  const userAccountId = useSelector(accountId);
  const [loading, setLoading] = useState<boolean>(true);
  const [imgAddress, setImgAddress] = useState<string>("");
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const navigate = useNavigate();
  const [level, setLevel] = useState<string>("");
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const tokenId = process.env.REACT_APP_TOKEN_ID!;
  const [isPopUpIcon, setIsPopUpIcon] = useState<boolean>(false);
  const [ipfsAddress, setIpfsAddress] = useState<string>("");
  const [isNFTiconLoading, setIsNFTiconLoading] = useState<boolean>(true);
  const [reward,setReward] = useState<string>();

  // useEffect(() => {
  //   testing();
  // }, []);

    //Trying disabling refresh
    useEffect(() => {
      const disableRefresh = (e:any) => {
        e.preventDefault();
        e.returnValue = '';
      };
  
      const handleBeforeUnload = (e:any) => {
        disableRefresh(e);
      };
  
      const handleUnload = (e:any) => {
        disableRefresh(e);
      };
  
      // Add event listeners to disable refreshing
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('unload', handleUnload);
  
      return () => {
        // Remove event listeners when component unmounts
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('unload', handleUnload);
      };
    }, []);
    //ends here
  
  const fetchUserIcon = async () => {
    const isUserSettingUpdating = await IsUserUpdatingIcon(ledger2, userAccountId);
    if (isUserSettingUpdating === true) {
      setIsNFTiconLoading(false);
    } else {
      ledger2.account
        .getAccount({ accountId: userAccountId })
        .then((account) => {
          console.log(account);
          const description = JSON.parse(account.description);
          console.log(description);
          console.log(Object.keys(description.av));
          console.log("imageaddress", Object.keys(description.av)[0]);
          setImgAddress(Object.keys(description.av)[0]);
          setIsNFTiconLoading(false);
        })
        .catch((error) => {
          setIsNFTiconLoading(false);
          console.log("need to equip nft");
        });
    }
  };


  useEffect(() => {
    // Function to fetch data from the APIc

    
    ledger2.account
      .getAccount({ accountId: userAccountId })
      .then(async (account) => {
        for (var i = 0; i < account.assetBalances.length; i++) {
          if (account.assetBalances[i].asset === tokenId) {
            store.dispatch(accountSlice.actions.setToken(Number(account.assetBalances[i].balanceQNT) / 1000000));
            localStorage.setItem("token", account.assetBalances[i].balanceQNT);
            console.log(account.assetBalances[i].balanceQNT);
          }
        }
        const description = JSON.parse(account.description);
        console.log(description.id);
        if (description.id != null) {
          const accountInfo = await ledger2.contract.getContract(description.id);
          console.log(accountInfo);
          setIpfsAddress(JSON.parse(accountInfo.description).descriptor);
          console.log(ipfsAddress);
          const ipfsJson = await fetch(`https://ipfs.io/ipfs/${JSON.parse(accountInfo.description).descriptor}`);
          console.log(ipfsJson);
          const text = await ipfsJson.text();
          console.log(text);
          const nftInfo = JSON.parse(text);
          console.log(nftInfo);
          console.log(nftInfo.attributes[6].value);
          console.log(typeof(nftInfo.attributes[6].value));
          var value = (convertWordToNumber(nftInfo.attributes[6].value)/3).toFixed(2).toString();
          console.log(value);
          console.log(typeof(value));
          setReward(value);
          if (nftInfo.description.includes("1") === true) {
            setLevel("1");
          }
          if (nftInfo.description.includes("2") === true) {
            setLevel("2");
          }
          if (nftInfo.description.includes("3") === true) {
            setLevel("3");
          }
          store.dispatch(accountSlice.actions.setLevel(description.ds));
        } else {
          setLevel("1");
          setReward("loading...");
          store.dispatch(accountSlice.actions.setLevel(description.ds));
        }



        console.log("description", description);
        console.log(Object.keys(description.av));
        console.log(typeof Object.keys(description.av)[0]);
        // setImgAddress(Object.keys(description.av)[0]);
        setLoading(false);
        console.log("imgAddress", imgAddress);
        console.log(typeof imgAddress);
      })
      .catch((error) => {
        console.log("need to equip nft");
        console.log(error);
        console.log("imgAddress bug", imgAddress);
        console.log(typeof imgAddress);
        setLoading(false);
      });
    fetchUserIcon()
    // TransferToken(nodeHost,userId,"10");

    // console.log(calRewardSigdaoOnSelfie(22.9), "calRewardSigdaoOnSelfie(22.9)");
  }, []);

  // todo: map
  // const userSIGDAO =

  // todo: export a button as take a selfie component
  async function handleTakeASelfie() {
    // if (await isTodayHaveSelfieRecord(tempAccountId, Ledger2)) {
    //   alert('already taken a selfie, since we are in demo mode, click comfirm for another selfie')
    //   navigate('/takeSelfie')
    // }
    navigate("/takeSelfie");
  }

  // const testing = async () => {
  //   await TransferToken(nodeHost,userId, calRewardSigdaoOnSelfie(22.9).toString())
  // }
  const nftContractChecked = useRef(false);
  useEffect(() => {
    if (nftContractChecked.current) {
      console.log("called");
      return;
    }
    nftContractChecked.current = true;
    ledger2.contract
      .getContractsByAccount({
        accountId: userAccountId,
        machineCodeHash: codeHashIdForNft,
      })
      .then((senderNftStorage) => {
        store.dispatch(accountSlice.actions.setNftContractStorage(senderNftStorage.ats[0].at));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const content: JSX.Element = (
    <>
      {isPopUpIcon && (
        <div className="hidden-content">
          {isNFTiconLoading ? (
            <div className="x0"></div>
          ) : (
            <>
              {/* <img className="x0-generateFreeNFT" src={`https://ipfs.io/ipfs/${imgAddress}`} alt="0" /> */}
              {/* <h1 className="text-1">#{nftNumber}</h1> */}
              <IPFSImageComponent className="x0-generateFreeNFT" imgAddress={imgAddress} />
            </>
          )}
          <div className="x16206">
            <div className="lv-1">LV {level}</div>
            <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
            <div className="reward-10">REWARD +{reward}%</div>
          </div>
      
          <div className="x0-signa">$0 SIGNA</div>
          <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
          <div onClick={() => setIsPopUpIcon(false)} className="click-the-area-to-make-it-hidden-again"></div>
        </div>
      )}

      <div className="screen">
        <div className="bettermidapp-home-1">
          <Link to="/featureMissions">
            <div className="view-all-RoXPLo inter-medium-royal-blue-14px">See all</div>
          </Link>
          <div className="feature-missions-RoXPLo inter-semi-bold-white-21px">Feature Missions</div>

          <Link to="/leaderboard"></Link>
          <ImageSlider slides={slides} />
          <Link to="https://discord.gg/MATW3Dcdcw" target="_blank" rel="noopener noreferrer">
            <img src={`${process.env.PUBLIC_URL}/img/home/bxl-discord-alt.svg`} alt="" className="discord-RoXPLo" />
          </Link>
          <div className="our-community-RoXPLo inter-semi-bold-white-21px">Social Events</div>
          <div className="alert-get-signa inter-semi-bold-white-15px">GET SIGNA:</div>
          <div className="nav-to-take-selfie-content">
            <NavigateToTakeSelfieButton />
          </div>
          {/* </Link> */}
          <div className="quick-actions-RoXPLo inter-semi-bold-white-21px">Selfie To Earn</div>
          <div className="greetings-RoXPLo">
            {/* <h1 className="title-2ZgxSS">Hi ! </h1> */}
            <h1 className="title-2ZgxSS">Hello ! </h1>
            <div className="lv_-reward-2ZgxSS">
              <div className="lv-1-b5x63m inter-semi-bold-keppel-15px">LV {level}</div>
              <div className="nft-reward-10-b5x63m inter-semi-bold-white-15px">REWARD +{reward}%</div>
              <img className="seperate-line-b5x63m" src={`${process.env.PUBLIC_URL}/img/seperate-line-1@1x.png`} alt="seperate line" />
            </div>
            <UserIcon setIsPopUpIcon={setIsPopUpIcon} home={true} userAccountId={userAccountId}></UserIcon>
            {/* {imgAddress === ""?gender === "Female"?
          // <img className="nft_-avatar-2ZgxSS" src={`${process.env.PUBLIC_URL}/img/home/nft-avatar-13@1x.png`} alt="NFT_Avatar" />
          <Link to="/allNftList/">
              <div className="home_nft_-avatar">
                  <img
                    className="home_icon_ic_add"
                    src="img/profile/ic-add-2@1x.png"
                    alt="ic_add"
                  />
              </div>
            </Link>
          :(
            <Link to="/allNftList/">
              <div className="home_nft_-avatar">
                <img
                  className="home_icon_ic_add"
                  src="img/profile/ic-add-2@1x.png"
                  alt="ic_add"
                />
              </div>
            </Link>
              // <img className="nft_-avatar-2ZgxSS" src={`${process.env.PUBLIC_URL}/img/home/1.png`} alt="NFT_Avatar" />
          )
          :(
            <img className = "nft_-avatar-2ZgxSS" src = {`https://ipfs.io/ipfs/${imgAddress}`}></img>
          )
          } */}
            <Link to="/profile">
              <div className="ic_next-2ZgxSS">
                <img className="ic_chevron_right_24px-LRB8nH" src={`${process.env.PUBLIC_URL}/img/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
              </div>
            </Link>
            <Link to="/aiCoachSelect">
              <img className="home-ai-select-icon" src={`${process.env.PUBLIC_URL}/img/home/bxs-Aicoach.svg`} />
            </Link>
            <Link to="/setting">
              <img className="home-setting-icon" src={`${process.env.PUBLIC_URL}/img/ic-settings-24px-1@1x.png`} alt="" />
            </Link>
            <div className="score-bar_3-2ZgxSS">
              <div className="sigdao-score-iPTNDG sigdao-score">
                <div className="x10-kxjIEt x10 inter-semi-bold-keppel-15px">{loading ? <div>loading...</div> : Token}</div>
                <div className="signdao_tokengradient-kxjIEt signdao_tokengradient">
                  <div className="x441-e5x8kp x441"></div>
                  <div className="x442-e5x8kp x442"></div>
                  <img className="x880-e5x8kp x880" src={`${process.env.PUBLIC_URL}/img/file---880-1x-png-10@1x.png`} alt="880" />
                </div>
              </div>
            </div>
            <div className="sigdao-2ZgxSS inter-semi-bold-white-15px">SIGDAO:</div>
          </div>
          {/* <HorizontalScrollContainerMission></HorizontalScrollContainerMission> */}
          <HorizontalScrollContainer inputClassName="missions-scroll-RoXPLo x-">
            <Link to="/missionChallenge">
              <div className="challenges-x9-hacks-GEWAL1">
                <div className="small-image">
                  <img className="challenge-x9_banner-UqALvc" src={`${process.env.PUBLIC_URL}/img/home/challengex9-banner@1x.png`} alt="ChallengeX9_banner" />
                </div>
                <div className="challengesx-9-hacks-ewZMRw inter-medium-white-15px">
                  Challenges
                  <br />x 9 hacks
                </div>
                <div className="x1-3mins-each-ewZMRw inter-normal-cadet-blue-12px">1-3mins/ each</div>
                <div className="sigdao-score-ewZMRw sigdao-score">
                  <div className="x10-HEHiSw x10 inter-semi-bold-keppel-14px">+5.25 - 15.75</div>
                  <div className="signdao_tokengradient-HEHiSw signdao_tokengradient">
                    <div className="x441-giFx9O x441"></div>
                    <div className="x442-giFx9O x442"></div>
                    <img className="x880-giFx9O x880" src={`${process.env.PUBLIC_URL}/img/file---880-1x-png-10@1x.png`} alt="880" />
                  </div>
                </div>
              </div>
            </Link>
            <div className="meditations-GEWAL1">
              <div className="home-meditation-content">
                <div className="small-image">
                  <img className="meditation_banner-dLbFgX" src={`${process.env.PUBLIC_URL}/img/home/meditation-banner@1x.png`} alt="Meditation_banner" />
                </div>
                <div className="weekly-meditation-3kbxqV inter-medium-white-15px">Weekly Meditation</div>
                <div className="saturday-only-3kbxqV inter-normal-cadet-blue-12px">Saturday only</div>
                <div className="sigdao-score-3kbxqV sigdao-score">
                  <div className="x10-UyxTRp x10 inter-semi-bold-keppel-14px">+20</div>
                  <div className="signdao_tokengradient-UyxTRp signdao_tokengradient">
                    <div className="x441-ozHgg7 x441"></div>
                    <div className="x442-ozHgg7 x442"></div>
                    <img className="x880-ozHgg7 x880" src={`${process.env.PUBLIC_URL}/img/file---880-1x-png-10@1x.png`} alt="880" />
                  </div>
                </div>
              </div>
              <div className="meditations-overlay">
                <img src="/img/ic-locked-1@1x.png" className="lock-image" alt="" />
              </div>
            </div>
            <div className="step-counts-GEWAL1">
              <div className="home-meditation-content">
                <div className="small-image">
                  <img className="step_count_banner-45Wblr" src={`${process.env.PUBLIC_URL}/img/allMission/Talk-to-mi-Square-Cover.png`} alt="Step_count_banner" />
                </div>
                <div className="walking-mission-7hGHU0 inter-medium-white-15px">Secret Coach - Talk To mi</div>
                <div className="step-count-7hGHU0 inter-normal-cadet-blue-12px">Secret Coach - Talk To mi</div>
                <div className="sigdao-score-7hGHU0 sigdao-score">
                  <div className="x10-SMcg87 x10 inter-semi-bold-keppel-14px">+20</div>
                  <div className="signdao_tokengradient-SMcg87 signdao_tokengradient">
                    <div className="x441-JHyhgs x441"></div>
                    <div className="x442-JHyhgs x442"></div>
                    <img className="x880-JHyhgs x880" src={`${process.env.PUBLIC_URL}/img/file---880-1x-png-10@1x.png`} alt="880" />
                  </div>
                </div>
              </div>
              <div className="meditations-overlay">
                <img src="/img/ic-locked-1@1x.png" className="lock-image" alt="" />
              </div>
            </div>
          </HorizontalScrollContainer>
          {/* <BackButton /> */}

          {/* <div className="missions-scroll-RoXPLo">
        </div> */}
          <MenuBar />
        </div>
      </div>
    </>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default Home;
