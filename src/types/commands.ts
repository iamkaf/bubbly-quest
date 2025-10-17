// ============================================================================
// Bubbly Quest Command System Type Definitions
// ============================================================================

// ----------------------------------------------------------------------------
// Command Types and Categories
// ----------------------------------------------------------------------------

export type CommandVerb =
  | 'go'
  | 'move'
  | 'take'
  | 'get'
  | 'grab'
  | 'drop'
  | 'use'
  | 'consume'
  | 'equip'
  | 'unequip'
  | 'attack'
  | 'fight'
  | 'hit'
  | 'look'
  | 'examine'
  | 'inspect'
  | 'inventory'
  | 'stats'
  | 'help'
  | 'save'
  | 'load'
  | 'quit';

export type Direction =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'northeast'
  | 'northwest'
  | 'southeast'
  | 'southwest'
  | 'up'
  | 'down';

export type CommandType =
  | 'movement'
  | 'interaction'
  | 'combat'
  | 'inventory'
  | 'system'
  | 'information'
  | 'unknown';

// ----------------------------------------------------------------------------
// Parsed Command Structure
// ----------------------------------------------------------------------------

export interface ParsedCommand {
  // The original input from the player
  raw: string;

  // The recognized command type
  type: CommandType;

  // The primary action verb
  verb: CommandVerb | null;

  // Direction (for movement commands)
  direction?: Direction;

  // Target object (item name, monster name, feature name)
  target?: string;

  // Secondary target (for compound commands like "give sword to npc")
  secondaryTarget?: string;

  // Additional modifiers or flags
  modifiers?: string[];

  // Whether this is a recognized/valid command
  valid: boolean;

  // Error message if invalid
  error?: string;
}

// ----------------------------------------------------------------------------
// Command Context (for context-aware parsing)
// ----------------------------------------------------------------------------

export interface CommandContext {
  // Current room info
  currentRoomId: number;
  availableExits: string[];
  visibleItems: string[];
  visibleMonster?: string;
  visibleFeatures: string[];

  // Player info
  inventoryItems: string[];
  equippedItems: string[];

  // Combat state
  inCombat: boolean;
}

// ----------------------------------------------------------------------------
// Command Result
// ----------------------------------------------------------------------------

export interface CommandResult {
  // Whether the command executed successfully
  success: boolean;

  // User-facing message to display
  message: string;

  // Optional additional details
  details?: string;

  // Whether this command should be added to history
  addToHistory?: boolean;
}

// ----------------------------------------------------------------------------
// Command History Entry
// ----------------------------------------------------------------------------

export interface CommandHistoryEntry {
  command: string;
  timestamp: string;
  result: CommandResult;
}

// ----------------------------------------------------------------------------
// Synonym Mappings (used internally by parser)
// ----------------------------------------------------------------------------

export interface SynonymMap {
  [key: string]: CommandVerb | Direction;
}
