import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CouponUser {
  email: string;
  token: string;
}

const initialState: CouponUser = {
  email: "",
  token: "",
};

export const couponUserSlice = createSlice({
  name: "couponUser",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CouponUser>) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.email = "";
      state.token = "";
    },
  },
});
export const { actions } = couponUserSlice;
export const selectCouponUser = (state: any) => state.couponUser;
export const selectCouponUserEmail = (state: any) => state.couponUser.email;
export const selectCouponUserToken = (state: any) => state.couponUser.token;

