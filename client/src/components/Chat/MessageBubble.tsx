

interface Props {
  sender: "assistant" | "user";
  message: string;
}

const MessageBubble = ({ sender, message }: Props) => {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>

      <div
        className={`
        max-w-3xl
        rounded-3xl
        px-6
        py-4
        shadow-sm
        ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 dark:bg-slate-800"
        }`}
      >

        {message}

      </div>

    </div>
  );
};

export default MessageBubble;