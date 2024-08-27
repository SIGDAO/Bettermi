import { apiSlice } from "./couponSystemAPISlice";
import { FilterOption } from "./filter";

export const filterAPI = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getFilterOption: builder.mutation<FilterOption, void>({
      query: () => ({
        url: '/coupon/getCouponFilterOption',
        method: 'GET',
      }),
      transformResponse: (response: FilterOption) => response,
    }),
  })
})

export const { useGetFilterOptionMutation } = filterAPI;