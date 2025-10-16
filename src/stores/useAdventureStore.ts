import { create } from 'zustand';
import type { AdventureStore } from '@/types';

export const useAdventureStore = create<AdventureStore>()((set) => ({
  currentAdventure: null,
  adventureList: null,

  loadAdventure: (adventure) => set({ currentAdventure: adventure }),

  loadAdventureList: (list) => set({ adventureList: list }),

  resetAdventure: () => set({ currentAdventure: null }),
}));
