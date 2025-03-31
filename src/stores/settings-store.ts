
// src/store/settings-store.ts
"use client";
import { create } from "zustand";

export type TSettingMenuKey =
    | "profile"
    | "prompts"
    | "roles"
    | "openai"
    | "anthropic"
    | "gemini";

type SettingsState = {
    isSettingsOpen: boolean;
    selectedMenu: TSettingMenuKey;
};

type SettingsActions = {
    open: () => void;
    dismiss: () => void;
    selectMenu: (key: TSettingMenuKey) => void;
};

export const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
    isSettingsOpen: false,
    selectedMenu: "profile",

    open: () => set({ isSettingsOpen: true }),
    dismiss: () => set({ isSettingsOpen: false }),
    selectMenu: (key) => set({ selectedMenu: key }),
}));
