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
import { GenericExtensionWallet } from "@signumjs/wallets";


export async function P2PTransferNftToken(Wallet:any,nodeHost:any,accountId:any,assetId:string,publicKey:string){
  const walletNodeHost:string = nodeHost?nodeHost:window.localStorage.getItem('nodeHost');
    const wallet = new GenericExtensionWallet();
    await wallet.connect({
      appName:"123",
      networkName:"Signum-TESTNET",

    });
    const ledger2 =LedgerClientFactory.createClient({nodeHost:nodeHost || walletNodeHost});
    console.log(nodeHost, "nodeHost");
    console.log(assetId);
    console.log(publicKey);
    console.log(accountId);

    if(ledger2 != null){
      try {
        const unsignedTransaction = await ledger2.asset.transferAsset({
          assetId:assetId,
          quantity:"1",
          recipientId:accountId,
          feePlanck:"1000000",
          senderPublicKey:publicKey,
        });
        await wallet.confirm(unsignedTransaction.unsignedTransactionBytes);

      } catch (error) {
        console.log(error);
      }
    }
}
