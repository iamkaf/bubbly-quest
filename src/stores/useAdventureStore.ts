import { create } from 'zustand';
import type { Adventure, AdventureList, AdventureStore, AdventureMetadata } from '@/types';
import {
  readAdventure,
  readAdventureList,
  writeAdventure,
  writeAdventureList,
} from '@/services/fileSystem';

export const useAdventureStore = create<AdventureStore>()((set, get) => ({
  // Initial state
  currentAdventure: null,
  adventureList: null,
  isLoading: false,
  isLoadingAdventure: false,
  error: null,

  // Synchronous actions
  loadAdventure: (adventure) => set({ currentAdventure: adventure }),

  loadAdventureList: (list) => set({ adventureList: list }),

  resetAdventure: () => set({ currentAdventure: null }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Asynchronous actions
  loadAdventureFromFile: async (adventureId: string) => {
    set({ isLoadingAdventure: true, error: null });

    try {
      const result = await readAdventure(adventureId);

      if (result.success) {
        set({
          currentAdventure: result.data,
          isLoadingAdventure: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: `Failed to load adventure: ${result.error.message}`,
          isLoadingAdventure: false,
        });
        return false;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set({
        error: `Error loading adventure: ${message}`,
        isLoadingAdventure: false,
      });
      return false;
    }
  },

  saveAdventureToFile: async (adventure: Adventure) => {
    set({ isLoading: true, error: null });

    try {
      const result = await writeAdventure(adventure);

      if (result.success) {
        // Update current adventure if it's the same one
        const state = get();
        if (state.currentAdventure?.metadata.id === adventure.metadata.id) {
          set({ currentAdventure: adventure });
        }

        // Refresh adventure list to update metadata
        await get().refreshAdventureList();

        set({ isLoading: false, error: null });
        return true;
      } else {
        set({
          error: `Failed to save adventure: ${result.error.message}`,
          isLoading: false,
        });
        return false;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set({
        error: `Error saving adventure: ${message}`,
        isLoading: false,
      });
      return false;
    }
  },

  refreshAdventureList: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await readAdventureList();

      if (result.success) {
        set({
          adventureList: result.data,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: `Failed to load adventure list: ${result.error.message}`,
          isLoading: false,
        });
        return false;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set({
        error: `Error loading adventure list: ${message}`,
        isLoading: false,
      });
      return false;
    }
  },

  updateAdventureListMetadata: async (adventureId: string, updates: Partial<AdventureMetadata>) => {
    const state = get();

    if (!state.adventureList) {
      set({ error: 'No adventure list loaded' });
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      // Find the adventure in the list
      const adventureIndex = state.adventureList.adventures.findIndex(
        (adv) => adv.id === adventureId,
      );

      if (adventureIndex === -1) {
        set({
          error: `Adventure not found in list: ${adventureId}`,
          isLoading: false,
        });
        return false;
      }

      // Create updated list
      const updatedList: AdventureList = {
        ...state.adventureList,
        adventures: state.adventureList.adventures.map((adv, index) =>
          index === adventureIndex ? { ...adv, ...updates } : adv,
        ),
      };

      // Write to file
      const result = await writeAdventureList(updatedList);

      if (result.success) {
        set({
          adventureList: updatedList,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: `Failed to update adventure list: ${result.error.message}`,
          isLoading: false,
        });
        return false;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set({
        error: `Error updating adventure list: ${message}`,
        isLoading: false,
      });
      return false;
    }
  },
}));
