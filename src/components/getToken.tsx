import { useContext } from "react";
import { AppContext } from "../redux/useContext";
import { useLedger } from "../redux/useLedger";
import { UnsignedTransaction } from "@signumjs/core";
import { Contract, ContractDataView } from "@signumjs/contracts";



export function GetToken(accountId: string){
    /*const Ledger2 = useLedger();
    const passInfo = async () => {
        if(Ledger2 != null){
            const BMI = 25;*/
    /*const initializeContract = await Ledger2.contract.getContract(
        "4534547954881819112") ;
      console.log(initializeContract);*/
      /*const asset = await Ledger2.asset.getAssetsByOwner({accountId:accountId});
      console.log(asset);
      console.log(asset.assets[0]);
      return (
        <div>
        asset.assets[0]
        </div>
        );
    }

}*/
return(<div></div>);




}
