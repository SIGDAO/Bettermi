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

interface IRewardProps {}

const Reward: React.FunctionComponent<IRewardProps> = (props) => {
  const navigate = useNavigate();
  const tempAccountId = useSelector(accountId);
  const Ledger2 = useLedger();
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const codeHashIdForNft: string = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const [bmiRecordTimes, setBmiRecordTimes] = React.useState<number>(0);
  const [nftAcquireNumber, setNftAcquireNumber] = React.useState<number>();
  const [bmiHitHealthyNumber, setBmiHitHealthyNumber] = React.useState<number>();
  const [challengeCompletedTimes, setChallengeCompletedTimes] = React.useState<number>();
  const isGuest = useSelector(selectCurrentIsGuest);

  useEffect(() => {
    if (isGuest) {
      setBmiRecordTimes(0);
      setNftAcquireNumber(0);
      setBmiHitHealthyNumber(0);
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
    isHitFirstHealthyBMIRange(tempAccountId, Ledger2).then((ans) => {
      setBmiHitHealthyNumber(ans ? 1 : 0);
    });
    countTotalChallengesTimes(tempAccountId, Ledger2).then((res) => {
      setChallengeCompletedTimes(res);
    });
  }, []);

  // const redeemCard = rewardDetailList.map((cardContent) => (
  //   <div className="rewards-cards">
  //     {/* <img className="card_bg" src={`${process.env.PUBLIC_URL}/img/reward/card-bg-1@1x.png`} alt="Card_bg" /> */}
  //     <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/reward/nft-avatar-4@1x.png`} alt="NFT_Avatar" />
  //     <div className="rewards-cards-detail-container">
  //       <div className="master-collector-5RWzHs inter-semi-bold-white-18px">Master Collector</div>
  //       <p className="reward-card-description inter-normal-cadet-blue-12px">Acquire 3 NFTs from our collection.</p>
  //       <div className="ic_next">
  //         <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
  //       </div>
  //       <div className="goal-data">
  //         <div className="x893"></div>
  //         <div className="goal-YBUPcf goal">
  //           <div className="x0 inter-semi-bold-keppel-14px">0</div>
  //           <div className="x3-XEqJB9 x3 inter-semi-bold-white-14px">/ 3</div>
  //         </div>
  //       </div>

  //     </div>
  //   </div>
  // ));

  const handleRewardDetailDisplayStyle = (isGuest: boolean) => {
    return isGuest ? { opacity: 0.5 } : {};
  };

  const displayRewardList = (isGuest: boolean): JSX.Element[] =>
    rewardDetailList.map((reward) => {
      const { id, title, shortDescription, previewImagePathBig, requireTimes, active } = reward;

      const displayCurrentTimes = (id: number) => {
        switch (id) {
          case 1:
            return nftAcquireNumber;
          case 2:
            return bmiRecordTimes;
          case 3:
            return 0;
          case 4:
            return challengeCompletedTimes;
          case 5:
            return bmiHitHealthyNumber;
          default:
            return 0;
        }
      };

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
          <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/${previewImagePathBig}`} alt="NFT_Avatar" />
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
        {/* <img className="bg-kQlY8S bg" src={`${process.env.PUBLIC_URL}/img/reward/bg-14-1x-png@1x.png`} alt="BG" /> */}
        {/* <div className="reward-list-container"> */}
        {/* {redeemCard} */}
        {/* </div> */}
        <div className="reward-cards-container">
          {displayRewardList(isGuest)}

        </div>
        {/* <Link to="/rewardDetail/1">
          <div className="rewards-cards-kQlY8S rewards-cards">
            <div className="master-collector-5RWzHs inter-semi-bold-white-18px">Master Collector</div>
            <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/reward/nft-avatar-4@1x.png`} alt="NFT_Avatar" />
            <p className="acquire-3-nf-ts-from-our-collection-5RWzHs inter-normal-cadet-blue-12px">Acquire 3 NFTs from our collection.</p>
            <div className="ic_next">
              <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
            </div>
            <div className="goal-data" style={handleRewardDetailDisplayStyle(isGuest)}>
              <div className="x893"></div>
              <div className="goal-YBUPcf goal">
                <div className="x0 inter-semi-bold-keppel-14px">{nftAcquireNumber}</div>
                <div className={"x3-XEqJB9 x3 inter-semi-bold-white-14px"}>/ 3</div>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/rewardDetail/2">
          <div className="rewards-cards-TttECi rewards-cards">
            <div className="selfie-champion-O07kH5 inter-semi-bold-white-18px">Selfie Champion</div>
            <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/reward/nft-avatar-5@1x.png`} alt="NFT_Avatar" />
            <p className="selfies-for-60-consecutive-days-O07kH5 inter-normal-cadet-blue-12px">Selfies for 60 consecutive days</p>
            <div className="ic_next">
              <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
            </div>
            <div className="goal-data" style={handleRewardDetailDisplayStyle(isGuest)}>
              <div className="x893"></div>
              <div className="goal-hfcLyr goal">
                <div className="x0 inter-semi-bold-keppel-14px">{bmiRecordTimes}</div>
                <div className={"x3-eZrkM2 x3 inter-semi-bold-white-14px"}>/ 60</div>
              </div>
            </div>
          </div>
        </Link>
        <div className="rewards-cards-xzgu34 rewards-cards">
          <img src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} className="lock-image" alt="" />

          <div className="rewards-cards-disable-content">
            <div className="social-butterfly-nGgOF5 inter-semi-bold-white-18px">Elite Challenger</div>
            <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/reward/nft-avatar-7@1x.png`} alt="NFT_Avatar" />
            <p className="build-a-thriving-network-of-75-friends-nGgOF5 inter-normal-cadet-blue-12px">Complete 50 challenges</p>
            <div className="ic_next">
              <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
            </div>
            <div className="ic_next">
              <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
            </div>
            <div className="goal-data" style={handleRewardDetailDisplayStyle(isGuest)}>
              <div className="x893"></div>
              <div className="goal-1TY7aZ goal">
                <div className="x0 inter-semi-bold-keppel-14px">0</div>
                <div className={"x3-E0cPgC x3 inter-semi-bold-white-14px"}>/ 50</div>
              </div>
            </div>
          </div>
        </div>
        <div className="rewards-cards-C55ruw rewards-cards">
          <img src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} className="lock-image" alt="" />

          <div className="rewards-cards-disable-content">
            <div className="elite-challenger-yvS2xN inter-semi-bold-white-18px">Wellness Milestone</div>
            <div className="Wellness-Milestone-reward-list-container">
              <img className="nft_-avatar-new" src={`${process.env.PUBLIC_URL}/img/reward/Wellness_Milestone_Square.png`} alt="NFT_Avatar" />
            </div>
            <div className="complete-50-challenges-yvS2xN inter-normal-cadet-blue-12px">Hit the first healthy BMI range</div>
            <div className="ic_next">
              <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />s
            </div>
            <div className="goal-data" style={handleRewardDetailDisplayStyle(isGuest)}>
              <div className="x893"></div>
              <div className="goal-hu1xkO goal">
                <div className="x0 inter-semi-bold-keppel-14px">{bmiHitHealthyNumber}</div>
                <div className={"x3-SJHvta x3 inter-semi-bold-white-14px"}>/ 1</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
  return <CenterLayout content={content} bgImg={false} />;
};

export default Reward;
