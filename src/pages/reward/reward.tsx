import * as React from "react";
import "./reward.css";
import { Link } from "react-router-dom";
import MenuBar from "../../components/menuBar";
import { CenterLayout } from "../../components/layout";
import { ShortTitleBar } from "../../components/titleBar";
import { rewardDetailList } from "../../data/rewardList";
import { getBMIRecordDay } from "../../components/bmiCalculate";
import { useSelector } from "react-redux";
import { accountId } from "../../redux/account";
import { useLedger } from "../../redux/useLedger";
import { useEffect } from "react";

interface IRewardProps {}

const Reward: React.FunctionComponent<IRewardProps> = (props) => {
  const tempAccountId = useSelector(accountId);
  const Ledger2 = useLedger();
  const [bmiRecordTimes, setBmiRecordTimes] = React.useState<number>(0);
  
  
  useEffect(() => {
    getBMIRecordDay(tempAccountId, Ledger2)
      .then((res) => {
        setBmiRecordTimes(res);
      })
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

  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-rewards-2">
        <ShortTitleBar title="Redeem Rewards" />
        {/* <img className="bg-kQlY8S bg" src={`${process.env.PUBLIC_URL}/img/reward/bg-14-1x-png@1x.png`} alt="BG" /> */}
        {/* <div className="reward-list-container"> */}
          {/* {redeemCard} */}
        {/* </div> */}
        <Link to="/rewardDetail/1">
          <div className="rewards-cards-kQlY8S rewards-cards">
            <img className="card_bg" src={`${process.env.PUBLIC_URL}/img/reward/card-bg-1@1x.png`} alt="Card_bg" />
            <div className="master-collector-5RWzHs inter-semi-bold-white-18px">Master Collector</div>
            <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/reward/nft-avatar-4@1x.png`} alt="NFT_Avatar" />
            <p className="acquire-3-nf-ts-from-our-collection-5RWzHs inter-normal-cadet-blue-12px">Acquire 3 NFTs from our collection.</p>
            <div className="ic_next">
              <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
            </div>
            <div className="goal-data">
              <div className="x893"></div>
              <div className="goal-YBUPcf goal">
                <div className="x0 inter-semi-bold-keppel-14px">0</div>
                <div className="x3-XEqJB9 x3 inter-semi-bold-white-14px">/ 3</div>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/rewardDetail/2">
          <div className="rewards-cards-TttECi rewards-cards">
            <img className="card_bg" src={`${process.env.PUBLIC_URL}/img/reward/card-bg-1@1x.png`} alt="Card_bg" />
            <div className="selfie-champion-O07kH5 inter-semi-bold-white-18px">Selfie Champion</div>
            <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/reward/nft-avatar-5@1x.png`} alt="NFT_Avatar" />
            <p className="selfies-for-60-consecutive-days-O07kH5 inter-normal-cadet-blue-12px">Selfies for 60 consecutive days</p>
            <div className="ic_next">
              <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
            </div>
            <div className="goal-data">
              <div className="x893"></div>
              <div className="goal-hfcLyr goal">
                <div className="x0 inter-semi-bold-keppel-14px">{bmiRecordTimes}</div>
                <div className="x3-eZrkM2 x3 inter-semi-bold-white-14px">/ 60</div>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/rewardDetail/4">
          <div className="rewards-cards-xzgu34 rewards-cards">
            <img className="card_bg" src={`${process.env.PUBLIC_URL}/img/reward/card-bg-1@1x.png`} alt="Card_bg" />
            <div className="social-butterfly-nGgOF5 inter-semi-bold-white-18px">Elite Challenger</div>
            <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/reward/nft-avatar-7@1x.png`} alt="NFT_Avatar" />
            <p className="build-a-thriving-network-of-75-friends-nGgOF5 inter-normal-cadet-blue-12px">Complete 50 challenges</p>
            <div className="ic_next">
              <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
            </div>
            <div className="ic_next">
              <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
            </div>
            <div className="goal-data">
              <div className="x893"></div>
              <div className="goal-1TY7aZ goal">
                <div className="x0 inter-semi-bold-keppel-14px">0</div>
                <div className="x3-E0cPgC x3 inter-semi-bold-white-14px">/ 50</div>
              </div>
            </div>
          </div>
        </Link>
        <Link to="/rewardDetail/3">
          <div className="rewards-cards-C55ruw rewards-cards">
            <img className="card_bg" src={`${process.env.PUBLIC_URL}/img/reward/card-bg-1@1x.png`} alt="Card_bg" />
            <div className="elite-challenger-yvS2xN inter-semi-bold-white-18px">Wellness Milestone</div>
            <div className="Wellness-Milestone-reward-list-container">
              <img className="nft_-avatar-new" src={`${process.env.PUBLIC_URL}/img/reward/Wellness_Milestone_Square.png`} alt="NFT_Avatar" />
            </div>
            <div className="complete-50-challenges-yvS2xN inter-normal-cadet-blue-12px">Hit the first healthy BMI range</div>
            <div className="ic_next">
              <img className="ic_chevron_right_24px" src={`${process.env.PUBLIC_URL}/img/reward/ic-chevron-right-24px-1@1x.png`} alt="ic_chevron_right_24px" />
            s</div>
            <div className="goal-data">
              <div className="x893"></div>
              <div className="goal-hu1xkO goal">
                <div className="x0 inter-semi-bold-keppel-14px">0</div>
                <div className="x3-SJHvta x3 inter-semi-bold-white-14px">/ 1</div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
  return <CenterLayout content={content} bgImg={false} />;
};

export default Reward;
