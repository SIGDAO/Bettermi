import React, { useState, useEffect } from "react";
import "./selfieToEarn.css";
import { CenterLayout } from "../../components/layout";
import MenuBar from "../../components/menuBar";
import { ShortTitleBar } from "../../components/titleBar";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import CustomTradingViewChart from "./customTradingViewChart";
import "../../components/calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { selectBMI, userBMISlice } from "../../redux/userBMI";
import { forEach } from "lodash";
import { accountId } from "../../redux/account";
import { useLedger } from "../../redux/useLedger";
import { findBMI, isTodayHaveSelfieRecord } from "../../components/bmiCalculate";
import { BMI_Day } from "../../redux/userBMI";
import { SeriesDataItemTypeMap, UTCTimestamp } from "lightweight-charts";
import moment from "moment";
import { NavigateToTakeSelfieButton } from "../../components/button";
import { calRewardSigdaoOnSelfie } from "../../components/selfieToEarnRewardType";
import { CheckTakenSelfie } from "../../NftSystem/BMISelfieSystem";
import { LedgerClientFactory } from "@signumjs/core";
import { selectCurrentIsGuest } from "../../redux/profile";
import { TakeSelfieWindow } from "../../components/popupWindow";
import SigdaoIcon from "../../components/icon";
// import { useFindBMI } from '../../components/findBMI';

export type ISelfieToEarnProps = {
  // children?: Promise<Element>;
};

interface BMIData {
  time: UTCTimestamp;
  value: Number;
  prev: Number;
}

const SelfieToEarn: React.FunctionComponent<ISelfieToEarnProps> = (props) => {
  const [value, setValue] = useState<Date>(); // selected day on calendar
  // const [data, setData] = useState<SeriesDataItemTypeMap["Area"][]>();
  const [data, setData] = useState<BMIData[]>();
  const [daySelectedData, setDaySelectedData] = useState<any>();
  const [weekOption, setweekOption] = useState(true);
  const [monthOption, setmonthOption] = useState(false);
  const [yearOption, setyearOption] = useState(false);
  const [fiveYearOption, setFiveYearOption] = useState(false);

  const tempAccountId = useSelector(accountId);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // demo data
  const bmi_fetchedData = useSelector(selectBMI);

  const Ledger2 = useLedger();
  const userAccountId = useSelector(accountId);
  const BMIContractHashId = process.env.REACT_APP_BMI_CONTRACT_HASH_ID!;
  const isGuest = useSelector(selectCurrentIsGuest);

  // var data: BMI_Day[];

  const optionList = [
    {
      text: "1W",
      option: weekOption,
      setOption: setweekOption,
    },
    {
      text: "1M",
      option: monthOption,
      setOption: setmonthOption,
    },
    {
      text: "1Y",
      option: yearOption,
      setOption: setyearOption,
    },
    {
      text: "5Y",
      option: fiveYearOption,
      setOption: setFiveYearOption,
    },
  ];

  const handleOptionClick = (option: any) => {
    option.setOption(true);

    optionList.forEach((item) => {
      if (item.text != option.text) {
        item.setOption(false);
      }
    });
  };

  // const calRewardSigdaoOnSelfie = (bmi: number) => {
  //   if (bmi >= 18.5 && bmi <= 22.9) {
  //     return 5.25
  //   } else if (bmi > 22.9 && bmi <= 23.4 || bmi >= 18 && bmi < 18.5) {
  //     return 3.94
  //   } else if (bmi > 23.4 && bmi <= 23.7 || bmi >= 17.7 && bmi < 18) {
  //     return 2.63
  //   } else {
  //     return 1.31
  //   }
  // }

  function onChange(nextValue: any) {
    setValue(nextValue);
  }

  // todo: export a button as take a selfie component

  useEffect(() => {
    if (isGuest) {
      return;
    }
    // testing data
    // let res = genBMIlist("1W")
    // setData([
    //   { time: Math.floor(new Date().getTime() / 1000), value: 25.5 },
    //   // { time: Math.floor(new Date('2023-07-19').getTime() / 1000), value: 19.1 },
    //   // { time: Math.floor(new Date('2023-07-20').getTime() / 1000), value: 20.1 },
    //   // { time: Math.floor(new Date('2023-07-21').getTime() / 1000), value: 21.1 },
    //   // { time: Math.floor(new Date('2023-07-22').getTime() / 1000), value: 26.5 },
    //   // { time: Math.floor(new Date('2023-07-23').getTime() / 1000), value: 27.5 },
    //   // { time: Math.floor(new Date('2023-07-25').getTime() / 1000), value: 22.68 },
    //   // { time: Math.floor(new Date('2023-07-26').getTime() / 1000), value: 22.67 },
    //   // { time: '2023-07-20', value: 20.1 },
    //   // { time: '2023-07-21', value: 21.1 },
    //   // { time: '2023-07-22', value: 26.5 },
    //   // { time: '2023-07-23', value: 27.5 },
    //   // { time: '2023-07-25', value: 22.68 },
    //   // { time: '2023-07-26', value: 22.67 },
    // ]
    // )
    // setValue(new Date())

    // real data

    findBMI(tempAccountId, Ledger2).then((res) => {
      setData(res);
    });

    setValue(new Date(new Date().setHours(0, 0, 0, 0)));
  }, []);

  useEffect(() => {
    if (data && data.length !== 0) {
      dispatch(userBMISlice?.actions?.setBMI(data));
    }
  }, [data]);

  // const genBMIlist

  useEffect(() => {
    // forEach(optionList, (item) => {
    //   if (item.option) {
    //     let startIndex = data?.length()
    //     // filtering
    //     setData(bmiList)
    //     // dispatch(userBMISlice.actions.setBMI(bmiList))
    //   }
    // })
  }, [weekOption, monthOption, yearOption, fiveYearOption]);

  useEffect(() => {
    if (value && data && typeof value === "object") {
      let todayTimestamp = Math.floor(value.getTime() / 1000);
      let tmrTimestamp = todayTimestamp + 86400;
      setDaySelectedData(
        data?.filter((item: any) => {
          return item.time >= todayTimestamp && item.time < tmrTimestamp;
        }),
      );
    }
  }, [value, data]);

  useEffect(() => {}, [daySelectedData]);

  // const Custom..

  const displaySelectedDateRecord: JSX.Element =
    daySelectedData && daySelectedData.length !== 0 ? (
      daySelectedData?.map((item: any, index) => {
        const date = new Date(item.time * 1000);
        const dateFormat = date.toLocaleDateString("en-GB");

        return (
          <div key={index} className="display-selected-data-record-container">
            <div className="trending-container">
              {item.prev !== 0 && (
                <img
                  className={`${item.prev > 0 ? "icon-arrow-left-XaN6DJ-up" : "icon-arrow-left-XaN6DJ"} icon-arrow-left-img`}
                  src="img/selfieToEarn/icon-arrow-left-6@1x.png"
                  alt="icon-arrow-left"
                />
              )}
              <div className="trending-text-container inter-normal-keppel-12px">{item.prev === 0 ? "-" : item.prev + "kg/m²"}</div>
            </div>
            <div className="day-and-bmi-data-container">
              <div className="inter-medium-white-15px">{dateFormat}</div>
              <div className="inter-normal-cadet-blue-12px">{item.value} kg/m²</div>
            </div>
            <div className="sigdao-reward-container">
              <SigdaoIcon height="17px" width="17px" />
              <div className="sigdao-reward-text-container inter-semi-bold-keppel-14px">+{calRewardSigdaoOnSelfie(item?.value) / 10 ** 6}</div>
            </div>
          </div>
        );
      })
    ) : (
      <div className="no-record-container inter-medium-white-15px">No record today.</div>
    );

  const registeredUserView: JSX.Element = (
    <>
      <div className="bmi_-status-MUU5YC">
        <div className="current-kgm2-C5Ye0d inter-normal-cadet-blue-12px-2">
          <span className="span0-b6eiBJ inter-normal-cadet-blue-12px">CURRENT (KG/M²)</span>
        </div>
        <div className="start-kgm2-C5Ye0d inter-normal-cadet-blue-12px-2">
          <span className="span0-OeIZvd inter-normal-cadet-blue-12px">START (KG/M²)</span>
        </div>
        <img className="bmi-goal-C5Ye0d bmi-goal" src="img/selfieToEarn/bmi-goal-1@1x.png" alt="BMI Goal" />
        <img className="bmi-goal-HuKS2x bmi-goal" src="img/selfieToEarn/bmi-goal-1@1x.png" alt="BMI Goal" />
        <div className="x255-C5Ye0d">{data && String(data[data?.length - 1]?.value)}</div>
        <div className="x265-C5Ye0d">{data && String(data[0]?.value)}</div>
        <img className="x598-C5Ye0d" src="img/selfieToEarn/file---598@1x.png" alt="598" />
      </div>
      <div className="x6-MUU5YC x6">
        {/* orignal chat */}
        <div className="mean-bmi-discription-container">
          <div className="mean-bmi-discription inter-normal-white-12px">Mean BMI (kg/m²)</div>
          <ul className="mean-bmi-setting">
            {optionList.map((option) => {
              return (
                <li
                  className={option.option ? "mean-bmi-setting-item-selected inter-normal-cadet-blue-12px-3" : "mean-bmi-setting-item inter-normal-cadet-blue-12px-3"}
                  key={option.text}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.text}
                </li>
              );
            })}
          </ul>
        </div>
        <CustomTradingViewChart data={data} height={323} width={390} setValue={onChange} />
      </div>
      <div className="calender-MUU5YC">
        <Calendar
          calendarType="Arabic"
          onChange={onChange}
          value={value}
          locale="en-US"
          minDetail="decade"
          // allowPartialRange={true}
          // selectRange={true}
        />
      </div>
      <div className="x16212-MUU5YC">
        <div className="rewards_card-container">{displaySelectedDateRecord}</div>
      </div>
    </>
  );

  const guestUserView = (
    <>
      <div className="bg-locked-selfieToEarn"></div>
      <div className="take-selfie-window-guest-container">
        <TakeSelfieWindow />
      </div>
    </>
  );

  const content: JSX.Element = (
    <div className="screen">
      <div className={isGuest ? "bettermidapp-selfie-to-earn-1-inactive" : "bettermidapp-selfie-to-earn-1"}>
      {/* <div className={"bettermidapp-selfie-to-earn-1"}> */}

        <ShortTitleBar title="Selfie to Earn" aiCoach={true} setting={true} />
        <div className="take-a-selfie-button-container">
          <NavigateToTakeSelfieButton />
        </div>
        <div className="bmi_-status-MUU5YC">
          <div className="current-kgm2-C5Ye0d inter-normal-cadet-blue-12px-2">
            <span className="span0-b6eiBJ inter-normal-cadet-blue-12px">CURRENT (KG/M²)</span>
          </div>
          <div className="start-kgm2-C5Ye0d inter-normal-cadet-blue-12px-2">
            <span className="span0-OeIZvd inter-normal-cadet-blue-12px">START (KG/M²)</span>
          </div>
          <img className="bmi-goal-C5Ye0d bmi-goal" src="img/selfieToEarn/bmi-goal-1@1x.png" alt="BMI Goal" />
          <img className="bmi-goal-HuKS2x bmi-goal" src="img/selfieToEarn/bmi-goal-1@1x.png" alt="BMI Goal" />
          <div className="x255-C5Ye0d">{data && String(data[data?.length - 1]?.value)}</div>
          <div className="x265-C5Ye0d">{data && String(data[0]?.value)}</div>
          <img className="x598-C5Ye0d" src="img/selfieToEarn/file---598@1x.png" alt="598" />
        </div>
        <div className="x6-MUU5YC x6">
          {/* orignal chat */}
          <div className="mean-bmi-discription-container">
            <div className="mean-bmi-discription inter-normal-white-12px">Mean BMI (kg/m²)</div>
            <ul className="mean-bmi-setting">
              {optionList.map((option) => {
                return (
                  <li
                    className={option.option ? "mean-bmi-setting-item-selected inter-normal-cadet-blue-12px-3" : "mean-bmi-setting-item inter-normal-cadet-blue-12px-3"}
                    key={option.text}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.text}
                  </li>
                );
              })}
            </ul>
          </div>
          <CustomTradingViewChart data={data} height={323} width={390} setValue={onChange} />
        </div>
        <div className="calender-MUU5YC">
          <Calendar
            calendarType="Arabic"
            onChange={onChange}
            value={value}
            locale="en-US"
            minDetail="decade"
            // allowPartialRange={true}
            // selectRange={true}
          />
        </div>
        <div className="x16212-MUU5YC">
          <div className="rewards_card-container">{displaySelectedDateRecord}</div>
        </div>
        {isGuest && guestUserView}
        <MenuBar />
      </div>
    </div>
  );

  return <CenterLayout content={content} bgImg={false} />;
};

export default SelfieToEarn;
