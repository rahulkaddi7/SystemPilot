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
          whitespace-pre-wrap
          break-words
          overflow-hidden
          ${
            isUser
              ? "bg-[var(--user-message)] text-white"
              : "bg-[var(--assistant-message)] text-[var(--text)]"
          }
        `}
      >
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;