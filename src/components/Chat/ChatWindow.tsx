import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

const ChatWindow = () => {
  return (
    <main className="flex flex-col flex-1">

      <div className="flex-1 overflow-y-auto px-12 py-10 space-y-6 text-white">
        <MessageBubble
          sender="assistant"
          message="Welcome to LearnGPT! What would you like to learn today?"
        />
        <MessageBubble
          sender="user"
          message="I want to learn Binary Trees."
        />
        <MessageBubble
          sender="assistant"
          message="Awesome! I can generate questions, explain concepts, or test your knowledge."
        />
      </div>
      <ChatInput />
    </main>
  );
};

export default ChatWindow;