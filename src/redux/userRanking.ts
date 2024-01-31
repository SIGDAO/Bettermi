
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface leaderBoardBanner {
    displayAccountId:string;
    userRanking:number;
    tokenBalance:string;
    accountId:string;
    accountImage:string;
 }
 export interface userRanking {
    userRankingList:leaderBoardBanner[];
 }


const initialState: userRanking = {
    userRankingList: [],
};

export const userRankingSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setUserRanking: (state, action: PayloadAction<userRanking>) => {
            state.userRankingList = action.payload.userRankingList;

        }
    }   
});
export const { actions } = userRankingSlice;
export const userRankingListRedux = (state: any) => state.userRanking.userRankingList;
