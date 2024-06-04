// package
import React from "react";
import { useEffect, useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Provider as ReduxProvider } from "react-redux";
import { Fragment } from "react";
import { Analytics } from "@vercel/analytics/react";
import { loadState, saveState } from "./redux/sessionStorage";
import { createTheme, ThemeProvider } from "@mui/material";

// setting
import { store } from "./redux/reducer";
import { appConfig } from "./redux/useContext";
import { AppContext } from "./redux/useContext";

// JSX element and css
import "./App.css";
import "react-calendar/dist/Calendar.css";
import LogoPage from "./pages/logoPage/LogoPage";
import ConnectWallet from "./pages/connectWallet/connectWallet";
import GenerateBMI from "./pages/generateBMI/GenerateBMI";
import TakeSelfie from "./pages/takeSelfie/TakeSelfie";
import ConnectSucceed from "./pages/connectSucceed/connectSucceed";
import GenerateFreeNFT from "./pages/generateFreeNFT/generateFreeNFT";
import CustomizeYourProfile from "./pages/customizeYourProfile/customizeYourProfile";
import Home from "./pages/home/home";
import AllMission from "./pages/allMission/allMission";
import ChallengeCompleted from "./pages/challengeCompleted/challengeCompleted";
import ChallengeCountdown from "./pages/challengeCountdown/challengeCountdown";
import MissionChallenge from "./pages/missionChallenge/missionChallenge";
import MyNftList from "./pages/myNftList/myNftList";
import Reward from "./pages/reward/reward";
import RewardDetail from "./pages/rewardDetail/rewardDetail";
import SelfieToEarn from "./pages/selfieToEarn/selfieToEarn";
import Profile from "./pages/profile/profile";
import Marketplace from "./pages/marketplace/marketplace";
import Testing from "./pages/testing/testing";
// import { ThemeProvider , createTheme } from '@mui/material/styles';
import GenerateBMIDaily from "./pages/generateBMIDaily/generateBMIDaily";
import GenerateBMINFTImport from "./pages/generateBMINFTImport/generateBMINFTImport";
import AiCoachSelect from "./pages/aiCoachSelect/aiCoachSelect";
import AiCoachDetail from "./pages/aiCoachDetail/aiCoachDetail";
import ErrorGenerateNFT from "./pages/errorGenerateNFT/errorGenerateNFT";
import LoadingMinting from "./pages/loadingMinting/loadingMinting";
import Setting from "./pages/setting/setting";
import IndexMyNftList from "./pages/myNftList/indexMyNftList";
import Leaderboard from "./pages/leaderboard/leaderboard";
import OtherUserProfile from "./pages/leaderboard/otherUserProfile";
import RoleRoute from "./route/roleRoute";
import AllNftList from "./pages/allNftList/allNftList";
import { IndexAllNftList } from "./pages/allNftList/indexAllNftList";
import { profileSlice, selectCurrentIsGuest } from "./redux/profile";

store.subscribe(() => {
  saveState(store.getState());
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#4136F1",
    },
  },
});

const titleList = {
  "/": "Bettermi",
  // "/connectWallet": "Connect Wallet - Bettermi",
  "/generateBMI": "Generate BMI - Bettermi",
  "/takeSelfie": "Take Selfie - Bettermi",
  "/connectSucceed": "Connect Succeed - Bettermi",
  "/generateFreeNFT": "Generate Free NFT - Bettermi",
  "/customizeYourProfile": "Customize Your Profile - Bettermi",
  "/home": "Home - Bettermi",
  "/featureMissions": "Feature Missions - Bettermi",
  "/challengeCompleted": "Challenge Completed - Bettermi",
  "/challengeCountdown": "Challenge Countdown - Bettermi",
  "/missionChallenge": "Mission Challenge - Bettermi",
  "/myNftList": "My NFT List - Bettermi",
  "/reward": "Reward - Bettermi",
  "/rewardDetail": "Reward Detail - Bettermi",
  "/selfieToEarn": "Selfie To Earn - Bettermi",
  "/profile": "Profile - Bettermi",
  "/marketplace": "Marketplace - Bettermi",
  "/previewNFTImg": "NFT detail - Bettermi",
  "/generateBMIDaily": "Generate BMI Daily - Bettermi",
  "/generateBMINFTImport": "Generate BMI NFT Import - Bettermi",
  "/aiCoachSelect": "AI Coach Select - Bettermi",
  "/aiCoachDetail": "AI Coach Detail - Bettermi",
  "/errorGenerateNFT": "Error Generate NFT - Bettermi",
  "/errorTakeSelfie": "Error Take Selfie - Bettermi",
  "/errorCustomizeYourProfile": "Error Customize Your Profile - Bettermi",
  "/loadingMinting": "Loading Minting - Bettermi",
  "/setting": "Setting - Bettermi",
  "/NFTTransferCompleted": "NFT Transfer Completed - Bettermi",
};

const guestAllowedPath = [
  // "/connectWallet",
  "/home",
  "/takeSelfie",
  "/generateBMINFTImport",
  "/profile",
  "/allNftList",
  "/setting",
  // "/leaderboard",
  "/reward",
  "/marketplace",
  "/rewardDetail",
  "/featureMissions",
  "/missionChallenge",
  "/challengeCountdown",
];

const checkCurrentPathIsGuestAllowed = (currentPath: string): boolean => {
  if (currentPath === "/") return true;

  return guestAllowedPath.some((path) => currentPath.startsWith(path));
}

const CheckStore: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentPath: string = location.pathname;
  const { appName, Wallet, Ledger } = useContext(AppContext);
  const isGuest = useSelector(selectCurrentIsGuest);

  console.log("currentPath", currentPath);
  // console.log("isGuest", "/rewardDetail".)
  console.log(
    "hih",
    guestAllowedPath.some((path) => {
      console.log("path", path);
      console.log("currentPath.startsWith(path)", currentPath.startsWith(path));
      return currentPath.startsWith(path);
    }),
  );

  if (Wallet.Extension.connection !== null && sessionStorage.getItem("state") !== null) {
    dispatch(profileSlice.actions.authenticated());
  } else if (!checkCurrentPathIsGuestAllowed(currentPath) || !isGuest) {
    sessionStorage.clear();
    return <Navigate to="/" />;
  } else {
    dispatch(profileSlice.actions.unauthenticated());
  }

  return <Outlet />;
};

function App() {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [previousPath, setPreviousPath] = useState<string>("");

  const location = useLocation();
  useEffect(() => {
    document.title = titleList[location.pathname] ?? "Bettermi";
  }, [location]);

  useEffect(() => {
    if (location.pathname !== currentPath) {
      setPreviousPath(currentPath);
      setCurrentPath(location.pathname);
    }
  }, [location.pathname]);

  return (
    // path
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={appConfig}>
        <ReduxProvider store={store}>
          <Routes>
            <Route
              element={
                <Fragment>
                  <CheckStore />
                  <Analytics />
                </Fragment>
              }
            >
              {/* all user */}
              {/* <Route path="/" element={<LogoPage />} /> */}
              <Route path="*" element={<Navigate to="/home" />} />
              <Route path="/" element={<ConnectWallet />} />
              {/* need to have its own logined setting */}
              <Route path="/takeSelfie" element={<TakeSelfie />} />
              <Route path="/loadingMinting" element={<LoadingMinting pathname="/loadingMinting" />} />
              {/* user that not yet created acct */}
              {/* <Route element={<RoleRoute role="unregisteredUser" />}> */}
              <Route path="/connectSucceed" element={<ConnectSucceed />} />
              <Route path="/generateBMINFTImport" element={<GenerateBMINFTImport />} />
              <Route path="/generateFreeNFT" element={<GenerateFreeNFT />} />
              {/* the login for this page should be if no name then can access, if have name cannot access */}
              <Route path="/customizeYourProfile" element={<CustomizeYourProfile />} />
              {/* </Route> */}
              {/* user that created acct */}
              {/* <Route element={<RoleRoute role="registeredUser" />}> */}
              <Route path="/home" element={<Home />} />
              <Route path="/featureMissions" element={<AllMission />} />
              <Route path="/challengeCompleted" element={<ChallengeCompleted />} />
              <Route path="/challengeCountdown">
                <Route path=":id" element={<ChallengeCountdown />} />
              </Route>
              <Route path="/missionChallenge" element={<MissionChallenge />} />
              {/* account that can only access in certain time */}
              <Route path="/myNftList" element={<MyNftList />} />
              <Route path="/allNftList" element={<IndexAllNftList />} />
              <Route path="/indexMyNftList" element={<IndexMyNftList />} />
              <Route path="/reward" element={<Reward />} />
              <Route path="/rewardDetail">
                <Route path=":id" element={<RewardDetail />} />
              </Route>
              <Route path="/selfieToEarn" element={<SelfieToEarn />} />
              <Route path="/profile" element={<Profile previousPath={previousPath} />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/previewNFTImg" element={<Testing />} />
              <Route path="/generateBMIDaily" element={<GenerateBMIDaily />} />
              <Route path="/aiCoachSelect" element={<AiCoachSelect />} />
              <Route path="/aiCoachDetail">
                <Route path=":id" element={<AiCoachDetail />} />
              </Route>
              <Route path="/errorGenerateNFT" element={<ErrorGenerateNFT />} />
              <Route path="/errorTakeSelfie" element={<ErrorGenerateNFT />} />
              <Route path="/errorCustomizeYourProfile" element={<ErrorGenerateNFT />} />
              <Route path="/errorWalletNotConnected" element={<ErrorGenerateNFT />} />
              <Route path="/loadingBMIDaily" element={<LoadingMinting pathname="/loadingBMIDaily" />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/NFTTransferCompleted" element={<ChallengeCompleted NFT={true} />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/OtherUserProfile" element={<OtherUserProfile />} />
            </Route>
            {/* </Route> */}
          </Routes>
        </ReduxProvider>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
