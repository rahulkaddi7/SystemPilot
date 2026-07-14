import {
  Plus,
  MessageSquare,
  Moon,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getChats } from "../../api/chat";
import type { Chat } from "../../types/chat";


interface SidebarProps {
  onNewChat: () => void;
}

const Sidebar = ({ onNewChat }: SidebarProps) => {
  const navigate = useNavigate();

  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getChats();
        setChats(data);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };

    fetchChats();
  }, []);

  return (
    <aside className="w-72 border-r border-blue-100 dark:border-blue-900 bg-white dark:bg-[#050816] flex flex-col">


      <div className="p-6 border-b border-blue-100 dark:border-blue-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          LearnGPT
        </h1>
      </div>


      <div className="p-4">
        <button
          onClick={onNewChat}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-blue-500
            py-3
            text-gray-800
            dark:text-white
            hover:bg-blue-50
            dark:hover:bg-blue-950
            transition
          "
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {chats.map((chat) => (
          <button
            key={chat.thread_id}
            onClick={() => navigate(`/chat/${chat.thread_id}`)}
            className="
              w-full
              flex
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              mb-2
              text-left
              text-gray-700
              dark:text-gray-200
              hover:bg-blue-50
              dark:hover:bg-blue-950
              transition
            "
          >
            <MessageSquare size={18} />
            <span className="truncate">
              {chat.title}
            </span>
          </button>
        ))}
      </div>

      <div className="border-t border-blue-100 dark:border-blue-900 p-4 space-y-2">

        <button
          className="
            w-full
            flex
            items-center
            gap-3
            rounded-xl
            p-3
            text-gray-700
            dark:text-gray-200
            hover:bg-blue-50
            dark:hover:bg-blue-950
            transition
          "
        >
          <Moon size={18} />
          Theme
        </button>

        <button
          className="
            w-full
            flex
            items-center
            gap-3
            rounded-xl
            p-3
            text-gray-700
            dark:text-gray-200
            hover:bg-blue-50
            dark:hover:bg-blue-950
            transition
          "
        >
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;