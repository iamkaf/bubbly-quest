// ============================================================================
// Bubbly Quest - Zod Validation Schemas
// ============================================================================

import { z } from 'zod';

// ----------------------------------------------------------------------------
// Basic Type Schemas
// ----------------------------------------------------------------------------

export const DifficultySchema = z.enum(['easy', 'medium', 'hard', 'extreme']);
export const ItemTypeSchema = z.enum(['consumable', 'weapon', 'armor', 'key', 'treasure', 'misc']);
export const RaritySchema = z.enum(['common', 'uncommon', 'rare', 'legendary']);
export const ArmorSlotSchema = z.enum(['head', 'chest', 'hands', 'feet']);
export const DamageTypeSchema = z.enum(['slashing', 'piercing', 'bludgeoning', 'magic']);
export const LightingSchema = z.enum(['dark', 'dim', 'bright']);
export const AggressionSchema = z.enum(['passive', 'neutral', 'aggressive']);
export const AttackPatternSchema = z.enum(['basic', 'random', 'smart']);
export const VictoryTypeSchema = z.enum([
  'collect_items',
  'reach_room',
  'defeat_monster',
  'custom',
]);
export const GameActionTypeSchema = z.enum(['move', 'take', 'use', 'attack', 'talk', 'custom']);

// ----------------------------------------------------------------------------
// Item Entity Schemas
// ----------------------------------------------------------------------------

export const ItemConsumableSchema = z.object({
  effect: z.object({
    heal: z.number().optional(),
    damage: z.number().optional(),
    temporaryBuff: z
      .object({
        stat: z.enum(['attack', 'defense']),
        amount: z.number(),
        duration: z.number(),
      })
      .optional(),
  }),
  uses: z.number().optional(),
});

export const ItemWeaponSchema = z.object({
  damage: z.number(),
  requiredLevel: z.number().optional(),
  damageType: DamageTypeSchema.optional(),
});

export const ItemArmorSchema = z.object({
  defense: z.number(),
  requiredLevel: z.number().optional(),
  slot: ArmorSlotSchema,
});

export const ItemKeySchema = z.object({
  doorId: z.number(),
  reusable: z.boolean(),
});

export const ItemTreasureSchema = z.object({
  value: z.number(),
  sellable: z.boolean(),
});

export const ItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string(),
  type: ItemTypeSchema,
  rarity: RaritySchema,
  value: z.number().optional(),

  // Type-specific properties
  consumable: ItemConsumableSchema.optional(),
  weapon: ItemWeaponSchema.optional(),
  armor: ItemArmorSchema.optional(),
  key: ItemKeySchema.optional(),
  treasure: ItemTreasureSchema.optional(),

  // Common properties
  weight: z.number().optional(),
  stackable: z.boolean().optional(),
  maxStack: z.number().optional(),
  usable: z.boolean(),
  equippable: z.boolean().optional(),
  icon: z.string().optional(),
});

// ----------------------------------------------------------------------------
// Monster Entity Schemas
// ----------------------------------------------------------------------------

export const MonsterBehaviorSchema = z.object({
  aggression: AggressionSchema,
  attackPattern: AttackPatternSchema,
  specialAttack: z
    .object({
      name: z.string(),
      damage: z.number(),
      description: z.string(),
      frequency: z.number(),
    })
    .optional(),
  weaknesses: z.array(z.string()).optional(),
  immunities: z.array(z.string()).optional(),
});

export const MonsterLootSchema = z.object({
  itemIds: z.array(z.number()),
  dropChances: z.record(z.string(), z.number()), // Keys are always strings in JSON
  guaranteedItems: z.array(z.number()).optional(),
});

export const MonsterAppearanceSchema = z.object({
  description: z.string(),
  icon: z.string().optional(),
  sound: z.string().optional(),
});

export const MonsterSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string(),
  level: z.number().min(1),
  hp: z.number().min(1),
  maxHp: z.number().min(1),
  attack: z.number().min(0),
  defense: z.number().min(0),
  xp: z.number().min(0),
  gold: z.number().optional(),

  behavior: MonsterBehaviorSchema,
  loot: MonsterLootSchema,
  appearance: MonsterAppearanceSchema.optional(),

  respawnable: z.boolean().optional(),
  respawnTime: z.number().optional(),
  boss: z.boolean().optional(),
});

// ----------------------------------------------------------------------------
// Room Entity Schemas
// ----------------------------------------------------------------------------

export const RoomFeatureSchema = z.object({
  description: z.string(),
  interactable: z.boolean(),
  requiredItem: z.number().optional(),
  action: z.string().optional(),
});

export const RoomSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string(),
  longDescription: z.string().optional(),
  exits: z.record(z.string(), z.number().nullable()),
  items: z.array(z.number()),
  monster: z.number().nullable().optional(),
  features: z.record(z.string(), RoomFeatureSchema).optional(),
  lighting: LightingSchema.optional(),
  atmosphere: z.string().optional(),
  visited: z.boolean().optional(),
});

// ----------------------------------------------------------------------------
// Adventure Schemas
// ----------------------------------------------------------------------------

export const AdventureMetadataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  version: z.string(),
  author: z.string(),
  difficulty: DifficultySchema,
  estimatedPlaytime: z.number().min(0),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  playtime: z.number().optional(),
  completed: z.boolean().optional(),
  lastPlayed: z.string().optional(),
});

export const AdventureConfigSchema = z.object({
  startingRoomId: z.number(),
  maxLevel: z.number().min(1),
  startingLevel: z.number().min(1),
  startingInventory: z.array(z.number()),
  victoryConditions: z.object({
    type: VictoryTypeSchema,
    target: z.union([z.number(), z.string()]),
    description: z.string(),
  }),
});

export const AdventureEntitiesSchema = z.object({
  rooms: z.array(RoomSchema),
  items: z.array(ItemSchema),
  monsters: z.array(MonsterSchema),
});

export const PlayerStatsSchema = z.object({
  roomsVisited: z.number().min(0),
  monstersDefeated: z.number().min(0),
  itemsCollected: z.number().min(0),
  deaths: z.number().min(0),
});

export const PlayerStateSchema = z.object({
  name: z.string(),
  level: z.number().min(1),
  currentHp: z.number().min(0),
  maxHp: z.number().min(1),
  currentXp: z.number().min(0),
  xpToNextLevel: z.number().min(0),
  attack: z.number().min(0),
  defense: z.number().min(0),
  currentRoomId: z.number(),
  inventory: z.array(
    z.object({
      id: z.number(),
      quantity: z.number().min(1),
      durability: z.number().optional(),
      customProperties: z.record(z.string(), z.unknown()).optional(),
    }),
  ),
  equipment: z.record(z.string(), z.number().nullable()),
  gold: z.number().min(0),
  stats: PlayerStatsSchema,
});

export const WorldStateSchema = z.object({
  defeatedMonsters: z.array(z.number()),
  takenItems: z.record(z.string(), z.array(z.number())), // Keys are always strings in JSON
  unlockedDoors: z.record(z.string(), z.array(z.string())),
  solvedPuzzles: z.array(z.string()),
  triggeredEvents: z.array(z.string()),
  customState: z.record(z.string(), z.unknown()).optional(),
});

export const AdventureSchema = z.object({
  metadata: AdventureMetadataSchema,
  config: AdventureConfigSchema,
  entities: AdventureEntitiesSchema,
  stateTemplate: z.object({
    playerStateTemplate: PlayerStateSchema.partial(),
    worldStateTemplate: WorldStateSchema.partial(),
  }),
});

export const AdventureListSchema = z.object({
  adventures: z.array(AdventureMetadataSchema),
  lastPlayed: z.string().optional(),
  favorites: z.array(z.string()),
});

// ----------------------------------------------------------------------------
// Save Game Schemas
// ----------------------------------------------------------------------------

export const SaveGameMetadataSchema = z.object({
  id: z.string().min(1),
  adventureId: z.string().min(1),
  playerName: z.string(),
  saveTimestamp: z.string(),
  playtime: z.number().min(0),
  screenshot: z.string().optional(),
  version: z.string(),
});

export const GameActionSchema = z.object({
  timestamp: z.string(),
  type: GameActionTypeSchema,
  details: z.record(z.string(), z.unknown()),
  result: z.string(),
});

export const SessionStateSchema = z.object({
  commandHistory: z.array(z.string()),
  lastActions: z.array(GameActionSchema),
  currentObjective: z.string().optional(),
  completedObjectives: z.array(z.string()),
});

export const SaveGameSchema = z.object({
  metadata: SaveGameMetadataSchema,
  playerState: PlayerStateSchema,
  worldState: WorldStateSchema,
  sessionState: SessionStateSchema,
});

// ----------------------------------------------------------------------------
// Validation Helper Functions
// ----------------------------------------------------------------------------

export function validateAdventure(data: unknown) {
  return AdventureSchema.parse(data);
}

export function validateAdventureList(data: unknown) {
  return AdventureListSchema.parse(data);
}

export function validateSaveGame(data: unknown) {
  return SaveGameSchema.parse(data);
}

export function validateItem(data: unknown) {
  return ItemSchema.parse(data);
}

export function validateMonster(data: unknown) {
  return MonsterSchema.parse(data);
}

export function validateRoom(data: unknown) {
  return RoomSchema.parse(data);
}

// Safe validation functions that return { success, data, error }
export function safeValidateAdventure(data: unknown) {
  return AdventureSchema.safeParse(data);
}

export function safeValidateAdventureList(data: unknown) {
  return AdventureListSchema.safeParse(data);
}

export function safeValidateSaveGame(data: unknown) {
  return SaveGameSchema.safeParse(data);
}
