import { useRef } from "react";
import { TChatMessagesProps } from "./chat-message";
import { useClipboard } from "@/hooks/use-clipboard";
import { useModelList } from "@/hooks/use-model-list";
import { useMarkdown } from "@/hooks/use-mdx";
import { motion } from "framer-motion";
import Spinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  ArrowClockwise,
  BookmarkSimple,
  Check,
  Copy,
  TrashSimple,
} from "@phosphor-icons/react";

export const AIMessageBubble = (props: TChatMessagesProps) => {
  const { key, aiMessage, loading, model } = props;

  const messageRef = useRef<HTMLDivElement>(null);
  const { showCopied, copy } = useClipboard();
  const { getModelByKey } = useModelList();
  const { renderMarkdown } = useMarkdown();

  const modelForMessage = getModelByKey(model);

  const handleCopyContent = () => {
    messageRef?.current && aiMessage && copy(aiMessage);
  };

  return (
    <motion.div
      ref={messageRef}
      className="bg-white/500 rounded-2xl px-4 pb-2 w-full border border-white/5 flex flex-col items-start"
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 1,
          ease: "easeInOut",
        },
      }}
    >
      {aiMessage && renderMarkdown(aiMessage, key === "streaming")}
      {loading && <Spinner />}
      <div className="flex flex-row w-full justify-between items-center py-1  opacity-50 hover:opacity-100 transition-opacity">
        <motion.p
          className="text-zinc-50 text-xs py-1/2 gap-2 flex justify-center items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 1,
              ease: "easeInOut",
            },
          }}
        >
          {modelForMessage?.icon()}
          {modelForMessage?.name}
        </motion.p>
        {!loading && (
          <div className="flex flex-row gap-1">
            <Button variant={"ghost"} size={"icon"}>
              <BookmarkSimple size={16} weight="regular" />
            </Button>
            <Button variant={"ghost"} size={"icon"} onClick={handleCopyContent}>
              {showCopied ? (
                <Check size={16} weight="regular" />
              ) : (
                <Copy size={16} weight="regular" />
              )}
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <ArrowClockwise size={16} weight="regular" />
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <TrashSimple size={16} weight="regular" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
