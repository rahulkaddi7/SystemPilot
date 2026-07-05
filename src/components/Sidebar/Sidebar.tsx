import {
  Plus,
  MessageSquare,
  Moon,
  Settings
} from "lucide-react";

const chats = [
  "React Basics",
  "Operating System",
  "Binary Trees",
  "DBMS Revision",
  "Java Interview"
];

const Sidebar = () => {
  return (
    <aside className="w-72 border-r border-blue-100 dark:border-blue-900 bg-white dark:bg-[#0F172A] text-white flex flex-col">

        <div className="p-6 border-b border-blue-100 dark:border-blue-900">
        <h1 className="text-2xl font-bold">
          LearnGPT
        </h1>

      </div>

      <div className="p-4">

        <button
          className="
          flex
          items-center
          justify-center
          gap-2
          w-full
          rounded-xl
          border
          border-blue-500
          py-3
          hover:bg-blue-50
          dark:hover:bg-blue-950
          transition"
        >

          <Plus size={18} />
          New Chat
        </button>

      </div>

   
      <div className="flex-1 overflow-y-auto px-3">
        {chats.map((chat) => (
          <button
            key={chat}
            className="
            w-full
            flex
            items-center
            gap-3
            rounded-xl
            px-4
            py-3
            mb-2
            hover:bg-blue-50
            dark:hover:bg-blue-950
            transition"
          >

            <MessageSquare size={18} />
            <span>{chat}</span>
          </button>
        ))}

      </div>
      <div className="border-t border-blue-100 dark:border-blue-900 p-4 space-y-2">
        <button className="flex gap-3 w-full rounded-xl p-3 hover:bg-blue-50 dark:hover:bg-blue-950">
          <Moon size={18} />
          Theme
        </button>
        <button className="flex gap-3 w-full rounded-xl p-3 hover:bg-blue-50 dark:hover:bg-blue-950">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;