import ReactMarkdown from "react-markdown";

export const MessageList = ({ messages }) => {
  return (
    <div className="flex-1  flex flex-col gap-4 py-4 min-h-0">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "assistant" && (
            <div className="size-8 rounded-full bg-foreground flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
              F
            </div>
          )}

          <div
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-foreground text-white rounded-tr-sm"
                : "bg-white text-foreground rounded-tl-sm"
            }`}
          >
            {msg.isLoading ? (
              <TypingIndicator />
            ) : (
              <ReactMarkdown
                components={{
                  // style elements to match your design
                  p: ({ children }) => (
                    <p className="mb-1 last:mb-0">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-4 mb-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-4 mb-1">{children}</ol>
                  ),
                  li: ({ children }) => <li className="mb-0.5">{children}</li>,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            )}
          </div>

          {msg.role === "user" && (
            <div className="size-8 rounded-full bg-magenta-other flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
              S
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="size-1.5 rounded-full bg-green-sec animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);
