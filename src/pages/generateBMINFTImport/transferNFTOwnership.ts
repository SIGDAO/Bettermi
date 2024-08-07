import { useLedger } from "../../redux/useLedger";
import { useContext } from "react";
import { AppContext } from "../../redux/useContext";
import { useSelector } from "react-redux";
import { accountId } from "../../redux/account";
import { UnsignedTransaction } from "@signumjs/core";
import { Api } from "@signumjs/core";
import axios from "axios";

export const TransferNFTOwnership = async (ledger: Api, userAccountId: string, Wallet: any) => {
  //const { nftId, ledger, acåcountPublicKey, wallet } = this.context;
  // if not burning, check for account existence
  const NFT_address = "9209749234109330048";
  const NEXT_PUBLIC_NFT_CONTRACT_METHOD_TRANSFER = "-8011735560658290665";
  if (ledger != null) {
    if (userAccountId !== "0") {
      // throws if account does not exists
      await ledger.account.getAccount({
        accountId: userAccountId,
        includeCommittedAmount: false,
        includeEstimatedCommitment: false,
      });
    }

    // (await ledger.contract.callContractMethod({
    //     senderPublicKey: contract_Owner,
    //     senderPrivateKey:nftDistributorPrivateKey,
    //     skipAdditionalSecurityCheck:true,
    //     feePlanck: "2000000",
    //     amountPlanck: "30000000",
    //     contractId: NFT_address,    //NFT id address
    //     methodHash: NEXT_PUBLIC_NFT_CONTRACT_METHOD_TRANSFER,
    //     methodArgs: [userAccountId],
    // }))
    await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/transferNFTOwnership", {
      skipAdditionalSecurityCheck: true,
      feePlanck: "2000000",
      amountPlanck: "30000000",
      contractId: NFT_address, //NFT id address
      methodHash: NEXT_PUBLIC_NFT_CONTRACT_METHOD_TRANSFER,
      methodArgs: [userAccountId],
    });
    //return Wallet.Extension.confirm(unsignedTransactionBytes);
  }
};
