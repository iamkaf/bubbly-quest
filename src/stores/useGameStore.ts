import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { info, warn } from '@tauri-apps/plugin-log';
import type { GameStore } from '@/types';

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    playerState: null,
    worldState: null,

    updatePlayer: (updates) =>
      set((state) => {
        if (state.playerState) {
          Object.assign(state.playerState, updates);
          info(`Player state updated: ${JSON.stringify(updates)}`);
        } else {
          warn('Attempted to update player state but no player state exists');
        }
      }),

    addToInventory: (item) =>
      set((state) => {
        if (!state.playerState) {
          warn('Attempted to add item to inventory but no player state exists');
          return;
        }

        const existingItemIndex = state.playerState.inventory.findIndex((i) => i.id === item.id);

        if (existingItemIndex >= 0) {
          // Item exists, increase quantity
          const oldQuantity = state.playerState.inventory[existingItemIndex].quantity;
          state.playerState.inventory[existingItemIndex].quantity += item.quantity;
          info(
            `Added ${item.quantity}x ${item.id} to inventory (was ${oldQuantity}, now ${state.playerState.inventory[existingItemIndex].quantity})`,
          );
        } else {
          // New item, add to inventory
          state.playerState.inventory.push(item);
          info(`Added new item ${item.id} (x${item.quantity}) to inventory`);
        }

        // Update stats
        state.playerState.stats.itemsCollected += item.quantity;
      }),

    removeFromInventory: (itemId, quantity = 1) =>
      set((state) => {
        if (!state.playerState) {
          warn('Attempted to remove item from inventory but no player state exists');
          return;
        }

        const itemIndex = state.playerState.inventory.findIndex((i) => i.id === itemId);

        if (itemIndex >= 0) {
          const item = state.playerState.inventory[itemIndex];
          const oldQuantity = item.quantity;

          if (item.quantity <= quantity) {
            // Remove item completely
            state.playerState.inventory.splice(itemIndex, 1);
            info(`Removed all ${itemId} from inventory (was ${oldQuantity})`);
          } else {
            // Decrease quantity
            item.quantity -= quantity;
            info(
              `Removed ${quantity}x ${itemId} from inventory (was ${oldQuantity}, now ${item.quantity})`,
            );
          }
        } else {
          warn(`Attempted to remove item ${itemId} from inventory but item not found`);
        }
      }),

    equipItem: (slot, itemId) =>
      set((state) => {
        if (!state.playerState) {
          warn('Attempted to equip item but no player state exists');
          return;
        }

        const previousItem = state.playerState.equipment[slot];
        state.playerState.equipment[slot] = itemId;
        info(
          `Equipped item ${itemId} to slot ${slot}${previousItem ? ` (replaced ${previousItem})` : ''}`,
        );
      }),

    updateWorldState: (updates) =>
      set((state) => {
        if (state.worldState) {
          Object.assign(state.worldState, updates);
          info(`World state updated: ${JSON.stringify(updates)}`);
        } else {
          warn('Attempted to update world state but no world state exists');
        }
      }),

    resetGame: () =>
      set(() => {
        info('Game state reset');
        return {
          playerState: null,
          worldState: null,
        };
      }),
  })),
);
