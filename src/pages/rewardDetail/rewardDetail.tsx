import React, { useEffect, useRef } from "react";
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
import { GuestConnectWallectButton, PurpleButton } from "../../components/button";
import SigdaoIcon from "../../components/icon";
import { countReferredUser } from "../../NftSystem/Reward/calculateReferralReward";
import axios from "axios";

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
  const pageExist = displayRewardDetail ? displayRewardDetail.active : false;
  const isSigdaoReward = typeof displayRewardDetail?.reward === "number";
  // const classNameList = determinePageClass(id as string);
  const tempAccountId = useSelector(accountId);
  const isGuest = useSelector(selectCurrentIsGuest);
  const Ledger2 = useLedger();
  const [BMIRecordTimes, setBMIRecordTimes] = React.useState<number>();
  const nodeHost = useSelector(selectWalletNodeHost);
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const codeHashIdForNft: string = process.env.REACT_APP_NFT_MACHINE_CODE_HASH!;
  const tokenId: string = process.env.REACT_APP_TOKEN_ID!;
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const mimiNftStorageAccounts = process.env.REACT_APP_NFT_STORAGE_MIMI!.split(",");
  const ioNftStorageAccounts = process.env.REACT_APP_NFT_STORAGE_IO!.split(",");
  const storageAccounts = [...mimiNftStorageAccounts, ...ioNftStorageAccounts];

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
        const referredNum = await countReferredUser(ledger2, tempAccountId);
        setBMIRecordTimes(referredNum);
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
    try {
      if (!BMIRecordTimes) return;

      if (BMIRecordTimes! >= displayRewardDetail!.requireTimes) {
        switch (id) {
          case "1":
            await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/masterCollectorRedeemReward/", {
              accountId: tempAccountId,
            });

            break;
          case "2":
            await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/selfieChampionRedeemReward", {
              userAccountId: tempAccountId,
              codeHashIdForNFT: codeHashIdForNft,
              nftStorageAccounts: storageAccounts,
            });
            break;
          case "3":
            await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/superConnectorRedeemReward", {
              userAccountId: tempAccountId,
              assetId: tokenId,
            });
            break;
          case "4":
            await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/eliteChallengerRedeemReward", {
              userAccountId: tempAccountId,
              assetId: tokenId,
              nftStorageAccounts: storageAccounts,
              codeHashIdForNft: codeHashIdForNft,
            });
            break;
          case "5":
            await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/wellnessMilestoneRedeemReward", {
              userAccountId: tempAccountId,
            });
            break;
          default:
            break;
        }
      }
    } catch (e) {
      alert("an error has occured during connection to server. Please try again or contact us.");
    }
  };

  const rewardRedeemButton: JSX.Element = (
    <>{isGuest ? <GuestConnectWallectButton height={"56px"} width={"248px"} /> : <PurpleButton action={() => getReward()} text={"Redeem"} height={"56px"} width={"248px"} />}</>
  );

  const rewardDetailReward: JSX.Element = (
    <>
      {isSigdaoReward ? (
        <div className="reward-detail-score-container">
          <div className="inter-semi-bold-white-15px">SIGDAO:</div>

          <div className="sigdao-score-oG1yRx">
            <SigdaoIcon />
            <div className="inter-semi-bold-keppel-15px">+{displayRewardDetail?.reward}</div>
          </div>
        </div>
      ) : (
        <p className="reward-detail-reward inter-semi-bold-keppel-15px">{displayRewardDetail?.reward}</p>
      )}
    </>
  );

  const isRunned = useRef(false);

  useEffect(() => {
    if (isGuest) return;
    if (isRunned.current) {
      return;
    }
    isRunned.current = true;
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
        <div className="reward-content-container">
          <div className={isSigdaoReward ? "reward-content" : "reward-content-not-sigdao"}>
            <div className={isSigdaoReward ? "reward-detail-description" : "reward-detail-description-not-sigdao"}>
              <div className="inter-semi-bold-white-22px">{displayRewardDetail?.title}</div>
              {rewardDetailReward}
              <p className={"reward-content-description inter-normal-white-14px"}>{displayRewardDetail?.description}</p>
            </div>

            <div className={"goal-data-container"} style={isGuest ? { opacity: "0.5" } : {}}>
              <div className={"reward-detail-goal-data"}>
                <div className={`inter-semi-bold-keppel-14px`}>{isGuest ? "0" : BMIRecordTimes}</div>
                <div className={`inter-semi-bold-white-14px`}>/ {displayRewardDetail?.requireTimes}</div>
              </div>
            </div>
            {rewardRedeemButton}
            <p className="better-mi-reserves-t-tOBH5R inter-normal-cadet-blue-12px">
              Bettermi.io reserves the right to the final decision <br />
              in case of any disputes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return !pageExist ? <Navigate to={`/reward`} /> : <CenterLayout content={content} bgImg={false} />;
};

export default RewardDetail;
