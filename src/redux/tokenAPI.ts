// src/services/pokemon.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const tokenAPI = createApi({
  reducerPath: 'transferAsset',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://bmi.bettermi.io/api/' 
  }),
  endpoints: (builder) => ({
    transferAsset: builder.mutation<any, Object>({
      query: (transferInfo) => ({
        url: 'transferAsset/',
        method: 'POST',
        body: transferInfo,
        header: {
          'Content-Security-Policy': 'upgrade-insecure-requests',
        },
      }),
      transformResponse: (response: any) => response,
    }),
  }),
});

export const { useTransferAssetMutation } = tokenAPI;