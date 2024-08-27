import * as React from "react";
import "./couponDetail.css";
import { CenterLayout } from "../../components/layout";
import { ShortTitleBar } from "../../components/titleBar";
import { Link ,useParams} from "react-router-dom";
import { accountId } from "../../redux/account";
import { useSelector } from "react-redux";
import { TransferToken } from "../../components/transferToken";
import { Button } from "@mui/material";
import { walletNodeHost } from "../../redux/wallet";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { challengeList } from "../../data/challengeList";
import { CheckIsUserFirstDayOfRegistration } from "../../NftSystem/BMISelfieSystem";
import { selectWalletNodeHost } from "../../redux/useLedger";
import { LedgerClientFactory } from "@signumjs/core";
import { CountChallenges } from "../../NftSystem/Token/countChallenges";
import { findNFTLevel } from "../../NftSystem/FindNFTLevel";
import { checkUserLevel } from "../../NftSystem/UserLevel/checkUserLevel";
import { selectCurrentIsGuest } from "../../redux/profile";
import SigdaoIcon from "../../components/icon";
import MenuBar from "../../components/menuBar";
interface ICouponsProps {}

const CouponDetail: React.FunctionComponent<ICouponsProps> = (props) => {
  const title = "Coupon Detail";
  const params = useParams();
  console.log("Coupon Code:",  params)
  const userAccountId = useSelector(accountId);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const navigate = useNavigate();
  const [isOverDailyPlayTimesLimit, setisOverDailyPlayTimesLimit] = useState<boolean[]>([]);
  const [userChallengeTimes, setUserChallengeTimes] = useState<number[]>([]);
  const [allowedChallengeList, setAllowedChallengeList] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [Timedifference, setTimedifference] = useState<string[]>([]);
  const BMIMachineCodeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace(/['"]+/g, "");
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const updated = useRef(false);
  let isNew = false;
  const isGuest = useSelector(selectCurrentIsGuest);

  // to use CountChallenges to count
  // display as 0/3 as text

  //Anderson's code starts here
  // const NewUserCheck = async () => {
  //   const isUpdated = await CheckIsUserFirstDayOfRegistration(ledger2, userAccountId, BMIMachineCodeHashId);

  //   return isUpdated === true
  // };

  // useEffect(() => {

  //   NewUserCheck();
  // })
  useEffect(() => {
    const handleBeforeUnload = () => {
      updated.current = false; // Reset the value before navigating away
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  //Anderson's code ends here

  useEffect(() => {
    const checkTimeSlot = async () => {
      // guest user
      if (isGuest) {
        setIsLoading(false);
        setAllowedChallengeList([true, true, true, false, false, false, false, false, false]);

        return;
      }

      //Anderson's code starts here
      //findNFTLevel(ledger2,userAccountId);
      if (updated.current === false) {
        updated.current = true;
        //isNew = await NewUserCheck(); //Run a check on whether there is a new user. Also, the handleBeforeUnload function ensures the check only run once
        const userLevel = await checkUserLevel(ledger2, userAccountId);

        const playedChallenge = await CountChallenges(userAccountId, ledger2);
        const allowedChallenge: boolean[] = [];
        for (var i = 0; i < 9; i++) {
          if (i >= userLevel * 3) {
            allowedChallenge.push(false);
            //playedChallenge[i] = 3;
          } else {
            allowedChallenge.push(true);
          }
        } //Temporarily disable the remaining six challenges

        setAllowedChallengeList(allowedChallenge);

        setUserChallengeTimes(playedChallenge);

        setisOverDailyPlayTimesLimit(
          playedChallenge.map((numChallengesPlayed) => {
            if (numChallengesPlayed >= 2) {
              return false;
            }
            return true;
          }),
        );
        setIsLoading(false);

        //Anderson's code ends here

        //Anderson disabled this 2023/11/12
        // setisOverDailyPlayTimesLimit(
        //   challengeList.map((mission) => {
        //     if(mission.title === "1. Hello Bae !" /*&& isNew === true*/){

        //       return true;
        //     }
        //     const { timeslot } = mission;
        //     const isInSlot = timeslot.some(
        //       (slot) => currentTime >= getTimeInMinutes(slot.startingTime) && currentTime <= getTimeInMinutes(slot.endTime)
        //     );

        //     return isInSlot;
        //   })
        // );

        //Anderson disabled till here
        // setTimedifference(
        //   challengeList.map((mission) => {
        //     const { timeslot } = mission;
        //     const timedifferentInFormat = timeslot.map((slot) => {
        //       const time = slot.startingTime.split(":").map((ele) => parseInt(ele));
        //       const formatTime = time[0] * 60 * 60 + time[1] * 60;
        //       const timeDiff = formatTime - currentTimeInSecond;

        //       if (timeDiff < 0) {
        //         return timeDiff + 24 * 60 * 60;
        //       }

        //       return timeDiff;
        //     });
        //     let filteredtimedifferentInFormat = timedifferentInFormat.filter((date) => {

        //       return date > 0;
        //     });

        //     filteredtimedifferentInFormat.sort((a, b) => a - b);

        //     const hours = Math.floor(filteredtimedifferentInFormat[0] / 3600)
        //       .toString()
        //       .padStart(2, "0");
        //     const minutes = Math.floor((filteredtimedifferentInFormat[0] % 3600) / 60)
        //       .toString()
        //       .padStart(2, "0");
        //     const seconds = (filteredtimedifferentInFormat[0] % 60).toString().padStart(2, "0");

        //     // const hours = Math.floor(timedifferentInFormat[0] / (1000 * 60 * 60));
        //     // const minutes = Math.floor((timedifferentInFormat[0] / (1000 * 60)) % 60);
        //     // const seconds = Math.floor((timedifferentInFormat[0] / 1000) % 60);

        //     return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        //     // return timedifferentInFormat;
        //     // return '';
        //   })
        // );
      }
    };

    const interval = setInterval(checkTimeSlot, 2000);

    return () => clearInterval(interval);

    // setisOverDailyPlayTimesLimit(
    //   challengeList.map((mission) => {
    //     return true;
    //   })
    // );
  }, []);

  const getTimeInMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const challengeTimesDisplay = (index): JSX.Element => {
    if (!allowedChallengeList[index]) {
      return <div className="score-bar_2-inactive inter-semi-bold-white-15px">LOCKED</div>;
    }

    if (isOverDailyPlayTimesLimit[index]) {
      return (
        <div className="score-bar_2">
          <div className="starting inter-semi-bold-white-15px">{`${userChallengeTimes[index]}/2`}</div>
        </div>
      );
    }

    if (isGuest) {
      return <div className="score-bar_2-completed inter-semi-bold-white-15px">STARTING</div>;
    }


    return (
      <div className="score-bar_2-completed inter-semi-bold-white-15px">
        {/* {mission.timeslot[0].startingTime} */}
        COMPLETED
        {/* {Timedifference[index]} */}
      </div>
    );
  };

  // const checkTimeSlot = () => {
  //   const currentTime = new Date().toLocaleTimeString([], {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });

  //   for (const mission of challengeList) {
  //     for (const time of mission.timeslot) {
  //       if (currentTime >= time.startingTime && currentTime <= time.endTime) {
  //         setisOverDailyPlayTimesLimit(true);
  //         return;
  //       }
  //     }
  //   }

  //   setisOverDailyPlayTimesLimit(false);
  // };

  // useEffect(() => {
  //   const interval = setInterval(checkTimeSlot, 1000); // Check every second

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  const content: JSX.Element = (
    <div className="screen">
            <div className="mission-body-container">
          <div className="mission-body">
          <ShortTitleBar title={title} aiCoach={true} setting={true} customiseBackButton={true} customiseBackButtonLink="/featureMissions" isCouponSystem={true}/>
          <img className="couponDetailImage" src={`${process.env.PUBLIC_URL}/img/coupons/demo_coupons.jpg`} alt="Photo" />

            <div className="couponDetail-rewardTitle inter-semi-bold-royal-blue-15px">
              <h2>迎新獎賞：$50現金優惠券</h2>
              <p>有效期至xx/xx/xxxxx</p>
              <Button variant="contained" fullWidth={true}>使用優惠</Button>
              </div>
            <div className="containerCouponsTermsAndPolicies"> 
            <div className="couponsTermsAndPolicies">
            <h2>條款與細則</h2>
            <p>使用範圍-此優惠券僅適用於指定商品或服務，詳情請參閱產品頁面。</p>
            <p>有效期限-優惠券自發行日起有效，截止日期為 [截止日期]。逾期無效。</p>
            <p>使用限制-每位顧客僅限使用一次。</p>
            <p>兌換方式-在結帳時輸入優惠券代碼以享受折扣。</p>
            <p>使用範圍-此優惠券僅適用於指定商品或服務，詳情請參閱產品頁面。</p>
            <p>其他條款-我們保留修改或取消優惠券的權利，恕不另行通知。
              如有任何爭議，我們保留最終解釋權。</p>
            </div>
            </div>
          </div>
          <MenuBar />
        </div>
    </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default CouponDetail;
