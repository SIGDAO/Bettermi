import { useMemo } from "react";
import { LedgerClientFactory } from "@signumjs/core";
import { RootState } from "./reducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const selectWalletNodeHost = (state: RootState): string =>
  state.wallet.walletNodeHost;



export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useLedger = () => {
  const nodeHost = useAppSelector(selectWalletNodeHost);
    console.log(nodeHost);
  return useMemo(() => {
    if (!nodeHost) return null;
    console.debug("Connected to new host", nodeHost);
    return LedgerClientFactory.createClient({ nodeHost });
  }, [nodeHost]);
};
            