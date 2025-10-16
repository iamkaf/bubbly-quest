// ============================================================================
// Bubbly Quest Type Definitions
// ============================================================================

// ----------------------------------------------------------------------------
// Enums and Helper Types
// ----------------------------------------------------------------------------

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';
export type ItemType = 'consumable' | 'weapon' | 'armor' | 'key' | 'treasure' | 'misc';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type ArmorSlot = 'head' | 'chest' | 'hands' | 'feet';
export type DamageType = 'slashing' | 'piercing' | 'bludgeoning' | 'magic';
export type Lighting = 'dark' | 'dim' | 'bright';
export type Aggression = 'passive' | 'neutral' | 'aggressive';
export type AttackPattern = 'basic' | 'random' | 'smart';
export type VictoryType = 'collect_items' | 'reach_room' | 'defeat_monster' | 'custom';
export type GameActionType = 'move' | 'take' | 'use' | 'attack' | 'talk' | 'custom';
export type Screen = 'menu' | 'game' | 'editor' | 'settings';
export type Theme =
  | 'bubbly-original'
  | 'midnight-cozy'
  | 'strawberry-sunset'
  | 'matcha-mochi'
  | 'sakura-spring'
  | 'cozy-cottage'
  | 'starlight-velvet'
  | 'arcade-night'
  | 'autumn-grimoire'
  | 'abyssal-tide';

// ----------------------------------------------------------------------------
// Item Entity Structures
// ----------------------------------------------------------------------------

export interface ItemConsumable {
  effect: {
    heal?: number;
    damage?: number;
    temporaryBuff?: {
      stat: 'attack' | 'defense';
      amount: number;
      duration: number;
    };
  };
  uses?: number;
}

export interface ItemWeapon {
  damage: number;
  requiredLevel?: number;
  damageType?: DamageType;
}

export interface ItemArmor {
  defense: number;
  requiredLevel?: number;
  slot: ArmorSlot;
}

export interface ItemKey {
  doorId: number;
  reusable: boolean;
}

export interface ItemTreasure {
  value: number;
  sellable: boolean;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  type: ItemType;
  rarity: Rarity;
  value?: number;

  // Type-specific properties
  consumable?: ItemConsumable;
  weapon?: ItemWeapon;
  armor?: ItemArmor;
  key?: ItemKey;
  treasure?: ItemTreasure;

  // Common properties
  weight?: number;
  stackable?: boolean;
  maxStack?: number;
  usable: boolean;
  equippable?: boolean;
  icon?: string;
}

// ----------------------------------------------------------------------------
// Monster Entity Structure
// ----------------------------------------------------------------------------

export interface MonsterBehavior {
  aggression: Aggression;
  attackPattern: AttackPattern;
  specialAttack?: {
    name: string;
    damage: number;
    description: string;
    frequency: number;
  };
  weaknesses?: string[];
  immunities?: string[];
}

export interface MonsterLoot {
  itemIds: number[];
  dropChances: {
    [itemId: number]: number;
  };
  guaranteedItems?: number[];
}

export interface MonsterAppearance {
  description: string;
  icon?: string;
  sound?: string;
}

export interface Monster {
  id: number;
  name: string;
  description: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  xp: number;
  gold?: number;

  behavior: MonsterBehavior;
  loot: MonsterLoot;
  appearance?: MonsterAppearance;

  respawnable?: boolean;
  respawnTime?: number;
  boss?: boolean;
}

// ----------------------------------------------------------------------------
// Room Entity Structure
// ----------------------------------------------------------------------------

export interface RoomFeature {
  description: string;
  interactable: boolean;
  requiredItem?: number;
  action?: string;
}

export interface Room {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  exits: {
    [direction: string]: number | null;
  };
  items: number[];
  monster?: number | null;
  features?: {
    [featureName: string]: RoomFeature;
  };
  lighting?: Lighting;
  atmosphere?: string;
  visited?: boolean;
}

// ----------------------------------------------------------------------------
// Adventure Structure
// ----------------------------------------------------------------------------

export interface AdventureMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  difficulty: Difficulty;
  estimatedPlaytime: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  playtime?: number;
  completed?: boolean;
  lastPlayed?: string;
}

export interface AdventureConfig {
  startingRoomId: number;
  maxLevel: number;
  startingLevel: number;
  startingInventory: number[];
  victoryConditions: {
    type: VictoryType;
    target: number | string;
    description: string;
  };
}

export interface AdventureEntities {
  rooms: Room[];
  items: Item[];
  monsters: Monster[];
}

export interface Adventure {
  metadata: AdventureMetadata;
  config: AdventureConfig;
  entities: AdventureEntities;
  stateTemplate: {
    playerStateTemplate: Partial<PlayerState>;
    worldStateTemplate: Partial<WorldState>;
  };
}

export interface AdventureList {
  adventures: AdventureMetadata[];
  lastPlayed?: string;
  favorites: string[];
}

// ----------------------------------------------------------------------------
// Game State Structures
// ----------------------------------------------------------------------------

export interface InventoryItem {
  id: number;
  quantity: number;
  durability?: number;
  customProperties?: {
    [key: string]: unknown;
  };
}

export interface PlayerStats {
  roomsVisited: number;
  monstersDefeated: number;
  itemsCollected: number;
  deaths: number;
}

export interface PlayerState {
  name: string;
  level: number;
  currentHp: number;
  maxHp: number;
  currentXp: number;
  xpToNextLevel: number;
  attack: number;
  defense: number;
  currentRoomId: number;
  inventory: InventoryItem[];
  equipment: {
    [slot: string]: number | null;
  };
  gold: number;
  stats: PlayerStats;
}

export interface WorldState {
  defeatedMonsters: number[];
  takenItems: {
    [roomId: number]: number[];
  };
  unlockedDoors: {
    [roomId: string]: string[];
  };
  solvedPuzzles: string[];
  triggeredEvents: string[];
  customState?: {
    [key: string]: unknown;
  };
}

export interface GameAction {
  timestamp: string;
  type: GameActionType;
  details: {
    [key: string]: unknown;
  };
  result: string;
}

export interface SessionState {
  commandHistory: string[];
  lastActions: GameAction[];
  currentObjective?: string;
  completedObjectives: string[];
}

// ----------------------------------------------------------------------------
// Save Game Structure
// ----------------------------------------------------------------------------

export interface SaveGameMetadata {
  id: string;
  adventureId: string;
  playerName: string;
  saveTimestamp: string;
  playtime: number;
  screenshot?: string;
  version: string;
}

export interface SaveGame {
  metadata: SaveGameMetadata;
  playerState: PlayerState;
  worldState: WorldState;
  sessionState: SessionState;
}

// ----------------------------------------------------------------------------
// UI State Types
// ----------------------------------------------------------------------------

export interface UIState {
  theme: Theme;
  currentScreen: Screen;
  isTransitioning: boolean;
  isLoading: boolean;
  menuVisible: boolean;
}

// ----------------------------------------------------------------------------
// Store Types (for Zustand)
// ----------------------------------------------------------------------------

export interface GameStore {
  playerState: PlayerState | null;
  worldState: WorldState | null;

  // Actions
  updatePlayer: (updates: Partial<PlayerState>) => void;
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: number, quantity?: number) => void;
  equipItem: (slot: string, itemId: number | null) => void;
  updateWorldState: (updates: Partial<WorldState>) => void;
  resetGame: () => void;
}

export interface UIStore {
  theme: Theme;
  currentScreen: Screen;
  isTransitioning: boolean;
  isLoading: boolean;
  menuVisible: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setScreen: (screen: Screen) => void;
  setTransitioning: (transitioning: boolean) => void;
  setLoading: (loading: boolean) => void;
  toggleMenu: () => void;
}

export interface AdventureStore {
  currentAdventure: Adventure | null;
  adventureList: AdventureList | null;

  // Actions
  loadAdventure: (adventure: Adventure) => void;
  loadAdventureList: (list: AdventureList) => void;
  resetAdventure: () => void;
}
