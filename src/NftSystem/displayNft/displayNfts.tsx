import { LedgerClientFactory } from "@signumjs/core";
import { Api } from "@signumjs/core";
export async function GetAllNftList(ledger:Api,machineCodeHashId:string,distributor:string) { 
    const nftList = await ledger.contract.getContractsByAccount({
        accountId: distributor,
        machineCodeHash: machineCodeHashId,
    });
    console.log(nftList);
    return nftList;
}