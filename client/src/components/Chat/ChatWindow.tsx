import type { Message } from "../../types/chat";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface ChatWindowProps {
  messages: Message[];
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatWindow = ({ messages, onSend, isLoading }: ChatWindowProps) => {
  return (
    <main className="flex flex-col flex-1 min-h-0">

      <div className="flex-1 overflow-y-auto px-12 py-10 space-y-6">

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Hi User
            </h2>

            <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">
              Welcome to LearnGPT.
              Let's make this learning journey memorable.
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Ask me anything and let's start learning 
            </p>

          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={index}
              sender={message.sender}
              message={message.message}
            />
          ))
        )}


        {isLoading && (
          <div className="flex">
            <TypingIndicator />
          </div>
        )}

      </div>

      <ChatInput onSend={onSend} />

    </main>
  );
};

export default ChatWindow;