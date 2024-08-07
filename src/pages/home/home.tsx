import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { CenterLayout } from "../../components/layout";
import MenuBar from "../../components/menuBar";
import { useSelector } from "react-redux";
import { selectCurrentIsGuest, selectCurrentUsername } from "../../redux/profile";
import { accountPublicKey, accountToken } from "../../redux/account";
import { store } from "../../redux/reducer";
import { useState } from "react";
import { LedgerClientFactory } from "@signumjs/core";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { useEffect } from "react";
import { accountSlice } from "../../redux/account";
import { accountId } from "../../redux/account";
import { NavigateToTakeSelfieButton } from "../../components/button";
import ImageSlider from "./Carousel";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import { IsUserUpdatingIcon } from "../../NftSystem/updateUserNftStorage";
import UserIcon from "../../components/loadUserIcon";
import HorizontalScrollContainer from "../../components/horizontalScrollContainer";
import { convertWordToNumber } from "../../NftSystem/Reward/getRewardPercentage";
import { reEquipNft } from "../../NftSystem/displayNft/reequipNft";
import { getApiUrls } from "../../components/constants/constant";
import { NFTDetailPopUpWindow } from "../../components/popupWindow";
import HomeMissionList from "./horzontalScrollContainer";
import UserInfoContainer from "./userInfoContainer";
import ReferralSuccessPopupWindow from "./referralSuccessPopupWindow";

interface IHomeProps {
  pathname?: string;
}

const checkSlides = (isGuest: boolean) => {
  if (isGuest) {
    return [
      { src: `${process.env.PUBLIC_URL}/img/home/Get-Signa-Banner.png`, link: "https://discord.com/invite/MATW3Dcdcw", icon: `${process.env.PUBLIC_URL}/img/home/ic-reservation@1x.png` },
      // { src: `${process.env.PUBLIC_URL}/img/home/Take-a-Selfie-Banner.png`, link: "/takeSelfie", icon: `${process.env.PUBLIC_URL}/img/home/ic-reservation@1x.png` },
      // { src: `${process.env.PUBLIC_URL}/img/home/News-Banner.png`, link: "https://www.bettermi.io/", icon: `${process.env.PUBLIC_URL}/img/home/ic-reservation@1x.png` },
      // {'src': `${process.env.PUBLIC_URL}/img/home/Blockchain-Forum-Banner.png`, 'link': '', 'icon': `${process.env.PUBLIC_URL}/img/home/bxs-forum.svg`},
      { src: `${process.env.PUBLIC_URL}/img/leaderboard/Leaderboard_Banner.png`, link: "/leaderboard", icon: `${process.env.PUBLIC_URL}/img/home/ic_leaderboard.png` },
      // {'src': `${process.env.PUBLIC_URL}/img/home/Secret-Coach-io-Banner.png`, 'link': ''},
      // {'src': `${process.env.PUBLIC_URL}/img/home/Secret-Coach-mimi-Banner.png`, 'link': ''},
    ];
  }

  return [
    { src: `${process.env.PUBLIC_URL}/img/home/Get-Signa-Banner.png`, link: "https://discord.com/invite/MATW3Dcdcw", icon: `${process.env.PUBLIC_URL}/img/home/ic-reservation@1x.png` },
    // { src: `${process.env.PUBLIC_URL}/img/home/News-Banner.png`, link: "https://www.bettermi.io/", icon: `${process.env.PUBLIC_URL}/img/home/ic-reservation@1x.png` },
    // {'src': `${process.env.PUBLIC_URL}/img/home/Blockchain-Forum-Banner.png`, 'link': '', 'icon': `${process.env.PUBLIC_URL}/img/home/bxs-forum.svg`},
    { src: `${process.env.PUBLIC_URL}/img/leaderboard/Leaderboard_Banner.png`, link: "/leaderboard", icon: `${process.env.PUBLIC_URL}/img/home/ic_leaderboard.png` },
    // {'src': `${process.env.PUBLIC_URL}/img/home/Secret-Coach-io-Banner.png`, 'link': ''},
    // {'src': `${process.env.PUBLIC_URL}/img/home/Secret-Coach-mimi-Banner.png`, 'link': ''},
  ];
};

const disableRefresh = (e: any) => {
  e.preventDefault();
  e.returnValue = "";
};

const handleBeforeUnload = (e: any) => {
  disableRefresh(e);
};

const handleUnload = (e: any) => {
  disableRefresh(e);
};

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const pathname: string | undefined = props.pathname;
  console.log("pathname is", pathname);
  const codeHashIdForNft = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const tokenId = process.env.REACT_APP_TOKEN_ID!;
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const distributorPublicKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PUBLIC_KEY!;

  const navigate = useNavigate();
  const reduxIsGuest = useSelector(selectCurrentIsGuest);

  const isGuest = pathname === "/referralGiveReward" ? true : reduxIsGuest;

  const { appName, Wallet, Ledger } = useContext(AppContext);
  const name = useSelector(selectCurrentUsername);
  const Token: string = useSelector(accountToken);
  const userAccountId: string = useSelector(accountId);
  const nodeHost = useSelector(selectWalletNodeHost);
  const userAccountPublicKey = useSelector(accountPublicKey);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });

  const [level, setLevel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [imgAddress, setImgAddress] = useState<string>("");
  const [isPopUpNFTDetailWinodow, setIsPopUpNFTDetailWinodow] = useState<boolean>(false);
  const [ipfsAddress, setIpfsAddress] = useState<string>("");
  const [isNFTiconLoading, setIsNFTiconLoading] = useState<boolean>(true);
  const [rewardPercentage, setRewardPercentage] = useState<string>("");
  const [isPopUpReferralSuccessWindow, setIsPopUpReferralSuccessWindow] = useState<boolean>(true);

  const slides = checkSlides(isGuest);

  useEffect(() => {
    // Add event listeners to disable refreshing
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      // Remove event listeners when component unmounts
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);
  //ends here

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
        .catch(async (error) => {
          setIsNFTiconLoading(false);
        });
    }
  };

  const nftIconCheck = useRef(false);
  useEffect(() => {
    // Function to fetch data from the APIc
    if (nftIconCheck.current || isGuest || pathname === "/referralGiveReward") {
      return;
    }
    nftIconCheck.current = true;
    reEquipNft(ledger2, Wallet, userAccountId, codeHashIdForNft, nftDistributor, userAccountPublicKey, navigate);
    ledger2.account
      .getAccount({ accountId: userAccountId })
      .then(async (account) => {
        for (var i = 0; i < account.assetBalances.length; i++) {
          if (account.assetBalances[i].asset === tokenId) {
            store.dispatch(accountSlice.actions.setToken(Number(account.assetBalances[i].balanceQNT) / 1000000));
            localStorage.setItem("token", account.assetBalances[i].balanceQNT);
          }
        }
        const description = JSON.parse(account.description);
        if (description.id != null) {
          const accountInfo = await ledger2.contract.getContract(description.id);
          setIpfsAddress(JSON.parse(accountInfo.description).descriptor);
          const ipfsJson = await fetch(getApiUrls(JSON.parse(accountInfo.description).descriptor).imgAddress);
          const text = await ipfsJson.text();
          const nftInfo = JSON.parse(text);
          var value = (convertWordToNumber(nftInfo.attributes[6].value) / 3).toFixed(2).toString();
          setRewardPercentage(value);
          if (nftInfo.description.includes("1")) {
            setLevel("1");
          }
          if (nftInfo.description.includes("2")) {
            setLevel("2");
          }
          if (nftInfo.description.includes("3")) {
            setLevel("3");
          }
          store.dispatch(accountSlice.actions.setLevel(description.ds));
        } else {
          setLevel("1");
          setRewardPercentage("");
          store.dispatch(accountSlice.actions.setLevel(description.ds));
        }

        // setImgAddress(Object.keys(description.av)[0]);
        setLoading(false);
      })
      .catch(async (error) => {
        console.log(error);

        setLoading(false);
      });
    fetchUserIcon();
    // TransferToken(nodeHost,userId,"10");
  }, []);

  const nftContractChecked = useRef(false);
  useEffect(() => {
    if (nftContractChecked.current || isGuest || pathname == "/referralGiveReward") {
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
      <NFTDetailPopUpWindow
        // isGuest={isGuest}
        isNFTiconLoading={isNFTiconLoading}
        imgAddress={imgAddress}
        level={level}
        rewardPercentage={rewardPercentage}
        isPopUpNFTDetailWinodow={isPopUpNFTDetailWinodow}
        setIsPopUpNFTDetailWinodow={setIsPopUpNFTDetailWinodow}
      >
        <div className="screen">
          <div className="bettermidapp-home-1">
            {pathname === "/referralGiveReward" && <ReferralSuccessPopupWindow />}
            <Link to="/featureMissions">
              <div className="view-all-RoXPLo inter-medium-royal-blue-14px">See all</div>
            </Link>
            <div className="feature-missions-RoXPLo inter-semi-bold-white-21px">Feature Missions</div>

            <Link to="/leaderboard"></Link>
            <ImageSlider slides={slides} />
            <div className="our-community-RoXPLo inter-semi-bold-white-21px">Social Events</div>
            <div className="nav-to-take-selfie-content">
              <NavigateToTakeSelfieButton />
            </div>
            <div className="quick-actions-RoXPLo inter-semi-bold-white-21px">Selfie To Earn</div>
            <UserInfoContainer
              isGuest={isGuest}
              setIsPopUpNFTDetailWinodow={setIsPopUpNFTDetailWinodow}
              userAccountId={userAccountId}
              setRewardPercentage={setRewardPercentage}
              setImgAddress={setImgAddress}
              level={level}
              rewardPercentage={rewardPercentage}
              loading={loading}
              Token={Token}
            />
            <HomeMissionList />
            <MenuBar />
          </div>
        </div>
      </NFTDetailPopUpWindow>
    </>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default Home;
