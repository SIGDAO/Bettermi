
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface referrer 
{
    referrerAccountId:string,
    refereeAccountId:string,
}   

const initialState: referrer = {
    referrerAccountId:"",
    refereeAccountId:"",
};

export const referrerSlice = createSlice({
    name: "referrer",
    initialState,
    reducers: {
        setReferrerAccountId: (state, action: PayloadAction<referrer>) => {
            state.referrerAccountId = action.payload.referrerAccountId;
        },
        setRefereeAccountId:  (state, action: PayloadAction<referrer>) => {
            state.refereeAccountId = action.payload.refereeAccountId;
        }
    }   
});
export const { actions } = referrerSlice;
export const referrer = (state:any) => state.referrer.referrerAccountId;
export const referee = (state:any) => state.referrer.refereeAccountId;