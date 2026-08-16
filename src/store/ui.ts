import { create } from "zustand";
import type { ChatMessage } from "@/types/api";

/** Lightweight client-only UI state. Never business data. */
interface UiState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  conversationId: string | null;
  messages: ChatMessage[];
  setConversationId: (id: string) => void;
  addMessage: (message: ChatMessage) => void;
  clearConversation: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  conversationId: null,
  messages: [],
  setConversationId: (id) => set({ conversationId: id }),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  clearConversation: () => set({ messages: [], conversationId: null }),
}));
