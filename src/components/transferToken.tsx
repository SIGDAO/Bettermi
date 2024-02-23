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

export async function TransferToken(nodeHost: any, accountId: any, quantity: string) {
  const walletNodeHost: string = nodeHost ? nodeHost : window.localStorage.getItem("nodeHost");
  //const assetId = "3862155318820066741";
  const assetId = process.env.REACT_APP_TOKEN_ID!;

  try {
    await axios.post(process.env.REACT_APP_NODE_ADDRESS + "/api/transferAsset", {
      assetId: assetId,
      quantity: quantity,
      accountId: accountId,
      skipAdditionalSecurityCheck: true,
      feePlanck: "1000000",
    });
  } catch (error) {
    console.log(error);
  }
}
