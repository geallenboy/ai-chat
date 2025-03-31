import { use, useEffect, useRef } from "react";
import hjjs from "highlight.js";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

export type codeBlockProps = {
  lang?: string;
  code?: string;
};

const CodeBlock = ({ lang, code }: codeBlockProps) => {
  const ref = useRef<HTMLPreElement>(null);
  const language = lang && hjjs.getLanguage(lang) ? lang : "plaintext";
  const { copiedText, copy, showCopied } = useClipboard();
  useEffect(() => {
    if (ref?.current && code) {
      const hightlightedCode = hjjs.highlight(code, { language }).value;
      ref.current.innerHTML = hightlightedCode;
    }
  }, [code, language]);

  return (
    <div className="bg-black/20 rounded2xlg p-4 w-full">
      <div className="pl-4 pr-2 py-2w-full flex justify-between items-center">
        <p>{language}</p>
        <Button
          size={"sm"}
          variant={"secondary"}
          onClick={() => code && copy(code)}
        >
          {showCopied ? <CheckIcon /> : <CopyIcon />}
          {showCopied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="w-full">
        <code
          className={`hljs language-${language} whitespace-pre-wrap break-words overflow-x-auto w-full inline-block pr-[100%] text-sm`}
          ref={ref}
        ></code>
      </pre>
    </div>
  );
};

export default CodeBlock;
