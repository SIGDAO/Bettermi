import { apiSlice } from "./couponSystemAPISlice";

export const couponAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCouponsByMerchant: builder.mutation({
      query: (credentials) => ({
        url: "/coupon/getCouponsByMerchant",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getCouponsByUser: builder.mutation({
      query: (email: string) => ({
        url: "/coupon/getCouponsByUser",
        method: "POST",
        body: { email },
      }),
    }),
    // getCouponsByUser: builder.query({
    //   query: () => ({
    //     url: "/coupon/getCouponsByUser",
    //     method: "GET",
    //   }),
    // }),
    refreshCouponCode: builder.mutation({
      query: (credentials) => ({
        url: "/coupon/refreshCouponCode",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getFilteredCoupon: builder.mutation({
      query: (credentials) => ({
        url: "/coupon/getFilteredCoupon",
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useGetCouponsByMerchantMutation, useGetCouponsByUserMutation, useRefreshCouponCodeMutation } = couponAPI;

// // no role
// router.get("/getCouponsByMerchant", getAllCoupons);

// // role: user
// router.post("/refreshCouponCode", verifyUser, refreshCouponCode);
// router.post("/getCouponCode", verifyUser, check("coupon_id").isNumeric().withMessage("Please enter a correct format"), getCouponCodeByID);
// router.post("/getCouponsByUser", verifyUser, check("email").isEmail().withMessage("Please enter a correct format"), getCouponsByUser);
// router.post("/getAllCoupons", verifyUser, getAllCoupons);

// router.get("/getCouponFilterOption", verifyUser, getCouponFilterOption);
// router.post("/getFilteredCoupon", verifyUser, getFilteredCoupon);
