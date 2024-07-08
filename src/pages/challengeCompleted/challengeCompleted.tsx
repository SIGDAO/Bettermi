import * as React from "react";
import "./challengeCompleted.css";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { CenterLayout } from "../../components/layout";
import { ShortTitleBar } from "../../components/titleBar";
import { challengeList } from "../../data/challengeList";
import { TransferToken } from "../../components/transferToken";
import { useSelector } from "react-redux";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { accountId } from "../../redux/account";
import { TransferTokenWithMessage } from "../../NftSystem/TokenTransfers";
import { useRef, useEffect } from "react";
import { CountChallenges } from "../../NftSystem/Token/countChallenges";
import { LedgerClientFactory } from "@signumjs/core";
import { GetRewardPercentage } from "../../NftSystem/Reward/getRewardPercentage";
import { selectCurrentIsGuest } from "../../redux/profile";
import { BackButton, GuestConnectWallectButton } from "../../components/button";
import SigdaoIcon from "../../components/icon";

interface IChallengeCompletedProps {
  NFT?: boolean;
}

const displayReawrd = (pathname: string): string | undefined => {
  if (pathname) {
    const pathList = pathname.split("/");
    const reward = pathList[pathList.length - 1];

    return challengeList.find((mission, index) => index === parseInt(reward) - 1)?.sigdao || undefined;
  }

  return "";
};

const ChallengeCompleted: React.FunctionComponent<IChallengeCompletedProps> = (props) => {
  const { NFT } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [pathname, setPathname] = React.useState<string>("");
  const [loading, setLoading] = React.useState<Boolean>(true);
  const [userReward, setReward] = React.useState<string>("");
  const nodeHost = useSelector(selectWalletNodeHost);
  const userAccountId = useSelector(accountId);
  const distributed = useRef(false);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const isGuest = useSelector(selectCurrentIsGuest);
  ///Anderson's code starts here

  useEffect(() => {
    const handleBeforeUnload = () => {
      distributed.current = false; // Reset the value before navigating away
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  //Anderson's code ends here

  //Anderson's code starts here

  const TransferTokenToUser = async (nodeHost: string, userAccountId: string, reward: string, ledger2: any) => {
    var rewardString: string | undefined = displayReawrd(location.state?.reward);
    const challengeNumber: string[] | null = location.state?.reward.split("/");

    if (rewardString == undefined || !challengeNumber) {
      return;
    } else {
      const index: number = Number(challengeNumber[2]);
      const numChallengesPlayed = await CountChallenges(userAccountId, ledger2);

      //await TransferToken(nodeHost, userAccountId, rewardString);
      const rewardPercentage = await GetRewardPercentage(ledger2, userAccountId);

      var reward: string;
      if (rewardPercentage != null) {
        reward = String((parseFloat(rewardString!) * (100 + parseInt(rewardPercentage))) / 100);
      } else {
        reward = String(parseFloat(rewardString!));
      }

      setReward(reward);
      if (numChallengesPlayed[index - 1] < 3 && rewardPercentage != null) {
        await TransferTokenWithMessage(nodeHost, userAccountId, reward, parseInt(challengeNumber![challengeNumber!.length - 1]));
      } else {
        alert("you have already played three times");
        navigate("/missionChallenge");
      }
      setLoading(false);
      return;
    }
  };

  //Anderson's code ends here

  React.useEffect(() => {
    // if guest, don't transfer token
    if (isGuest) {
      setLoading(false);
      var rewardString: string | undefined = displayReawrd(location.state?.reward);
      setReward(String(parseFloat(rewardString!)));
      return;
    }

    if (!NFT && distributed.current === false) {
      TransferTokenToUser(nodeHost, userAccountId, location.state?.reward, ledger2); //Anderson's code
      distributed.current = true; //Anderson's code
    }
  }, []);
  React.useEffect(() => {
    setPathname(() => {
      if (location.pathname === "/NFTTransferCompleted") {
        // return '/NftList';
        return "/missionChallenge";
      }

      return "/missionChallenge";
    });
  }, [location]);

  const SmallTitle = NFT ? "Your NFT has been transferred." : "You have earned:";

  const doneClickHandler = () => {
    if (!loading) {
      navigate(pathname);
    }
  };

  const registeredUserView: JSX.Element = (
    <>
      {loading ? (
        <div className="buttonLoadingNotDone" onClick={doneClickHandler}>
          <div className="button1-UidXYK button1"></div>
          <div className="continue-UidXYK inter-semi-bold-white-15px">Done</div>
        </div>
      ) : (
        <div className="button_-done-iwUDzs" onClick={doneClickHandler}>
          <div className="button1-UidXYK button1"></div>
          <div className="continue-UidXYK inter-semi-bold-white-15px">Done</div>
        </div>
      )}
    </>
  );

  const guestUserView: JSX.Element = (
    <>
      {/* <div className="bg-locked-challenge-completed"></div> */}
      <div className="earn-sigdao-challenge-completed inter-normal-white-20px">Earn SIGDAO now !</div>
      <div className="button_-done-iwUDzs" >
        <GuestConnectWallectButton height={"56px"} width={"248px"} />
      </div>
    </>
  );

  const content: JSX.Element = (
    <>
      <div className="screen">
        <div className="bettermidapp-challenge-finished-1">
          {isGuest && <BackButton />}
          {/* <ShortTitleBar title='' setting={false} aiCoach={false} transparent={true} /> */}
          <div className="x16219-iwUDzs" style={isGuest ? { opacity: 0.6 } : {}}>
            <div className="you-have-earned-75VOY2">{SmallTitle}</div>
            <h1 className="title-75VOY2">Congratulations !</h1>
            <div className="finished-75VOY2">
              <img src="img/challengeCompleted/completed-mimi.png" alt="" className="mimi-heart-challenge-completed" />
              {/* <div className="button3-copy-3oZEl3">
              <div className="button1-vX3ONf button1"></div>
            </div>
            <img className="icon-awesome-check-3oZEl3" src={`${process.env.PUBLIC_URL}/img/challengeSuccess/icon-awesome-check@1x.png`} alt="Icon awesome-check" /> */}
            </div>
            {NFT ? null : loading ? (
              <div className="sigdao-score-75VOY2">
                <div className="x10-VOfFBB inter-semi-bold-keppel-14px">+ loading...</div>
                <SigdaoIcon width="17px" height="17px" />
              </div>
            ) : (
              <div className="sigdao-score-75VOY2">
                <div className="x10-VOfFBB inter-semi-bold-keppel-14px">+ {userReward}</div>
                <SigdaoIcon width="17px" height="17px" />
              </div>
            )}
          </div>
          {isGuest ? guestUserView : registeredUserView}
        </div>
      </div>
      <div className="bg-locked-challenge-completed"></div>
    </>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default ChallengeCompleted;
