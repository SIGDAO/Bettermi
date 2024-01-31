
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface userAccount 
{
    accountId: string,
    accountRS: string,
    publicKey: string,
    isWatchOnlyMode: boolean,
    token:number,
    level:string,
    nftContractStorage:string,
}   

const initialState: userAccount = {
    accountId: "",
    accountRS: "",
    publicKey: "",
    isWatchOnlyMode: false,
    token:0,
    level:"1",
    nftContractStorage:"",
};

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setAccount: (state, action: PayloadAction<userAccount>) => {
            state.accountId = action.payload.accountId;
            state.accountRS = action.payload.accountRS;
            state.publicKey = action.payload.publicKey;
            state.isWatchOnlyMode = action.payload.isWatchOnlyMode;
        },
        setToken:(state, action: PayloadAction<number>) => {
            state.token = action.payload;
        },
        setLevel:(state,action:PayloadAction<string>) => {
            state.level = action.payload;
        },
        setNftContractStorage:(state,action:PayloadAction<string>) => {
            state.nftContractStorage = action.payload;
        },
    }   
});
export const { actions } = accountSlice;
export const accountPublicKey = (state: any) => state.account.publicKey;
export const accountId = (state: any) => {
    return state.account.accountId? state.account.accountId:localStorage.getItem("accountId");
};
export const accountToken = (state: any) => {
    return state.account.token?state.account.token:localStorage.getItem("token");
};
export const accountLevel = (state:any) => {

    return state.account.level;
}
export const getNftContractStorage = (state:any) => {
    return state.account.nftContractStorage?state.account.nftContractStorage:localStorage.getItem("nftContractStorage");
}