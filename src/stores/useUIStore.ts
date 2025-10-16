import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIStore } from '@/types';

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'bubbly-original',
      currentScreen: 'menu',
      isTransitioning: false,
      isLoading: false,
      menuVisible: false,

      setTheme: (theme) => set({ theme }),

      setScreen: (screen) =>
        set(() => {
          // Optional: Add transition animation
          return { currentScreen: screen, isTransitioning: false };
        }),

      setTransitioning: (transitioning) => set({ isTransitioning: transitioning }),

      setLoading: (loading) => set({ isLoading: loading }),

      toggleMenu: () => set((state) => ({ menuVisible: !state.menuVisible })),
    }),
    {
      name: 'bubbly-quest-ui',
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    },
  ),
);
