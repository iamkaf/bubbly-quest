// ============================================================================
// Bubbly Quest Command Parser
// ============================================================================
// Natural language command parser with synonym support, context awareness,
// and compound command processing.

import type {
  CommandVerb,
  Direction,
  CommandType,
  ParsedCommand,
  CommandContext,
  SynonymMap,
} from '@/types/commands';

// ----------------------------------------------------------------------------
// Synonym and Alias Mappings
// ----------------------------------------------------------------------------

// Map common variations to canonical command verbs
const VERB_SYNONYMS: SynonymMap = {
  // Movement
  go: 'go',
  move: 'go',
  walk: 'go',
  travel: 'go',
  head: 'go',
  run: 'go',

  // Taking items
  take: 'take',
  get: 'take',
  grab: 'take',
  pick: 'take',
  pickup: 'take',
  loot: 'take',

  // Dropping items
  drop: 'drop',
  discard: 'drop',
  throw: 'drop',

  // Using items
  use: 'use',
  consume: 'use',
  drink: 'use',
  eat: 'use',
  apply: 'use',

  // Equipment
  equip: 'equip',
  wear: 'equip',
  wield: 'equip',
  unequip: 'unequip',
  remove: 'unequip',
  doff: 'unequip',

  // Combat
  attack: 'attack',
  fight: 'attack',
  hit: 'attack',
  strike: 'attack',
  kill: 'attack',

  // Looking/examining
  look: 'look',
  examine: 'look',
  inspect: 'look',
  check: 'look',
  observe: 'look',
  view: 'look',
  read: 'look',

  // Inventory
  inventory: 'inventory',
  inv: 'inventory',
  i: 'inventory',
  items: 'inventory',
  bag: 'inventory',

  // Stats
  stats: 'stats',
  status: 'stats',
  character: 'stats',
  player: 'stats',

  // System
  help: 'help',
  commands: 'help',
  '?': 'help',
  save: 'save',
  load: 'load',
  quit: 'quit',
  exit: 'quit',
};

// Map direction aliases to canonical directions
const DIRECTION_ALIASES: SynonymMap = {
  // Cardinal directions
  north: 'north',
  n: 'north',
  forward: 'north',

  south: 'south',
  s: 'south',
  back: 'south',
  backward: 'south',

  east: 'east',
  e: 'east',
  right: 'east',

  west: 'west',
  w: 'west',
  left: 'west',

  // Diagonal directions
  northeast: 'northeast',
  ne: 'northeast',
  'north-east': 'northeast',

  northwest: 'northwest',
  nw: 'northwest',
  'north-west': 'northwest',

  southeast: 'southeast',
  se: 'southeast',
  'south-east': 'southeast',

  southwest: 'southwest',
  sw: 'southwest',
  'south-west': 'southwest',

  // Vertical directions
  up: 'up',
  u: 'up',
  upstairs: 'up',
  climb: 'up',

  down: 'down',
  d: 'down',
  downstairs: 'down',
  descend: 'down',
};

// Words to ignore during parsing
const IGNORE_WORDS = new Set(['a', 'an', 'the', 'to', 'at', 'in', 'on', 'with', 'my', 'some']);

// ----------------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------------

/**
 * Normalize input text: lowercase, trim, remove extra spaces
 */
function normalizeInput(input: string): string {
  return input.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Tokenize input into words, filtering out ignore words
 */
function tokenize(input: string): string[] {
  return normalizeInput(input)
    .split(' ')
    .filter((word) => word.length > 0 && !IGNORE_WORDS.has(word));
}

/**
 * Find the best match for a target string in a list of options
 * Uses simple substring matching
 */
function findBestMatch(target: string, options: string[]): string | null {
  const normalizedTarget = normalizeInput(target);

  // Exact match
  const exactMatch = options.find((opt) => normalizeInput(opt) === normalizedTarget);
  if (exactMatch) return exactMatch;

  // Starts with match
  const startsWithMatch = options.find((opt) => normalizeInput(opt).startsWith(normalizedTarget));
  if (startsWithMatch) return startsWithMatch;

  // Contains match
  const containsMatch = options.find((opt) => normalizeInput(opt).includes(normalizedTarget));
  if (containsMatch) return containsMatch;

  return null;
}

/**
 * Extract the verb from tokens
 */
function extractVerb(tokens: string[]): CommandVerb | null {
  if (tokens.length === 0) return null;

  const firstToken = tokens[0];
  const synonym = VERB_SYNONYMS[firstToken];

  return synonym ? (synonym as CommandVerb) : null;
}

/**
 * Extract direction from tokens
 */
function extractDirection(tokens: string[]): Direction | null {
  for (const token of tokens) {
    const direction = DIRECTION_ALIASES[token];
    if (direction) return direction as Direction;
  }
  return null;
}

/**
 * Determine command type based on verb
 */
function getCommandType(verb: CommandVerb | null): CommandType {
  if (!verb) return 'unknown';

  const movementVerbs: CommandVerb[] = ['go', 'move'];
  const interactionVerbs: CommandVerb[] = ['take', 'get', 'grab', 'drop', 'use', 'consume'];
  const combatVerbs: CommandVerb[] = ['attack', 'fight', 'hit'];
  const inventoryVerbs: CommandVerb[] = ['inventory', 'equip', 'unequip'];
  const systemVerbs: CommandVerb[] = ['help', 'save', 'load', 'quit'];
  const infoVerbs: CommandVerb[] = ['look', 'examine', 'inspect', 'stats'];

  if (movementVerbs.includes(verb)) return 'movement';
  if (interactionVerbs.includes(verb)) return 'interaction';
  if (combatVerbs.includes(verb)) return 'combat';
  if (inventoryVerbs.includes(verb)) return 'inventory';
  if (systemVerbs.includes(verb)) return 'system';
  if (infoVerbs.includes(verb)) return 'information';

  return 'unknown';
}

/**
 * Extract target object from remaining tokens after verb
 */
function extractTarget(tokens: string[], startIndex: number): string | null {
  if (startIndex >= tokens.length) return null;

  // Join remaining tokens (after filtering out directions)
  const remainingTokens = tokens.slice(startIndex).filter((token) => !DIRECTION_ALIASES[token]);

  return remainingTokens.length > 0 ? remainingTokens.join(' ') : null;
}

// ----------------------------------------------------------------------------
// Main Parser Function
// ----------------------------------------------------------------------------

/**
 * Parse a command string into a structured ParsedCommand object
 *
 * @param input - The raw command string from the player
 * @param context - Optional context for context-aware parsing
 * @returns ParsedCommand object with parsed information
 */
export function parseCommand(input: string, context?: CommandContext): ParsedCommand {
  const tokens = tokenize(input);

  // Handle empty input
  if (tokens.length === 0) {
    return {
      raw: input,
      type: 'unknown',
      verb: null,
      valid: false,
      error: 'Please enter a command.',
    };
  }

  // Extract verb
  const verb = extractVerb(tokens);

  // Handle shortcut commands that don't need a verb
  // "i" or "inventory" with no other words
  if ((tokens[0] === 'i' || tokens[0] === 'inventory') && tokens.length === 1) {
    return {
      raw: input,
      type: 'inventory',
      verb: 'inventory',
      valid: true,
    };
  }

  // "stats" or "status"
  if ((tokens[0] === 'stats' || tokens[0] === 'status') && tokens.length === 1) {
    return {
      raw: input,
      type: 'information',
      verb: 'stats',
      valid: true,
    };
  }

  // "help" or "?"
  if (tokens[0] === 'help' || tokens[0] === '?' || tokens[0] === 'commands') {
    return {
      raw: input,
      type: 'system',
      verb: 'help',
      valid: true,
    };
  }

  // Check if it's a direction-only command (implicit "go")
  const direction = extractDirection(tokens);
  if (direction && !verb) {
    return {
      raw: input,
      type: 'movement',
      verb: 'go',
      direction,
      valid: true,
    };
  }

  // If no verb recognized
  if (!verb) {
    return {
      raw: input,
      type: 'unknown',
      verb: null,
      valid: false,
      error: `I don't understand "${tokens[0]}". Type "help" for a list of commands.`,
    };
  }

  // Get command type
  const type = getCommandType(verb);

  // Build the parsed command
  const command: ParsedCommand = {
    raw: input,
    type,
    verb,
    valid: true,
  };

  // Handle movement commands
  if (type === 'movement') {
    command.direction = direction ?? undefined;

    if (!command.direction) {
      command.valid = false;
      command.error = 'Which direction? Try: north, south, east, west, up, down.';
    }
  }

  // Handle interaction commands (take, drop, use, etc.)
  if (type === 'interaction') {
    const target = extractTarget(tokens, 1);

    if (verb === 'take' || verb === 'get' || verb === 'grab') {
      if (!target) {
        command.valid = false;
        command.error = 'What do you want to take?';
      } else {
        // Context-aware: try to match target with visible items
        if (context && context.visibleItems.length > 0) {
          const match = findBestMatch(target, context.visibleItems);
          command.target = match || target;
        } else {
          command.target = target;
        }
      }
    } else if (verb === 'drop') {
      if (!target) {
        command.valid = false;
        command.error = 'What do you want to drop?';
      } else {
        // Context-aware: try to match with inventory items
        if (context && context.inventoryItems.length > 0) {
          const match = findBestMatch(target, context.inventoryItems);
          command.target = match || target;
        } else {
          command.target = target;
        }
      }
    } else if (verb === 'use' || verb === 'consume') {
      if (!target) {
        command.valid = false;
        command.error = 'What do you want to use?';
      } else {
        // Context-aware: try to match with inventory items
        if (context && context.inventoryItems.length > 0) {
          const match = findBestMatch(target, context.inventoryItems);
          command.target = match || target;
        } else {
          command.target = target;
        }
      }
    }
  }

  // Handle combat commands
  if (type === 'combat') {
    const target = extractTarget(tokens, 1);

    if (!target && context && context.visibleMonster) {
      // Auto-target visible monster if no target specified
      command.target = context.visibleMonster;
    } else if (target) {
      command.target = target;
    } else {
      command.valid = false;
      command.error = 'What do you want to attack?';
    }
  }

  // Handle look/examine commands
  if (type === 'information' && (verb === 'look' || verb === 'examine' || verb === 'inspect')) {
    const target = extractTarget(tokens, 1);

    if (target) {
      // Try to match with visible items, features, or monsters
      if (context) {
        const allOptions = [
          ...context.visibleItems,
          ...context.visibleFeatures,
          ...(context.visibleMonster ? [context.visibleMonster] : []),
        ];
        const match = findBestMatch(target, allOptions);
        command.target = match || target;
      } else {
        command.target = target;
      }
    }
    // If no target, it's a "look around" command (valid)
  }

  // Handle equipment commands
  if (type === 'inventory' && (verb === 'equip' || verb === 'unequip')) {
    const target = extractTarget(tokens, 1);

    if (!target) {
      command.valid = false;
      command.error =
        verb === 'equip' ? 'What do you want to equip?' : 'What do you want to unequip?';
    } else {
      // Context-aware: match with inventory or equipped items
      if (context) {
        const options = verb === 'equip' ? context.inventoryItems : context.equippedItems;
        const match = findBestMatch(target, options);
        command.target = match || target;
      } else {
        command.target = target;
      }
    }
  }

  return command;
}

// ----------------------------------------------------------------------------
// Compound Command Support
// ----------------------------------------------------------------------------

/**
 * Parse compound commands (e.g., "take sword and attack goblin")
 *
 * @param input - The raw command string
 * @param context - Optional context for parsing
 * @returns Array of parsed commands
 */
export function parseCompoundCommand(input: string, context?: CommandContext): ParsedCommand[] {
  // Split on "and", "then", or comma (with optional spaces)
  const parts = input.split(/\s*(?:and|then|,)\s+/i);

  // If only one part, just parse normally
  if (parts.length === 1) {
    return [parseCommand(input, context)];
  }

  // Parse each part as a separate command
  return parts.map((part) => parseCommand(part.trim(), context));
}

// ----------------------------------------------------------------------------
// Command Validation
// ----------------------------------------------------------------------------

/**
 * Validate a parsed command against context
 *
 * @param command - The parsed command
 * @param context - The command context
 * @returns Updated command with validation results
 */
export function validateCommand(command: ParsedCommand, context: CommandContext): ParsedCommand {
  // If already invalid, return as-is
  if (!command.valid) return command;

  // Validate movement commands
  if (command.type === 'movement' && command.direction) {
    const directionName = command.direction;
    if (!context.availableExits.includes(directionName)) {
      return {
        ...command,
        valid: false,
        error: `You can't go ${directionName} from here.`,
      };
    }
  }

  // Validate combat commands
  if (command.type === 'combat') {
    if (!context.visibleMonster) {
      return {
        ...command,
        valid: false,
        error: 'There is nothing to attack here.',
      };
    }
  }

  return command;
}

// ----------------------------------------------------------------------------
// Command History Management
// ----------------------------------------------------------------------------

export class CommandHistory {
  private history: string[] = [];
  private maxSize: number;
  private currentIndex: number = -1;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  /**
   * Add a command to history
   */
  add(command: string): void {
    // Don't add empty commands or duplicates
    if (!command.trim()) return;
    if (this.history.length > 0 && this.history[this.history.length - 1] === command) return;

    this.history.push(command);

    // Trim if exceeds max size
    if (this.history.length > this.maxSize) {
      this.history.shift();
    }

    // Reset navigation index
    this.currentIndex = this.history.length;
  }

  /**
   * Get previous command (for up arrow navigation)
   */
  getPrevious(): string | null {
    if (this.history.length === 0) return null;

    if (this.currentIndex > 0) {
      this.currentIndex--;
    }

    return this.history[this.currentIndex] || null;
  }

  /**
   * Get next command (for down arrow navigation)
   */
  getNext(): string | null {
    if (this.history.length === 0) return null;

    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }

    // At the end, return empty string
    this.currentIndex = this.history.length;
    return '';
  }

  /**
   * Reset navigation to end of history
   */
  resetNavigation(): void {
    this.currentIndex = this.history.length;
  }

  /**
   * Get all history
   */
  getAll(): string[] {
    return [...this.history];
  }

  /**
   * Clear history
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Get recent commands (last n)
   */
  getRecent(n: number = 10): string[] {
    return this.history.slice(-n);
  }
}

// ----------------------------------------------------------------------------
// Autocomplete Suggestions
// ----------------------------------------------------------------------------

/**
 * Get autocomplete suggestions based on partial input
 *
 * @param partial - Partial command input
 * @param context - Command context
 * @returns Array of suggested completions
 */
export function getAutocompleteSuggestions(partial: string, context?: CommandContext): string[] {
  const normalized = normalizeInput(partial);
  if (normalized.length === 0) return [];

  const suggestions: string[] = [];

  // Suggest verbs
  const verbKeys = Object.keys(VERB_SYNONYMS);
  const matchingVerbs = verbKeys.filter((v) => v.startsWith(normalized));
  suggestions.push(...matchingVerbs);

  // Suggest directions
  const directionKeys = Object.keys(DIRECTION_ALIASES);
  const matchingDirections = directionKeys.filter((d) => d.startsWith(normalized));
  suggestions.push(...matchingDirections);

  // Suggest context items
  if (context) {
    // Match visible items
    const matchingItems = context.visibleItems.filter((item) =>
      normalizeInput(item).includes(normalized),
    );
    suggestions.push(...matchingItems);

    // Match inventory items
    const matchingInventory = context.inventoryItems.filter((item) =>
      normalizeInput(item).includes(normalized),
    );
    suggestions.push(...matchingInventory);

    // Match features
    const matchingFeatures = context.visibleFeatures.filter((feature) =>
      normalizeInput(feature).includes(normalized),
    );
    suggestions.push(...matchingFeatures);

    // Match monster
    if (context.visibleMonster && normalizeInput(context.visibleMonster).includes(normalized)) {
      suggestions.push(context.visibleMonster);
    }
  }

  // Remove duplicates and limit to top 10
  return [...new Set(suggestions)].slice(0, 10);
}
