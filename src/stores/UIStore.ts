import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  modal: string | null;
  notifications: string[];
  setLoading: (isLoading: boolean) => void;
  showModal: (modal: string) => void;
  hideModal: () => void;
  addNotification: (notification: string) => void;
  removeNotification: (notification: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  modal: null,
  notifications: [],
  setLoading: (isLoading) => set({ isLoading }),
  showModal: (modal) => set({ modal }),
  hideModal: () => set({ modal: null }),
  addNotification: (notification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),
  removeNotification: (notification) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n !== notification),
    })),
}));