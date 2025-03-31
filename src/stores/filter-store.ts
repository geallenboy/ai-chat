// src/store/filter-store.ts
"use client";
import { create } from "zustand";

interface FilterState {
    isFilterOpen: boolean;
    open: () => void;
    dismiss: () => void;
    toggle: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    isFilterOpen: false,
    open: () => set({ isFilterOpen: true }),
    dismiss: () => set({ isFilterOpen: false }),
    toggle: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
}));