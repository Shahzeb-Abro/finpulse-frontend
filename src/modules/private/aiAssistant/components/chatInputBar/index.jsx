import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const SendIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path d="M8 1.5a.75.75 0 0 1 .75.75v9.19l2.72-2.72a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06l2.72 2.72V2.25A.75.75 0 0 1 8 1.5Z" />
  </svg>
);

export const ChatInputBar = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const canSend = input.trim().length > 0 && !isLoading;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const handleSend = () => {
    if (!canSend) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2 rounded-[12px] border border-input bg-white px-4 py-3 transition-colors",
        "focus-within:border-foreground",
      )}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your budgets, pots, transactions..."
        rows={1}
        disabled={isLoading}
        className={cn(
          "flex-1 resize-none bg-transparent text-sm text-foreground outline-none",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "max-h-40 min-h-16",
        )}
      />
      <button
        onClick={handleSend}
        disabled={!canSend}
        className={cn(
          "flex size-8 flex-shrink-0 items-center justify-center rounded-lg transition-all",
          canSend
            ? "bg-foreground text-white hover:bg-grey-500 active:scale-95"
            : "bg-grey-100 text-grey-300 cursor-not-allowed",
        )}
      >
        <SendIcon className="size-4 rotate-180" />
      </button>
    </div>
  );
};
