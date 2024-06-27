
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface referrer 
{
    referrerAccountId:string,
}   

const initialState: referrer = {
    referrerAccountId:"",
};

export const referrerSlice = createSlice({
    name: "referrer",
    initialState,
    reducers: {
        setReferrerAccountId: (state, action: PayloadAction<referrer>) => {
            state.referrerAccountId = action.payload.referrerAccountId;
        }
    }   
});
export const { actions } = referrerSlice;
export const referrer = (state:any) => state.referrer.referrerAccountId;