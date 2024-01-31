// src/services/pokemon.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Message {
  message: string;
  // category: string;
}

const characterApi = createApi({
  reducerPath: 'characterApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8080/'
  }),
  endpoints: (builder) => ({
    sendMsg:  builder.mutation<Message, Object>({
      query: (payload) => ({
        url: '/posts',
        method: 'POST',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

export const { useSendMsgMutation } = characterApi;
