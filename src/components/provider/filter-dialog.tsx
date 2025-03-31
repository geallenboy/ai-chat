"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Plus, Chat, Eraser } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFilterStore } from "@/stores/filter-store";
import { useChatStore } from "@/stores/chat-store";
import { useChatActions } from "@/hooks/use-chat-actions";
import dayjs from "dayjs";

export const FilterDialog = () => {
  const { isFilterOpen, dismiss, toggle } = useFilterStore();
  const { sessions } = useChatStore();
  const { createSession, clearChatSessions } = useChatActions();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const handleNewSession = async () => {
    const session = await createSession();
    router.push(`/chat/${session.id}`);
    dismiss();
  };

  const handleSelectSession = (sessionId: string) => {
    router.push(`/chat/${sessionId}`);
    dismiss();
  };

  return (
    <CommandDialog open={isFilterOpen} onOpenChange={dismiss}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem
            className="gap-3"
            value="new chat"
            onSelect={handleNewSession}
          >
            <Plus size={14} weight="bold" />
            New session
          </CommandItem>
          <CommandItem
            className="gap-3"
            value={`clear history`}
            onSelect={async () => {
              await clearChatSessions();
              const session = await createSession();
              router.push(`/chat/${session.id}`);
              dismiss();
            }}
          >
            <Eraser size={14} weight="bold" />
            Clear Histor
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Sessions">
          {sessions.map((session) => (
            <CommandItem
              key={session.id}
              value={`${session.id}/${session.title}`}
              className="gap-3 w-full"
              onSelect={() => handleSelectSession(session.id)}
            >
              <Chat
                size={14}
                weight="fill"
                className="text-zinc-500 flex-shrink-0"
              />
              <span>{session.title}</span>
              <span className="pl-4 text-xs dark:text-zinc-700 flex-shrink-0">
                {dayjs(session.createdAt).format("YYYY/MM/DD HH:mm")}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
