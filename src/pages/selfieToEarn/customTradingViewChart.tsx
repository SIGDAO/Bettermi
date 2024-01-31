// test trading view


// import { createChart, ColorType } from 'lightweight-charts';

import { Chart, AreaSeries, PriceLine, PriceScale } from "lightweight-charts-react-wrapper";
import { IChartApi, LineStyle, ColorType, LineWidth, PriceScaleMode, AreaData, SeriesDataItemTypeMap } from "lightweight-charts";
// PriceScaleModem, 
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { findBMI } from "../../components/bmiCalculate";
import { useSelector, useDispatch } from "react-redux";
import { accountId } from "../../redux/account";
import { useLedger } from "../../redux/useLedger";
import { userBMISlice } from "../../redux/userBMI";

interface ChartProps {
  data?: { time: string; value: number }[];
  height?: number;
  width?: number;
}

const initialColors = {
  // backgroundColor: '#171717',
  backgroundColor: 'transparent',
  lineColor: '#2962FF',
  textColor: 'white',
  // areaTopColor: '#2962FF',
  // areaBottomColor: 'rgba(41, 98, 255, 0.28)',
  areaTopColor: '#4136F1',
  areaBottomColor: '#8643FF',
}

const genBMIlist = (option: string) => {
  let returnList = []
  let today = new Date()
  console.log(today, "today")
  let totalDays = 0
  switch (option) {
    case '1W':
      totalDays = 7
      break
    case '1M':
      totalDays = 30
      break
    case '1Y':
      totalDays = 365
      break
    case '5Y':
      totalDays = 365 * 5
      break
    default:
      return []
  }
  for (let i = 0; i < totalDays; i++) {
    let tempDate = new Date(today.setDate(today.getDate() - 1))
    let dateFormat = tempDate.getFullYear() + "-" + (tempDate.getMonth()+1) + "-" + tempDate.getDate()

    console.log()
    returnList.push({time: dateFormat, value: Math.floor(Math.random() * 10) + 20.1})
  }
  return returnList

}



const initialData = [
  { time: '2018-12-22', value: 26.5 },
  { time: '2018-12-23', value: 27.5 },
  { time: '2018-12-24', value: 25.5 },
  // { time: '2018-07-25', value: 25.5 },
  // { time: '2018-07-25', value: 25.17 },
  { time: '2018-12-27', value: 28.89 },
  { time: '2018-12-28', value: 25.46 },
  { time: '2018-12-29', value: 23.92 },
  { time: '2023-12-30', value: 22.68 },
  { time: '2023-12-31', value: 22.67 },
];

const testing:LineWidth = 1

const areaSeriesInitialOptions = {
  // lineColor: initialColors.lineColor!,
  lineColor: 'transparent',
  topColor: initialColors.areaTopColor!,
  bottomColor: initialColors.areaBottomColor!,
  lineWidth: testing,
  // lineStyle: LineStyle.LargeDashed,
  priceFormat: {
    // type: "price",
    precision: 1,
  },
  // crosshairMarkerVisible: false,
  // priceScaleId: 'left',
}


const CustomTradingViewChart: React.FC<ChartProps> = (prop) => {
  // const [bmilist, setBMIlist] = useState([])
  // const [data, setData] = useState<SeriesDataItemTypeMap['Area'][]>()
  const { height, width, data } = prop;
  const displayData: AreaData[] = []
  const handleReference = useCallback((ref: IChartApi) => {
    ref?.timeScale().fitContent();
  }, []);
  const dispatch = useDispatch();  


  const options = {
    layout: {
      background: { type: ColorType.Solid, color: initialColors.backgroundColor! },
      textColor: initialColors.textColor!,
      fontFamily: "Inter",
    },
    grid: {
      vertLines: {
        color: "rgba(42, 46, 57, 0)",
      },
      horzLines: {
        color: "rgba(42, 46, 57, 0.6)",
      },
    },
    leftPriceScale: {
      // position: 'left',
      borderVisible: false,
      visible: true,
      mode: PriceScaleMode.Normal,
      ticksVisible: true,
    },
    timeScale: {
      fixRightEdge: true,
      fixLeftEdge: true,
    },
    rightPriceScale: {
      visible: false,
    },
    localization: {
      locale: 'en-US',
      dateFormat: 'dd/MM/yyyy',
    },
    width: width || 1000,
    height: height || 300,
  }
  

  return (
    <Chart {...options} ref={handleReference}>
      {data && (
        <AreaSeries 
          {...areaSeriesInitialOptions} 
          data={data}
          markers={data.map((item: any, index: any) => {
            return {
              time: item.time,
              position: 'inBar',
              color: data.length - 1 === index ? '#39B3AF' : '#4136F1',
              shape: 'circle',
              // text: item.value,
              // size: 1,
              // shape: 'arrowDown',
              // text: 'test',
            }})
          }
        >
          <PriceLine 
            price={26.5} 
            color={'#39b3af'} 
            lineWidth={2} 
            lineStyle={LineStyle.LargeDashed} 
          />
        </AreaSeries>
      )}
    </Chart>
  )
}

export default CustomTradingViewChart;



// const ChartComponent: React.FC<ChartProps> = ({
//   data,
//   colors = initialColors,
// }) => {
//   const chartContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleResize = () => {
//       if (chartContainerRef.current) {
//         chart.applyOptions({ width: chartContainerRef.current.clientWidth });
//       }
//     };

//     const chart = createChart(chartContainerRef.current!, {
//       layout: {
//         background: { type: ColorType.Solid, color: colors.backgroundColor! },
//         textColor: colors.textColor!,
//       },
//       width: chartContainerRef.current?.clientWidth,
//       height: 300,
//     });
//     chart.timeScale().fitContent();

//     const newSeries = chart.addAreaSeries({
//       lineColor: colors.lineColor!,
//       topColor: colors.areaTopColor!,
//       bottomColor: colors.areaBottomColor!,
//     });
//     newSeries.setData(data);

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);

//       chart.remove();
//     };
//   }, [data, colors]);

//   return <div ref={chartContainerRef} />;
// };

// const App: React.FC = () => {
//   return (
//     <div className="testing" style={{'backgroundColor': 'black',}}>
//       <ChartComponent data={initialData} colors={initialColors}/>
//     </div>
//   )
// };

// export default App;

// import React, { useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';


// function MyApp() {
//   const [value, setValue] = useState(new Date());

//   function onChange(nextValue: any) {
//     setValue(nextValue);
//   }

//   return (
//     <Calendar
//       calendarType='Arabic'
//       onChange={onChange}
//       value={value}
//       locale='en-US'
//     />
//   );
// }

// export default MyApp;