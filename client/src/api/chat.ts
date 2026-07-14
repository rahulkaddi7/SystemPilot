
import api from "./api";
import type {
  Chat,
  ChatResponse,
  ChatDetail,
} from "../types/chat";

export const sendMessage = async (
  message: string,
  thread_id: string
) => {
  const response = await api.post("/chat", {
    thread_id,
    message,
  });

  return response.data;
};


export const continueChat = async (
  threadId: string,
  message: string
): Promise<ChatResponse> => {
  const { data } = await api.post(`/chat/${threadId}`, {
    message,
  });

  return data;
};


export const getChats = async (): Promise<Chat[]> => {
  const { data } = await api.get("/chats");

  return data;
};


export const getChatById = async (
  threadId: string
): Promise<ChatDetail> => {
  const { data } = await api.get(`/chats/${threadId}`);

  return data;
};
