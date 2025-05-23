import { create } from 'zustand';

type ToastType = "success" | "error";

interface ToastStore {
  message: string;
  type: ToastType;
  isVisible: boolean;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

export const useToast = create<ToastStore>((set) => ({
  message: "",
  type: "error",
  isVisible: false,
  showToast: (message: string, type: ToastType = "error", duration: number = 3000) => {
    set({ message, type, isVisible: true });
    setTimeout(() => {
      set({ isVisible: false });
    }, duration);
  },
  hideToast: () => set({ isVisible: false }),
})); 