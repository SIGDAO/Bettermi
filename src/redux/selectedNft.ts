
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface selectedNft 
{
    nftId:string,
    nftNumber:string,
    nftImageAddress:string,
}   

const initialState: selectedNft = {
    nftId:"",
    nftNumber:"",
    nftImageAddress:"",
};

export const selectedNftSlice = createSlice({
    name: "selectedNft",
    initialState,
    reducers: {
        setSelectedNft: (state, action: PayloadAction<selectedNft>) => {
            state.nftId = action.payload.nftId;
            state.nftNumber = action.payload.nftNumber;
            state.nftImageAddress = action.payload.nftImageAddress;
        },
        setNftId:(state, action: PayloadAction<string>) => {
            state.nftId = action.payload;
        },
        setNftNumber:(state,action:PayloadAction<string>) => {
            state.nftNumber = action.payload;
        },
        setNftImageAddress:(state,action:PayloadAction<string>) => {
            state.nftImageAddress = action.payload;
        },
    }   
});
export const { actions } = selectedNftSlice;
export const nftId = (state: any) => state.selectedNft.nftId;
export const nftNumber = (state:any)=>{return state.selectedNft.nftNumber;}
export const nftImageAddress = (state:any) => {return state.selectedNft.nftImageAddress}
