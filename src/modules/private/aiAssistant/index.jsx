import { useCallback, useEffect, useRef, useState } from "react";
import { ChatInputBar, MessageList, EmptyState } from "./components";
import { fetchSessionMessages, streamAssistantChat } from "@/api/assistant";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { Button } from "@/components/ui/button";
import { AllSessionsDialog } from "@/dialogs";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionMessages } from "@/hooks/useAssistant";

export const AIAssistant = () => {
  const [streamingMessages, setStreamingMessages] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [olderMessages, setOlderMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  const { data: sessionData, isLoading: isLoadingSession } =
    useSessionMessages(sessionId);

  const allMessages = [
    ...olderMessages,
    ...(sessionData?.messages || []),
    ...streamingMessages,
  ];

  const prevSessionRef = useRef(sessionId);
  if (prevSessionRef.current !== sessionId) {
    prevSessionRef.current = sessionId;
    setStreamingMessages([]);
    setOlderMessages([]);
    setHasMore(false);
  }

  // Set hasMore from initial query
  if (sessionData?.hasMore && !hasMore && olderMessages.length === 0) {
    setHasMore(true);
  }

  const loadOlderMessages = useCallback(async () => {
    if (isLoadingHistory || !hasMore || !sessionId) return;

    shouldAutoScrollRef.current = false;

    const allLoaded = [...olderMessages, ...(sessionData?.messages || [])];
    if (allLoaded.length === 0) return;

    setIsLoadingHistory(true);

    const container = messagesContainerRef.current;
    const previousScrollHeight = container ? container.scrollHeight : 0;

    try {
      const oldestMessageId = allLoaded[0].id;
      const res = await fetchSessionMessages(sessionId, oldestMessageId);
      const data = res?.data || {};

      const older = data?.content
        .map((m) => ({
          id: m.id,
          role: m?.role?.toLowerCase(),
          content: m.content,
        }))
        .reverse();

      setOlderMessages((prev) => [...older, ...prev]);
      setHasMore(data?.hasNext || false);

      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - previousScrollHeight;
        }
      });
    } catch (error) {
      console.error("Failed to load older messages:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [isLoadingHistory, hasMore, sessionId, olderMessages, sessionData]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Re-enable auto-scroll if user scrolls near bottom
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;
    shouldAutoScrollRef.current = isNearBottom;

    // Load older messages if scrolled near top
    if (container.scrollTop < 50 && hasMore && !isLoadingHistory) {
      loadOlderMessages();
    }
  }, [loadOlderMessages, hasMore, isLoadingHistory]);

  useEffect(() => {
    if (shouldAutoScrollRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [streamingMessages]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    shouldAutoScrollRef.current = true;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const loadingMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      isLoading: true,
    };

    setStreamingMessages((prev) => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    let firstChunk = true;

    await streamAssistantChat(
      text,
      allMessages,
      sessionId ? Number(sessionId) : null,
      // onChunk — fires for every word
      (word) => {
        if (firstChunk) {
          firstChunk = false;
          setStreamingMessages((prev) =>
            prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, isLoading: false } : m,
            ),
          );
        }
        setStreamingMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1
              ? { ...m, content: m.content + word } // no extra space here
              : m,
          ),
        );
      },
      // onDone
      () => {
        setIsLoading(false);
        queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
      },
      // onError
      () => {
        setStreamingMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1
              ? {
                  ...m,
                  content: "Something went wrong. Please try again.",
                  isLoading: false,
                }
              : m,
          ),
        );
        setIsLoading(false);
      },
      (id) => {
        if (!sessionId) {
          navigate(ROUTES.chatSession(id), { replace: true });
        }
      },
    );
  };

  const handleNewChat = () => {
    navigate(ROUTES.aiAssistant);
    setStreamingMessages([]);
    setOlderMessages([]);
    setHasMore(false);
  };
  return (
    <div className="p-4 pb-0 flex flex-col gap-4 h-screen">
      <div className="flex items-center gap-6 justify-between">
        <div className="flex items-center gap-6">
          <div className="size-4 rounded-full bg-magenta-other" />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-foreground">
              FinPulse Assistant
            </h2>
            <p className="text-grey-500 text-xs">
              Knows your budgets, pots, and transactions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleNewChat}>
            + New Chat
          </Button>
          <AllSessionsDialog />
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col min-h-0">
        {allMessages.length === 0 ? (
          <EmptyState onSuggestionClick={sendMessage} />
        ) : (
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto no-scrollbar"
          >
            {isLoadingHistory && (
              <div className="text-center py-2 text-sm text-muted-foreground">
                Loading older messages...
              </div>
            )}
            {isLoadingSession && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Loading conversation...
              </div>
            )}
            <MessageList messages={allMessages} />
          </div>
        )}

        <div className="py-4">
          <ChatInputBar onSend={sendMessage} isLoading={isLoading} />
          <p className="text-xs text-center text-muted-foreground mt-2">
            FinPulse AI can make mistakes. Double-check important financial
            decisions.
          </p>
        </div>
      </div>
    </div>
  );
};
