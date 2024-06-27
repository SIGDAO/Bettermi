import { useContext } from "react";
import { UnsignedTransaction } from "@signumjs/core";
import { Contract, ContractDataView } from "@signumjs/contracts";
import { LedgerClientFactory } from "@signumjs/core";
import { useSelector } from "react-redux";
import { Api } from "@signumjs/core";
import { useNavigate } from "react-router-dom";
import { encryptAES,generateMasterKeys,hashSHA256 } from "@signumjs/crypto";
import { sortUnconfirmedTransactionArrayAccordingToAscendingTimeStamps } from "./updateUserNftList";
import { sortArrayAccordingToDescendingTimeStamps } from "./updateUserNftList";
import { send } from "process";
import { sendMessage } from "./updateUserNftList";
import { myNftList } from "../pages/myNftList/myNftList";
import { convertWordToNumber } from "./Reward/getRewardPercentage";
import { otherUserNftList } from "../pages/leaderboard/otherUserProfile";
import { getApiUrls } from "../components/constants/constant";
import { getDomains } from "../components/ipfsImgComponent";


export async function AddNftToAccount(ledger2:any, recipientId:string,nftToBeDistributed:string){
    
}

export async function fetchIPFSJSON(address: string) {
    let res, text;
    const domains = getDomains(address);
    const url = getApiUrls(address).imgAddress;
    console.log("testing url is",url)
    let index = 0;
    while (true) {
        const ipfsAddress = domains[index];
        try {
            res = await fetch(ipfsAddress);
            text = await res.text();
            break;
        }
        catch (error){
            console.log(error);
            index = (index + 1) % domains.length
        }    
    }
    return JSON.parse(text);
}

export async function FindLatestTransactionNumber(ledger2:any,recipient:string,nftDistributor:string){//Takes the account id of recipient but not the contrat Id
    console.log(ledger2);
    console.log(recipient);
    console.log(nftDistributor)
    const message = await ledger2.account.getUnconfirmedAccountTransactions(recipient);
    console.log(message);
    const unconfirmedTransactionList = await sortUnconfirmedTransactionArrayAccordingToAscendingTimeStamps(message.unconfirmedTransactions);
    console.log(unconfirmedTransactionList);
    var latestTransactionNumber:string = "0";
    var finalArray:string[] = [];
    var tempArray:string[] = [];
    for(var i = unconfirmedTransactionList.length - 1;i >= 0;i--){
        if(unconfirmedTransactionList[i].sender === nftDistributor && unconfirmedTransactionList[i].recipient === recipient){
            tempArray = unconfirmedTransactionList[i].attachment.message.split(",");
            console.log("Latest Transaction found",tempArray[0]);
            latestTransactionNumber = tempArray[0];
            console.log("latest transaction number is ",latestTransactionNumber);
            return latestTransactionNumber;
    }
}
    const transactionList = await ledger2.account.getAccountTransactions({
        accountId: recipient,
    });
    const nftListInUserAccount = await sortArrayAccordingToDescendingTimeStamps(transactionList.transactions);
    console.log("Finding the lastest transaction from user's nftStorage account",transactionList);
    for (var i = 0; i < nftListInUserAccount.length;i++){
        if(nftListInUserAccount[i].sender === nftDistributor && nftListInUserAccount[i].recipient === recipient){    
            tempArray = nftListInUserAccount[i].attachment.message.split(",");
                latestTransactionNumber = tempArray[0];
                console.log("latest transaction number is ",latestTransactionNumber);
                return latestTransactionNumber;
            }
    }
    console.log("latest transaction number is ",latestTransactionNumber)
    return latestTransactionNumber;
}

export async function FindLatestTransactionArray(ledger2:any,recipient:string,nftDistributor:string,latestTransactionNumber:string):Promise<string[]>{//Takes the account id of recipient but not the contrat Id
    console.log(recipient);
    const message = await ledger2.account.getUnconfirmedAccountTransactions(recipient);
    var unconfirmedTransactionList = await sortUnconfirmedTransactionArrayAccordingToAscendingTimeStamps(message.unconfirmedTransactions);
    console.log(unconfirmedTransactionList);
    var finalArray:string[] = [];
    var tempArray:string[] = [];
    if(latestTransactionNumber === "0"){
        finalArray.push("empty")
        return finalArray;
    }
    for(var i = unconfirmedTransactionList.length - 1;i >= 0;i--){
        if(unconfirmedTransactionList[i].sender === nftDistributor && unconfirmedTransactionList[i].recipient === recipient){
            tempArray = unconfirmedTransactionList[i].attachment.message.split(",");
            console.log("the temp array is",tempArray);
            if(tempArray[1] === "empty"){
                console.log("no NftLeft");
                finalArray.push("empty")
                return finalArray;
            }
            if(latestTransactionNumber === tempArray[0]){
                tempArray.splice(0,1);
                finalArray = finalArray.concat(tempArray);
            }
            console.log("the final array is",finalArray);
        //     finalArray = finalArray.concat(tempArray);
        //     for(var j = i; j >= 0; j--){
        //         if(unconfirmedTransactionList[j].sender === nftDistributor && unconfirmedTransactionList[j].recipient === recipient){
        //             tempArray = unconfirmedTransactionList[j].attachment.message.split(",");
        //             if(tempArray[j] === latestTransactionNumber){
        //                 tempArray.splice(0,1);
        //                 finalArray = finalArray.concat(tempArray);
        //             console.log("Latest Transaction found",tempArray[0]);
        //             }
        //             if(Number(tempArray[j]) < Number(latestTransactionNumber)){
        //                 break;
        //             } 
        //     }
        //     break;
        // }
    if(Number(tempArray[i]) < Number(latestTransactionNumber)){
        break;
    }
}
    }
    var transactionList = await ledger2.account.getAccountTransactions({
        accountId: recipient,
    });
    var nftListInUserAccount = await sortArrayAccordingToDescendingTimeStamps(transactionList.transactions);
    console.log("Finding the lastest transaction from user's nftStorage account",nftListInUserAccount);
    console.log("nftListInUserAccount.length", nftListInUserAccount.length);
    for (var i = 0;i<nftListInUserAccount.length;i++){
        console.log("nftListInUserAccount[i].sender", nftListInUserAccount[i])
        if(nftListInUserAccount[i].sender === nftDistributor && nftListInUserAccount[i].recipient === recipient){
            tempArray = nftListInUserAccount[i].attachment.message.split(",");
            console.log(i);
            console.log(tempArray);
            if(Number(tempArray[0]) != Number(latestTransactionNumber)){
                console.log("not latest transaction",latestTransactionNumber,"   ",tempArray);
                break;
            } 
            if(tempArray[1] === "empty"){
                console.log("no nft left");
                finalArray.push("empty")
                return finalArray;            
            }
            if(latestTransactionNumber === tempArray[0]){
                console.log("Latest Transaction found",tempArray[0]);
                tempArray.splice(0,1);
                finalArray = finalArray.concat(tempArray);
                continue;
            }
        }
}
console.log("the final array is",finalArray);
return finalArray;
}



export async function updateReceiverAccount(ledger2:any, recipientId:string,codeHashId:string,nftToBeDistributed:string,nftDistributor:string){
    let receiverNftStorage = await ledger2.contract.getContractsByAccount({
        accountId: recipientId,
        machineCodeHash: codeHashId,
    });
    var latestTransactionList:string[] = [];
    var finalNftList:string[] = [];
    var finalNftListString:string = "";
    const latestTransactionNumber = await FindLatestTransactionNumber(ledger2,receiverNftStorage.ats[0].at,nftDistributor);
    const newTransactionNumber = (Number(latestTransactionNumber) + 1).toString();
    latestTransactionList = await FindLatestTransactionArray(ledger2,receiverNftStorage.ats[0].at,nftDistributor,latestTransactionNumber);
    if(latestTransactionList[0] === "empty"){
        finalNftList.push(newTransactionNumber);
        finalNftList.push(nftToBeDistributed); 
        finalNftListString = finalNftList.join(",");
        console.log("final nft list is",finalNftListString);
        await sendMessage(ledger2,finalNftListString,receiverNftStorage.ats[0].at,"1000000");
    }

    else{
        console.log("latest transaction list is ",latestTransactionList);
        if(latestTransactionList.includes(nftToBeDistributed) === true){
            console.log("The nft is already included, return");
            return "unsuccessful";
        }
        finalNftList.push(newTransactionNumber);
        finalNftList.push(nftToBeDistributed);
        for(var i = 0;i<latestTransactionList.length;i++){
            console.log(latestTransactionList[i]);
            finalNftList.push(latestTransactionList[i]);
            if(i !=0 && i%46 == 0){
                finalNftListString = finalNftList.join(",");
                console.log("final nft list to be sent is",finalNftListString);
                await sendMessage(ledger2,finalNftListString,receiverNftStorage.ats[0].at,"6000000");
                finalNftList = [];
                finalNftList.push(newTransactionNumber);
                console.log("The finalNftList after clearing",finalNftList);
                continue;
            }
            if(i == latestTransactionList.length - 1){
                finalNftListString = finalNftList.join(",");
                console.log("final nft list to be sent is",finalNftListString);
                const feePlanck:string = ((Math.floor((i%46)/8) + 1)*1000000).toString();
                console.log(feePlanck);
                await sendMessage(ledger2,finalNftListString,receiverNftStorage.ats[0].at,feePlanck);
                finalNftList = [];
                finalNftList.push(newTransactionNumber);
                console.log("The finalNftList after clearing",finalNftList);
            }
        }

        //sendMessage(ledger2,finalNftListString,senderNftStorage.ats[0].at,nftDistributorPublicKey,nftDistributorPrivateKey,"1000000");

    }


}

export async function CheckNftOwnerId(ledger2:any,contractId:string){
    const contract = await ledger2.contract.getContract(contractId);
    console.log(contract);
    const view = new ContractDataView(contract);
    console.log(view.getVariableAsDecimal(5));
    return view.getVariableAsDecimal(5);

};


export async function updateSenderAccount(ledger2:any, senderId:string,codeHashId:string,nftToBeDistributed:string,nftDistributor:string){
    let senderNftStorage = await ledger2.contract.getContractsByAccount({
        accountId: senderId,
        machineCodeHash: codeHashId,
    });
    var latestTransactionList:string[] = [];
    var finalNftList:string[] = [];
    var finalNftListString:string = "";
    const latestTransactionNumber = await FindLatestTransactionNumber(ledger2,senderNftStorage.ats[0].at,nftDistributor);
    const newTransactionNumber = (Number(latestTransactionNumber) + 1).toString();
    latestTransactionList = await FindLatestTransactionArray(ledger2,senderNftStorage.ats[0].at,nftDistributor,latestTransactionNumber);
    if(latestTransactionList[0] === "empty"){

        console.log("no such nft exist. No NFT in this account");
        return "unsuccessful";
    }
    else{
        console.log("latest transaction list is ",latestTransactionList);
        const index = latestTransactionList.indexOf(nftToBeDistributed);
        if(index !== -1){
            latestTransactionList.splice(index,1);
            finalNftList.push(newTransactionNumber);
            if(latestTransactionList.length === 0){
                finalNftList.push("empty");
                console.log("final nft list is empty and it is",finalNftList);
                finalNftListString = finalNftList.join(",");
                await sendMessage(ledger2,finalNftListString,senderNftStorage.ats[0].at,"1000000");
            }
            for(var i = 0;i<latestTransactionList.length;i++){
                console.log(latestTransactionList[i]);
                finalNftList.push(latestTransactionList[i]);
                if(i !=0 && i%46 == 0){
                    finalNftListString = finalNftList.join(",");
                    console.log("final nft list to be sent is",finalNftListString);
                    await sendMessage(ledger2,finalNftListString,senderNftStorage.ats[0].at,"6000000");
                    finalNftList = [];
                    finalNftList.push(newTransactionNumber);
                    console.log("The finalNftList after clearing",finalNftList);
                    continue;
                }
                if(i == latestTransactionList.length - 1){
                    finalNftListString = finalNftList.join(",");
                    console.log("final nft list to be sent is",finalNftListString);
                    const feePlanck:string = ((Math.floor((i%46)/8) + 1)*1000000).toString();
                    console.log(feePlanck);
                    await sendMessage(ledger2,finalNftListString,senderNftStorage.ats[0].at,feePlanck);
                    finalNftList = [];
                    finalNftList.push(newTransactionNumber);
                    console.log("The finalNftList after clearing",finalNftList);
                }
            }
            return "successful";
        }
        else{
            console.log("no such nft exist. No NFT in this account");
            return "unsuccesful";
        }
    }
}

export async function p2pTransferNft(ledger2:any,wallet:any,nftToBeDistributed:string,senderPublicKey:string,recipientId:string){
    const transaction = await ledger2.contract.callContractMethod({
        senderPublicKey: senderPublicKey,
        feePlanck: "2000000",
        amountPlanck: "30000000",
        contractId: nftToBeDistributed,
        methodHash: "-8011735560658290665",
        methodArgs: [recipientId],
        });
        await wallet.Extension.confirm(transaction.unsignedTransaction);
}

export async function TransferNft(ledger2:any,wallet:any,nftToBeDistributed:string,recipientId:string,senderPrivateKey:string,senderPublicKey:string){
    
await ledger2.contract.callContractMethod({
  senderPublicKey: senderPublicKey,
  senderPrivateKey: senderPrivateKey,
  feePlanck: "2000000",
  amountPlanck: "30000000",
  contractId: nftToBeDistributed,
  methodHash: "-8011735560658290665",
  methodArgs: [recipientId],
});
}

export async function UpdateUserStorage(ledger2:any, senderId:string,recipientId:string,codeHashId:string,nftToBeDistributed:string,nftDistributor:string){
    const result = await updateSenderAccount(ledger2,senderId,codeHashId,nftToBeDistributed,nftDistributor); //Find and delete
    if(result === "successful"){
        console.log("the result is",result);

        //Run check if such nft belong to user
        await updateReceiverAccount(ledger2,recipientId,codeHashId,nftToBeDistributed,nftDistributor);
    }

    else{
        await updateReceiverAccount(ledger2,recipientId,codeHashId,nftToBeDistributed,nftDistributor);
        console.log("oops something went wrong");

        //Run check if such nft belong to user
    }

}

export async function IsUserSettingUpdating(ledger2:any,userAccountId:string){

        const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);
        //console.log(messages);
        for (var i = 0; i < messages.unconfirmedTransactions.length; i++){
            if(messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId){
                console.log("updating personal info");

                return true;
            }
        }
        return false;

}

export async function IsUserUpdatingDescription(ledger2:any,userAccountId:string){
    const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);
    const originalDescription = await ledger2.account.getAccount({accountId: userAccountId});
    //console.log(messages);
    for (var i = 0; i < messages.unconfirmedTransactions.length; i++){
        if(messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId){
            const newDescription = JSON.parse(messages.unconfirmedTransactions[i].attachment.description);
            console.log(newDescription);
            if(newDescription.nm == null){
                return false;
            }
            else if(originalDescription.description == null){
                console.log("called original description is ", originalDescription);
                return true;
            }
            const description = JSON.parse(originalDescription.description);
            console.log(description);
            if(description.nm !== newDescription.nm){
                console.log("called description.nm !== newDescription.nm");
                return true;
            }
            if(description.ds !== newDescription.ds){
                console.log("called description.ds !== newDescription.ds");
                return true;
            }
            if(description.hp !== newDescription.hp){
                console.log("called description.hp !== newDescription.hp");
                return true;
            }
            if(description.sc !== newDescription.sc){
                console.log("called description.sc !== newDescription.sc");
                return true;
            }

            console.log("not updating personal info");
            return false;
        }
    }
    return false;
}

export async function IsUserUpdatingIcon(ledger2:any,userAccountId:string){
    console.log("called is user updating icon");
    const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);
    const originalDescription = await ledger2.account.getAccount({accountId: userAccountId});
    //console.log(messages);
    for (var i = 0; i < messages.unconfirmedTransactions.length; i++){
        if(messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId){
            const newDescription =  messages.unconfirmedTransactions[i].attachment.description==null?{}:JSON.parse(messages.unconfirmedTransactions[i].attachment.description);
            if(newDescription.av == null){
                console.log("called newDescription.av == null");
                return false;
            }
            const newImage = Object.keys(newDescription.av)[0];
            console.log(originalDescription);
            if(originalDescription.description == null){
                console.log("called original description is ", originalDescription);
                return true;
            }
            else{
                const description = originalDescription.description == null?{}:JSON.parse(originalDescription.description);
                if(description.av == null){
                    console.log("called description.av == null");
                    return true;
                }
                console.log(originalDescription);
                console.log(Object.keys(description.av));
                console.log(newImage);
                console.log("updating personal info");
                if(Object.keys(description.av)[0] === newImage){
                    console.log("returned false");
                    return false;
                }
                else{
                    console.log("returned true");
                    return true;
                }
            }

            return true;
        }
    }
    return false;
}


export async function FindNftContractStorage(ledger2:any,accountId:string,codeHashIdForNft:string){
    let NftContractStorage = await ledger2.contract.getContractsByAccount({
        accountId: accountId,
        machineCodeHash: codeHashIdForNft,
    });
    if(NftContractStorage.ats[0] != null){
        return NftContractStorage.ats[0].at;
    }
    else{
        return "";
    }
}

export async function GetUserNftList(ledger2:any,accountId:string,nftDistributor:string,codeHashIdForNft:string){
    const userNftContractStorage = await FindNftContractStorage(ledger2,accountId,codeHashIdForNft);
    if(userNftContractStorage === null){
        return [];
    }
    else{
        const latestTransactionNumber = await FindLatestTransactionNumber(ledger2,userNftContractStorage,nftDistributor);
        const latestTransactionList = await FindLatestTransactionArray(ledger2,userNftContractStorage,nftDistributor,latestTransactionNumber);
        if(latestTransactionList[0] === "empty"){
           return [];
          }
          else{
                //console.log(latestTransactionList);
                var nft : myNftList;
                var userNftList:otherUserNftList[] = [];
                for (var i = 0;i < latestTransactionList.length;i++){
                    const contractInfo = await ledger2.contract.getContract(latestTransactionList[i]);
                    const trial = JSON.parse(contractInfo.description);
                    nft = {level:trial.version,image:trial.descriptor,nftId:latestTransactionList[i]};
                    const nftInfo = await fetchIPFSJSON(trial.descriptor);
                    console.log("nftInfo is",nftInfo);
                    console.log("reward percentage  is" , convertWordToNumber(nftInfo.attributes[6].value)/3);
                    userNftList.push({rewardPercentage: ((convertWordToNumber(nftInfo.attributes[6].value)/3).toFixed(2)).toString(),imageAddress:nftInfo.media[0].social});
                  }
                  
                  console.log(userNftList[0]);
                  console.log(userNftList);
                    return userNftList;
          }
    }
}

export async function FindNftIpfsAddressWithConractId(ledger2:any,nftId:string){
    let res, text;
    const contractInfo = await ledger2.contract.getContract(nftId);
    const trial = JSON.parse(contractInfo.description);
    //console.log("trial.descriptor is ",trial.descriptor);

    // const domains = [
    //     `https://gateway.pinata.cloud/ipfs/${trial.descriptor}`,
    //     `https://ipfs.io/ipfs/${trial.descriptor}`,
    //     `https://${trial.descriptor}.ipfs.dweb.link/`,
    //     `https://cloudflare-ipfs.com/ipfs/${trial.descriptor}`,
    //     `https://pfs.eth.aragon.network/ipfs/${trial.descriptor}`,
    //     `https://video.oneloveipfs.com/ipfs/${trial.descriptor}`,
    //     `https://ipfs.eth.aragon.network/ipfs/${trial.descriptor}`,
    // ];
    // let index = 0;
    // while (true) {
    //     const ipfsAddress = domains[index];
    //     try {
    //         res = await fetch(ipfsAddress);
    //         text = await res.text();
    //         break;
    //     }
    //     catch (error){
    //         console.log(error);
    //         index = (index + 1) % domains.length
    //     }    
    // }
    const nftInfo = await fetchIPFSJSON(trial.descriptor)
    let matches = nftInfo.name.match(/(\d+)/);
    const nftNumber = matches[0].toString().padStart(8, '0');
    //const nftNumber = "1234".padStart(8, '0');
    //console.log(nftInfo.media[0].social);
    //console.log(nftNumber);
    return {nftImage:nftInfo.media[0].social,nftNumber:nftNumber};     
}

export async function UpdateUserIcon(ledger2:any,imgAddress:string,nftId:string,userAccountId:string,userAccountpublicKey:string,Wallet:any,name:string){
    //let newDes =waitingToBeChangedDescription.description===undefined?{}:JSON.parse(waitingToBeChangedDescription.description);
    const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);
    let newDescriptionObj = {};
    //console.log(newDescriptionObj);
    //console.log(imgAddress);
    //console.log("123");
    let obj = {
      [imgAddress]:"image/png"
    }

    newDescriptionObj = Object.assign(newDescriptionObj,{av:obj});       
    newDescriptionObj = Object.assign(newDescriptionObj,{id:nftId});
    newDescriptionObj = Object.assign(newDescriptionObj,{nm:name});
    //console.log("newDescriptionObj is ",newDescriptionObj);
    //console.log("nftID is ",nftId);

    //Part One, If there is updating user setting in the unconfirmed transaction list, the latest user setting info is in the unconfirmed transactionlist

    for (var i = 0; i < messages.unconfirmedTransactions.length; i++){
        if(messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId){
            let oldDescription = messages.unconfirmedTransactions[i].attachment.description==null?{}:JSON.parse(messages.unconfirmedTransactions[i].attachment.description);
            //newDescriptionObjcription = Object.assign({av:oldDescription.av},{id:oldDescription.id},newDescriptionObj);
            let newDescription = {};
            console.log("old des in unconfirmed description is",oldDescription);
            if(oldDescription.nm != null){                                              
                newDescription = Object.assign({nm:oldDescription.nm},newDescription);          //Assign the old description to the new description if the old description exists
            }
            if(oldDescription.ds != null){
                newDescription = Object.assign({ds:oldDescription.ds},newDescription);
            }
            if(oldDescription.hp != null){
                newDescription = Object.assign({hp:oldDescription.hp},newDescription);
            }
            if(oldDescription.sc != null){
                newDescription = Object.assign({sc:oldDescription.sc},newDescription);
            }
            if(oldDescription.bg != null){
                newDescription = Object.assign({bg:oldDescription.bg},newDescription);
            }
            newDescription = Object.assign(newDescription,newDescriptionObj);
            //console.log("new Description is",newDescription); 
            newDescription = JSON.stringify(newDescription);
            const setAccountInfo = await ledger2.account.setAccountInfo({
                name:name,
                description:newDescription,
                feePlanck:"3000000",
                senderPublicKey:userAccountpublicKey,
              });
              //console.log(setAccountInfo);
              await Wallet.Extension.confirm(setAccountInfo.unsignedTransactionBytes);
            return newDescription;
        }
    }

    //If there is no unconfirmed transactions, the latest version of user setting is on the BlockChain

    let newDes = {};
    const waitingToBeChangedDescription = await ledger2.account.getAccount({accountId: userAccountId});
    let oldDes =waitingToBeChangedDescription.description==null?{}:JSON.parse(waitingToBeChangedDescription.description);
    if(oldDes.nm != null){
        newDes = Object.assign({nm:oldDes.nm},newDes);      //Assign the old description to the new description if the old description exists
    }
    if(oldDes.ds != null){
        newDes = Object.assign({ds:oldDes.ds},newDes);
    }
    if(oldDes.hp != null){
        newDes = Object.assign({hp:oldDes.hp},newDes);
    }
    if(oldDes.sc != null){
        newDes = Object.assign({sc:oldDes.sc},newDes);
    }
    console.log("old des is",oldDes);
    //console.log(newDes);
    newDes = Object.assign(newDes,newDescriptionObj);
    //console.log(newDes);
    newDes = JSON.stringify(newDes);
    const setAccountInfo = await ledger2.account.setAccountInfo({
      name:"1234",
      description:newDes,
      feePlanck:"3000000",
      senderPublicKey:userAccountpublicKey,
    });
    //console.log(setAccountInfo);
    await Wallet.Extension.confirm(setAccountInfo.unsignedTransactionBytes);
    return newDes;
}


export async function UpdateUserDescription(ledger2:any,newDescriptionObj:any,userAccountId:string,userAccountpublicKey:string,Wallet:any,name:string){
    const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);
    //const originalDescription = await ledger2.account.getAccount({accountId: userAccountId});
    for (var i = 0; i < messages.unconfirmedTransactions.length; i++){
        if(messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId){
            let oldDescription = messages.unconfirmedTransactions[i].attachment.description==null?{}:JSON.parse(messages.unconfirmedTransactions[i].attachment.description);
            //console.log(oldDescription);
            let newDescription = {};
            if(oldDescription.av != null){
                newDescription = Object.assign({av:oldDescription.av},newDescription);
            }
            if(oldDescription.id != null){
                newDescription = Object.assign({id:oldDescription.id},newDescription);
            }
            newDescription = Object.assign(newDescription,newDescriptionObj);
            //console.log("new Description is",newDescription); 
            newDescription = JSON.stringify(newDescription);
            const setAccountInfo = await ledger2.account.setAccountInfo({
                name:name,
                description:newDescription,
                feePlanck:"3000000",
                senderPublicKey:userAccountpublicKey,
              });
              //console.log(setAccountInfo);
              await Wallet.Extension.confirm(setAccountInfo.unsignedTransactionBytes);
            return newDescription;
        }
    }
    const waitingToBeChangedDescription = await ledger2.account.getAccount({accountId: userAccountId});
    let oldDes =waitingToBeChangedDescription.description==null?{}:JSON.parse(waitingToBeChangedDescription.description);
    //console.log(oldDes);
    //console.log(newDescriptionObj);
    let newDes = {};
    if(oldDes.av != null){
        newDes = Object.assign({av:oldDes.av},newDes);
    };
    if(oldDes.id != null){
        newDes = Object.assign({id:oldDes.id},newDes);
    }
    newDes = Object.assign( newDes,newDescriptionObj);

    //console.log(newDes);
    newDes = JSON.stringify(newDes);
    const setAccountInfo = await ledger2.account.setAccountInfo({
      name:name,
      description:newDes,
      feePlanck:"3000000",
      senderPublicKey:userAccountpublicKey,
    });
    //console.log(setAccountInfo);
    await Wallet.Extension.confirm(setAccountInfo.unsignedTransactionBytes);
}

export async function GetEquippedNftId(ledger2:any,userAccountId:string){
    const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);
    for (var i = 0; i < messages.unconfirmedTransactions.length; i++){
        if(messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId){
            let CurrentDescription = messages.unconfirmedTransactions[i].attachment.description==null?{}:JSON.parse(messages.unconfirmedTransactions[i].attachment.description);
            if(CurrentDescription.id != null){
                return CurrentDescription.id;
            }
            else{
                return "";
            }
        }
    }
    const waitingToBeChangedDescription = await ledger2.account.getAccount({accountId: userAccountId});
    let currentDes =waitingToBeChangedDescription.description==null?{}:JSON.parse(waitingToBeChangedDescription.description);
    if(currentDes.id != null){
        return currentDes.id;
    }
    else{
        return "";
    }
}

// export function UpdateUserStorageButton(){
//     const codeHashId = "5093642053599315133";
//     const Ledger2 = LedgerClientFactory.createClient({nodeHost:"https:europe3.testnet.signum.network"});
//     const senderId = "416342944383657789";
//     const recipientId = "9998305876488457803";
//     const nftDistributor = "4572964086056463895";
//     const nftToBeDistributed = "10668973197928562219";
//     const nftDistributorPrivateKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PRIVATE_KEY!;
//     const nftDistributorPublicKey = process.env.process.env.REACT_APP_NFT_DISTRIBUTOR_PUBLIC_KEY!;
//     const passInfo = async () => {
//         if(Ledger2 != null){
//             UpdateUserStorage(Ledger2,senderId,recipientId,codeHashId,nftToBeDistributed,nftDistributor,nftDistributorPublicKey,nftDistributorPrivateKey);
//      }}

//     return (<button onClick = {passInfo}>UpdateUserStorage</button>);
// }


export async function UpdateUserIconNewVersion(ledger2:any,imgAddress:string,nftId:string,userAccountId:string,userAccountpublicKey:string,Wallet:any,name:string){
    //let newDes =waitingToBeChangedDescription.description===undefined?{}:JSON.parse(waitingToBeChangedDescription.description);
    const messages = await ledger2.account.getUnconfirmedAccountTransactions(userAccountId);
    let newDescriptionObj = {};
    //console.log(newDescriptionObj);
    //console.log(imgAddress);
    //console.log("123");
    let obj = {
      [imgAddress]:"image/png"
    }

    newDescriptionObj = Object.assign(newDescriptionObj,{av:obj});       
    newDescriptionObj = Object.assign(newDescriptionObj,{id:nftId});
    //console.log("newDescriptionObj is ",newDescriptionObj);
    //console.log("nftID is ",nftId);

    //Part One, If there is updating user setting in the unconfirmed transaction list, the latest user setting info is in the unconfirmed transactionlist

    for (var i = 0; i < messages.unconfirmedTransactions.length; i++){
        if(messages.unconfirmedTransactions[i].type === 1 && messages.unconfirmedTransactions[i].subtype === 5 && messages.unconfirmedTransactions[i].sender === userAccountId){
            let oldDescription = messages.unconfirmedTransactions[i].attachment.description==null?{}:JSON.parse(messages.unconfirmedTransactions[i].attachment.description);
            //newDescriptionObjcription = Object.assign({av:oldDescription.av},{id:oldDescription.id},newDescriptionObj);
            let newDescription = {};
            console.log("old des in unconfirmed description is",oldDescription);
            newDescription = Object.assign(oldDescription,newDescriptionObj);

            //console.log("new Description is",newDescription); 
            newDescription = JSON.stringify(newDescription);
            console.log("new description is",newDescription);
            const setAccountInfo = await ledger2.account.setAccountInfo({
                name:name,
                description:newDescription,
                feePlanck:"3000000",
                senderPublicKey:userAccountpublicKey,
              });
              //console.log(setAccountInfo);
              await Wallet.Extension.confirm(setAccountInfo.unsignedTransactionBytes);
            return newDescription;
        }
    }

    //If there is no unconfirmed transactions, the latest version of user setting is on the BlockChain

    let newDes = {};
    const waitingToBeChangedDescription = await ledger2.account.getAccount({accountId: userAccountId});
    console.log(waitingToBeChangedDescription.description);
    let oldDes =waitingToBeChangedDescription.description==null?{}:JSON.parse(waitingToBeChangedDescription.description);
    console.log("newDes is",newDescriptionObj);
    console.log("old des is",oldDes);
    //console.log(newDes);
    if(typeof oldDes === 'object' && oldDes !== null){
        newDes = Object.assign(oldDes,newDescriptionObj);
    }
    else{
        newDes = newDescriptionObj;
    }
    console.log("newDes is",newDes);
    //console.log(newDes);
    newDes = JSON.stringify(newDes);
    const setAccountInfo = await ledger2.account.setAccountInfo({
      name:"1234",
      description:newDes,
      feePlanck:"3000000",
      senderPublicKey:userAccountpublicKey,
    });
    //console.log(setAccountInfo);
    await Wallet.Extension.confirm(setAccountInfo.unsignedTransactionBytes);
    return newDes;
}

