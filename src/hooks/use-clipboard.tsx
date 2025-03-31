import { useCallback, useState } from "react";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;

export function useClipboard() {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);
  const [showCopied, setshowCopied] = useState<boolean>(false);

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator.clipboard) {
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setshowCopied(true);
      setTimeout(() => {
        setshowCopied(false);
      }, 1500);
      return true;
    } catch (err) {
      setCopiedText(null);
      setshowCopied(false);
      console.error("Failed to copy: ", err);
      return false;
    }
  }, []);

  return { copy, copiedText, showCopied };
}
