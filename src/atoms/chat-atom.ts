import { atom } from "jotai";

export type MessageType = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const messagesAtom = atom<MessageType[]>([
  {
    role: "assistant",
    content: "Hello, I'm your assistant. I'm here to help you with your essay.",
  },
]);
