import * as React from "react";
import "./couponDetail.css";
import { CenterLayout } from "../../components/layout";
import { ShortTitleBar } from "../../components/titleBar";
import { Link ,useParams} from "react-router-dom";
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
import { usePostCouponDetailMutation } from "../../redux/couponAPI";
import { SendEmailLinkContent, useGetLoginLinkMutation, useAccessMutation, useLogoutMutation, useUserStatusMutation } from "../../redux/couponUserAPI";
import { couponUserSlice, selectCouponUserEmail} from "../../redux/couponUser";
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import { useUser } from '../../providers/userProvider';
interface ICouponsProps {}

const CouponDetail: React.FunctionComponent<ICouponsProps> = (props) => {
  const title = "Coupon Detail";
  const params = useParams();
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
  const [couponName , setCouponName] = useState<string>("Coupon Name");
  const [couponDescription, setCouponDescription] = useState<string>("Coupon Description");
  const dispatch = useDispatch();
  const [postCouponDetail, { isSuccess: isGetCouponsByUser, error: getCouponError }] = usePostCouponDetailMutation();
  //user checking 
  const [login, { isSuccess: isLoginSuccess, isLoading: isLoginLoading, data: loginData, error: loginError }] = useAccessMutation();
  const [userStatus, { isSuccess: isGetUserStauts, error: getUserStatusError  }] = useUserStatusMutation();
  const [logout, { isSuccess: isLogoutSuccess, error: logoutError }] = useLogoutMutation();
  const [couponUser, setCouponUser] = React.useState(useSelector(selectCouponUserEmail));
  //alert message 
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState<AlertColor>("success")
  const [alertMessage, setAlertMessage] = React.useState<String>("QRcode generated")
  //click the button to use the coupon 
  const handleClick = () => {
    console.log("couponsUser: ", couponUser)
    setSeverity("success");
    setAlertMessage("QRcode generated")
    //no user information, send out the error message 
    if(couponUser=== undefined || couponUser === null || couponUser === ""){
      setSeverity("error");
      setAlertMessage("no user information")
      setOpen(true);
    }else{
    //find user information, use the api to record the use of coupon
    //api function 
    setOpen(true);
    }
    
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
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
   
    console.log("Coupon Code:",  params.couponCode)
    if(params.couponCode){
    postCouponDetail(params.couponCode)
    .then((res) => {
      console.log(res);
      if ("data" in res) {
        const couponList = res.data;
       if (couponList.length === 0){
        console.log("404 not found")
        navigate("/404")
       }
        console.log(couponList);
        setCouponName(couponList[0].c_name);
        setCouponDescription(couponList[0].c_description);
      }
    })
    .catch((err) => {
      console.log(err);
    });

  }else{
    console.log("404 not found")
    navigate("/404")
  }
 
      userStatus("")
         .then((res) => {
      console.log(res);
      if ("data" in res) {
        // const couponList = res.data;
        dispatch(couponUserSlice.actions.setCredentials({ email: res.data.user.email || "", token: res.data.token || "" }));
        setCouponUser(res.data.user.email );
      }else{
        console.log("Auto login failed")
        dispatch(couponUserSlice.actions.setCredentials({ email: "" , token:  "" }));
      }
    })
    .catch((err) => {
       console.log("Auto login failed")
      console.log(err);
      dispatch(couponUserSlice.actions.setCredentials({ email: "" , token:  "" }));
      setCouponUser("");
    });
  
    // const handleBeforeUnload = () => {
    //   updated.current = false; // Reset the value before navigating away
    // };

    // window.addEventListener("beforeunload", handleBeforeUnload);

    // return () => {
    //   window.removeEventListener("beforeunload", handleBeforeUnload);
    // };


  }, []);

  //Anderson's code ends here



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
          <ShortTitleBar title={title} aiCoach={true} setting={true} customiseBackButton={true} customiseBackButtonLink="/coupons" isCouponSystem={true}/>
          <img className="couponDetailImage" src={`${process.env.PUBLIC_URL}/img/coupons/demo_coupons.jpg`} alt="Photo" />

            <div className="couponDetail-rewardTitle inter-semi-bold-royal-blue-15px">
              <h2>{couponName}</h2>
              <p>{couponDescription}</p>
              <Button variant="contained" fullWidth={true} onClick={() =>{handleClick()}}>使用優惠</Button>
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
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default CouponDetail;
