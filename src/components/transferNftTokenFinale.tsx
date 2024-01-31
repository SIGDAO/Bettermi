import { useContext } from "react";
import { AppContext } from "../redux/useContext";
import { useLedger } from "../redux/useLedger";
import { UnsignedTransaction } from "@signumjs/core";
import { Contract, ContractDataView } from "@signumjs/contracts";
import { LedgerClientFactory } from "@signumjs/core";
import { accountId } from "../redux/account";
import { useSelector } from "react-redux";
import { Api } from "@signumjs/core";
import { walletNodeHost } from "../redux/wallet";
import { useNavigate } from "react-router-dom";

interface myNftList{
    image:string;
    level:number;
    assetId:string;
    name:string;
  }

export const TransferNftTokenOwnershipFinale = async (nodeHost:any,recipientId:any) => {
var userNftToken:myNftList[] = [];
var index:number[]  = [];
const walletNodeHost:string = nodeHost?nodeHost:window.localStorage.getItem('nodeHost');
const Ledger2 =LedgerClientFactory.createClient({nodeHost:walletNodeHost });
const nftStorageAccount:string = process.env.REACT_APP_NFT_TOKEN_STORAGE!;
const publicKey:string = process.env.REACT_APP_NFT_TOKEN_STORAGE_PUBLIC_KEY!;
const privateKey:string = process.env.REACT_APP_NFT_TOKEN_STORAGE_PRIVATE_KEY!;
console.log("nftStorageAccount is ",nftStorageAccount);
console.log("publicKey is ",publicKey);
console.log("privateKey is ",privateKey);
const accountInfo = await Ledger2.account.getAccount({accountId: nftStorageAccount});
console.log("accountInfo is ",accountInfo);
const nftToBeDistributed = accountInfo.assetBalances[Math.floor(Math.random() * accountInfo.assetBalances.length)];
console.log("nftToBeDistributed is ",nftToBeDistributed);

// const assets = await Ledger2.asset.getAssetsByOwner({
//     accountId: nftStorageAccount,
// });
// console.log("assets is ",assets);
//     assets.assets.map((asset)=>{
//       if(asset.issuer === nftStorageAccount && asset.name === "BetterMi"){
//         console.log(JSON.parse(asset.description));
//         console.log(JSON.parse(asset.description).descriptor);
//         console.log(typeof(JSON.parse(asset.description).descriptor));
//         userNftToken.push({level:1,image:JSON.parse(asset.description).descriptor,assetId:asset.asset,name:JSON.parse(asset.description).Name});
//         index.push(assets.assets.indexOf(asset));
//       }
//     });
// console.log(userNftToken);
// const nftToBeDistributed = userNftToken[Math.floor(Math.random() * userNftToken.length)];
// console.log(nftToBeDistributed);
// console.log(nftToBeDistributed.assetId);
// console.log(recipientId);
// console.log(publicKey);
// console.log(privateKey);
await Ledger2.asset.transferAsset({
    assetId: nftToBeDistributed.asset,
    quantity: "1",
    recipientId: recipientId,
    feePlanck: "1000000",
    senderPrivateKey: privateKey,
    skipAdditionalSecurityCheck:true,
    senderPublicKey: publicKey,
});
console.log("token transferred");
}