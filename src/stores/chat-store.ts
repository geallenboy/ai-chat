import { create } from "zustand";
import { TChatSession } from "@/hooks/use-chat-session";
import { TSStreamProps } from "@/hooks/use-llm";

type ChatState = {
    sessions: TChatSession[];
    isSessionLoading: boolean;
    streamingMessage?: TSStreamProps;
    currentSession?: TChatSession;
    error?: string;
};

type ChatActions = {
    setSessions: (sessions: TChatSession[]) => void;
    setCurrentSession: (session: TChatSession) => void;
    setStreamingMessage: (stream?: TSStreamProps) => void;
    setError: (error?: string) => void;
    setIsLoading: (loading: boolean) => void;
};

export const useChatStore = create<ChatState & ChatActions>((set) => ({
    sessions: [],
    isSessionLoading: true,
    streamingMessage: undefined,
    currentSession: undefined,
    error: undefined,

    setSessions: (sessions) => set({ sessions }),
    setCurrentSession: (session) => set({ currentSession: session }),
    setStreamingMessage: (stream) => set({ streamingMessage: stream }),
    setError: (error) => set({ error }),
    setIsLoading: (loading) => set({ isSessionLoading: loading })
}));
