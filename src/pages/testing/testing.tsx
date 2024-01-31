import * as React from "react";
import { CenterLayout } from "../../components/layout";
import { BackButton } from "../../components/button";
import "./testing.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FindLatestTransactionArray, FindLatestTransactionNumber, FindNftIpfsAddressWithConractId, IsUserUpdatingIcon } from "../../NftSystem/updateUserNftStorage";
import { selectWalletNodeHost, useLedger } from "../../redux/useLedger";
import { useDispatch, useSelector } from "react-redux";
import { profileSlice } from "../../redux/profile";
import { accountId, getNftContractStorage } from "../../redux/account";
import { LedgerClientFactory } from "@signumjs/core";

interface TestingProps {}

const Testing: React.FunctionComponent<TestingProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const Ledger = useLedger();
  const userAccountId = useSelector(accountId);
  const nodeHost = useSelector(selectWalletNodeHost);
  const ledger2 = LedgerClientFactory.createClient({ nodeHost });
  const nftDistributor = process.env.REACT_APP_NFT_DISTRIBUTOR!;
  const NftContractStorage = useSelector(getNftContractStorage);

  const [nftId, setNftId] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [nftIpfsAddress, setNftIpfsAddress] = React.useState<string>("");
  const [nftNumber, setNftNumber] = React.useState<string>("");
  const [imgAddress, setImgAddress] = React.useState<string>("");
  const fetchUserIcon = async () => {
    const isUserSettingUpdating = await IsUserUpdatingIcon(ledger2, userAccountId);
    if (isUserSettingUpdating === true) {
      setIsLoading(false);
    } else {
      ledger2.account
        .getAccount({ accountId: userAccountId })
        .then((account) => {
          console.log(account);
          const description = JSON.parse(account.description);
          console.log(description);
          console.log(Object.keys(description.av));
          console.log(typeof Object.keys(description.av)[0]);
          setImgAddress(Object.keys(description.av)[0]);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("need to equip nft");
        });
      const latestTransactionNumber = await FindLatestTransactionNumber(Ledger, NftContractStorage, nftDistributor);
      const latestTransactionList = await FindLatestTransactionArray(Ledger, NftContractStorage, nftDistributor, latestTransactionNumber);
      setNftId(latestTransactionList[0]);
    }
  };

  useEffect(() => {
    fetchUserIcon();
  }, []);

  useEffect(() => {
    if (!nftId) return;
    FindNftIpfsAddressWithConractId(Ledger, nftId)
      .then((result) => {
        console.log("reslt is ", result);
        dispatch(profileSlice.actions.setNFTImageAddress(result.nftImage));
        setNftIpfsAddress(result.nftImage);
        setNftNumber(result.nftNumber);
        setIsLoading(false);
      })
      .catch((e: any) => {
        alert("We apologize that some error has occured. You can still get your free NFT in myNft Collection if you haven't get one");
        console.log(e);
      });
  }, [nftId]);

  const content: JSX.Element = (
    <>
      <img className="photo" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/photo-1@1x.png`} alt="Photo" />
      {/* <BackButton /> */}
      {isLoading === true ? (
        <div className="x0"></div>
      ) : (
        <>
          <img className="x0" src={`https://ipfs.io/ipfs/${imgAddress}`} alt="0" />
          <h1 className="text-1">#{nftNumber}</h1>
        </>
      )}
      <div className="x16206">
        <div className="lv-1">LV 1</div>
        <img className="x6" src={`${process.env.PUBLIC_URL}/img/generateFreeNFT/file---6@1x.png`} alt="6" />
        <div className="reward-10">REWARD +10%</div>
      </div>
      <div className="x0-signa">$0 SIGNA</div>
      {/* <div className="button_-import" onClick={() => navigate(-1)}>
        <div className="continue inter-semi-bold-white-15px">Return</div>
      </div> */}
    </>
  );

  return <CenterLayout bgImg={false} content={content} />;
};

export default Testing;

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
//     console.log("testing")
//     console.log(booleanStates)
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
//   // console.log(today, "today")
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
//     // console.log()
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
//         console.log("data", typeof res)
//         console.log("res data", res)
//         // console.log("data", initialData)
//         // dispatch(userBMISlice.actions.setBMI(res))
//       })

//   }, []);

//   // const genBMIlist

//   // useEffect(() => {
//   //   console.log('data', data)
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

//     console.log("sdfidjifj");

//     let ourContract = await ledger.contract.getContractsByAccount({
//       accountId: userAccountId,
//       machineCodeHash: codeHashId,
//     });

//     while (ourContract.ats[0] == null) {
//       ourContract = await ledger.contract.getContractsByAccount({
//         accountId: userAccountId,
//         machineCodeHash: codeHashId,
//       });
//       console.log(ourContract);
//       if (pathname === "/loadingMinting") setIsMinting(false);
//     }

//     while (isMinting === true) {
//       if (pathname === "/loadingBMIDaily") {
//         let transaction = await ledger.account.getAccountTransactions({
//           accountId: ourContract.ats[0].at,
//         });
//         let last_transaction = transaction.transactions[transaction.transactions.length - 1];
//         let content = JSON.parse(last_transaction.attachment.message);
//         console.log(content.time);
//         // compare upload time is today
//         let selfieTime = new Date(content.time);
//         let today = new Date();
//         console.log(selfieTime.getDate(), today);
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
