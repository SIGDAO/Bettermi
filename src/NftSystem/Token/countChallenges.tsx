import { LedgerClientFactory } from "@signumjs/core";
import { AttachmentMessage } from "@signumjs/core";

//Interfaces
export interface DateInfo {
  day: number;
  month: number;
  year: number;
  isToday: boolean;
}

//Helper functions
function checkString(message: string) {
  const targetPhrase = "challenge number 1";
  const containsPhrase = message.includes(targetPhrase);
  return containsPhrase;
}
function findChallengeNumber(text: string) {
  const searchString = "Congrats! You completed challenge number ";
  const startIndex = text.indexOf(searchString);

  if (startIndex !== -1) {
    const startSubstring = startIndex + searchString.length;
    const endSubstring = text.indexOf(" ", startSubstring);
    const challengeNumber = text.substring(startSubstring, endSubstring !== -1 ? endSubstring : undefined);

    return parseInt(challengeNumber);
  }

  return null;
}
function extractDateFromString(message: string) {
  const regex = /\bon\s(.+?)\./;
  console.log("message to be extracted is ", message);
  const match = message.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

async function getWorldTime() {
  try {
    const response = await fetch("https://worldtimeapi.org/api/ip");
    console.log("response is", response);
    const data = await response.json();
    const dateTime = new Date(data.datetime);
    var dateString = dateTime.toLocaleString();
    console.log("Current world time:", dateTime.toLocaleString());

    const [datePart, timePart] = dateString.split(", ");

// Split the date part into day, month, and year

    const [day, month, year] = datePart.split("/");
    console.log(day);
    console.log(month);
    console.log(year);
    return [day, month, year ]
  } catch (error) {
    console.log("Error:", error);
  }
}


 function extractDateInfoAndCheckToday(dateString: string,today:string[]) {
  //const date = new Date("Mon Jan 11 2023 12:04:46 GMT+0800 (Hong Kong Standard Time)");
  const date = new Date(dateString);
  // Extract day, month, and year from the date object
  const day = date.getDate();
  const month = date.getMonth()+1;
  const year = date.getFullYear();
  console.log("day is",day);
  console.log("month is",month+1);
  console.log("year is",year);
  // Get today's date

  const todayDay = parseInt(today[0]);
  const todayMonth = parseInt(today[1]);
  const todayYear = parseInt(today[2]);
  console.log(todayDay);
  console.log(todayMonth);
  console.log(todayYear);
  // Check if the extracted date matches today's date
  const isToday = (day === todayDay && month === todayMonth && year === todayYear);

  return { day, month, year, isToday };
}

//Main functions
export async function CountChallenges(accountId: string, Ledger2: any): Promise<number[]> {
  const challengeNum = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var countTimes: number[] = [];
  for (var i = 0; i < challengeNum.length; i++) {
    countTimes.push(0);
  }

  // const GMTOffset = extractGMTOffset(dateString);
  // console.log("extracting GMT offset from string:", GMTOffset);
  // console.log("original Date:", dateString);
  // const hongKongTime = convertToHongKongTime(dateString);

  // console.log("Hong Kong Time:", hongKongTime);
  if (Ledger2 != null) {
    const unconfirmedTransaction = await Ledger2.account.getUnconfirmedAccountTransactions(accountId);
    console.log(unconfirmedTransaction);
    const today = await getWorldTime();
    console.log(today);
    if(today == null){
      return [3,3,3,3,3,3,3,3,3];
    }
    
    for (var i = 0; i < unconfirmedTransaction.unconfirmedTransactions.length; i++) {
      if (unconfirmedTransaction.unconfirmedTransactions[i] != undefined && unconfirmedTransaction.unconfirmedTransactions[i].attachment != undefined) {
        try{
        const message = unconfirmedTransaction.unconfirmedTransactions[i].attachment.message;
        if (!message) {
          continue;
        }
        console.log("unconfirmed transactions", message);
        var gametime: string | null = extractDateFromString(message);
        console.log("game time is",gametime)
        if (gametime != null) {
          const dateInfo: DateInfo =  extractDateInfoAndCheckToday(gametime,today);
          console.log("Day:", dateInfo.day);
          console.log("Month:", dateInfo.month);
          console.log("Year:", dateInfo.year);
          console.log("Is today:", dateInfo.isToday);
          if (dateInfo.isToday !== false) {
            const contains = checkString(message);
            console.log("String contains 'challenge number':", contains);
            const challengeNumber: number | null = findChallengeNumber(message);
            if (challengeNumber != null) {
              countTimes[challengeNumber - 1] = countTimes[challengeNumber - 1] + 1;
            }
          }
        }
      }
      catch(error){
        console.log("error is",error);

        continue;
      }
      }
    }
    //Check string from unconfirmedList
    const accounts = await Ledger2.account.getAccountTransactions({
      accountId: accountId,
      type: 2,
      subtype: 1,
    });
    console.log(accounts);
    for (var i = 0; i < accounts.transactions.length; i++) {
      if (accounts.transactions[i] != undefined) {
        const message = accounts.transactions[i].attachment.message;
        if (!message) {
          continue;
        }
        console.log("checking is skipped", message);
        var gametime: string | null = extractDateFromString(message);
        console.log("game time is",gametime);
        if (gametime != null) {
          const dateInfo: DateInfo =  extractDateInfoAndCheckToday(gametime,today);
          console.log("Day:", dateInfo.day);
          console.log("Month:", dateInfo.month);
          console.log("Year:", dateInfo.year);
          console.log("Is today:", dateInfo.isToday);
          if (dateInfo.isToday !== false) {
            const contains = checkString(message);
            console.log("String contains 'challenge number':", contains);
            const challengeNumber: number | null = findChallengeNumber(message);
            if (challengeNumber != null) {
              countTimes[challengeNumber - 1] = countTimes[challengeNumber - 1] + 1;
            }
          }
        }
        // if(contains == true){
        //     countTimes[1].push(1);
        // }
        // else{
        //     countTimes[1].push(0);
        // }
      }
    }
    console.log(countTimes);
  }
  return countTimes;
}
