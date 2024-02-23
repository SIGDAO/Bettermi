import { useContext } from "react";
import { UnsignedTransaction } from "@signumjs/core";
import { Contract, ContractDataView } from "@signumjs/contracts";
import { LedgerClientFactory } from "@signumjs/core";
import { useSelector } from "react-redux";
import { Api } from "@signumjs/core";
import { useNavigate } from "react-router-dom";
import { encryptAES, generateMasterKeys, hashSHA256 } from "@signumjs/crypto";
import axios from "axios";

export interface appendArrayReturnValue {
  array: string;
  length: number;
}
export async function sortArrayAccordingToDescendingTimeStamps(array: any[]) {
  var temp;
  for (var i = 0; i < Math.min(array.length, 20); i++) {
    for (var j = i + 1; j < Math.min(array.length, 20); j++) {
      if (array[i].timestamp < array[j].timestamp) {
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  }
  return array;
}

export async function sortUnconfirmedTransactionArrayAccordingToAscendingTimeStamps(array: any[]) {
  var temp;
  for (var i = 0; i < array.length; i++) {
    for (var j = i + 1; j < array.length; j++) {
      if (array[i].timestamp > array[j].timestamp) {
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  }
  return array;
}

export async function sendMessage(ledger2: any, message: string, recipientId: string, feePlanck: string) {
  await axios.post( process.env.REACT_APP_NODE_ADDRESS + "/sendMessage", {
    message: message,
    recipientId: recipientId,
    feePlanck: feePlanck,
  });
}
export function appendMessageAndReturnLength(arrayString: string, element: string) {
  var newArray: string[] = arrayString.split(",");
  newArray.push(element);
  var length = newArray.length;
  arrayString = newArray.join(",");
  return { array: arrayString, length: length };
}
export async function UpdateUserNftList(
  ledger2: any,
  nftToBeDistributed: string,
  recipient: string,
  codeHashId: string,
  nftDistributor: string,
  nftDistributorPublicKey: string,
  nftDistributorPrivateKey: string,
) {
  let ourContract = await ledger2.contract.getContractsByAccount({
    accountId: recipient,
    machineCodeHash: codeHashId,
  });
  console.log(ourContract.ats[0]);
  const transaction = await ledger2.account.getUnconfirmedAccountTransactions(ourContract.ats[0].at);
  console.log(transaction);
  var unconfirmedTransactionList = await sortUnconfirmedTransactionArrayAccordingToAscendingTimeStamps(transaction.unconfirmedTransactions);
  for (var i = unconfirmedTransactionList.length - 1; i >= 0; i--) {
    if (unconfirmedTransactionList[i].recipient === ourContract.ats[0].at && unconfirmedTransactionList[i].sender === nftDistributor) {
      //Also need to check sender
      var nftList = unconfirmedTransactionList[i].attachment.message;
      var newArray: appendArrayReturnValue = appendMessageAndReturnLength(nftList, nftToBeDistributed);
      // nftList = nftList.split(",");
      // nftList.push(nftToBeDistributed);
      // nftList = nftList.join(",");
      nftList = newArray.array;
      //var feePlanck = (newArray.length * 1000000).toString();
      console.log(nftList);
      var feePlanck = ((Math.floor(newArray.length / 8) + 1) * 1000000).toString();
      console.log(feePlanck);
      sendMessage(ledger2, nftList, ourContract.ats[0].at, nftDistributorPublicKey, nftDistributorPrivateKey, feePlanck);
      // await ledger2.message.sendMessage({
      //     message: nftList,
      //     recipientId: ourContract.ats[0].at,
      //     senderPublicKey: nftDistributorPublicKey,
      //     senderPrivateKey: nftDistributorPrivateKey,
      //     feePlanck: feePlanck,
      // });
      console.log(ourContract.ats[0].at);
      return nftList;
    }
  }
  var transactionList = await ledger2.account.getAccountTransactions({
    accountId: ourContract.ats[0].at,
    //accountId: "12250586388493498889",
    //accountId: "13200973539414283116",
    //accountId: "7552471569593225484",
    type: 1,
    subtype: 0,
  });
  console.log(transactionList);
  console.log(transactionList.transactions.length == 0);
  if (transactionList.transactions.length == 0) {
    console.log(nftToBeDistributed);
    //sendMessage(ledger2,nftToBeDistributed,ourContract.ats[0].at,nftDistributorPublicKey,nftDistributorPrivateKey);
    console.log(transactionList.transaction);
    return nftToBeDistributed;
  } else {
    var originalNftList: string[] = [];
    var sortedTransactionList = await sortArrayAccordingToDescendingTimeStamps(transactionList.transactions);
    console.log(sortedTransactionList);
    var nftList = sortedTransactionList[0].attachment.message;
    var newArray: appendArrayReturnValue = appendMessageAndReturnLength(nftList, nftToBeDistributed);
    // nftList = nftList.split(",");
    // nftList.push(nftToBeDistributed);
    // nftList = nftList.join(",");
    nftList = newArray.array;
    console.log(newArray.length);
    var feePlanck = ((Math.floor(newArray.length / 8) + 1) * 1000000).toString();
    console.log(feePlanck);
    console.log(nftList);
    console.log(typeof transactionList.transactions[1].timestamp);
    sendMessage(ledger2, nftList, ourContract.ats[0].at, nftDistributorPublicKey, nftDistributorPrivateKey, feePlanck);
    // await ledger2.message.sendMessage({
    //     message: nftList,
    //     recipientId: ourContract.ats[0].at,
    //     senderPublicKey: nftDistributorPublicKey,
    //     senderPrivateKey: nftDistributorPrivateKey,
    //     feePlanck: "1000000",
    // });
    return nftList;
  }
}

// export function UpdateNftList(){
//     const codeHashId = "5093642053599315133";
//     const Ledger2 = LedgerClientFactory.createClient({nodeHost:"https:europe3.testnet.signum.network"});
//     const nftDistributorPrivateKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PRIVATE_KEY!;
//     const passInfo = async () => {
//         if(Ledger2 != null){
//             UpdateUserNftList(Ledger2,"4534547954881819112","416342944383657789",codeHashId,"4572964086056463895",process.env.process.env.REACT_APP_NFT_DISTRIBUTOR_PUBLIC_KEY!,nftDistributorPrivateKey);
//      }}

//     return (<button onClick = {passInfo}>UpdateNftList</button>);
// }
