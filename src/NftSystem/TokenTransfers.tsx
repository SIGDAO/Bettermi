import { useContext } from "react";
import { UnsignedTransaction } from "@signumjs/core";
import { Contract, ContractDataView } from "@signumjs/contracts";
import { LedgerClientFactory } from "@signumjs/core";
import { useSelector } from "react-redux";
import { Api } from "@signumjs/core";
import { useNavigate } from "react-router-dom";
import { encryptAES,generateMasterKeys,hashSHA256 } from "@signumjs/crypto";
import { UpdateUserNftList } from "./updateUserNftList";
import { sendMessage } from "./updateUserNftList";
import { sortArrayAccordingToDescendingTimeStamps, sortUnconfirmedTransactionArrayAccordingToAscendingTimeStamps } from "./updateUserNftList";
import { FindLatestTransactionArray, FindLatestTransactionNumber, UpdateUserStorage } from "./updateUserNftStorage";
import { updateReceiverAccount } from "./updateUserNftStorage";
import { CheckNftOwnerId } from "./updateUserNftStorage";
import { AttachmentMessage } from "@signumjs/core";

//A helper function by Anderson
export async function TransferTokenWithMessage(nodeHost:any,accountId:any,quantity:string,challengeNum:number){
    const walletNodeHost:string = nodeHost?nodeHost:window.localStorage.getItem('nodeHost');
    const nftDistributorPrivateKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PRIVATE_KEY!;
    const nftDistributorPublicKey = process.env.REACT_APP_NFT_DISTRIBUTOR_PUBLIC_KEY!;
      const ledger2 =LedgerClientFactory.createClient({nodeHost:nodeHost || walletNodeHost});
      const tokenId:string = process.env.REACT_APP_TOKEN_ID!;
      console.log("quantity is",quantity);
      console.log(ledger2, "ledger2");
      console.log(nodeHost, "nodeHost");
      console.log(quantity, 'quantity');
      const date = new Date();
      console.log(date);
      const message = `Congrats! You completed challenge number ${challengeNum} on ${date}.`;
      const hi:AttachmentMessage =new AttachmentMessage({
        messageIsText:true,
        message:message,

    });
    
      if(ledger2 != null){
        try {
          const reward:number = (Number(quantity))*1000000;
          await ledger2.asset.transferAsset({
            assetId:tokenId,
            quantity: reward,
            recipientId:accountId,
            senderPrivateKey:nftDistributorPrivateKey,
            skipAdditionalSecurityCheck:true,
            feePlanck:"1000000",
            senderPublicKey:nftDistributorPublicKey,
            attachment:hi
          })
  
        } catch (error) {
          console.log(error);
        }
      }
  }
  