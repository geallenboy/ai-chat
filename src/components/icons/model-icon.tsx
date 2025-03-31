import { cn } from "@/lib/utils";
import Image from "next/image";

export type TModelIocon = {
  type: "gpt3" | "gpt4" | "anthropic" | "gemini" | "openai";
  size: "small" | "medium" | "large";
};

export const ModelIcon = ({ type, size }: TModelIocon) => {
  const iconSrc = {
    gpt3: "/icons/gpt3.svg",
    gpt4: "/icons/gpt4.svg",
    anthropic: "/icons/claude.svg",
    gemini: "/icons/gemini.svg",
    openai: "/icons/openai.svg",
  };

  return (
    <Image
      src={iconSrc[type]}
      alt={type}
      width={0}
      height={0}
      className={cn(
        "object-cover",
        size === "small" && "w-4 h-4",
        size === "medium" && "w-6 h-6",
        size === "large" && "w-8 h-8"
      )}
      sizes="100vw"
    />
  );
};
