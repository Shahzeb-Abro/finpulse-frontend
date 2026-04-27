import {
  deleteSession,
  fetchChatSessions,
  fetchSessionMessages,
  renameSession,
} from "@/api/assistant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useChatSessions = (
  page = 0,
  pageSize = 10,
  search = "",
  options = {},
) => {
  return useQuery({
    queryKey: ["chat-sessions", page, pageSize, search],
    queryFn: () => fetchChatSessions({ page, pageSize, search }),
    ...options,
  });
};

export const useSessionMessages = (sessionId) => {
  return useQuery({
    queryKey: ["chat-messages", sessionId],
    queryFn: () => fetchSessionMessages(sessionId),
    enabled: !!sessionId,
    select: (res) => ({
      messages: (res?.data?.content || [])
        .map((m) => ({
          id: m.id,
          role: m?.role?.toLowerCase(),
          content: m.content,
        }))
        .reverse(),
      hasMore: res?.data?.hasNext || false,
    }),
  });
};

export const useInvalidateSessions = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
};

export const useDeleteChatSession = (sessionId, onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
    onError: (error) => {
      toast.error(
        error?.message || "Failed to delete session. Please try again.",
      );
    },
  });
};

export const useRenameChatSession = (sessionId, newTitle, onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => renameSession(sessionId, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
      onSuccess();
    },
    onError: (error) => {
      toast.error(
        error?.message || "Failed to rename session. Please try again.",
      );
    },
  });
};
