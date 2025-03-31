"use client";

import { useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { useChatSession } from "@/hooks/use-chat-session";
import { useLLM } from "@/hooks/use-llm";
import { useChatStore } from "@/stores/chat-store";

export const ChatInitializer = () => {
  const { sessionId } = useParams();
  const {
    setSessions,
    setCurrentSession,
    setStreamingMessage,
    setError,
    setIsLoading,
    streamingMessage,
  } = useChatStore();

  const { getSessions, getSessionById } = useChatSession();

  useLLM({
    onInit: async (props) => setStreamingMessage(props),
    onStreamStart: async (props) => setStreamingMessage(props),
    onStream: async (props) => setStreamingMessage(props),
    onStreamEnd: async () => {
      await fetchSessions();
      setStreamingMessage(undefined);
      if (sessionId) await fetchSessionById(sessionId.toString());
    },
    onError: async (error) => {
      setError(error.message || "模型处理出错");
      setStreamingMessage(undefined);
    },
  });

  const fetchSessions = async () => {
    setIsLoading(true);
    const sessions = await getSessions();
    console.log("sessions", sessions);
    setSessions(sessions);
    setIsLoading(false);
  };

  const fetchSessionById = useCallback(
    async (id: string) => {
      const session = await getSessionById(id);
      console.log("session", session);
      if (session) {
        setCurrentSession(session);
      }
    },
    [getSessionById, setCurrentSession]
  );

  // 初始化加载会话
  useEffect(() => {
    fetchSessions();
  }, []);

  // 当 sessionId 变化时，拉取当前会话
  useEffect(() => {
    if (sessionId) {
      fetchSessionById(sessionId.toString());
    }
  }, [sessionId]);

  useEffect(() => {
    if (!streamingMessage && sessionId) {
      fetchSessionById(sessionId.toString());
    }
  }, [streamingMessage]);

  return null;
};
