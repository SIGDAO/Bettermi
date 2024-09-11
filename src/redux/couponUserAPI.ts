import { apiSlice } from "./couponSystemAPISlice";

export interface SendEmailLinkContent {
  email: string;
  href: string;
}

export const couponUserAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    access: builder.mutation({
      query: (credentials: SendEmailLinkContent) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getLoginLink: builder.mutation({
      query: (credentials: SendEmailLinkContent) => ({
        url: "/auth/getLoginLink",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
    }),
    userStatus: builder.mutation({
      query: () => ({
        url: "/auth/userStatus",
        method: "GET",
      }),
    })
  }),
});

export const { useAccessMutation, useGetLoginLinkMutation, useLogoutMutation ,useUserStatusMutation} = couponUserAPI;
