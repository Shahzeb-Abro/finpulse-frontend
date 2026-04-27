import api from "@/lib/axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const fetchChatSessions = async ({
  page = 0,
  pageSize = 10,
  search = "",
}) => {
  const { data } = await api.get("/chat-sessions/", {
    params: { page, pageSize, wildSeach: search, sort: "lastUpdatedDate,desc" },
  });
  return data;
};

export const fetchSessionMessages = async (
  sessionId,
  cursor = null,
  size = 20,
) => {
  const params = { size };
  if (cursor) params.cursor = cursor;

  const response = await api.get(`/chat-sessions/${sessionId}/messages`, {
    params,
  });
  console.log("Axios full response:", response);
  console.log("response.data:", response.data);
  return response.data;
};

export const deleteSession = async (sessionId) => {
  try {
    const response = await api.delete(`/chat-sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete session:", error);
    throw error;
  }
};

export const renameSession = async (sessionId, newTitle) => {
  try {
    const response = await api.patch(`/chat-sessions/${sessionId}/rename`, {
      title: newTitle,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to rename session:", error);
    throw error;
  }
};

export const streamAssistantChat = async (
  message,
  history = [],
  sessionId,
  onChunk,
  onDone,
  onError,
  onSession = () => {},
) => {
  try {
    const response = await fetch(`${BASE_URL}/assistant/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      credentials: "include",
      body: JSON.stringify({
        message,
        history:
          history == null
            ? null
            : history.map((m) => ({ role: m.role, content: m.content })),
        sessionId,
      }),
    });

    if (!response.ok) throw new Error("Stream request failed");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        if (line.startsWith("session: ")) {
          const id = line.slice(9).trim();
          onSession(id);
          continue;
        }
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6); // don't trim — spaces matter
        if (data.trim() === "[DONE]") {
          onDone();
          return;
        }
        if (data === "\\n") {
          onChunk("\n"); // real newline
        } else if (data) {
          onChunk(data.replace(/\\n/g, "\n"));
        }
      }
    }

    onDone();
  } catch (err) {
    console.log("Stream error:", err);
    onError(err);
  }
};
