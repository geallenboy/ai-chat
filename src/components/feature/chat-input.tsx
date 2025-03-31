"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { PromptType, RoleType } from "@/lib/prompts";
import { Button } from "@/components/ui/button";
import { Command, Plus, Sparkle } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useChatStore } from "@/stores/chat-store";
import { useChatActions } from "@/hooks/use-chat-actions";

const slideeUpVariant = {
  initial: { y: 50, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const ChatInput = () => {
  const { sessionId } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const { currentSession, streamingMessage } = useChatStore();
  const { runModel } = useChatActions();

  const isNewSession =
    !currentSession?.messages?.length && !streamingMessage?.loading;

  useEffect(() => {
    if (sessionId) {
      inputRef.current?.focus();
    }
  }, [sessionId]);

  const examples = [
    "What is the weather in New York?",
    "What is the capital of France?",
    "What is the population of China?",
    "What is the tallest mountain in the world?",
  ];

  const handleSubmit = (query: string) => {
    if (!query) return;

    runModel(
      {
        role: RoleType.assistant,
        type: PromptType.ask,
        query,
      },
      sessionId!.toString()
    );

    setInputValue("");
  };

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center absolute bottom-0 px-4 pb-4 pt-16 bg-gradient-to-t dark:form-zinc-800 dark:to-transparent from-70% to-white/10 left-0 right-0 gap-6",
        isNewSession && "top-0"
      )}
    >
      {isNewSession && (
        <div className="flex flex-row items-center w-[680px] justify-start gap-2">
          <motion.h1
            className="text-2xl font-semibold tracking-tight text-zinc-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
          >
            <span className="text-zinc-500">Hello! haha</span>
            <br />
            What can I help you with today ?
          </motion.h1>
        </div>
      )}

      <motion.div
        variants={slideeUpVariant}
        initial="initial"
        animate="animate"
        className="flex flex-row items-center px-3 bg-white/10 w-[700px] rounded-2xl"
      >
        {isNewSession ? (
          <div className="min-w-8 h-8 flex justify-center items-center">
            <Sparkle size={24} weight="fill" />
          </div>
        ) : (
          <Button size={"icon"} className="min-w-8 h-8">
            <Plus size={16} weight="bold" />
          </Button>
        )}
        <Input
          value={inputValue}
          ref={inputRef}
          variant={"ghost"}
          placeholder="Ask ChatHub anything..."
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(inputValue);
            }
          }}
        />
        <Badge>
          <Command size={14} weight="bold" />K
        </Badge>
      </motion.div>

      {isNewSession && (
        <div className="grid grid-cols-2 gap-2 w-[700px]">
          {examples.map((example, index) => (
            <div
              key={index}
              onClick={() => handleSubmit(example)}
              className="text-sm flex flex-row items-center py-3 px-4 bg-black/10 border border-white/5 text-zinc-400 w-full rounded-2xl hover:bg-black/20 hover:scale-[101%] cursor-pointer"
            >
              {example}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatInput;
