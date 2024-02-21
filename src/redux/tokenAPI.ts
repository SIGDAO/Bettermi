// src/services/pokemon.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BMI {
  bmi: number;
  category: string;
}

export const tokenAPI = createApi({
  reducerPath: 'transferAsset',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://bmi.bettermi.io/api' 
  }),
  endpoints: (builder) => ({
    transferAsset: builder.mutation<BMI, Object>({
      query: (transferInfo) => ({
        url: 'getbmi/',
        method: 'POST',
        body: transferInfo,
        header: {
          'content-type': 'multipart/form-data',
          'Content-Security-Policy': 'upgrade-insecure-requests',
        },
      }),
      transformResponse: (response: BMI) => response,
    }),
  }),
});

export const { useTransferAssetMutation } = tokenAPI;