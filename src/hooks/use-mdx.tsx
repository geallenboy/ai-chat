import CodeBlock from "@/components/feature/code-block";
import Markdown from "marked-react";
import { JSX } from "react";
import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 3,
      ease: "easeInOut",
      delay: 0.1,
    },
  },
};

export const useMarkdown = () => {
  const renderMarkdown = (message: string, animate: boolean) => {
    return (
      <Markdown
        renderer={{
          text: (children) => {
            return (
              <motion.span
                variants={variants}
                animate={"visible"}
                className="text-zinc-100"
                initial={animate ? "hidden" : "visible"}
              >
                {children}
              </motion.span>
            );
          },
          paragraph: (children) => {
            return <p className="text-sm leading-7">{children}</p>;
          },
          heading: (children, level) => {
            const Heading = `h${level}` as keyof JSX.IntrinsicElements;
            return <h1 className="font-medium text-md">{children}</h1>;
          },
          link: (href, text) => {
            return (
              <a href={href} target="_blank">
                {text}
              </a>
            );
          },
          blockquote: (children) => {
            return (
              <div>
                <p>{children}</p>
              </div>
            );
          },
          list: (children, ordered) => {
            if (ordered) {
              return (
                <motion.ol
                  className="list-decimal ml-8"
                  initial="hidden"
                  animate="visible"
                >
                  {children}
                </motion.ol>
              );
            }

            return (
              <motion.ul
                className="list-disc ml-8"
                initial="hidden"
                animate="visible"
              >
                {children}
              </motion.ul>
            );
          },
          listItem: (children) => {
            return (
              <motion.li className="my-4" initial="hidden" animate="visible">
                <p className="text-sm leading-7">{children}</p>
              </motion.li>
            );
          },
          strong: (children) => {
            return (
              <motion.strong
                initial="hidden"
                animate="visible"
                className="font-semibold"
              >
                {children}
              </motion.strong>
            );
          },
          code: (code, lang) => {
            return (
              <motion.div
                className="my-4 w-full"
                initial="hidden"
                animate="visible"
              >
                <CodeBlock code={code?.toString()} lang={lang} />
              </motion.div>
            );
          },
          codespan: (code, lang) => {
            return (
              <motion.span
                className="px-2 py-1 text-sm md:text-base rounded-md dark:text-white bg-zinc-50 text-zinc-800 dark:bg-white/10 font-medium"
                initial="hidden"
                animate="visible"
              >
                {code}
              </motion.span>
            );
          },
        }}
      >
        {message}
      </Markdown>
    );
  };

  return { renderMarkdown };
};
