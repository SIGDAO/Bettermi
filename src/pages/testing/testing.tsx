import * as React from "react";
import { CenterLayout } from "../../components/layout";
import { BackButton } from "../../components/button";
import "./testing.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FindLatestTransactionArray, FindLatestTransactionNumber, FindNftIpfsAddressWithConractId, IsUserUpdatingIcon } from "../../NftSystem/updateUserNftStorage";
import { selectWalletNodeHost, useLedger } from "../../redux/useLedger";
import { useDispatch, useSelector } from "react-redux";
import { profileSlice } from "../../redux/profile";
import { accountId, getNftContractStorage } from "../../redux/account";
import { LedgerClientFactory } from "@signumjs/core";
import { SendEmailLinkContent, useGetLoginLinkMutation, useAccessMutation, useLogoutMutation } from "../../redux/couponUserAPI";
import { couponUserSlice, selectCurrentEmail } from "../../redux/couponUser";
import { useGetCouponDetailMutation, useGetCouponsByUserMutation } from "../../redux/couponAPI";
import { couponSlice, selectCurrentCouponList, selectCurrentSelectedCoupon } from "../../redux/coupon";
import { useGetFilterOptionMutation } from "../../redux/filterAPI";
import { FilterOption, filterSlice, selectCurrentFilterOption } from "../../redux/filter";

interface TestingProps {}

const Testing: React.FunctionComponent<TestingProps> = (props) => {
  const dispatch = useDispatch();
  const [getLoginLink, { isSuccess: isSendLoginLinkSuccess, data, error }] = useGetLoginLinkMutation();
  const [login, { isSuccess: isLoginSuccess, isLoading: isLoginLoading, data: loginData, error: loginError }] = useAccessMutation();
  const [getCouponsByUser, { isSuccess: isGetCouponsByUser, error: getCouponError }] = useGetCouponsByUserMutation();
  const [getFilterOption, { isSuccess: isGetFilterOptionSuccess, error: getFilterOptionError }] = useGetFilterOptionMutation();
  const [getCouponDetail, { isSuccess: isGetCouponCodeSuccess, error: getCouponCodeError, status: couponDetailStatus }] = useGetCouponDetailMutation();
  const loginedEmail = useSelector(selectCurrentEmail);
  const couponList = useSelector(selectCurrentCouponList);
  const filterOption: FilterOption = useSelector(selectCurrentFilterOption);
  const selectedCoupon = useSelector(selectCurrentSelectedCoupon);
  const [isTriggerGetCouponCode, setIsTriggerGetCouponCode] = useState<boolean>(false);


  const [logout, { isSuccess: isLogoutSuccess, error: logoutError }] = useLogoutMutation();
  const location = useLocation();

  const [email, setEmail] = useState<string>("");
  const [userEnterCouponId, setUserEnterCouponId] = useState<number>(0);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paramValue = searchParams.get("apiKey");
    console.log(paramValue);

    if (searchParams.size > 0 && !isLoginLoading) {
      login({ email: localStorage.getItem("email") || "", href: window.location.href })
        .then((res) => {
          if ("data" in res) {
            dispatch(couponUserSlice.actions.setCredentials({ email: localStorage.getItem("email") || "", token: res.data.accessToken || "" }));
          }
          const newUrl = `${location.pathname}`;
          window.history.replaceState({}, "", newUrl);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [location.search]);

  // build a function to get coupon code for every 30 seconds
  // if isTriggerGetCouponCode is false, stop the interval
  useEffect(() => {
    if (isTriggerGetCouponCode && couponDetailStatus !== "rejected") {
      const interval = setInterval(() => {
        getCouponDetail(userEnterCouponId)
          .then((res) => {
            console.log("res", res);
            if ("data" in res) {
              dispatch(couponSlice.actions.setSelectedCoupon(res.data));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isTriggerGetCouponCode]);


  const emailLogin = async () => {
    const sendEmail: SendEmailLinkContent = {
      email,
      href: window.location.href,
    };

    await getLoginLink(sendEmail);
    localStorage.setItem("email", email);
    console.log(data);
  };

  const getCouponList = async () => {
    getCouponsByUser(loginedEmail)
      .then((res) => {
        console.log(res);
        if ("data" in res) {
          const couponList = res.data;
          dispatch(couponSlice.actions.setCouponList(couponList));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const userLogout = async () => {
    logout("testing")
      .then((res) => {
        console.log(res);
        dispatch(couponUserSlice.actions.logout());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getFilter = async () => {
    getFilterOption()
      .then((res) => {
        console.log(res);
        if ('data' in res) {
          dispatch(filterSlice.actions.setFilterOption(res.data));
        } else {
          console.error('Failed to fetch filter options:', res.error);
        }
      })
  
  }

  const getCoupon = async () => {
    setIsTriggerGetCouponCode(true);
    // getCouponDetail(userEnterCouponId)
    //   .then((res) => {
    //     console.log("res", res);
    //     if ("data" in res) {
    //       dispatch(couponSlice.actions.setSelectedCoupon(res.data));
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  const content: JSX.Element = (
    <>
      <BackButton customiseBackButtonLink={"/home"} />
      <button onClick={emailLogin}>testing get email login</button>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={userLogout}>Logout</button>
      <button onClick={getCouponList}>Get Coupon list</button>
      <button onClick={getFilter}>Get Filter</button>
      <button onClick={getCoupon}>Get coupon detail by coupon id(need to enter coupon id that user have )</button>
      <input type="number" placeholder="coupon_id" value={userEnterCouponId} onChange={(e) => setUserEnterCouponId(parseInt(e.target.value))} />
      <button onClick={() => setIsTriggerGetCouponCode(false)}>Stop get coupon code</button>



      {isSendLoginLinkSuccess && <p style={{ color: "white" }}>send the email link</p>}
      {isLoginSuccess && <p style={{ color: "white" }}>login success</p>}
      {isLogoutSuccess && <p style={{ color: "white" }}>logout success</p>}
      {couponList.map((coupon, index) => {
        return (
          <div key={index}>
            <p style={{ color: "white" }}>{coupon.c_name}</p>
            <p style={{ color: "white" }}>{coupon.c_description}</p>
          </div>
        );
      })}
      {isGetFilterOptionSuccess && <p style={{ color: "white" }}>get filter option</p>}
      {isGetFilterOptionSuccess && <p style={{ color: "white" }}><br/>industry:</p>}
      {filterOption.industry.map((option, index) => {
        return (
          <div key={index}>
            <div style={{ color: "white" }}>{option.industry_name}</div>
          </div>
        );
      })}
      {isGetFilterOptionSuccess && <p style={{ color: "white" }}><br/>merchant</p>}
      {filterOption.merchant.map((option, index) => {
        return (
          <div key={index}>
            <div style={{ color: "white" }}>{option.merchant_name}</div>
          </div>
        );
      })}
      {couponDetailStatus === "fulfilled" && <p style={{ color: "white" }}>get coupon detail</p>}
      {couponDetailStatus === "fulfilled" && <p style={{ color: "white" }}>{selectedCoupon.c_name}</p>}
      {couponDetailStatus === "fulfilled" && <p style={{ color: "white" }}>{selectedCoupon.c_description}</p>}
      {couponDetailStatus === "fulfilled" && <p style={{ color: "white" }}>{selectedCoupon.coupon_code}</p>}
      <p style={{ color: "white" }}>{couponDetailStatus}</p>
      <p style={{ color: "white" }}>{isTriggerGetCouponCode ? "triggered get coupon code" : "stop get coupon code"}</p>
    </>
  );

  return <CenterLayout bgImg={false} content={content} />;
};

export default Testing;

// const Testing: React.FunctionComponent<TestingProps> = (props) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const Ledger = useLedger();
//   const userAccountId = useSelector(accountId);
//   const nodeHost = useSelector(selectWalletNodeHost);
//   const ledger2 = LedgerClientFactory.createClient({ nodeHost });
//   const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
//   const NftContractStorage = useSelector(getNftContractStorage);

//   const [nftId, setNftId] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [nftIpfsAddress, setNftIpfsAddress] = useState<string>("");
//   const [nftNumber, setNftNumber] = useState<string>("");
//   const [imgAddress, setImgAddress] = useState<string>("");
//   const fetchUserIcon = async () => {
//     const isUserSettingUpdating = await IsUserUpdatingIcon(ledger2, userAccountId);
//     if (isUserSettingUpdating === true) {
//       setIsLoading(false);
//     } else {
//       ledger2.account
//         .getAccount({ accountId: userAccountId })
//         .then((account) => {

//           const description = JSON.parse(account.description);

//           setImgAddress(Object.keys(description.av)[0]);
//           setIsLoading(false);
//         })
//         .catch((error) => {
//           setIsLoading(false);

//         });
//       const latestTransactionNumber = await FindLatestTransactionNumber(Ledger, NftContractStorage, nftDistributor);
//       const latestTransactionList = await FindLatestTransactionArray(Ledger, NftContractStorage, nftDistributor, latestTransactionNumber);
//       setNftId(latestTransactionList[0]);
//     }
//   };

//   useEffect(() => {
//     fetchUserIcon();
//   }, []);

//   useEffect(() => {
//     if (!nftId) return;
//     FindNftIpfsAddressWithConractId(Ledger, nftId)
//       .then((result) => {

//         dispatch(profileSlice.actions.setNFTImageAddress(result.nftImage));
//         setNftIpfsAddress(result.nftImage);
//         setNftNumber(result.nftNumber);
//         setIsLoading(false);
//       })
//       .catch((e: any) => {
//         alert("We apologize that some error has occurred. You can still get your free NFT in myNft Collection if you haven't get one");
//         console.log(e);
//       });
//   }, [nftId]);

//   const content: JSX.Element = (
//     <>
//       <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
//       {/* <BackButton /> */}
//       {isLoading === true ? (
//         <div className="x0"></div>
//       ) : (
//         <>
//           <img className="x0" src={`https://ipfs.io/ipfs/${imgAddress}`} alt="0" />
//           <h1 className="text-1">#{nftNumber}</h1>
//         </>
//       )}
//       <div className="x16206">
//         <div className="lv-1">LV 1</div>
//         <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
//         <div className="reward-10">REWARD +10%</div>
//       </div>
//       <div className="x0-signa">$0 SIGNA</div>
//       {/* <div className="button_-import" onClick={() => navigate(-1)}>
//         <div className="continue inter-semi-bold-white-15px">Return</div>
//       </div> */}
//     </>
//   );

//   return <CenterLayout bgImg={false} content={content} />;
// };

// export default Testing;

// import React, { useEffect, useState } from "react";
// import "./testing.css";
// import { CarouselItem, Carousel } from "./Carousel";
// import { Link } from "react-router-dom";
// import { useSendMsgMutation } from "../../redux/characteraiAPI";

// export default function Testing() {
//   const initialArray: any[] = Array.from({ length: 10 }); // Example array with length 10
//   const [booleanStates, setBooleanStates] = useState<boolean[]>(Array(initialArray.length).fill(false));

//   const slides = [
//     {'src': `${process.env.PUBLIC_URL}/img/home/1@1x.png`, 'link': 'https://www.bettermi.io/'},
//     {'src': `${process.env.PUBLIC_URL}/img/home/1@1x.png`, 'link': 'https://www.bettermi.io/'},
//     {'src': `${process.env.PUBLIC_URL}/img/home/1@1x.png`, 'link': 'https://www.bettermi.io/'},
//   ]

//   const [ sendMsg, {isLoading, data} ] = useSendMsgMutation()

//   useEffect(() => {

//   }, []);

//   const handleSendMsg = async () => {
//     await sendMsg({msg: "testing sendMsg"})
//   }

//   return (
//     // <button onClick={() => handleSendMsg()}>
//     <>
//       <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
//       {/* <BackButton /> */}
//       {isLoading === true ? (
//         <div className="x0"></div>
//       ) : (
//         <>
//           <img className="x0" src={`https://ipfs.io/ipfs/${nftIpfsAddress}`} alt="0" />
//           <h1 className="text-1">#{nftNumber}</h1>
//         </>
//       )}
//       <div className="x16206">
//         <div className="lv-1">LV 1</div>
//         <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
//         <div className="reward-10">REWARD +10%</div>
//       </div>
//       <div className="x0-signa">$0 SIGNA</div>
//       <div className="button_-import" onClick={() => navigate("/customizeYourProfile", { state: { nftImageAddress: nftIpfsAddress, nftId: nftId } })}>
//         <div className="continue inter-semi-bold-white-15px">Next</div>
//       </div>
//     </>
//     // <button>
//     //   {booleanStates}
//     // </button>
//     // <Carousel>
//     //   {slides.map((slide, index) => {
//     //     return (
//     //       <CarouselItem key={index}>
//     //         <Link to={slide.link}>
//     //           <img className='home-scroller-element-image' src={slide.src} alt="" />
//     //         </Link>
//     //       </CarouselItem>
//     //     )
//     //   })}
//     // </Carousel>
//   );
// }

// // test trading view

// // import { createChart, ColorType } from 'lightweight-charts';

// import { Chart, AreaSeries, PriceLine, PriceScale } from "lightweight-charts-react-wrapper";
// import { IChartApi, LineStyle, ColorType, LineWidth, PriceScaleMode, AreaData, SeriesDataItemTypeMap, UTCTimestamp } from "lightweight-charts";
// // PriceScaleModem,
// import React, { useEffect, useRef, useCallback, useState } from 'react';
// import { findBMI } from "../../components/bmiCalculate";
// import { useSelector, useDispatch } from "react-redux";
// import { accountId } from "../../redux/account";
// import { useLedger } from "../../redux/useLedger";
// import { userBMISlice } from "../../redux/userBMI";
// import './testing.css'

// interface ChartProps {
//   data?: { time: string; value: number }[];
//   height?: number;
//   width?: number;
// }

// const initialColors = {
//   backgroundColor: 'transparent',
//   lineColor: '#2962FF',
//   textColor: 'white',
//   areaTopColor: '#2962FF',
//   areaBottomColor: 'rgba(41, 98, 255, 0.28)',
// }

// const testing:LineWidth = 1

// // garbge code, don't know where to put
// const genBMIlist = (option: string) => {
//   // let returnList: BMI_Day [] = []
//   let today = new Date()
//
//   let totalDays = 0
//   switch (option) {
//     case '1W':
//       totalDays = 7
//       today = new Date(today.getDate() - totalDays)
//       break
//     case '1M':
//       totalDays = 30
//       today = new Date(today.getDate() - totalDays)
//       break
//     case '1Y':
//       totalDays = 365
//       today = new Date(today.getDate() - totalDays)
//       break
//     case '5Y':
//       totalDays = 365 * 5
//       today = new Date(today.getDate() - totalDays)
//       break
//     default:
//       return []
//   }
//   for (let i = 0; i < totalDays; i++) {
//     let tempDate = new Date(today.setDate(today.getDate() + 1))
//     const year = tempDate.getFullYear();
//     const month = ('0' + (tempDate.getMonth() + 1)).slice(-2);
//     const day = ('0' + tempDate.getDate()).slice(-2);
//     const hours = ('0' + tempDate.getHours()).slice(-2);
//     const minutes = ('0' + tempDate.getMinutes()).slice(-2);
//     const formattedDate = `${year}-${month}-${day}`;

//     // let dateFormat: string = tempDate.getFullYear() + "-" + (tempDate.getMonth()+1) + "-" + tempDate.getDate()
//
//     returnList.push({time: formattedDate, value: Math.floor(Math.random() * 10) + 20.1})
//   }
//   return returnList

// }

// const areaSeriesInitialOptions = {
//   // lineColor: initialColors.lineColor!,
//   lineColor: 'transparent',
//   topColor: initialColors.areaTopColor!,
//   bottomColor: initialColors.areaBottomColor!,
//   lineWidth: testing,
//   // lineStyle: LineStyle.LargeDashed,
//   priceFormat: {
//     // type: "price",
//     precision: 1,
//   },
// }

// const initialData: SeriesDataItemTypeMap['Area'][] = [
//   {
//     "time": 1689907868 as UTCTimestamp,
//     "value": 22.5
//   }
// ]

// const CustomTradingViewChart: React.FC = () => {
//   // const [bmilist, setBMIlist] = useState([])
//   const [data, setData] = useState<SeriesDataItemTypeMap['Area'][]>()
//   const dispatch = useDispatch();
//   const tempAccountId = useSelector(accountId);
//   const Ledger2 = useLedger();
//   const height = 300
//   const width = 1000

//   useEffect(() => {
//     findBMI(tempAccountId, Ledger2)
//       .then((res) => {
//         // data = res
//         // const displayData = [res]
//         setData(res)

//
//         // dispatch(userBMISlice.actions.setBMI(res))
//       })

//   }, []);

//   // const genBMIlist

//   // useEffect(() => {
//
//   // }, [data])

//   const options = {
//     layout: {
//       background: { type: ColorType.Solid, color: initialColors.backgroundColor! },
//       textColor: initialColors.textColor!,
//       fontFamily: "Inter",
//     },
//     grid: {
//       vertLines: {
//         color: "rgba(42, 46, 57, 0)",
//       },
//       horzLines: {
//         color: "rgba(42, 46, 57, 0.6)",
//       },
//     },
//     leftPriceScale: {
//       // position: 'left',
//       borderVisible: false,
//       visible: true,
//       mode: PriceScaleMode.Normal,
//       ticksVisible: true,
//     },
//     timeScale: {
//       fixRightEdge: true,
//       fixLeftEdge: true,
//     },
//     rightPriceScale: {
//       visible: false,
//     },
//     localization: {
//       locale: 'en-US',
//       dateFormat: 'dd/MM/yyyy',
//     },
//     width: width || 1000,
//     height: height || 300,
//   }

//   // return (
//   //   <Chart {...options}>
//   //     {data && (
//   //       <AreaSeries
//   //         {...areaSeriesInitialOptions}
//   //         data={data}
//   //         // markers={data.map((item: any, index: any) => {
//   //         //   return {
//   //         //     time: item.time,
//   //         //     position: 'inBar',
//   //         //     color: data.length - 1 === index ? '#39b3af' : '#687074',
//   //         //     shape: 'circle',
//   //         //     // text: item.value,
//   //         //     // size: 1,
//   //         //     // shape: 'arrowDown',
//   //         //     // text: 'test',
//   //         //   }})
//   //         // }
//   //       >
//   //         <PriceLine
//   //           price={26.5}
//   //           color={'#39b3af'}
//   //           lineWidth={2}
//   //           lineStyle={LineStyle.LargeDashed}
//   //         />
//   //       </AreaSeries>
//   //     )}
//   //   </Chart>
//   // )

//   return (
//     <>
//       <div className="loader"></div>
//     </>
//   )
// }

// export default CustomTradingViewChart;

// import React from "react";
// import "./loadingMinting.css";
// import { CenterLayout } from "../../components/layout";
// import { useLedger } from "../../redux/useLedger";
// import { useSelector } from "react-redux";
// import { accountId } from "../../redux/account";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// interface ILoadingMintingProps {
//   pathname: string;
// }

// const LoadingMinting: React.FunctionComponent<ILoadingMintingProps> = (props) => {
//   const navigate = useNavigate();
//   const ledger = useLedger();
//   const userAccountId = useSelector(accountId);
//   const { pathname } = props;
//   const codeHashId = "7457358473503628676"; // the code hash of the BMI contract
//   const [count, setCount] = useState(1);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isMinting, setIsMinting] = useState<boolean>(true);

//   const checkIfTransactionOnChain = async () => {
//     if (!ledger) return;
//     // const startTime: number = Date.now(); // get the current time in milliseconds

//     let ourContract = await ledger.contract.getContractsByAccount({
//       accountId: userAccountId,
//       machineCodeHash: codeHashId,
//     });

//     while (ourContract.ats[0] == null) {
//       ourContract = await ledger.contract.getContractsByAccount({
//         accountId: userAccountId,
//         machineCodeHash: codeHashId,
//       });

//       if (pathname === "/loadingMinting") setIsMinting(false);
//     }

//     while (isMinting === true) {
//       if (pathname === "/loadingBMIDaily") {
//         let transaction = await ledger.account.getAccountTransactions({
//           accountId: ourContract.ats[0].at,
//         });
//         let last_transaction = transaction.transactions[transaction.transactions.length - 1];
//         let content = JSON.parse(last_transaction.attachment.message);

//         // compare upload time is today
//         let selfieTime = new Date(content.time);
//         let today = new Date();

//         if (selfieTime.getDate() === today.getDate()) {
//           setIsMinting(false);
//         }
//       }

//     }

//     setCount(100);

//     pathname === "/loadingMinting" ? navigate("/generateFreeNFT") : navigate("/selfieToEarn");
//   };

//   useEffect(() => {
//     checkIfTransactionOnChain().catch((err) => {
//       console.error(err);
//     });
//   }, []);

//   useEffect(() => {
//     const incrementInterval = 240000 / 96; // Time divided by the number of increments
//     // const incrementInterval = 5000 / 100;
//     const timer = setInterval(() => {
//       setCount((prevCount) => prevCount + 1);

//       // if (count => 100 ) {
//       // } else {
//       //   setIsLoading(false);
//       //   navigate('/generateFreeNFT');
//       //   clearInterval(timer);
//       // }
//     }, incrementInterval);

//     return () => {
//       // setIsLoading(false);
//       // navigate('/generateFreeNFT');
//       clearInterval(timer);
//     };
//   }, []);

//   useEffect(() => {
//     if (count >= 100) {
//       setIsLoading(false);
//     }
//   }, [count]);

//   const content: JSX.Element = (
//     <div className="screen">
//       <div className="bettermidapp-generate-free-nft-minting">
//         <div className="bg_2-JdJl2l">
//           <div className="mimi-loading">
//             <img className="mimi-loading-image" src="/img/loadingMinting/mimi-dancing-for-loadin-page.gif" alt="" />
//           </div>
//           <div className="x50-7ckAMs">{count}%</div>
//         </div>
//         <div className="minting-JdJl2l inter-normal-white-15px">{pathname === "/loadingBMIDaily" ? "Loading…" : "Minting…"}</div>
//         <div className="reminder-text-1 inter-normal-white-15px">
//           Please wait patiently
//           <br />
//           and do not refresh the page
//         </div>
//       </div>
//     </div>
//   );

//   return <CenterLayout content={content} bgImg={false} />;
// };

// export default LoadingMinting;
