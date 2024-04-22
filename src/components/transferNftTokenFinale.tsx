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
import axios from "axios";

interface myNftList {
  image: string;
  level: number;
  assetId: string;
  name: string;
}

export const TransferNftTokenOwnershipFinale = async (nodeHost: any, recipientId: any) => {
  var userNftToken: myNftList[] = [];
  var index: number[] = [];
  const walletNodeHost: string = nodeHost ? nodeHost : window.localStorage.getItem("nodeHost");
  const Ledger2 = LedgerClientFactory.createClient({ nodeHost: walletNodeHost });
  const nftStorageAccount: string = process.env.REACT_APP_NFT_TOKEN_STORAGE!;

  const accountInfo = await Ledger2.account.getAccount({ accountId: nftStorageAccount });

  const nftToBeDistributed = accountInfo.assetBalances[Math.floor(Math.random() * accountInfo.assetBalances.length)];


  // const assets = await Ledger2.asset.getAssetsByOwner({
  //     accountId: nftStorageAccount,
  // });

  //     assets.assets.map((asset)=>{
  //       if(asset.issuer === nftStorageAccount && asset.name === "BetterMi"){



  //         userNftToken.push({level:1,image:JSON.parse(asset.description).descriptor,assetId:asset.asset,name:JSON.parse(asset.description).Name});
  //         index.push(assets.assets.indexOf(asset));
  //       }
  //     });

  // const nftToBeDistributed = userNftToken[Math.floor(Math.random() * userNftToken.length)];





  
  await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/transferAsset", {
    assetId: nftToBeDistributed.asset,
    quantity: "1",
    recipientId: recipientId,
    feePlanck: "1000000",
    skipAdditionalSecurityCheck: true,
  });

};
