import * as React from "react";
import "./coupons.css";
import { CenterLayout } from "../../components/layout";
import { ShortTitleBar } from "../../components/titleBar";
import { Link } from "react-router-dom";
import { accountId } from "../../redux/account";
import { useDispatch, useSelector } from "react-redux";
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
import { useLocation } from "react-router-dom";
import { useGetCouponDetailMutation, useGetUserMutation, useGetCouponsByUserMutation, useRefreshCouponCodeMutation, useGetAllCouponsMutation,usePostCouponsByFilteringMutation } from "../../redux/couponAPI";
import { couponSlice, selectCurrentCouponList, selectCurrentSelectedCoupon } from "../../redux/coupon";
import { useUser } from '../../providers/userProvider';
interface ICouponsProps {}

const Coupons: React.FunctionComponent<ICouponsProps> = (props) => {
  // const title = "All Coupons";
  const userAccountId = useSelector(accountId);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const navigate = useNavigate();
  const [isOverDailyPlayTimesLimit, setisOverDailyPlayTimesLimit] = useState<boolean[]>([]);
  const [userChallengeTimes, setUserChallengeTimes] = useState<number[]>([]);
  const [allowedChallengeList, setAllowedChallengeList] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title , setTitle]  = useState<string>("All Coupons");
  // const [Timedifference, setTimedifference] = useState<string[]>([]);
  const BMIMachineCodeHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace(/['"]+/g, "");
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const updated = useRef(false);
  let isNew = false;
  const isGuest = useSelector(selectCurrentIsGuest);
  const location = useLocation();

  const dispatch = useDispatch();
  const [getCouponsByUser, { isSuccess: isGetCouponsByUser, error: getCouponError }] = useGetCouponsByUserMutation();
  const [getAllCoupons, {isSuccess: isGetAllCoupons, error: getAllCouponsError}] = useGetAllCouponsMutation();
  const [postCouponsByFiltering, {isSuccess: isGetFilteredCoupons, error: getFilteredCouponsError}] = usePostCouponsByFilteringMutation();
  const couponList = useSelector(selectCurrentCouponList);
  //useContext - userProvider
  const { isLoggedIn, email, token,  logoutCouponUser, loginCouponUser } = useUser();

  // to use CountChallenges to count
  // display as 0/3 as text
  

  //joe 20/9
   useEffect(() => {
    console.log("UseContext-user data in Coupon:", email, token)
    // console.log("UseContext-user data in coupons:", email, token)
    const searchParams = new URLSearchParams(location.search);
    const paramValue = searchParams.get("apiKey");
    const paramMerchants = searchParams.get("merchant")
    const paramIndustries = searchParams.get("industry")
    const paramOrder = searchParams.get("order")
    // console.log("paramValue:", paramValue);
    // console.log("paramMerchants:", paramMerchants);
    if (paramMerchants !== null) {
    
    console.log("num:", paramMerchants.split("^^^").length)
    }
    // console.log("paramIndustries:", paramIndustries);
    // console.log("paramOrder: ", paramOrder)
    if (paramIndustries === null && paramOrder === null && ((paramMerchants !== null) && paramMerchants.split("^^^").length === 1)){
      setTitle(paramMerchants);
    }else if ( paramIndustries !== null || paramOrder !== null  || paramMerchants !== null){
      setTitle("Filtered result")
    }
    //case without login
    //if no any filtering options are selected, the page will fetch all the data.
    if (paramMerchants === null && paramIndustries === null && paramOrder === null){
      //get all coupon 
      getAllCoupons("")
      .then((res) => {
        console.log(res);
        if ("data" in res) {
          const couponList = res.data;
          dispatch(couponSlice.actions.setCouponList(couponList));
          console.log(couponList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }else{
      postCouponsByFiltering({paramOrder, paramMerchants,paramIndustries})
      .then((res) => {
        console.log(res);
        if ("data" in res) {
          const couponList = res.data;
          dispatch(couponSlice.actions.setCouponList(couponList));
          console.log(couponList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, []);
  // copied code, may delete after checking 
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
  const content: JSX.Element = (
    <div className="screen">
      <div className="bettermidapp-challenges-1">
        <ShortTitleBar title={title} aiCoach={true} setting={true} customiseBackButton={true} customiseBackButtonLink="/marketplace" isCouponSystem={true} isFilteringButton={true} isLoginButton={true}/>
        <img className="photo-7K5ObS" src="img/coupons/coupons_landing.jpg" alt="Photo" />
        <div className="challenges-card-7K5ObS">
          <img className="layer-nLfc9z" src="img/missionChallenge/layer-1@1x.png" alt="Layer" />
          <div className="scroll-group-nLfc9z">
            <div className="challenge-cards-QuyfDF">
              {isLoading ? (
                <div></div>
              ) : (
                <div> 
              {couponList.map((coupon, index) => {
        return (
          <div key={index}>
            {/* <p style={{ color: "white" }}>{coupon.c_name}</p>
            <p style={{ color: "white" }}>{coupon.c_description}</p> */}
                       <button className="couponsContainer" onClick={() => navigate(`/couponDetail/${coupon.coupon_code}`)}>
              <img className="couponImage" src={`${process.env.PUBLIC_URL}/img/coupons/demo_coupons.jpg`} alt="Card_bg"></img>
              <div className="descriptionChallengeCompleted">
                <div className="descriptionTitleChallengeCompleted">{coupon.c_name}</div>
                {/* <div className="couponExpiryDate">使用期xx/xx/xxxx</div> */}
                   <div className="couponExpiryDate">{coupon.c_description}</div>
                <div className="descriptionBottomBodyChallengeCompleted">
                  {/* <SigdaoIcon width="16px" height="16px" /> */}
                  {/* <div className="sigdaoChallengeCompleted">+5.25 ~ 15.75</div> */}
                  {/* <img className="arrowChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/ic-chevron-right-24px-1@1x.png`}></img> */}
                </div>
              </div>
            </button>
          </div>
        );
      })}
            {/* //non dymatic demo */}
            <button className="couponsContainer" onClick={() => navigate("/couponDetail/BTS789")}>
              <img className="couponImage" src={`${process.env.PUBLIC_URL}/img/coupons/demo_coupons.jpg`} alt="Card_bg"></img>
              <div className="descriptionChallengeCompleted">
                <div className="descriptionTitleChallengeCompleted">迎新獎賞：$50現金優惠劵</div>
                <div className="couponExpiryDate">使用期xx/xx/xxxx</div>
                <div className="descriptionBottomBodyChallengeCompleted">
                  {/* <SigdaoIcon width="16px" height="16px" /> */}
                  {/* <div className="sigdaoChallengeCompleted">+5.25 ~ 15.75</div> */}
                  {/* <img className="arrowChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/ic-chevron-right-24px-1@1x.png`}></img> */}
                </div>
              </div>
            </button>
            <button className="couponsContainer" onClick={() => navigate("/couponDetail/NTD0001")}>
              <img className="couponImage" src={`${process.env.PUBLIC_URL}/img/coupons/demo_coupons.jpg`} alt="Card_bg"></img>
              <div className="descriptionChallengeCompleted">
                <div className="descriptionTitleChallengeCompleted">迎新獎賞：xxx現金優惠劵</div>
                <div className="couponExpiryDate">使用期xx/xx/xxxx</div>
                <div className="descriptionBottomBodyChallengeCompleted">
                  {/* <SigdaoIcon width="16px" height="16px" /> */}
                  {/* <div className="sigdaoChallengeCompleted">+5.25 ~ 15.75</div> */}
                  {/* <img className="arrowChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/ic-chevron-right-24px-1@1x.png`}></img> */}
                </div>
              </div>
            </button>
            <button className="couponsContainer" onClick={() => navigate("/couponDetail/BEST10GUY")}>
              <img className="couponImage" src={`${process.env.PUBLIC_URL}/img/coupons/demo_coupons.jpg`} alt="Card_bg"></img>
              <div className="descriptionChallengeCompleted">
                <div className="descriptionTitleChallengeCompleted">迎新獎賞：免費飲品</div>
                <div className="couponExpiryDate">使用期xx/xx/xxxx</div>
                <div className="descriptionBottomBodyChallengeCompleted">
                  {/* <SigdaoIcon width="16px" height="16px" /> */}
                  {/* <div className="sigdaoChallengeCompleted">+5.25 ~ 15.75</div> */}
                  {/* <img className="arrowChallengeCompleted" src={`${process.env.PUBLIC_URL}/img/allMission/ic-chevron-right-24px-1@1x.png`}></img> */}
                </div>
              </div>
            </button>
            </div>
              )}
            </div>
          </div>
        </div>
        <MenuBar />
      </div>
    </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default Coupons;
