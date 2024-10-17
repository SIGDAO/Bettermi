import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { couponUserSlice } from "./couponUser";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://dapp.bettermi.io/couponApi/",  //http://localhost:8082
  credentials: 'include', 
  prepareHeaders: (headers, { getState }) => {
    try {
      const currentState: any = getState();
      const token = currentState.couponUser.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
    } catch (error) {
      console.log(error);
    }
    console.log(headers)
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    console.log("baseQueryWithReauth:", args, api, extraOptions)
  let result = await baseQuery(args, api, extraOptions);
    console.log("result:", result)
  if(result?.error?.status === 400){
    const errorMessage = result?.error?.data?.message || 'An unknown error occurred.';
    if(errorMessage === "Coupon is used"){
      // alert("sorry the coupon is used")
    }
    console.log(errorMessage);
  }
  if (result?.error?.status === 403) {
    console.log("sending refresh token");
    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    console.log(refreshResult);

    if (refreshResult?.data) {
      const email: string = api.getState().couponUser.email;
      // store the new token
      const token: string = (refreshResult.data as { accessToken: string }).accessToken;
      api.dispatch(couponUserSlice.actions.setCredentials({ email, token: token }));
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // log out if refresh token is invalid
      const logOutResult = await baseQuery("/auth/logout", api, extraOptions);

      console.log(logOutResult);
      api.dispatch(couponUserSlice.actions.logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
