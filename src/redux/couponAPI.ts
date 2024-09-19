import { SelectedCoupon } from "./coupon";
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
    getUser: builder.mutation({
      query: (email: string) => ({
        url: "/coupon/getUser",
        method: "POST",
        body: { email },
      }),
    }),
    getCouponsByUser: builder.mutation({
      query: (email: string) => ({
        url: "/coupon/getCouponsByUser",
        method: "POST",
        body: { email },
      }),
    }),
    getCouponDetail: builder.mutation({
      query: (coupon_id: number) => ({
        url: "/coupon/getCouponDetail",
        method: "POST",
        body: { coupon_id },
      }),
    }),
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
    getAllCoupons: builder.mutation({
      query: () => ({
        url: "/coupon/allCoupons",
        method: "GET",
      }),
    }),
    postCouponsByFiltering : builder.mutation({
      query: (filterOptions) => ({
        url: "coupon/couponsByFiltering",
        method: "POST",
        body: { ...filterOptions },
      })

    }),
    postCouponDetail: builder.mutation({
      query: (couponCode : string ) => ({
        url: "coupon/couponDetail",
        method: "POST",
        body: {couponCode},
      })
    })
  }),
});


export const { useGetCouponsByMerchantMutation, useGetUserMutation, useGetCouponsByUserMutation, useRefreshCouponCodeMutation, useGetCouponDetailMutation , useGetAllCouponsMutation , usePostCouponsByFilteringMutation, usePostCouponDetailMutation} = couponAPI;


// // no role
// router.get("/getCouponsByMerchant", getAllCoupons);

// // role: user
// router.post("/refreshCouponCode", verifyUser, refreshCouponCode);
// router.post("/getCouponCode", verifyUser, check("coupon_id").isNumeric().withMessage("Please enter a correct format"), getCouponCodeByID);
// router.post("/getCouponsByUser", verifyUser, check("email").isEmail().withMessage("Please enter a correct format"), getCouponsByUser);
// router.post("/getAllCoupons", verifyUser, getAllCoupons);

// router.get("/getCouponFilterOption", verifyUser, getCouponFilterOption);
// router.post("/getFilteredCoupon", verifyUser, getFilteredCoupon);
