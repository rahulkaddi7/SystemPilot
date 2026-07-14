const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></span>
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]"></span>
      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]"></span>
    </div>
  );
};

export default TypingIndicator;