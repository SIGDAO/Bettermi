import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clear } from "console";

// output: [{ coupon_id: number, c_name: string, c_description: string }]

export interface Coupon {
  coupon_id: number;
  c_name: string;
  c_description: string;
}

export interface AppCouponContent {
  couponList: Coupon[];
  selectedCoupon: Coupon & { coupon_code: string };
}

const initialState: AppCouponContent = {
  couponList: [],
  selectedCoupon: {
    coupon_id: 0,
    c_name: "",
    c_description: "",
    coupon_code: "",
  },
};

export const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    setCouponList: (state, action: PayloadAction<Coupon[]>) => {
      state.couponList = action.payload;
    },
    clearCouponList: (state) => {
      state.couponList = [];
    },
    setSelectedCoupon: (state, action: PayloadAction<Coupon & { coupon_code: string }>) => {
      state.selectedCoupon = action.payload;
    },
    clearSelectedCoupon: (state) => {
      state.selectedCoupon = {
        coupon_id: 0,
        c_name: "",
        c_description: "",
        coupon_code: "",
      };
    },

  },
});
export const { actions } = couponSlice;
export const selectCurrentCouponList = (state: any) => state.coupon.couponList;
export const selectCurrentSelectedCoupon = (state: any) => state.coupon.selectedCoupon;
