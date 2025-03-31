"use client";
//app/chat/[sessionId]/page.tsx
import React from "react";
import { DotsThree } from "@phosphor-icons/react";
import ChatInput from "@/components/feature/chat-input";
import ChatMessages from "@/components/feature/chat-message";
import ModelSelect from "@/components/feature/model-select";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settings-store";

const ChatSessionPage = () => {
  const { open } = useSettingsStore();
  return (
    <div className="w-full h-screen flex flex-row relative overflow-hidden">
      <div className="absolute flex justify-between items-center flex-row top-0 left-0 bg-gradient-to-b dark:from-zinc-800 dark:to-transparent from-70% to-white/10 z-10 right-0">
        <p className="p-2 text-sm text-zinc-500">ChatHub</p>
        <div className="flex flex-row gap-2 items-center">
          <ModelSelect />
          <Avatar name={"AI"} />
          <Button variant={"secondary"} size={"icon"} onClick={open}>
            <DotsThree size={20} weight="bold" />
          </Button>
        </div>
      </div>
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatSessionPage;
