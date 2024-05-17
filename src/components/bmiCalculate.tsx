import { useLedger } from '../redux/useLedger';
import { accountId } from '../redux/account';
import { useDispatch, useSelector } from "react-redux";
import { BMI_Day } from '../redux/userBMI';
import { UTCTimestamp, SeriesDataItemTypeMap, Time } from 'lightweight-charts';
import { calBMIType } from './rewardCalculate';
import axios from 'axios';
// import { SeriesDataItemTypeMap } from 'lightweight-charts/dist/typings/series-options';


// todo: merge with userBMI
export interface UserBMIState {
  userBMI: BMI_Day[] | undefined;
}

export interface UserBMIData{
  data:string[]
}

// find BMI contract content
// output: [] || [description || {time: time, value: value}]
const findBMIblockchainContract = async (tempAccountId: string, Ledger2: any) => {
  var contractAddress:string = '';
  var description: any;
  var bmiArray: SeriesDataItemTypeMap['Area'][]= [];
  const BMIRecord: Array<any> = [];
  const decryptedBMIRecord: Array<any> = [];
  const bmiHashId = process.env.REACT_APP_BMI_MACHINE_CODE_HASH!.replace(/"/g, '');
  // var contractData: any;
  const contract = await Ledger2.contract.getContractsByAccount({ 
    accountId :tempAccountId,
    machineCodeHash: bmiHashId,
  });
  if (!contract) return [];
  if (!contract.hasOwnProperty('ats')) return [];

  contractAddress = contract.ats[0]?.at;

  const BMIData:string[] = [];

  if (!contractAddress) return []
  try {

    description = JSON.parse(contract.ats[0]?.description);
    description.time = new Date(description.time);
    BMIRecord.push(description);
  } catch (error) {
    try {
      // description = await axios.post(process.env.REACT_APP_NODE_ADDRESS + '/decrypt', {
      //   data: contract.ats[0]?.description
      // })
      BMIRecord.push(contract.ats[0]?.description)
    } catch (error) {
      alert("Cannot fetch the record, please contact core team through discord!")
    }
  }




  const message = await Ledger2.account.getAccountTransactions({accountId:contractAddress}); //Contract Id


  
  for(let i = message.transactions.length - 1; i >= 0 ;i--){
    try {
      let tempRecord = JSON.parse(message.transactions[i].attachment.message);
      if (typeof tempRecord === 'number') continue;
      tempRecord.time = new Date(tempRecord.time);
      BMIRecord.push(tempRecord);
    } catch (error) {
      BMIRecord.push(message.transactions[i].attachment.message)
    }
  }
  const { data } = await axios.post(process.env.REACT_APP_NODE_ADDRESS + '/decrypt', {
    data: BMIRecord
  })

  let { data: decryptedArray } = data

  for ( let i = 0; i < decryptedArray.length; i++ ) {
    let content = decryptedArray[i]

    content.time = new Date(content.time);
    decryptedBMIRecord.push(content);
  }

  
  return data.data ;
}
const areRecordsOnSameDay = (record1: Date | null, record2: Date): boolean => {
  if (!record1) return false;
  const date1 = record1.toDateString();
  const date2 = record2.toDateString();

  console.log(date1, date2)
  
  return date1 === date2;
};

// find all the BMI record
// output: [] || [ {time: time, value: value} ]
export const findBMI = async (tempAccountId: string, Ledger2: any, today?: boolean | undefined) => {
  // let BMI: SeriesDataItemTypeMap['Area'][]= [];
  let BMI: { time: UTCTimestamp, value: Number, prev: Number }[] = [];

  if(Ledger2 == null) return [];

  const bmiDataObject = await findBMIblockchainContract(tempAccountId, Ledger2);


  if (!bmiDataObject) return [];

  // handle bmi contract message
  const message = bmiDataObject || null;

  // if (!message) return [];
  let content: any;
  let prev = 0;
  let prevDate: Date | null = null;
  for(let i = 0; i < message.length ;i++){
    content = message[i];
    let tempDate = content.time

    let dateFormat: UTCTimestamp  = Math.floor((tempDate.getTime() / 1000)) as UTCTimestamp;
    if (prev === 0 || prevDate === null) {
      BMI.push({time: dateFormat, value: Number(content.bmi), prev: prev});
    } else if (areRecordsOnSameDay(prevDate, tempDate)) {
      continue;
    } else {
      BMI.push({time: dateFormat, value: Number(content.bmi), prev: Number((Number(content.bmi) - prev).toFixed(1))});
    }

    prev = content.bmi;
    prevDate = tempDate;
    // return_Date(Number(obj.timestamp));

  }
  // sort the BMI value by time asc
  BMI.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0))


  return BMI;
}


export const isTodayHaveSelfieRecord = async (tempAccountId: string, Ledger2: any, bmi_fetchedData?: any) => {
  // if no ledger, return false
  if(Ledger2 == null) return false;
  const today = new Date();


  // if bmi_fetchedData, check if today have record
  if (bmi_fetchedData) {    

    for (let i = 0; i < bmi_fetchedData.length; i++) {
      const element = bmi_fetchedData[i];
      const elementDate = new Date(element.time * 1000);
      if (elementDate.getDate() === today.getDate() && elementDate.getMonth() === today.getMonth() && elementDate.getFullYear() === today.getFullYear()) {
        return true;
      };
    }
    return false;
  }


  // if no bmi_fetchedData, fetch data from blockchain and check if today have record
  const contract = await findBMIblockchainContract(tempAccountId, Ledger2);

  if (!contract) return false;

  const message = contract;

  let BMI: SeriesDataItemTypeMap['Area'][]= [];


  // handle bmi contract message
  for(let i = message.length - 1; i >= 0 ;i--){
    let content = message[i];

    let tempDate = content.time


    if (tempDate.getDate() === today.getDate() && tempDate.getMonth() === today.getMonth() && tempDate.getFullYear() === today.getFullYear()) {

      return true;
    };
  }

  return false;
}

export const isSelfieRecord = async (tempAccountId: string, Ledger2: any) => {
  const message = await findBMIblockchainContract(tempAccountId, Ledger2)

  // if no ledger, return false
  if (message.length === 0) return false;//Strange?
  return true;
}

export const getBMIRecordDay = async (tempAccountId: string, Ledger2: any) => {
  const message = await findBMIblockchainContract(tempAccountId, Ledger2)


  if (message.length === 0) {
    return 0;
  }

  let maxConsecutiveDays = 1;
  let currentConsecutiveDays = 1;

  // if no ledger, return false
  for (let i = 1; i < message.length; i++) {
    const currentDate = message[i].time;
    const previousDate = message[i - 1].time;

    const isConsecutive =
      currentDate.getDate() - previousDate.getDate() === 1 &&
      currentDate.getMonth() === previousDate.getMonth() &&
      currentDate.getFullYear() === previousDate.getFullYear();

    if (isConsecutive) {
      currentConsecutiveDays++;

      if (currentConsecutiveDays > maxConsecutiveDays) {
        maxConsecutiveDays = currentConsecutiveDays;
      }
    } else {
      currentConsecutiveDays = 1;
    }
  }

  return currentConsecutiveDays;
}

export const isHitFirstHealthyBMIRange = async (tempAccountId: string, Ledger2: any) => {
  const message = await findBMIblockchainContract(tempAccountId, Ledger2)

  // if no ledger, return false
  if (message.length === 0) return false;

  for (let i = 0; i < message.length; i++) {
    const BMIType = calBMIType(message[i].bmi);
    if (BMIType.type === 'Healthy') {
      return true;
    }
  }

  return false;
}