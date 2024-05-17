// src/services/pokemon.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChatHistory } from './aiCoach';
import llamaTokenizer from "llama-tokenizer-js";

export interface Message {
  message: string;
}

interface Reply {
  url: string;
}


export const countTokens = (text) => {
  return llamaTokenizer.encode(text).length;
};

const generatePrompt = (messages: ChatHistory[]): Message => {
  const returnMsg = messages.map((message) => (message.isUser ? `[INST] ${message.text} [/INST]` : `${message.text}`)).join("\n");
  const tokenLimit = 100;
  const token = countTokens(returnMsg)

  // if (token > tokenLimit) throw new Error(`Token more than ${tokenLimit}`)
  const sendjson: Message = {
    message: returnMsg,
  }

  return sendjson;

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
