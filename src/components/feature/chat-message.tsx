"use client";

import { useMarkdown } from "@/hooks/use-mdx";
import React, { useEffect, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Warning } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { getRelativeDate } from "@/lib/date";
import { TModelKey } from "@/lib/mode-type";
import { useChatStore } from "@/stores/chat-store";
import { useChatActions } from "@/hooks/use-chat-actions";
import { useParams } from "next/navigation";
import { AIMessageBubble } from "./ai-bubble";

export type TChatMessagesProps = {
  key: string;
  humanMessage: string;
  model: TModelKey;
  aiMessage?: string;
  loading?: boolean;
};

export type TMessageListByDate = Record<string, any[]>;

const ChatMessages = () => {
  const { renderMarkdown } = useMarkdown();
  const chatContainer = useRef<HTMLDivElement>(null);
  const { sessionId } = useParams();
  const { streamingMessage, currentSession } = useChatStore();
  const { fetchSessionById } = useChatActions();

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  useEffect(() => {
    if (streamingMessage) {
      scrollToBottom();
    }
  }, [streamingMessage]);

  useEffect(() => {
    if (!streamingMessage && sessionId) {
      fetchSessionById(sessionId as string);
    }
  }, [streamingMessage, sessionId]);

  const isLastStreamBelongsToCurrentSession =
    streamingMessage?.sessionId === sessionId;

  const renderMessage = (props: TChatMessagesProps) => {
    const { key, humanMessage } = props;
    return (
      <div className="flex flex-col gap-1 items-start w-full" key={key}>
        <motion.div
          className="bg-black/30 rounded-2xl p-2 text-sm flex flex-row gap-2 pr-4 border-white/5 items-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: "easeInOut" },
          }}
        >
          <Avatar name="Chat" />
          <span className="pt-1 leading-5">{humanMessage}</span>
        </motion.div>

        <AIMessageBubble {...props} />
      </div>
    );
  };

  const messageByDate = currentSession?.messages.reduce(
    (acc: TMessageListByDate, message) => {
      const date = dayjs(message.createdAt).format("YYYY/MM/DD");
      if (!acc[date]) acc[date] = [message];
      else acc[date].push(message);
      return acc;
    },
    {}
  );

  return (
    <div
      ref={chatContainer}
      className="flex flex-col w-full items-center h-screen overflow-y-auto pt-[86px] pb-[200px]"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1, ease: "easeInOut" } }}
        className="w-[600px] flex flex-col gap-8"
      >
        {messageByDate &&
          Object.entries(messageByDate).map(([date, messages]) => (
            <div key={date} className="flex flex-col">
              <div className="flex flex-row items-center w-full pb-4">
                <div className="w-full h-[1px] bg-white/5" />
                <p className="text-zinc-500 text-xs px-2 flex-shrink-0">
                  {getRelativeDate(date)}
                </p>
                <div className="w-full h-[1px] bg-white/5" />
              </div>
              <div className="flex flex-col w-full items-center">
                {messages.map((msg) =>
                  renderMessage({
                    key: msg.id,
                    humanMessage: msg.rawHuman,
                    aiMessage: msg.rawAI,
                    model: msg.model,
                  })
                )}
              </div>
            </div>
          ))}

        {isLastStreamBelongsToCurrentSession &&
          streamingMessage?.props?.query &&
          !streamingMessage?.error &&
          renderMessage({
            key: "streaming",
            humanMessage: streamingMessage?.props?.query,
            aiMessage: streamingMessage?.message,
            model: streamingMessage?.model,
            loading: true,
          })}
      </motion.div>

      {streamingMessage?.error && (
        <Alert variant="destructive">
          <Warning size={20} weight="bold" />
          <AlertTitle>Ahh! Something went wrong!</AlertTitle>
          <AlertDescription>{streamingMessage?.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ChatMessages;
