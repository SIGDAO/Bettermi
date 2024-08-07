import * as React from "react";
import "./reward.css";
import { Link, useNavigate } from "react-router-dom";
import MenuBar from "../../components/menuBar";
import { CenterLayout } from "../../components/layout";
import { ShortTitleBar } from "../../components/titleBar";
import { rewardDetailList } from "../../data/rewardList";
import { getBMIRecordDay, isHitFirstHealthyBMIRange } from "../../components/bmiCalculate";
import { useSelector } from "react-redux";
import { accountId } from "../../redux/account";
import { useLedger } from "../../redux/useLedger";
import { useEffect } from "react";
import { GetUserNftList } from "../../NftSystem/updateUserNftStorage";
import { countTotalChallengesTimes } from "../../NftSystem/Token/countChallenges";
import { selectCurrentIsGuest } from "../../redux/profile";
import { countReferredUser } from "../../NftSystem/Reward/calculateReferralReward";

interface IRewardProps {}

const Reward: React.FunctionComponent<IRewardProps> = (props) => {
  const navigate = useNavigate();
  const tempAccountId = useSelector(accountId);
  const Ledger2 = useLedger();
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const codeHashIdForNft: string = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const [bmiRecordTimes, setBmiRecordTimes] = React.useState<number>();
  const [nftAcquireNumber, setNftAcquireNumber] = React.useState<number>();
  const [bmiHitHealthyNumber, setBmiHitHealthyNumber] = React.useState<number>();
  const [challengeCompletedTimes, setChallengeCompletedTimes] = React.useState<number>();
  const [referredCount, setReferredCount] = React.useState<number>(0);
  const isGuest = useSelector(selectCurrentIsGuest);

  useEffect(() => {
    if (isGuest) {
      setBmiRecordTimes(0);
      setNftAcquireNumber(0);
      setBmiHitHealthyNumber(0);
      setChallengeCompletedTimes(0);
      setReferredCount(0);
      return;
    }

    getBMIRecordDay(tempAccountId, Ledger2).then((res) => {
      setBmiRecordTimes(res);
    });
    GetUserNftList(Ledger2, tempAccountId, nftDistributor, codeHashIdForNft)
      .then((res) => {
        setNftAcquireNumber(res.length);
      })
      .catch((err) => {
        alert(err);
      });
    countReferredUser(Ledger2!, tempAccountId)
      .then((result) => {
        console.log("referredCount", result);
        setReferredCount(result);
      })
      .catch((e) => {
        console.error(e);
      });

    isHitFirstHealthyBMIRange(tempAccountId, Ledger2).then((ans) => {
      setBmiHitHealthyNumber(ans ? 1 : 0);
    });
    countTotalChallengesTimes(tempAccountId, Ledger2).then((res) => {
      setChallengeCompletedTimes(res);
    });
  }, []);

  const handleRewardDetailDisplayStyle = (isGuest: boolean) => {
    return isGuest ? { opacity: 0.5 } : {};
  };

  const displayCurrentTimes = (id: number) => {
    switch (id) {
      case 1:
        return nftAcquireNumber;
      case 2:
        return bmiRecordTimes;
      case 3:
        return referredCount;
      case 4:
        return challengeCompletedTimes;
      case 5:
        return bmiHitHealthyNumber;
      default:
        return 0;
    }
  };

  const displayRewardList = (isGuest: boolean): JSX.Element[] =>
    rewardDetailList.map((reward) => {
      const { id, title, shortDescription, previewImagePathBig, requireTimes, active } = reward;

      return (
        <div
          className={active ? "rewards-cards" : "rewards-cards opacity-0-5"}
          onClick={() => {
            if (active) navigate(`/rewardDetail/${id}`);
          }}
          key={id}
        >
          {!active && <img src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} className="lock-image" alt="" />}

          <div className="master-collector-5RWzHs inter-semi-bold-white-18px">{title}</div>
          <img className={id === 3 || id === 5 ? "nft_-avatar nft_-avatar-border" :"nft_-avatar"} src={`${process.env.PUBLIC_URL}/${previewImagePathBig}`} alt="NFT_Avatar" />
          <p className="acquire-3-nf-ts-from-our-collection-5RWzHs inter-normal-cadet-blue-12px">{shortDescription}</p>
          <div className="ic_next">
            <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
          </div>
          <div className="goal-data" style={handleRewardDetailDisplayStyle(isGuest)}>
            <div className="x893"></div>
            <div className="goal-YBUPcf goal">
              <div className="x0 inter-semi-bold-keppel-14px">{displayCurrentTimes(id)}</div>
              <div className={"x3-XEqJB9 x3 inter-semi-bold-white-14px"}>/ {requireTimes}</div>
            </div>
          </div>
        </div>
      );
    });

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-rewards-2">
        <ShortTitleBar title="Redeem Rewards" aiCoach={true} setting={true} />
        <div className="reward-cards-container">{displayRewardList(isGuest)}</div>
      </div>
    </div>
  );
  return <CenterLayout content={content} bgImg={false} />;
};

export default Reward;
