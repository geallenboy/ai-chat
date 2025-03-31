
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { JSX } from "react";
import { ModelIcon } from "@/components/icons/model-icon";
import { TBaseModel, TModelKey } from "@/lib/mode-type";

export type TModel = {
    name: string;
    key: TModelKey;
    icon: () => JSX.Element;
    baseModel: TBaseModel;
    tokens: number;
};

export const useModelList = () => {
    const createInstance = async (model: TModel, apikey: string) => {
        switch (model.baseModel) {
            case "openai":
                return new ChatOpenAI({
                    model: model.key,
                    apiKey: apikey,
                });
            case "anthropic":
                return new ChatAnthropic({
                    model: model.key,
                    streaming: true,
                    anthropicApiUrl: `${window.location.origin}/api/anthropic`,
                    apiKey: apikey,
                });
            case "gemini":
                return new ChatGoogleGenerativeAI({
                    model: model.key,
                    apiKey: apikey,
                });
            default:
                throw new Error("Invalid model");
        }
    };

    const models: TModel[] = [
        {
            name: "GPT-4 Turbo",
            key: "gpt-4-turbo",
            icon: () => <ModelIcon type="gpt4" size = "medium" />,
            baseModel: "openai",
            tokens: 128000,
        },
        {
            name: "GPT-3.5 Turbo",
            key: "gpt-3.5-turbo",
            icon: () => <ModelIcon type="gpt3" size = "medium" />,
            baseModel: "openai",
            tokens: 128000,
        },
        {
            name: "GPT-3.5 Turbo Davinci",
            key: "gpt-3.5-turbo-davinci",
            icon: () => <ModelIcon type="gpt3" size = "medium" />,
            baseModel: "openai",
            tokens: 128000,
        },
        {
            name: "GPT-3.5 Turbo Codex",
            key: "gpt-3.5-turbo-codex",
            icon: () => <ModelIcon type="gpt3" size = "medium" />,
            baseModel: "openai",
            tokens: 128000,
        },
        {
            name: "GPT-3.5 Turbo Babbage",
            key: "gpt-3.5-turbo-babbage",
            icon: () => <ModelIcon type="gpt3" size = "medium" />,
            baseModel: "openai",
            tokens: 128000,
        },
        {
            name: "Claude-3 Opus",
            key: "claude-3-opus-20240229",
            icon: () => <ModelIcon type="anthropic" size = "medium" />,
            baseModel: "anthropic",
            tokens: 128000,
        },
        {
            name: "Claude-3 Sonnet",
            key: "claude-3-sonnet-20240229",
            icon: () => <ModelIcon type="anthropic" size = "medium" />,
            baseModel: "anthropic",
            tokens: 128000,
        },
        {
            name: "Claude-3 Haiku",
            key: "claude-3-haiku-20240307",
            icon: () => <ModelIcon type="anthropic" size = "medium" />,
            baseModel: "anthropic",
            tokens: 128000,
        },
        {
            name: "Gemini Pro",
            key: "gemini-pro",
            icon: () => <ModelIcon type="gemini" size = "medium" />,
            baseModel: "gemini",
            tokens: 128000,
        },
        {
            name: "Gemini 1.5 Flash",
            key: "gemini-1.5-flash-latest",
            icon: () => <ModelIcon type="gemini" size = "medium" />,
            baseModel: "gemini",
            tokens: 128000,
        },
        {
            name: "Gemini 1.5 Pro",
            key: "gemini-1.5-pro-latest",
            icon: () => <ModelIcon type="gemini" size = "medium" />,
            baseModel: "gemini",
            tokens: 128000,
        },
    ];

    const getModelByKey = (key: TModelKey) => {
        return models.find((model) => model.key === key);
    };
    return { models, createInstance, getModelByKey };
};
