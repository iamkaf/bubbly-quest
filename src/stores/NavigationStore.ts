import { create } from 'zustand';

interface NavigationState {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentScreen: 'main-menu',
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
}));