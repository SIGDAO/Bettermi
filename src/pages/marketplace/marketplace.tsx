import * as React from 'react';
import { Link } from 'react-router-dom';
import './marketplace.css';
import { CenterLayout } from '../../components/layout';
import MenuBar from '../../components/menuBar';
import { ShortTitleBar } from '../../components/titleBar';
import HorizontalScrollContainer from '../../components/horizontalScrollContainer';
import { useSelector } from 'react-redux';
import { accountId } from '../../redux/account';
import { useLedger } from '../../redux/useLedger';
import { getBMIRecordDay } from '../../components/bmiCalculate';

interface IMarketplaceProps {
}

const Marketplace: React.FunctionComponent<IMarketplaceProps> = (props) => {
  const tempAccountId = useSelector(accountId);
  const Ledger2 = useLedger();
  const [bmiRecordTimes, setBmiRecordTimes] = React.useState<number>(0);

  React.useEffect(() => {
    getBMIRecordDay(tempAccountId, Ledger2)
      .then((res) => {
        setBmiRecordTimes(res);
      })
  }, []);

  
  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-marketplace-1">
        <ShortTitleBar title="Marketplace" />
        <div className="partner-company-y1jIXk partner-company">
          <img className="bg-oobbG1" src={`${process.env.PUBLIC_URL}/img/marketplace/bg-23@1x.png`} alt="bg" />
          <div className="partner-company-oobbG1 partner-company">
            <p className="where-can-i-pay-with-sigdao-vbUx2m">WHERE CAN I PAY WITH SIGDAO?</p>
            <Link to="https://www.bettermi.io/en/partner.html">
              <div className="see-all-vbUx2m see-all inter-medium-royal-blue-14px">Partner</div>
            </Link>
            <p className="discover-thousands-o-vbUx2m">Discover thousands of products that accept SIGDAO!</p>
            <HorizontalScrollContainer inputClassName="x7-vbUx2m">
              <img className="zoe-fitness-8cjGPE zoe-fitness" src={`${process.env.PUBLIC_URL}/img/marketplace/Toget.png`} alt="Zoe Fitness" />
              <img className="vitev-8cjGPE" src={`${process.env.PUBLIC_URL}/img/marketplace/Flower.png`} alt="Vitev" />
              <img className="zoe-fitness-HI0Hnc zoe-fitness" src = {`${process.env.PUBLIC_URL}/img/marketplace/Ruto.png`}/>
              <img className="zoe-fitness-eRgkx7 zoe-fitness" src = {`${process.env.PUBLIC_URL}/img/marketplace/Era.png`}/>
              <img className="zoe-fitness-u91zz4 zoe-fitness" src = {`${process.env.PUBLIC_URL}/img/marketplace/ALC.png`}/>
              <img className="zoe-fitness-aEJ33D zoe-fitness" src = {`${process.env.PUBLIC_URL}/img/marketplace/FlavourHouse.png`}/>
              <img className="zoe-fitness-Jc5OoT zoe-fitness" src = {`${process.env.PUBLIC_URL}/img/marketplace/BPSAA-Logo-NFT.png`}/>
              <img className="zoe-fitness-SxtrzH zoe-fitness" src = {`${process.env.PUBLIC_URL}/img/marketplace/Chuen-Yik-Logo-NFT.png`}/>
              <img className="zoe-fitness-ppgU72 zoe-fitness" src = {`${process.env.PUBLIC_URL}/img/marketplace/Fourcheer-Logo-NFT.png`}/>
            </HorizontalScrollContainer>
          </div>
          <div className="redeem-rewards-oobbG1">REWARD REDEEM</div>
          <Link to="/reward">
            <div className="see-all-oobbG1 see-all inter-medium-royal-blue-14px">See all</div>
          </Link>
          <HorizontalScrollContainer inputClassName="x8-oobbG1">
            <Link to='/rewardDetail/1'>
              <div className="rewards-cards-PbMWvx rewards-cards">
                <img className="card_bg" src={`${process.env.PUBLIC_URL}/img/marketplace/card-bg-1@1x.png`} alt="Card_bg" />
                <div className="master-collector-YV3xtK inter-semi-bold-white-18px">Master Collector</div>
                <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/marketplace/nft-avatar-4@1x.png`} alt="NFT_Avatar" />
                <p className="acquire-3-nf-ts-from-our-collection-YV3xtK inter-normal-cadet-blue-12px">
                  Acquire 3 NFTs from our collection.
                </p>
                <div className="ic_next">
                  <img
                    className="ic_chevron_right_24px"
                    src={`${process.env.PUBLIC_URL}/img/marketplace/ic-chevron-right-24px-1@1x.png`}
                    alt="ic_chevron_right_24px"
                    />
                </div>
                <div className="goal-data">
                  <div className="x893"></div>
                  <div className="goal-xzndZB goal">
                    <div className="x0-1Jks0w x0-marketplace inter-semi-bold-keppel-14px">0</div>
                    <div className="x3-1Jks0w x3 inter-semi-bold-white-14px">/ 3</div>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/rewardDetail/2" >
              <div className="rewards-cards-dMXoGx rewards-cards">
                <img className="card_bg" src={`${process.env.PUBLIC_URL}/img/marketplace/card-bg-1@1x.png`} alt="Card_bg" />
                <div className="selfie-champion-gKPNC7 inter-semi-bold-white-18px">Selfie Champion</div>
                <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/marketplace/nft-avatar-5@1x.png`} alt="NFT_Avatar" />
                <p className="selfies-for-60-consecutive-days-gKPNC7 inter-normal-cadet-blue-12px">
                  Selfies for 60 consecutive days
                </p>
                <div className="ic_next">
                  <img
                    className="ic_chevron_right_24px"
                    src={`${process.env.PUBLIC_URL}/img/marketplace/ic-chevron-right-24px-1@1x.png`}
                    alt="ic_chevron_right_24px"
                    />
                </div>
                <div className="goal-data">
                  <div className="x893"></div>
                  <div className="goal-unXPox goal">
                    <div className="x0-KUFXm3 x0-marketplace inter-semi-bold-keppel-14px">{bmiRecordTimes}</div>
                    <div className="x3-KUFXm3 x3 inter-semi-bold-white-14px">/ 60</div>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/rewardDetail/3" >
              <div className="rewards-cards-YuvWOM rewards-cards">
                <img className="card_bg" src={`${process.env.PUBLIC_URL}/img/marketplace/card-bg-1@1x.png`} alt="Card_bg" />
                <div className="social-butterfly-00FLo4 inter-semi-bold-white-18px">Elite Challenger</div>
                <img className="nft_-avatar" src={`${process.env.PUBLIC_URL}/img/marketplace/nft-avatar-7@1x.png`} alt="NFT_Avatar" />
                <p className="build-a-thriving-network-of-75-friends-00FLo4 inter-normal-cadet-blue-12px">
                  Complete 50 challenges
                </p>
                <div className="ic_next">
                  <img
                    className="ic_chevron_right_24px"
                    src={`${process.env.PUBLIC_URL}/img/marketplace/ic-chevron-right-24px-1@1x.png`}
                    alt="ic_chevron_right_24px"
                    />
                </div>
                <div className="goal-data">
                  <div className="x893"></div>
                  <div className="goal-4xB4wg goal">
                    <div className="x0-mOFaDT x0-marketplace inter-semi-bold-keppel-14px">0</div>
                    <div className="x3-mOFaDT x3 inter-semi-bold-white-14px">/ 50</div>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/rewardDetail/4" >
              <div className="rewards-cards-DNKKjx rewards-cards">
                <img className="card_bg" src={`${process.env.PUBLIC_URL}/img/marketplace/card-bg-1@1x.png`} alt="Card_bg" />
                <div className="elite-challenger-VtU7WE inter-semi-bold-white-18px">Wellness Milestone</div>
                <img className="nft_-avatar-new" src={`${process.env.PUBLIC_URL}/img/reward/Wellness_Milestone_Square.png`} alt="NFT_Avatar" />
                <div className="complete-50-challenges-VtU7WE inter-normal-cadet-blue-12px">Hit the first healthy BMI range</div>
                <div className="ic_next">
                  <img
                    className="ic_chevron_right_24px"
                    src={`${process.env.PUBLIC_URL}/img/marketplace/ic-chevron-right-24px-1@1x.png`}
                    alt="ic_chevron_right_24px"
                    />
                </div>
                <div className="goal-data">
                  <div className="x893"></div>
                  <div className="goal-0yTxuU goal">
                    <div className="x0-T9m1oI x0 inter-semi-bold-keppel-14px">0</div>
                    <div className="x3-T9m1oI x3 inter-semi-bold-white-14px">/ 1</div>
                  </div>
                </div>
              </div>
            </Link>
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
              <div className="x0-Y63lEW x0-marketplace"><img className="x1-z2FCJz x1" src={`${process.env.PUBLIC_URL}/img/marketplace/Hot_Deals_Free_Consultation_Sample.png`} alt="1" /></div>
              <div className="x1-Y63lEW x1-no-border"><img className="x1-0pT4eI x1" src={`${process.env.PUBLIC_URL}/img/marketplace/Hot_Deals_Product_Discount_Sample.png`} alt="1" /></div>
              <div className="x2-Y63lEW"><img className="x1-EMGmsF x1" src={`${process.env.PUBLIC_URL}/img/marketplace/Hot_Deals_Service_Sample.png`} alt="1" /></div>
            </div>
          </HorizontalScrollContainer>
        </div>
        <MenuBar/>
      </div>
    </div>
  )


  return (
    <CenterLayout
      content={content}
      bgImg={false}
    />
  );
};

export default Marketplace;
