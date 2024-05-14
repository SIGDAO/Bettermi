import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExtensionWalletError } from "@signumjs/wallets";
import { clear } from "console";
import { useLedger } from './useLedger';
import { accountId } from './account';
import { useSelector } from "react-redux";
import { UTCTimestamp, SeriesDataItemTypeMap, Time } from 'lightweight-charts';
import { findBMI } from "../components/bmiCalculate";
import { useSendIoMsgMutation } from "./aiCoachAPI";
import { coachList } from "../data/aiCoachDetailList";


export interface ChatHistory {
  id: number
  text: string | null,
  isUser: boolean,
  time: Date,
  streamPath: string | null
} 

export interface UserBMIState {
  mimiMsg: ChatHistory[];
  ioMsg: ChatHistory[];
}

const initialState: UserBMIState = {
  mimiMsg: [{
    id: 1,
    text: coachList.find((coach) => coach.coachName === "Mimi")?.startingString || "",
    isUser: false,
    time: new Date,
    streamPath: null,
  }],
  ioMsg: [{
    id: 1,
    text: coachList.find((coach) => coach.coachName === ".io")?.startingString || "",
    isUser: false,
    time: new Date,
    streamPath: null,
  }],
};



export const aiCoachSlice = createSlice({
  name: "aiCoachMsg",
  initialState,
  reducers: {
    addMimiMsg: (state, action: PayloadAction<ChatHistory>) => {
      state.mimiMsg.push(action.payload);
    },
    
    addIoMsg: (state, action: PayloadAction<ChatHistory>) => {
      state.ioMsg.push(action.payload);
    },
    changeMimiMsg: (state, action: PayloadAction<ChatHistory>) => {
      const index = state.mimiMsg.findIndex(obj => obj.id === action.payload.id);

      if (index >= 0) {
        state.mimiMsg[index] = action.payload;
      }
    },
    changeIoMsg: (state, action: PayloadAction<ChatHistory>) => {
      const index = state.ioMsg.findIndex(obj => obj.id === action.payload.id);

      if (index >= 0) {
        state.ioMsg[index] = action.payload;
      }
    },
  },
});

export const { actions } = aiCoachSlice;

// get selfiePath, state type need change



// export const selectCurrentImg = (state: any) => state.selfieImage.selfiePath;
export const selectCurrentAiMsg = (state: any, id: string | undefined) => {
  if (id === "1") return state.aiCoachMsg.mimiMsg;
  if (id === "2") return state.aiCoachMsg.ioMsg;
  return []
}

