"use client";
import { usePreferences } from "@/hooks/use-preferences";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "@phosphor-icons/react";

export const GeminiSettings = () => {
  const [key, setKey] = useState<string>("");
  const { getApiKey, setApiKey } = usePreferences();

  useEffect(() => {
    getApiKey("gemini").then((key) => {
      if (key) {
        setKey(key);
      }
    });
  }, []);

  return (
    <div className="px-6 flex flex-col items-start gap-2">
      <h1 className="text-md font-medium text-white py-4">
        Google Gemini Settings
      </h1>
      <div className="flex flex-row items-end justify-between">
        <p className="text-xs text-zinc-500">Google Gemini AI API Key</p>
      </div>
      <Input
        placeholder="SK-xxxxxxxxxxxxxxxxxxx"
        value={key}
        autoCapitalize="off"
        type="password"
        onChange={(e) => {
          setKey(e.target.value);
          setApiKey("gemini", e.target.value);
        }}
      />
      <Button
        size={"sm"}
        variant={"secondary"}
        onClick={() => {
          window.open("https://aistudio.google.com/app/apikey", "_blank");
        }}
      >
        点击获取 API Key
        <ArrowRight size={16} weight="bold" />
      </Button>
      <Alert variant={"success"}>
        <Info className="h-4 w-4" />
        <AlertTitle>Attentions!</AlertTitle>
        <AlertDescription>
          您的 API Key 仅存储在浏览器本地，不会被传输到其他任何地方。
        </AlertDescription>
      </Alert>
    </div>
  );
};
