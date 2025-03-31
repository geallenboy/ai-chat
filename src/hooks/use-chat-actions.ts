// hooks/use-chat-actions.ts
import { useChatStore } from "@/stores/chat-store";
import { useChatSession } from "@/hooks/use-chat-session";
import { useLLM } from "@/hooks/use-llm";
import { useCallback } from "react";

export const useChatActions = () => {
    const {
        setSessions,
        setCurrentSession,
        setStreamingMessage,
        setError,
        setIsLoading,
    } = useChatStore();

    const { getSessions, getSessionById, createNewSession, clearSessions } = useChatSession();

    const { runModel } = useLLM({
        onInit: async (props) => setStreamingMessage(props),
        onStreamStart: async (props) => setStreamingMessage(props),
        onStream: async (props) => setStreamingMessage(props),
        onStreamEnd: async () => {
            await fetchSessions();
            setStreamingMessage(undefined);
        },
        onError: async (error) => {
            setError(error.message || "模型出错");
            setStreamingMessage(undefined);
        },
    });

    const fetchSessions = useCallback(async () => {
        setIsLoading(true);
        const sessions = await getSessions();
        setSessions(sessions);
        setIsLoading(false);
    }, [getSessions]);

    const fetchSessionById = useCallback(
        async (id: string) => {
            const session = await getSessionById(id);
            if (session) {
                setCurrentSession(session);
            }
        },
        [getSessionById]
    );

    const createSession = useCallback(async () => {
        const session = await createNewSession();
        await fetchSessions();
        return session;
    }, [createNewSession]);
    const clearChatSessions = async () => {
        await clearSessions();
        setSessions([]);
    }

    return {
        runModel,
        createSession,
        fetchSessions,
        fetchSessionById,
        clearChatSessions
    };
};
