import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import "./marketplace.css";
import { CenterLayout } from "../../components/layout";
import MenuBar from "../../components/menuBar";
import { ShortTitleBar } from "../../components/titleBar";
import HorizontalScrollContainer from "../../components/horizontalScrollContainer";
import { useSelector } from "react-redux";
import { accountId } from "../../redux/account";
import { useLedger } from "../../redux/useLedger";
import { getBMIRecordDay, isHitFirstHealthyBMIRange } from "../../components/bmiCalculate";
import { CountChallenges, countTotalChallengesTimes } from "../../NftSystem/Token/countChallenges";
import { GetUserNftList } from "../../NftSystem/updateUserNftStorage";
import { selectCurrentIsGuest } from "../../redux/profile";
import { rewardDetailList, rewardDetailListProps } from "../../data/rewardList";
import { countReferredUser } from "../../NftSystem/Reward/calculateReferralReward";
import { LedgerClientFactory } from "@signumjs/core";

interface IMarketplaceProps {}

const sponsorImageList = [
  "/img/marketplace/zomate-fitness-logo-nft-436x436.png",
  "/img/marketplace/ichio-logo-nft-436x436.png",
  "/img/marketplace/ycy-logo-nft.png",
  // "/img/marketplace/Era.png",
  "/img/marketplace/philo-logo-nft-436x436.png",
  "/img/marketplace/together-matching-logo-nft-436x436.png",
  "/img/marketplace/BPSAA-Logo-NFT.png",
  "/img/marketplace/Chuen-Yik-Logo-NFT.png",
  "/img/marketplace/Fourcheer-Logo-NFT.png",
];

const Marketplace: React.FunctionComponent<IMarketplaceProps> = (props) => {
  const tempAccountId = useSelector(accountId);
  const Ledger2 = useLedger();
  const isGuest = useSelector(selectCurrentIsGuest);
  const navigate = useNavigate();

  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const codeHashIdForNft: string = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const [bmiRecordTimes, setBmiRecordTimes] = React.useState<number>();
  const [bmiHitHealthyNumber, setBmiHitHealthyNumber] = React.useState<number>();
  const [challengeCompletedTimes, setChallengeCompletedTimes] = React.useState<number>();
  const [nftAcquireNumber, setNftAcquireNumber] = React.useState<number>();
  const [referredCount, setReferredCount] = React.useState<number>();

  const implementReward = (reward: rewardDetailListProps) => {
    switch (reward.id) {
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

  const sponsorImageDisplay: JSX.Element[] = sponsorImageList.map((imagePath) => {
    return (
      <div className="zoe-fitness-container">
        <img className={imagePath === "/img/marketplace/Era.png" ? "zoe-fitness-not-scaleup" : "zoe-fitness"} src={`${process.env.PUBLIC_URL + imagePath}`} alt="Zoe Fitness" />
      </div>
    );
  });
  const BMIRecordChecked = useRef(false);
  React.useEffect(() => {
    if (isGuest || BMIRecordChecked.current) {
      setBmiHitHealthyNumber(0);
      setBmiRecordTimes(0);
      setChallengeCompletedTimes(0);
      setNftAcquireNumber(0);
      setReferredCount(0);
      return;
    }
    BMIRecordChecked.current = true;
    console.log("called twice");
    getBMIRecordDay(tempAccountId, Ledger2).then((res) => {
      setBmiRecordTimes(res);
    });
    isHitFirstHealthyBMIRange(tempAccountId, Ledger2).then((ans) => {
      setBmiHitHealthyNumber(ans ? 1 : 0);
    });
    countTotalChallengesTimes(tempAccountId, Ledger2).then((res) => {
      setChallengeCompletedTimes(res);
    });
    countReferredUser(Ledger2!, tempAccountId)
    .then((result) => {
      console.log("referredCount", result);
      setReferredCount(result);
    })
    .catch((e) => {
      console.error(e);
    });
    GetUserNftList(Ledger2, tempAccountId, nftDistributor, codeHashIdForNft)
      .then((res) => {
        setNftAcquireNumber(res.length);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const rewardDisplay: JSX.Element[] = rewardDetailList.map((reward) => {
    const determinRewardPath = () => {
      if (reward.active) {
        navigate(`/rewardDetail/${reward.id}`);
      }
    };

    return (
      <div className={reward.active ? "rewards-cards" : "rewards-cards rewards-cards-disable-content"} onClick={() => determinRewardPath()}>
        {!reward.active && <img src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} className="lock-image" alt="" />}

        <div className={reward.id === 5 || reward.id === 3 ? "marketplace-rewards-image-container-border" : "marketplace-rewards-image-container"}>
          <img className="marketplace-rewards-image" src={`${process.env.PUBLIC_URL}/${reward.previewImagePath}`} alt="NFT_Avatar" />
        </div>
        <div className="marketplace-rewards-information">
          <div className="rewards-title inter-semi-bold-white-18px">{reward.title}</div>
          <div className="rewards-description inter-normal-cadet-blue-12px">{reward.shortDescription}</div>
          <div className="marketplace-rewards-goal-container">
            <div className={isGuest ? "rewards-goal opacity-0-5" : "rewards-goal"}>
              <div className="rewards-goal-number inter-semi-bold-keppel-14px">{implementReward(reward)}</div>
              <div className={"rewards-goal-text inter-semi-bold-white-14px"}>/ {reward.requireTimes}</div>
            </div>
            <div className="marketplace_ic_next">
              <img className="marketplace_ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/marketplace/ic-chevron-right-24px-1@1x.png`} alt="marketplace_ic_chevron_right_24px" />
            </div>
          </div>
        </div>
      </div>
    );
  });

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-marketplace-1">
        <ShortTitleBar title="Marketplace" aiCoach={true} setting={true} />
        <div className="partner-company-y1jIXk partner-company">
          <img className="bg-oobbG1" src={`${process.env.PUBLIC_URL}/img/marketplace/bg-23@1x.png`} alt="bg" />
          <div className="partner-company-oobbG1 partner-company">
            <p className="where-can-i-pay-with-sigdao-vbUx2m">WHERE CAN I PAY WITH SIGDAO?</p>
            <Link to="https://www.bettermi.io/en/partner.html" target="_blank" rel="noopener noreferrer">
              <div className="see-all-vbUx2m see-all inter-medium-royal-blue-14px">Partner</div>
            </Link>
            <p className="discover-thousands-o-vbUx2m">Discover thousands of products that accept SIGDAO!</p>
            <HorizontalScrollContainer inputClassName="sponser-image-container">
              <div className="x7-vbUx2m">{sponsorImageDisplay}</div>
            </HorizontalScrollContainer>
          </div>
          <div className="redeem-rewards-oobbG1">REWARD REDEEM</div>
          <Link to="/reward">
            <div className="see-all-oobbG1 see-all inter-medium-royal-blue-14px">See all</div>
          </Link>
          <HorizontalScrollContainer inputClassName="x8-oobbG1">
            <div className="reward-card-container">{rewardDisplay}</div>
          </HorizontalScrollContainer>
        </div>
        <div className="partner-company-Rea9Nd partner-company">
          <div className="bg-AStx0d"></div>
          <div className="hot-deals-AStx0d">HOT DEALS</div>
          {/* <Link to="https://www.bettermi.io/" >
            <div className="see-all-AStx0d see-all inter-medium-royal-blue-14px">See all</div>
          </Link> */}
          <HorizontalScrollContainer inputClassName="special-scroll-AStx0d">
            <div className="x25-Wx9nPx">
              <div className="x0-Y63lEW x0-marketplace">
                <img className="x1-z2FCJz x1" src={`${process.env.PUBLIC_URL}/img/marketplace/Hot_Deals_Free_Consultation_Sample.png`} alt="1" />
              </div>
              <div className="x1-Y63lEW x1-no-border">
                <img className="x1-0pT4eI x1" src={`${process.env.PUBLIC_URL}/img/marketplace/Hot_Deals_Product_Discount_Sample.png`} alt="1" />
              </div>
              <div className="x2-Y63lEW">
                <img className="x1-EMGmsF x1" src={`${process.env.PUBLIC_URL}/img/marketplace/Hot_Deals_Service_Sample.png`} alt="1" />
              </div>
            </div>
          </HorizontalScrollContainer>
        </div>
        <MenuBar />
      </div>
    </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default Marketplace;

// <HorizontalScrollContainer inputClassName="x8-oobbG1">
// <Link to="/rewardDetail/1">
//   <div className="rewards-cards-PbMWvx rewards-cards">
//     <div className="master-collector-YV3xtK inter-semi-bold-white-18px">Master Collector</div>
//     <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/marketplace/nft-avatar-4@1x.png`} alt="NFT_Avatar" />
//     <p className="acquire-3-nf-ts-from-our-collection-YV3xtK inter-normal-cadet-blue-12px">Acquire 3 NFTs from our collection.</p>
//     <div className="marketplace_ic_next">
//       <img className="marketplace_ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/marketplace/ic-chevron-right-24px-1@1x.png`} alt="marketplace_ic_chevron_right_24px" />
//     </div>
//     <div className="goal-data">
//       <div className="x893"></div>
//       <div className="goal-xzndZB goal">
//         <div className="x0-1Jks0w x0-marketplace inter-semi-bold-keppel-14px">{nftAcquireNumber}</div>
//         <div className="x3-1Jks0w x3 inter-semi-bold-white-14px">/ 3</div>
//       </div>
//     </div>
//   </div>
// </Link>
// <Link to="/rewardDetail/2">
//   <div className="rewards-cards-dMXoGx rewards-cards">
//     <div className="selfie-champion-gKPNC7 inter-semi-bold-white-18px">Selfie Champion</div>
//     <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/marketplace/nft-avatar-5@1x.png`} alt="NFT_Avatar" />
//     <p className="selfies-for-60-consecutive-days-gKPNC7 inter-normal-cadet-blue-12px">Selfies for 60 consecutive days</p>
//     <div className="marketplace_ic_next">
//       <img className="marketplace_ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/marketplace/ic-chevron-right-24px-1@1x.png`} alt="marketplace_ic_chevron_right_24px" />
//     </div>
//     <div className="goal-data">
//       <div className="x893"></div>
//       <div className="goal-unXPox goal">
//         <div className="x0-KUFXm3 x0-marketplace inter-semi-bold-keppel-14px">{bmiRecordTimes}</div>
//         <div className={isGuest ? "x3-KUFXm3 x3 inter-semi-bold-keppel-14px" : "x3-KUFXm3 x3 inter-semi-bold-white-14px"}>/ 60</div>
//       </div>
//     </div>
//   </div>
// </Link>
// {/* <Link to="/rewardDetail/4"> */}
// <div className="rewards-cards rewards-cards-YuvWOM">
//   <img src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} className="lock-image" alt="" />
//   <div className="rewards-cards-disable-content">
//     <div className="social-butterfly-00FLo4 inter-semi-bold-white-18px">Elite Challenger</div>
//     <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/marketplace/nft-avatar-7@1x.png`} alt="NFT_Avatar" />
//     <p className="build-a-thriving-network-of-75-friends-00FLo4 inter-normal-cadet-blue-12px">Complete 50 challenges</p>
//     <div className="marketplace_ic_next">
//       <img className="marketplace_ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/marketplace/ic-chevron-right-24px-1@1x.png`} alt="marketplace_ic_chevron_right_24px" />
//     </div>
//     <div className="goal-data">
//       <div className="x893"></div>
//       <div className="goal-4xB4wg goal">
//         {/* <div className="x0-mOFaDT x0-marketplace inter-semi-bold-keppel-14px">{challengeCompletedTimes}</div> */}
//         <div className="x0-mOFaDT x0-marketplace inter-semi-bold-keppel-14px">0</div>
//         <div className="x3-mOFaDT x3 inter-semi-bold-white-14px">/ 50</div>
//       </div>
//     </div>
//   </div>
// </div>
// {/* </Link> */}
// {/* <Link to="/rewardDetail/3" > */}
// <div className="rewards-cards rewards-cards-DNKKjx">
//   <div className="rewards-cards-disable-content">
//     <img src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} className="lock-image" alt="" />

//     <div className="elite-challenger-VtU7WE inter-semi-bold-white-18px">Wellness Milestone</div>
//     <img className="nft_-avatar-new" src={`${process.env.PUBLIC_URL}/img/reward/Wellness_Milestone_Square.png`} alt="NFT_Avatar" />
//     <div className="complete-50-challenges-VtU7WE inter-normal-cadet-blue-12px">Hit the first healthy BMI range</div>
//     <div className="marketplace_ic_next">
//       <img className="marketplace_ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/marketplace/ic-chevron-right-24px-1@1x.png`} alt="marketplace_ic_chevron_right_24px" />
//     </div>
//     <div className="goal-data">
//       <div className="x893"></div>
//       <div className="goal-0yTxuU goal">
//         {/* <div className="x0-T9m1oI x0 inter-semi-bold-keppel-14px">{bmiHitHealthyNumber}</div> */}
//         <div className="x0-T9m1oI x0 inter-semi-bold-keppel-14px">0</div>
//         <div className="x3-T9m1oI x3 inter-semi-bold-white-14px">/ 1</div>
//       </div>
//     </div>
//   </div>
// </div>
// {/* </Link> */}
// </HorizontalScrollContainer>
