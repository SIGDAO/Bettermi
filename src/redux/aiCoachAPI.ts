// src/services/pokemon.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChatHistory } from './aiCoach';

export interface Message {
  message: string;
}

interface Reply {
  url: string;
}

const generatePrompt = (messages): Message => {
  const returnMsg = messages.map((message) => (message.isUser ? `[INST] ${message.text} [/INST]` : `${message.text}`)).join("\n");
  console.log(messages, "return")
  const sendjson: Message = {
    message: returnMsg,
  }

  return sendjson;
;
};

export const aiCoachAPI = createApi({
  reducerPath: 'aiCoachAPI',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://dapp.bettermi.io/ai/'
  }),
  endpoints: (builder) => ({
    sendMimiMsg:  builder.mutation<string, ChatHistory[]>({
      query: (payload) => ({
        url: '/mimi',
        method: 'POST',
        body: generatePrompt(payload),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      transformResponse: (response: Reply) => {
        return response.url || "";
      },
      transformErrorResponse: (response: Object) => response.toString(),
    }),
    sendIoMsg:  builder.mutation<string, ChatHistory[]>({
      query: (payload) => ({
        url: '/io',
        method: 'POST',
        body: generatePrompt(payload),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      transformResponse: (response: Reply) => {
        return response.url || "";
      },
      transformErrorResponse: (response: Object) => response.toString(),
    }),
  }),
});

export const { useSendMimiMsgMutation, useSendIoMsgMutation } = aiCoachAPI;
