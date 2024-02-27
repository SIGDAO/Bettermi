import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Contract {
  isBMIContractBuild: boolean;
  isNFTContractBuild: boolean;
}

const initialState: Contract = {
  isBMIContractBuild: false,
  isNFTContractBuild: false,
};

export const contractSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setIsBMIContractBuild: (state, action: PayloadAction<boolean>) => {
      state.isBMIContractBuild = action.payload;
    },
    setIsNFTContractBuild: (state, action: PayloadAction<boolean>) => {
      state.isNFTContractBuild = action.payload;
    },
  },
});
export const { actions } = contractSlice;
export const selectCurrentIsBMIContractBuild = (state: any) => state.contract.isBMIContractBuild;
export const selectCurrentIsNFTContractBuild = (state: any) => state.contract.isNFTContractBuild;
