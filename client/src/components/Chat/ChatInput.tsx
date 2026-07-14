import { useState, useRef } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onSend(trimmedMessage);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <div className="p-6">
      <div className="flex items-end gap-4">

        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          placeholder="Describe what you'd like to learn..."
          rows={1}
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
            focus:border-blue-500
            overflow-y-auto
            max-h-52
          "
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          onClick={handleSend}
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
            transition
          "
        >
          <SendHorizontal />
        </button>

      </div>
    </div>
  );
};

export default ChatInput;