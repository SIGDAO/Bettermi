// src/services/pokemon.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChatHistory } from './aiCoach';

export interface Message {
  message: string;
}

interface Reply {
  url: string;
}

// export const Llama3Template = (defaultSystemPrompt = "") => {
//   return function (chat) {
//     let systemPrompt = defaultSystemPrompt;

//     let parts = [];
//     for (let turn of chat) {
//       if (turn.role === "system") {
//         systemPrompt = turn.content;
//         continue;
//       }

//       if (turn.role === "user") {
//         if (systemPrompt !== "") {
//           parts.push(
//             "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n" +
//               systemPrompt +
//               "<|eot_id|>" +
//               "\n<|start_header_id|>user<|end_header_id|>\n\n" +
//               turn.content +
//               "<|eot_id|>"
//           );
//           systemPrompt = "";
//         } else {
//           parts.push(
//             "<|start_header_id|>user<|end_header_id|> " +
//               turn.content +
//               "<|eot_id|>"
//           );
//         }
//       }

//       if (turn.role === "assistant") {
//         parts.push(
//           "<|start_header_id|>assistant<|end_header_id|>" +
//             turn.content +
//             "<|eot_id|>"
//         );
//       }
//     }

//     return parts.join("");
//   };
// };


const generatePrompt = (messages: ChatHistory[]): Message => {
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
