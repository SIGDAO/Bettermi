import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import "./rewardDetail.css";
import { CenterLayout } from "../../components/layout";
import { ShortTitleBar } from "../../components/titleBar";
import { rewardDetailList } from "../../data/rewardList";
import { getBMIRecordDay, isHitFirstHealthyBMIRange } from "../../components/bmiCalculate";
import { useSelector } from "react-redux";
import { accountId } from "../../redux/account";
import { selectWalletNodeHost, useLedger } from "../../redux/useLedger";
import { countTotalChallengesTimes } from "../../NftSystem/Token/countChallenges";
import { LedgerClientFactory } from "@signumjs/core";
import { GetUserNftList } from "../../NftSystem/updateUserNftStorage";
import { selectCurrentIsGuest } from "../../redux/profile";
import { GuestConnectWallectButton } from "../../components/button";
import SigdaoIcon from "../../components/icon";

interface IRewardDetailProps {}

const determinePageClass = (id: string) => {
  let classNameList: string[] = [];
  // index 0: the bigger container of finished times finished times / require times
  // index 1: the container of finished times / require times
  // index 2: the container of finished times
  // index 3: the container of require times
  // index 4: the container of the button redeem
  // index 5: the bg of the button redeem
  // index 6: the text of the button redeem
  switch (id) {
    case "1":
      break;
    case "2":
      classNameList.push("goal-data-HSU6AE");
      classNameList.push("goal-i4N5X2");
      classNameList.push("x0-LOKbtF");
      classNameList.push("x3-LOKbtF");
      classNameList.push("button_-redeem-HSU6AE");
      classNameList.push("button1-HGc5Lx");
      classNameList.push("continue-HGc5Lx");
      break;
    case "3":
      classNameList.push("goal-data-3v78GY");
      classNameList.push("goal-w4f5nL");
      classNameList.push("x0-xfYnWc");
      classNameList.push("x3-xfYnWc");
      classNameList.push("button_-redeem-3v78GY");
      classNameList.push("button1-H7SwXN");
      classNameList.push("continue-H7SwXN");
      break;
    case "4":
      classNameList.push("goal-data-sI1BHm");
      classNameList.push("goal-uivXzE");
      classNameList.push("x0-L2kRRH");
      classNameList.push("x3-L2kRRH");
      classNameList.push("button_-redeem-sI1BHm");
      classNameList.push("button1-diHELh");
      classNameList.push("continue-diHELh");
      break;
    default:
      break;
  }
  return classNameList;
};

const RewardDetail: React.FunctionComponent<IRewardDetailProps> = (props) => {
  const { id } = useParams();
  const displayRewardDetail = rewardDetailList.find((item) => item.id === Number(id));
  const pageExist = rewardDetailList.length >= Number(id);
  const isSigdaoReward = typeof displayRewardDetail?.reward === "number";
  const classNameList = determinePageClass(id as string);
  const tempAccountId = useSelector(accountId);
  const isGuest = useSelector(selectCurrentIsGuest);
  const Ledger2 = useLedger();
  const [BMIRecordTimes, setBMIRecordTimes] = React.useState<number>();
  const nodeHost = useSelector(selectWalletNodeHost);
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const codeHashIdForNft: string = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  // const loadNftList = async () => {
  //   try {

  //     userNftList = await GetUserNftList(ledger2, tempAccountId, nftDistributor, codeHashIdForNft);
  //     setMyNfts(userNftList);
  //     setLoadingNft(false);

  //   } catch (e: any) {
  //     console.log(e);
  //   }
  // };

  const getrewardDetailTimes = async () => {
    switch (id) {
      case "1":
        GetUserNftList(ledger2, tempAccountId, nftDistributor, codeHashIdForNft)
          .then((res) => {
            setBMIRecordTimes(res.length);
          })
          .catch((err) => {
            alert(err);
          });
        break;
      case "2":
        setBMIRecordTimes(await getBMIRecordDay(tempAccountId, Ledger2));
        break;
      case "3":
        setBMIRecordTimes(0)
        break;
      case "4":
        isHitFirstHealthyBMIRange(tempAccountId, Ledger2).then((ans) => {
          setBMIRecordTimes(ans ? 1 : 0);
        });
        break;
      case "5":
        setBMIRecordTimes(await countTotalChallengesTimes(tempAccountId, Ledger2));
        break;
      default:
        break;
    }
  };
  const getReward = async () => {
    if (displayRewardDetail?.requireTimes === BMIRecordTimes) {
    }
  };

  useEffect(() => {
    if (isGuest) return;
    getrewardDetailTimes();
  }, []);

  // todo: get user's implement times or other data from blockchain
  const implementTimes = 0;

  // todo: fin tune the style difference between the different reward detail page
  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-rewards-redeem-master-collector-1">
        <ShortTitleBar title={displayRewardDetail?.title} aiCoach={true} setting={true} />
        <img className="photo-P2i95W" src={`${process.env.PUBLIC_URL}/img/rewardDetail/${displayRewardDetail?.bgImagePath}`} alt="Photo" />
        <img className="layer-P2i95W" src={`${process.env.PUBLIC_URL}/img/rewardDetail/layer-2@1x.png`} alt="Layer" />
        {isGuest ? (
        <div className="button_-redeem-P2i95W">
          <GuestConnectWallectButton height={"56px"} width={"248px"} />
        </div>
        ) : (
          <div className={classNameList[4] || "button_-redeem-P2i95W"}>
            <div className={classNameList[5] || "button1-r8fHLz"} />
            <div className={`${classNameList[6] || "continue-r8fHLz"} inter-semi-bold-white-15px`}>Redeem</div>
          </div>
        )}
        <div className="profile-content-P2i95W">
          <div className="master-collector-tOBH5R master-collector">{displayRewardDetail?.title}</div>
          <p className={isSigdaoReward ? "unlocked-by-users-wh-tOBH5R inter-normal-white-14px" : "earned-by-users-who-B1MGte inter-normal-white-14px"}>{displayRewardDetail?.description}</p>
          <p className="better-mi-reserves-t-tOBH5R inter-normal-cadet-blue-12px">
            Bettermi.io reserves the right to the final decision <br />
            in case of any disputes.
          </p>
          {isSigdaoReward ? (
            <>
              <div className="score-bar_3-tOBH5R">
                <div className="sigdao-score-oG1yRx">
                  <div className="x10-ZdA7kA inter-semi-bold-keppel-15px">+{displayRewardDetail?.reward}</div>
                  <SigdaoIcon />
                </div>
              </div>
              <div className="sigdao-tOBH5R inter-semi-bold-white-15px">SIGDAO:</div>
            </>
          ) : (
            <p className="x250-FtIem3">{displayRewardDetail?.reward}</p>
          )}
        </div>

        <div className={classNameList[0] || "goal-data-P2i95W"} style={isGuest ? {opacity: "0.5"} : {}}>
          {/* <div className="x893-LfPhsf"></div> */}
          <div className={classNameList[1] || "goal-LfPhsf"}>
            <div className={`${classNameList[2] || "x0-ucGgAD"} inter-semi-bold-keppel-14px`}>{isGuest ? "0" : BMIRecordTimes}</div>
            <div className={`${classNameList[3] || "x3-ucGgAD"} inter-semi-bold-white-14px`}>/ {displayRewardDetail?.requireTimes}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return !pageExist ? <Navigate to={`/reward`} /> : <CenterLayout content={content} bgImg={false} />;
};

export default RewardDetail;

// if (!pageExist) {
//   return (
//     <CenterLayout
//       content={
//         <div
//           style={
//             {
//               height: '100%',
//               width: '100%',
//               color: 'white',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//           Page not found
//         </div>}
//       bgImg={false}/>
//   )
// }
