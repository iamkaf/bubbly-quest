import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameStore } from '@/types';

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    playerState: null,
    worldState: null,

    updatePlayer: (updates) =>
      set((state) => {
        if (state.playerState) {
          Object.assign(state.playerState, updates);
        }
      }),

    addToInventory: (item) =>
      set((state) => {
        if (!state.playerState) return;

        const existingItemIndex = state.playerState.inventory.findIndex((i) => i.id === item.id);

        if (existingItemIndex >= 0) {
          // Item exists, increase quantity
          state.playerState.inventory[existingItemIndex].quantity += item.quantity;
        } else {
          // New item, add to inventory
          state.playerState.inventory.push(item);
        }

        // Update stats
        state.playerState.stats.itemsCollected += item.quantity;
      }),

    removeFromInventory: (itemId, quantity = 1) =>
      set((state) => {
        if (!state.playerState) return;

        const itemIndex = state.playerState.inventory.findIndex((i) => i.id === itemId);

        if (itemIndex >= 0) {
          const item = state.playerState.inventory[itemIndex];

          if (item.quantity <= quantity) {
            // Remove item completely
            state.playerState.inventory.splice(itemIndex, 1);
          } else {
            // Decrease quantity
            item.quantity -= quantity;
          }
        }
      }),

    equipItem: (slot, itemId) =>
      set((state) => {
        if (!state.playerState) return;

        state.playerState.equipment[slot] = itemId;
      }),

    updateWorldState: (updates) =>
      set((state) => {
        if (state.worldState) {
          Object.assign(state.worldState, updates);
        }
      }),

    resetGame: () =>
      set(() => ({
        playerState: null,
        worldState: null,
      })),
  })),
);
