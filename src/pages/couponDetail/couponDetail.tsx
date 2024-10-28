import * as React from "react";
import "./couponDetail.css";
import { CenterLayout } from "../../components/layout";
import { ShortTitleBar } from "../../components/titleBar";
import { Link, useParams } from "react-router-dom";
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
import { usePostCouponDetailMutation, useRefreshCouponCodeMutation } from "../../redux/couponAPI";
import { SendEmailLinkContent, useGetLoginLinkMutation, useAccessMutation, useLogoutMutation, useUserStatusMutation } from "../../redux/couponUserAPI";
import { couponUserSlice, selectCouponUserEmail } from "../../redux/couponUser";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import { useUser } from "../../providers/userProvider";
import { QRCodeSVG } from "qrcode.react";
import { selectCurrentSelectedCoupon } from "../../redux/coupon";
import QRCode from "qrcode";
import { start } from "repl";
import io from "socket.io-client";

interface ICouponsProps {}
// const socket = io("https://dapp.bettermi.io/couponApi/");
const CouponDetail: React.FunctionComponent<ICouponsProps> = (props) => {
  const title = "Coupon Detail";
  const params = useParams();
  const couponExpiryTime: number = 10;
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
  const selectedCoupon = useSelector(selectCurrentSelectedCoupon);
  const [couponName, setCouponName] = useState<string>("Coupon Name Loading ...");
  const [couponCode, setCouponCode] = useState<string>("Coupon Code Loading ...");
  const [couponDescription, setCouponDescription] = useState<string>("Coupon Description Loading ...");
  const [coupon_id, setCoupon_id] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(couponExpiryTime);
  const numberOfUse = useRef(-1);
  const dispatch = useDispatch();
  const [postCouponDetail, { isSuccess: isGetCouponsByUser, error: getCouponError }] = usePostCouponDetailMutation();
  const [refreshCouponCode, { isSuccess: isRefreshedCoupon, error: refreshCouponError }] = useRefreshCouponCodeMutation();
  //user checking
  const [login, { isSuccess: isLoginSuccess, isLoading: isLoginLoading, data: loginData, error: loginError }] = useAccessMutation();
  const [userStatus, { isSuccess: isGetUserStauts, error: getUserStatusError }] = useUserStatusMutation();
  const [logout, { isSuccess: isLogoutSuccess, error: logoutError }] = useLogoutMutation();
  const [couponUser, setCouponUser] = React.useState(useSelector(selectCouponUserEmail));
  //alert message
  const [open, setOpen] = React.useState<boolean>(false);
  const [startFetching, setStartFetching] = React.useState<boolean>(false);
  const [severity, setSeverity] = React.useState<AlertColor>("success");
  const [alertMessage, setAlertMessage] = React.useState<String>("QRcode generated");
  const [expiredDate, setExpiredDate] = React.useState<String>();
  const [quantityPerUser, setQuantityPerUser] = React.useState<String>();
  //useContext - userProvider
  const { isLoggedIn, email, token, logoutCouponUser, loginCouponUser } = useUser();

  //testing
  const [qrCode, setQRCode] = React.useState<string>("");
  const [qrCodeText, setQRCodeText] = React.useState<string>("");
  const [switcher, setSwitcher] = React.useState<boolean>(true);

  //for the function that check the number of use to
  // useEffect(() => {
  // console.log("hasRendered.current is",hasRendered.current)
  // if (hasRendered.current === true) {
  //   return;
  // }
  // console.log("ran the useEffect");
  // hasRendered.current = true
  // socket.on('chat message', (data: { userEmail:string;sender: string; message: string }) => {
  //   console.log("chat message:",data.sender,data.message )
  //   console.log("the user email is",data.userEmail);
  //   console.log("email is ",email)
  //   if(email === data.userEmail){
  //     setStartFetching(false)
  //     alert("the coupon is burned")
  //     navigate('/coupons')
  //   }
  // alert("the coupon is burned")
  // navigate('/coupons')
  //   });
  //   return () => {
  //       socket.off('chat message');
  //     };
  // }, [socket]);

  //click the button to use the coupon
  const copyText = () => {
    navigator.clipboard
      .writeText(qrCodeText)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };
  const DataFetcher = () => {
    refreshCouponCode(coupon_id)
    .then(async (res) => {
      // console.log(res);
      if('data' in res){
        console.log("hihihi");
        console.log(res.data);
        const QrCode = await QRCode.toDataURL(res.data.coupon_code);
        if (QrCode) {
          if (numberOfUse.current != -1 && (res.data.number_of_use > numberOfUse.current) ){
            setStartFetching(false)
            setSeverity("success");
            setAlertMessage("The coupon is used")
            setOpen(true);
            const promiseResult = await new Promise(res => setTimeout(() => {
              res(true);
            }, 2000));
            if(promiseResult){
              navigate('/coupons')
            }
          }
          if (numberOfUse.current === -1 ){
            numberOfUse.current = res.data.number_of_use
          }
          numberOfUse.current = res.data.number_of_use ;
        setQRCode(QrCode);
        setQRCodeText(res.data.coupon_code);
        setTimeLeft(couponExpiryTime);
        setSeverity("success");
        setAlertMessage("QRcode generated");
        setOpen(true);
        }else{
        alert("We are sorry, something happened after ")
        navigate('/coupons');
        }
      }
      else if(res.error?.data?.message === "Coupon is used"){
        // alert("You have used this coupon")
        if ( numberOfUse.current === -1) {
        setStartFetching(false);
        setSeverity("error");
        setAlertMessage("You have used this coupon")
        setOpen(true);
        } else {
          setStartFetching(false);
          setSeverity("success");
          setAlertMessage("The coupon is used")
          setOpen(true);
          const promiseResult = await new Promise(res => setTimeout(() => {
            res(true);
          }, 3000));
          console.log("over 2s", promiseResult)
          if(promiseResult){
            navigate('/coupons')
          }
        }
      }
      else{
        alert("We are sorry, something happened after ")
        navigate('/coupons');
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
  const handleClick = async() => {
    console.log("couponsUser: ", couponUser);
    console.log("email is ", email);
    console.log("token is ", token);

    //no user information, send out the error message
    if ((email === undefined || email === null || email === "") && (token === undefined || token === null || token === "")) {
      setSeverity("error");
      setAlertMessage("no user information");
      setOpen(true);
      console.log(params.couponCode);
    } else {
      //find user information, use the api to record the use of coupon
      //api function
      setStartFetching(true);
      console.log("params.couponCode is ", params.couponCode);
      DataFetcher();
    }
  };

  useEffect(() => {
    // Initial fetch when the component mounts
    let interval: any;
    console.log("startFetching is", startFetching);
    if (startFetching) {
      // Fetch data immediately after button click
      // Set up an interval to fetch data every 30 seconds
      interval = setInterval(() => {
        // setSwitcher(switcher)
        DataFetcher();
      }, couponExpiryTime * 1000);
    }

    // Clean up the interval when the component unmounts or when fetching is stopped
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startFetching]); // Empty dependency array ensures this effect runs once on mount
  //close the alert box
  useEffect(() => {
    console.log("startFetching is ", startFetching);
    let timerId: any;
    if (startFetching) {
      console.log("Start count down");
      timerId = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        }
      }, 1000);
    }
    return () => clearInterval(timerId); // Cleanup the interval on component unmount
  }, [timeLeft, startFetching]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    console.log("set open is false");
    setOpen(false);
  };
  // to use CountChallenges to count
  // display as 0/3 as text
  //joe 21/10
  //refetch the detail if 503 example
  //   const fetchCouponDetail = async (urlParams, retries = 5, delay = 2000) => {
  //     try {
  //         const response = await  postCouponDetail(urlParams)

  //         // Check if the response is OK
  //         if (response.ok) {
  //             const result = await response.json();
  //             setData(result);
  //             setError(null); // Clear any previous errors
  //             return;
  //         }

  //         // If we receive a 503 status, we will retry
  //         if (response.status === 503 && retries > 0) {
  //             console.log(`Received 503. Retrying... (${retries} retries left)`);
  //             await new Promise(res => setTimeout(res, delay)); // Wait for the specified delay
  //             return fetchData(url, retries - 1, delay); // Retry the fetch
  //         }

  //         // Handle other errors
  //         throw new Error(`Fetch failed with status: ${response.status}`);
  //     } catch (err) {
  //         setError(err.message);
  //     } finally {
  //         setLoading(false);
  //     }
  // };
  //joe 20/9
  //fetch the coupon detail by its coupon code
  useEffect(() => {
    console.log("UseContext-user data in CouponDetail:", email, token);
    console.log("Coupon Code:", params.couponCode);
    if (params.couponCode) {
      postCouponDetail(params.couponCode)
        .then(async (res) => {
          console.log(res);
          if ("data" in res) {
            const couponList = res.data;
            if (couponList.length === 0) {
              console.log("404 not found");
              navigate("/404");
            }
            console.log("couponList is ", couponList);
            setCouponName(couponList[0].c_name);
            setCouponCode(couponList[0].coupon_code);
            setCouponDescription(couponList[0].c_description);
            setCoupon_id(couponList[0].coupon_id);
            setExpiredDate(couponList[0].expired_date);
            setQuantityPerUser(couponList[0].quantity_per_user);
          }
          if (res && res.error?.status == "FETCH_ERROR") {
            console.log("refetch the request");
            const promiseResult = await new Promise((res) =>
              setTimeout(() => {
                res(true);
              }, 1500)
            );
            console.log("over 2s", promiseResult);
            if (params.couponCode && promiseResult) {
              postCouponDetail(params.couponCode)
                .then(async (res) => {
                  console.log(res);
                  if ("data" in res) {
                    const couponList = res.data;
                    if (couponList.length === 0) {
                      console.log("404 not found");
                      navigate("/404");
                    }
                    console.log("couponList is ", couponList);
                    setCouponName(couponList[0].c_name);
                    setCouponCode(couponList[0].coupon_code);
                    setCouponDescription(couponList[0].c_description);
                    setCoupon_id(couponList[0].coupon_id);
                    setExpiredDate(couponList[0].expired_date);
                    setQuantityPerUser(couponList[0].quantity_per_user);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("404 not found");
      navigate("/coupons");
    }
  }, []);
  useEffect(() => {
    console.log(email);
  }, [email]);
  useEffect(() => {
    console.log(token);
  }, [token]);
  const content: JSX.Element = (
    <div className="screen">
      <div className="mission-body-container">
        <div className="mission-body">
          <ShortTitleBar
            title={title}
            aiCoach={true}
            setting={true}
            customiseBackButton={true}
            customiseBackButtonLink="/coupons"
            isCouponSystem={true}
            isFilteringButton={false}
            isLoginButton={true}
          />
          <img className="couponDetailImage" src={`${process.env.PUBLIC_URL}/img/coupons/demo_coupons.jpg`} alt="Photo" />
          <div></div>

          <div className="couponDetail-rewardTitle inter-semi-bold-royal-blue-15px">
            <h2>{couponName}</h2>
            <p>{couponDescription}</p>
            <Button
              variant="contained"
              fullWidth={true}
              onClick={async () => {
                await handleClick();
              }}
            >
              使用優惠
            </Button>
            {qrCode && isGetCouponsByUser && <img className="QRCode" src={qrCode} alt="QR Code" />}
            {qrCodeText && isGetCouponsByUser && <p className="QRCodeTextDescription">Your coupon code:</p>}
            {qrCodeText && isGetCouponsByUser && <p className="QRCodeText">{qrCodeText}</p>}
            {qrCodeText && isGetCouponsByUser && (
              <button onClick={copyText} className="copyTextButton">
                Copy Text
              </button>
            )}
            {qrCode && isGetCouponsByUser && <p className="QRCodeExpiryTime">expires in: {timeLeft}s</p>}
            {/* {isGetCouponsByUser && open && <QRCodeSVG size={256}     style={{
      height: "80%",
      width: "80%",
      maxWidth: "100%",
      maxHeight: "100%",
      margin: "auto",
      display: "block",
    }} value={selectedCoupon.coupon_code} viewBox={`0 0 256 256`} />} */}
          </div>
          <div className="containerCouponsTermsAndPolicies">
            <div className="couponsTermsAndPolicies">
              <h2>條款與細則</h2>
              <p>使用範圍-此優惠券僅適用於指定商品或服務，詳情請參閱產品頁面。</p>
              <p>有效期限-優惠券自發行日起有效，截止日期為{expiredDate}。逾期無效。</p>
              <p>使用限制-每位顧客僅限使用{quantityPerUser}次。</p>
              <p>兌換方式-在結帳時請願出示QR代碼以享受折扣。</p>
              <p>使用範圍-此優惠券僅適用於指定商品或服務，詳情請參閱產品頁面。</p>
              <p>其他條款-我們保留修改或取消優惠券的權利，恕不另行通知。 如有任何爭議，我們保留最終解釋權。</p>
            </div>
          </div>
        </div>
        <MenuBar />
      </div>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ horizontal: "center", vertical: "top" }}>
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default CouponDetail;
