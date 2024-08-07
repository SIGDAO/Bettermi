import { useContext } from "react";
import { UnsignedTransaction } from "@signumjs/core";
import { Contract, ContractDataView } from "@signumjs/contracts";
import { LedgerClientFactory } from "@signumjs/core";
import { useSelector } from "react-redux";
import { Api } from "@signumjs/core";
import { useNavigate } from "react-router-dom";
import { encryptAES, generateMasterKeys, hashSHA256 } from "@signumjs/crypto";
import { UpdateUserNftList } from "./updateUserNftList";
import { sendMessage } from "./updateUserNftList";
import { sortArrayAccordingToDescendingTimeStamps, sortUnconfirmedTransactionArrayAccordingToAscendingTimeStamps } from "./updateUserNftList";
import { FindLatestTransactionArray, FindLatestTransactionNumber, UpdateUserStorage } from "./updateUserNftStorage";
import { updateReceiverAccount } from "./updateUserNftStorage";
import { CheckNftOwnerId } from "./updateUserNftStorage";
import axios from "axios";

async function getNftList(ledger2: Api, nftStorageAccount: string, nftDistributor: string) {
  const nftTokenId = await ledger2.account.getAccountTransactions({
    accountId: nftStorageAccount,
    type: 1,
    subtype: 0,
  }); //get the nft Token ids from the user account
  console.log(nftTokenId);
  var nftList;
  const message = await ledger2.account.getUnconfirmedAccountTransactions(nftDistributor);
  console.log(message);
  console.log(message.unconfirmedTransactions[0]);
  var nftIdList: string[] = [];
  for (var i = message.unconfirmedTransactions.length - 1; i >= 0; i--) {
    if (message.unconfirmedTransactions[i].recipient === nftStorageAccount && message.unconfirmedTransactions[i].sender === nftDistributor) {
      //Also need to check sender
      var nftList = message.unconfirmedTransactions[i].attachment.message;
      console.log(nftList, "nftList found from unconfirmed transaction");
      nftList = nftList.split(",");
      return nftList;
    }
  }
  for (var i = 0; i < nftTokenId.transactions.length; i++) {
    console.log(nftTokenId.transactions[i].sender);
    console.log(typeof nftTokenId.transactions[i].sender);
    if (nftTokenId.transactions[i].sender === nftDistributor) {
      if (nftTokenId.transactions[i].attachment.message === "empty") {
        console.log("no nft left");
        return "empty";
        break;
      }
      nftList = nftTokenId.transactions[i].attachment.message;
      break;
    }
  } //filter out the messages that is from us
  console.log(nftList, "nftList");
  nftList = nftList.split(",");
  return nftList;
}

async function ChooseNftToBeDistributed(nftList: string[]) {
  const arrayIndex = Math.floor(Math.random() * nftList.length);
  const nftToBeDistributed = nftList[arrayIndex];
  console.log(nftToBeDistributed, "nftToBeDistributed");
  return { nft: nftToBeDistributed, arrayIndex: arrayIndex };
}

export interface NFTinfo {
  nft: string;
  arrayIndex: number;
}

async function CheckNftOwnership(ledger2: any, nftToBeDistributed: NFTinfo, nftDistributor: string) {
  const message = await ledger2.account.getUnconfirmedAccountTransactions(nftDistributor);
  console.log(message);
  console.log(message.unconfirmedTransactions[0]);
  for (var i = message.unconfirmedTransactions.length - 1; i >= 0; i--) {
    if (message.unconfirmedTransactions[i].recipient === nftToBeDistributed.nft && message.unconfirmedTransactions[i].recipient === nftDistributor) {
      console.log(message.unconfirmedTransactions[i], "message");
      console.log("checkNftOwnership,checked nft owned by others");
      return false;
    }
  }
  console.log(message.unconfirmedTransactions[0]);
  console.log("checkNftOwnership,checked nft is not owned by others");
  return true;
}

export async function SendBackToStorage(
  ledger2: any,
  nftToBeReturned: string,
  nftDistributor: string,
  nftStorageAccount: string,
  nftDistributorPublicKey: string,
  nftDistributorPrivateKey: string,
  recipientPrivateKey: string,
  recipientPublicKey: string,
) {
  await TransferNftToUser(ledger2, nftToBeReturned, nftDistributor);
  const message = await ledger2.account.getUnconfirmedAccountTransactions(nftDistributor);
  console.log(message);
  console.log(message.unconfirmedTransactions[0]);
  var nftIdList: string[] = [];
  for (var i = message.unconfirmedTransaction.length - 1; i >= 0; i--) {
    if (message.unconfirmedTransactions[i].recipient === nftStorageAccount) {
      var messageToBeSent = message.unconfirmedTransactions[i].attachment.message;
      console.log(messageToBeSent, "nftList");
      nftIdList = messageToBeSent.split(",");
      nftIdList.push(nftToBeReturned);
      console.log(message.unconfirmedTransactions[i], "message");
      nftIdList.join(",");
      await ledger2.message.sendMessage({
        message: nftIdList,
        recipientId: nftStorageAccount,
        feePlanck: "1000000",
        senderPublicKey: nftDistributorPublicKey,
        senderPrivateKey: nftDistributorPrivateKey,
      });
      return true;
    }
  }
  var nftList = await getNftList(ledger2, nftDistributor, nftDistributor);
  nftList.push(nftToBeReturned);
  const newNftList = nftList.join(",");
  console.log(newNftList);
  console.log(typeof newNftList);
  await ledger2.message.sendMessage({
    message: newNftList,
    recipientId: nftStorageAccount,
    feePlanck: "1000000",
    senderPublicKey: nftDistributorPublicKey,
    senderPrivateKey: nftDistributorPrivateKey,
  });
  console.log(message.unconfirmedTransactions[0]);
  return true;
}

async function TransferNftToUser(ledger2: any, nftToBeDistributed: string, recipientId: string) {
  console.log(recipientId);
  console.log({
      feePlanck: "1000000",
      amountPlanck: "31000000",
      contractId: nftToBeDistributed,
      methodHash: "3",
      methodArgs: [recipientId, "0", "0"],
    })


  await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/transferNftToUser", {
    feePlanck: "1000000",
    amountPlanck: "31000000",
    contractId: nftToBeDistributed,
    methodHash: "3",
    methodArgs: [recipientId, "0", "0"],
  });



  // await ledger2.contract.callContractMethod({
  //   senderPublicKey: senderPublicKey,
  //   senderPrivateKey: senderPrivateKey,
  //   feePlanck: "1000000",
  //   amountPlanck: "31000000",
  //   contractId: nftToBeDistributed,
  //   methodHash: "3",
  //   methodArgs: [recipientId, "0", "0"],
  // });
}

async function UpdateNftUser(ledger2: any, nftToBeDistributed: string, recipient: string, codeHashId: string, nftDistributor: string) {
  let ourContract = await ledger2.contract.getContractsByAccount({
    accountId: recipient,
    machineCodeHash: codeHashId,
  });
  console.log(ourContract.ats[0]);
  const transaction = await ledger2.account.getUnconfirmedAccountTransactions(ourContract.ats[0].at);
  console.log(transaction);
  var unconfirmedTransactionList = await sortUnconfirmedTransactionArrayAccordingToAscendingTimeStamps(transaction.unconfirmedTransactions);
  for (var i = unconfirmedTransactionList.length - 1; i >= 0; i--) {
    if (unconfirmedTransactionList[i].recipient === ourContract && unconfirmedTransactionList[i].sender === nftDistributor) {
      //Also need to check sender
      var nftList = unconfirmedTransactionList[i].attachment.message;
      nftList.split(",");
      nftList.push(nftToBeDistributed);
      nftList.join(",");
      return nftList;
    }
  }
  var transactionList = await ledger2.account.getAccountTransactions({
    accountId: ourContract.ats[0].at,
  });
  console.log(transactionList);
  const hi = "";
  console.log(hi === "");
  const latestTransactionNumber = await FindLatestTransactionNumber(ledger2, ourContract.ats[0].at, nftDistributor);
  FindLatestTransactionArray(ledger2, ourContract.ats[0].at, nftDistributor, latestTransactionNumber);
  //FindLatestTransactionArray(ledger2,"8171756695529241056",nftDistributor,latestTransactionNumber);
}

async function CheckAndOpenNftContract(ledger2: any, recipient: string, codeHashId: string) {
  let ourContract = await ledger2.contract.getContractsByAccount({
    accountId: recipient,
    machineCodeHash: codeHashId,
  });
  console.log(ourContract.ats[0]);
  if (ourContract.ats[0] == null) {
    setTimeout(async () => {
      const hi = await CheckAndOpenNftContract(ledger2, recipient, codeHashId);
      return hi;
    }, 10000);
  } else {
    return true;
  }
}

export const TransferNft = async (
  ledger2: any,
  recipientId: string,
  nftStorageAccounts: string[],
  codeHashId: string,
  nftDistributor: string,
  // nftDistributorPublicKey: string,
  // nftDistributorPrivateKey: string,
) => {
  //const nftStorageAccounts:string[] = ["15665755121650078056","4706959057956461088"];
  var nftStorageAccount = nftStorageAccounts![Math.floor(Math.random() * nftStorageAccounts!.length)]; //Pick a random account from the storage
  console.log(nftStorageAccount, "nftStorageAccount");
  var nftList = await getNftList(ledger2, nftStorageAccount, nftDistributor);
  while (nftList === "empty") {
    console.log("the current distributor is empty, select another one");
    nftStorageAccount = nftStorageAccounts![Math.floor(Math.random() * nftStorageAccounts!.length)]; //Pick a random account from the storage
    nftList = await getNftList(ledger2, nftStorageAccount, nftDistributor);
  }
  var nftToBeDistributed: NFTinfo = await ChooseNftToBeDistributed(nftList);
  var isNftAlreadyBeenDistributed = await CheckNftOwnership(ledger2, nftToBeDistributed, nftDistributor);
  while (isNftAlreadyBeenDistributed === false) {
    nftToBeDistributed = await ChooseNftToBeDistributed(nftList);
    isNftAlreadyBeenDistributed = await CheckNftOwnership(ledger2, nftToBeDistributed, nftDistributor);
  } // Check getting new one if the old one is already disributed.
  console.log(nftToBeDistributed, "nftToBeDistributed");
  console.log("recipientId is ", recipientId);

  await TransferNftToUser(ledger2, nftToBeDistributed.nft, recipientId);
  console.log("transfered nft to user");
  nftList.splice(nftToBeDistributed.arrayIndex, 1);
  var newNftList = "empty";
  var feePlanck = "1000000";
  if (nftList != "") {
    var newNftListLength = newNftList.length;
    feePlanck = ((Math.floor(nftList.length / 8) + 1) * 1000000).toString();
    newNftList = nftList.join(",");
    console.log(newNftList);
    console.log(newNftList.length, "newNftList.length");
    console.log("fee planck is", feePlanck);
  }
  await sendMessage(ledger2, newNftList, nftStorageAccount, feePlanck);
  await updateReceiverAccount(ledger2, recipientId, codeHashId, nftToBeDistributed.nft, nftDistributor);
};

export async function CheckNewUser(ledger2: any, userId: String, codeHashIdForNft: string, nftDistributor: string) {
  let senderNftStorage = await ledger2.contract.getContractsByAccount({
    accountId: userId,
    machineCodeHash: codeHashIdForNft,
  });
  if (senderNftStorage.ats.length >= 1) {
    //console.log("only one nft contract");
    const latestTransactionNumber = await FindLatestTransactionNumber(ledger2, senderNftStorage.ats[0].at, nftDistributor);
    if (latestTransactionNumber === "0") {
      console.log("no transaction");
      return true;
    }
  }
  //console.log(senderNftStorage.ats);
}

export async function TransferNftToNewUser(
  ledger2: any,
  userId: string,
  nftStorageAccounts: string[],
  codeHashId: string,
  nftDistributor: string,
) {
  const isNewUser = await CheckNewUser(ledger2, userId, codeHashId, nftDistributor);
  if (isNewUser === true) {
    //console.log("Transfering NFT to new user");
    await TransferNft(ledger2, userId, nftStorageAccounts, codeHashId, nftDistributor);
  }
}
