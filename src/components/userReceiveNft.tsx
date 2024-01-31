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
import {generateMasterKeys} from "@signumjs/crypto";

export async function UserReceiveNft(accountId:string, nodeHost:any,nftId:string){
  const walletNodeHost:string = nodeHost?nodeHost:window.localStorage.getItem('nodeHost');
    const ledger2 =LedgerClientFactory.createClient({nodeHost:nodeHost || walletNodeHost});
    console.log();
    let nftStorage = await ledger2.contract.getContractsByAccount({
        accountId: accountId,
        machineCodeHash: process.env.REACT_APP_NFT_CONTRACT_MACHINE_CODE_HASH!,
      });
      console.log(nftStorage);
    console.log(ledger2, "ledger2");
    console.log(nodeHost, "nodeHost");
    



}
