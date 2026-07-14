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
import { useTheme } from "../../hooks/useTheme";
import ThemeModal from "../Theme/ThemeModal";


interface SidebarProps {
  onNewChat: () => void;
}

const Sidebar = ({ onNewChat }: SidebarProps) => {
  const navigate = useNavigate();

  const [chats, setChats] = useState<Chat[]>([]);
  const [themeOpen, setThemeOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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

  console.log("Chats:", chats);
console.log("Is array:", Array.isArray(chats));

  return (
    <aside className="w-72 border-r border-[var(--border)] bg-[var(--bg)] flex flex-col">
      <div className="p-6 border-b border-[var(--border)]">
        <h1 className="text-2xl font-bold text-[var(--text)]">
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
          text-[var(--text)]
            
           hover:bg-[var(--hover)]
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
             text-[var(--text)]
             hover:bg-[var(--hover)]
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

      <div className="border-t border-[var(--border)] p-4 space-y-2">
        <button
          onClick={() => setThemeOpen(true)}
          className="
            w-full
            flex
            items-center
            gap-3
            rounded-xl
            p-3
             text-[var(--text)]
             hover:bg-[var(--hover)]
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
               text-[var(--text)]
             hover:bg-[var(--hover)]
            transition
          "
        >
          <Settings size={18} />
          Settings
        </button>
        <ThemeModal
          isOpen={themeOpen}
          currentTheme={theme}
          onClose={() => setThemeOpen(false)}
          onSelect={setTheme}
        />
      </div>
    </aside>
  );
};

export default Sidebar;