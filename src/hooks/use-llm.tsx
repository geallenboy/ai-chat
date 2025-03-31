import { PromptProps, TChatMessage, useChatSession } from "./use-chat-session";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import { v4 } from "uuid";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { getInstruction, getRole } from "@/lib/prompts";
import { usePreferences } from "./use-preferences";
import { useModelList } from "./use-model-list";
import dayjs from "dayjs";
import { TModelKey } from "@/lib/mode-type";

export type TSStreamProps = {
  props: PromptProps;
  model: TModelKey;
  sessionId: string;
  message?: string;
  loading?: boolean;
  error?: string;
};

export type TUseLLM = {
  onInit: (props: TSStreamProps) => Promise<void>;
  onStreamStart: (props: TSStreamProps) => Promise<void>;
  onStream: (props: TSStreamProps) => Promise<void>;
  onStreamEnd: (props: TSStreamProps) => Promise<void>;
  onError: (props: TSStreamProps) => Promise<void>;
};

export const useLLM = ({
  onInit,
  onStream,
  onStreamStart,
  onStreamEnd,
  onError,
}: TUseLLM) => {
  const { getSessionById, addMessageToSession } = useChatSession();
  const { getApiKey, getPreferences } = usePreferences();
  const { createInstance, getModelByKey } = useModelList();
  const preparePrompt = async (props: PromptProps, history: TChatMessage[]) => {
    const messageHistory = history;

    const prompt = ChatPromptTemplate.fromMessages(
      messageHistory?.length > 0
        ? [
            [
              "system",
              "You are {role} Answer use's question based on the following context:",
            ],
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
          ]
        : [
            props?.context
              ? [
                  "system",
                  "You are {role} Answer use's question based on the following context:{context}",
                ]
              : ["system", "You are {role}. {type}"],
            ["user", "{input}"],
          ]
    );
    const previousMessgeHistory = messageHistory.reduce(
      (acc: (HumanMessage | AIMessage)[], { rawAI, rawHuman }) => [
        ...acc,
        new HumanMessage(rawHuman),
        new AIMessage(rawAI),
      ],
      []
    );

    return await prompt.formatMessages(
      messageHistory?.length > 0
        ? {
            role: getRole(props.role),
            chat_history: previousMessgeHistory,
            input: props.query,
          }
        : {
            role: getRole(props.role),
            type: getInstruction(props.type),
            context: props.context,
            input: props.query,
          }
    );
  };

  const runModel = async (props: PromptProps, sessionId: string) => {
    const currentSession = await getSessionById(sessionId);
    if (!props?.query) {
      return;
    }
    const preferences = await getPreferences();
    const modelKey = preferences.defaultModel;
    onInit({
      props,
      model: modelKey,
      sessionId,
      loading: true,
    });
    const selectedModel = getModelByKey(modelKey);
    if (!selectedModel) {
      throw new Error("Model not found");
    }

    const apiKey = await getApiKey(selectedModel?.baseModel);
    if (!apiKey) {
      onError({
        props,
        model: modelKey,
        sessionId,
        error: "API Key not found",
        loading: false,
      });
      return;
    }
    try {
      const newMessageId = v4();

      const formattedChatPrompt = await preparePrompt(
        props,
        currentSession?.messages || []
      );

      const model = await createInstance(selectedModel, apiKey);
      const stream = await model.stream(formattedChatPrompt, {
        options: {
          stream: true,
        },
      });
      if (!stream) {
        throw new Error("Stream not found");
      }
      let streamedMessages = "";
      onStreamStart({
        props,
        sessionId,
        message: streamedMessages,
        model: modelKey,
        loading: true,
      });

      for await (const chunk of stream) {
        streamedMessages += chunk.content;
        onStream({
          props,
          sessionId,
          message: streamedMessages,
          model: modelKey,
          loading: true,
        });
      }

      const chatMessage: TChatMessage = {
        id: newMessageId,
        model: selectedModel.key,
        human: new HumanMessage(props.query),
        ai: new AIMessage(streamedMessages),
        rawHuman: props.query,
        rawAI: streamedMessages,
        props,
        createdAt: dayjs().toISOString(),
      };

      addMessageToSession(sessionId, chatMessage).then(() => {
        onStreamEnd({
          props,
          sessionId,
          message: streamedMessages,
          model: modelKey,
          loading: false,
        });
      });
    } catch (error: any) {
      console.log("error:", error);
      onError({
        props,
        sessionId,
        model: modelKey,
        error: error?.message || "error",
        loading: false,
      });
    }
  };

  return {
    runModel,
  };
};
