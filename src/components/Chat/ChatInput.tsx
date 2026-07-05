import { SendHorizontal } from "lucide-react";

const ChatInput = () => {
  return (
    <div className="border-t border-blue-100 dark:border-blue-900 p-6">

      <div className="flex items-center gap-4">

        <textarea
          placeholder="Describe what you'd like to learn..."
          rows={2}
          className="
          flex-1
          resize-none
          rounded-2xl
          border
          border-blue-200
          dark:border-blue-800
          bg-transparent
          px-5
          py-4
          outline-none
          focus:border-blue-500"
        />

        <button
          className="
          h-14
          w-14
          rounded-2xl
          border
          border-blue-500
          flex
          items-center
          justify-center
          hover:bg-blue-500
          hover:text-white
          transition"
        >

          <SendHorizontal />

        </button>

      </div>

    </div>
  );
};

export default ChatInput;