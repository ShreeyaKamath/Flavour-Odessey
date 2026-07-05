import { create } from "zustand";

type ToastMessage = {
  id: string;
  message: string;
};

type UiState = {
  isLoading: boolean;
  toasts: ToastMessage[];
  setLoading: (value: boolean) => void;
  addToast: (message: string) => void;
  dismissToast: (id: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isLoading: false,
  toasts: [],
  setLoading: (value) => set({ isLoading: value }),
  addToast: (message) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message }]
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
}));
