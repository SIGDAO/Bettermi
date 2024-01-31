import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExtensionWalletError } from "@signumjs/wallets";

export interface WalletState {
  walletNodeHost: string;
  walletPublicKey: string;
  isWalletConnected: boolean;
  watchOnly: boolean;
  walletError?: ExtensionWalletError;
  isOpenSignTransactionModal: boolean;
}

const initialState: WalletState = {
  walletNodeHost: "",
  walletPublicKey: "",
  isWalletConnected: false,
  watchOnly: false,
  walletError: undefined,
  isOpenSignTransactionModal: false,
};


export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletNodeHost: (state, action: PayloadAction<string>) => {
      state.walletNodeHost = action.payload;
    },
    setIsWalletConnected: (state, action: PayloadAction<boolean>) => {
      state.isWalletConnected = action.payload;
    },
    setWatchOnly: (state, action: PayloadAction<boolean>) => {
      state.watchOnly = action.payload;
    },
    setWalletPublicKey: (state, action: PayloadAction<string>) => {
      state.walletPublicKey = action.payload;
    },
    setWalletError: (state, action: PayloadAction<ExtensionWalletError>) => {
      state.walletError = action.payload;
    },
    setIsOpenSignTransactionModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenSignTransactionModal = action.payload;
    },
  },
});

export const { actions } = walletSlice;
export const walletNodeHost = (state: any) => {
  console.log(localStorage.getItem("nodeHost"));
  return state.wallet.walletNodeHost?state.wallet.walletNodeHost:localStorage.getItem("walletNodeHost");
 
}