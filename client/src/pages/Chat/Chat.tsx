import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import ChatWindow from "../../components/Chat/ChatWindow";

import { getChatById, sendMessage } from "../../api/chat";
import type { Message } from "../../types/chat";


const Chat = () => {

  const { threadId: chatId } = useParams();
  const [threadId, setThreadId] = useState(chatId || "");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {

    if (!chatId) {
      setMessages([]);
      setThreadId("");
      return;
    }

    setThreadId(chatId);

    const fetchChat = async () => {
      try {
        const data = await getChatById(chatId);
        setMessages(data.messages);
      } catch (error) {
        console.error("Failed to fetch chat:", error);
      }
    };

    fetchChat();

  }, [chatId]);

  const handleSend = async (message: string) => {

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message
      }
    ]);
    setIsLoading(true);
    try {

      const data = await sendMessage(
        message,
        threadId
      );

      if (data.thread_id) {
        setThreadId(data.thread_id);
      }

      let assistantMessage = data.message;
      try {
        const parsed = JSON.parse(data.message);
        assistantMessage = parsed.description;
      } catch {
        assistantMessage = data.message;
      }
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          message: assistantMessage
        }
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (

    <div className="flex h-screen bg-white dark:bg-[#050816]">
      <Sidebar
        onNewChat={() => {
          setMessages([]);
          setThreadId("");
        }}
      />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <ChatWindow
          messages={messages}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </div>
    </div>

  );

};


export default Chat;