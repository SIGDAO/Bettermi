import { apiSlice } from "./couponSystemAPISlice";

export const filterAPI = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getFilterOption: builder.mutation({
      query: credentials => ({
        url: '/filter/getCouponFilterOption',
        method: 'POST',
        body: { ...credentials }
      })
    }),
  })
})
