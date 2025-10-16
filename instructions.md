# **Bubbly Quest - Project Specification**

* **Project Name:** Bubbly Quest  
* **Version:** 1.0  
* **Date:** October 16, 2025  
* **Author:** Senpai & Gemini

## **1. Vision & Core Philosophy**

**Bubbly Quest** is a desktop application for creating and playing customizable, text-based adventure games. It is not just a single game, but a complete **engine** designed to be delightful and accessible.

The core philosophy is rooted in a **playful, toy-like user experience**. The application prioritizes a friendly, colorful, and highly animated interface to make interaction feel joyful and engaging. The architecture is designed to be modern, lightweight, and focused on a fun development experience.

## **2. Target Platform & Technology Stack**

### **2.1. Platform**

* **Target:** Windows Desktop only, enabled by the Tauri framework.

### **2.2. Technology Stack**

* **Core Framework:** **Tauri** (v2)
* **Frontend (Game Logic & UI):**
  * **Bundler:** Vite
  * **Language:** TypeScript
  * **UI Library:** React
  * **State Management:** Zustand
  * **Icons:** Phosphor React for a consistent icon set
  * **Styling:** CSS with CSS Custom Properties for a dynamic theming system.
  * **Fonts:** Google Fonts - Baloo 2 for body text and Rubik Mono One for titles (npm i @fontsource/baloo-2 @fontsource/rubik-mono-one)
  * **Animation:** Framer Motion for fluid, declarative animations
* **Backend (System Interface):**  
  * **Language:** **Rust**  
  * **Responsibilities:** Minimalist; strictly limited to system calls for file I/O. No game logic will be processed in Rust.

## **3. Application Architecture**

The project follows a **"JavaScript-first" architecture**. The vast majority of the application's logic, state management, and rendering is handled by the JavaScript/React frontend. The Rust backend acts as a thin, lightweight bridge to the operating system's file system.

### **3.0. State Management with Zustand**

The application will use Zustand for state management with the following store structure:

* **Game Store:** Manages the core game state including player stats, current location, inventory, and world state.
* **UI Store:** Handles UI-related state such as current theme, animation states, and menu visibility.
* **Adventure Store:** Manages the currently loaded adventure data (rooms, items, monsters).

Zustand was chosen for its simplicity, performance, and minimal boilerplate, allowing for clean separation of concerns without the complexity of more heavyweight solutions.

### **3.1. Frontend Responsibilities (JavaScript/TypeScript)**

* **Game Engine Logic:** Manages all rules of the game, including player movement, combat calculations, and inventory management.
* **State Management:** Uses Zustand to hold the complete, current state of the game session in memory (e.g., player stats, location, inventory).
* **Command Parser:** Implements a powerful, custom command parser that handles complex natural language inputs with synonyms, direction aliases, and context-aware actions.
* **Data Handling:** Parses and manages the adventure data (rooms.json, etc.) after requesting it from the Rust backend.
* **UI & Animations:** Renders all visual elements using React and applies all aesthetic styling and micro-animations via CSS and Framer Motion.

### **3.2. Backend Responsibilities (Rust)**

The Rust backend will expose a minimal set of Tauri commands to the frontend:

* read_file(path: String) -> Result<String, String>: Reads a file and returns its contents as a raw string.  
* write_file(path: String, content: String) -> Result<(), String>: Writes a string to a specified file path.  
* read_directory(path: String) -> Result<Vec<String>, String>: Returns a list of filenames within a given directory.

## **4. Feature Specification**

The project consists of two distinct applications: the **Game Player** and the **Adventure Editor**.

### **4.1. The Game Player ("Bubbly Quest")**

#### **4.1.1. User Interface & Experience**

* **Aesthetic:** The UI must be playful, friendly, and colorful, with a "toy box" feel. All elements will feature heavily rounded corners and a soft color palette.  
* **Micro-animations:** Animations are a core requirement. This includes:  
  * Bouncy, pressable buttons.  
  * Text that types out letter-by-letter or fades in gracefully.  
  * Wiggly/glowing hover effects on interactive elements.  
  * Smooth screen transitions.  
  * Reactive and animated player stat bars (HP, XP).  
* **Layout:** The main game screen will be divided into clear sections: a primary text view, a player status panel, an inventory panel, and a command input box.

#### **4.1.2. Theming System**

* The application must ship with a minimum of **10 themes**.  
* The user must be able to switch between themes freely and instantly from a settings menu.  
* Themes will be implemented using CSS Custom Properties attached to a data-theme attribute on the root React component.

#### **4.1.3. Gameplay & RPG Elements**

* **Command-based Interaction:** The player interacts with the world by typing commands. The custom parser will support:
  * Basic commands: "go north", "take potion", "attack goblin"
  * Direction aliases: "n", "north", "forward" all work for movement
  * Synonyms: "get", "take", "grab" for acquiring items
  * Compound commands: "take sword and attack goblin"
  * Context awareness: "attack" automatically targets the monster in the room
  * Inventory shortcuts: "i" or "inventory" to view items
* **Player Stats:** The player will have core RPG stats: HP (Health Points), XP (Experience Points), Level, Attack, and Defense.
* **Combat:** A simple, turn-based combat system will be initiated when the player enters a room with a hostile monster.
* **Leveling:** The player gains XP by defeating monsters. Upon reaching a certain XP threshold, the player will level up, increasing their stats.

#### **4.1.4. Save & Load System**

* The game must support **multiple save slots**.  
* Save files will be stored as individual JSON files (e.g., save_slot_1.json) within a saves directory.  
* The load menu will visually present the available save slots, showing metadata like Player Name, Level, and a timestamp.

### **4.2. The Adventure Editor ("Fabula Machina")**

* **UI Philosophy:** A simplified, form-based interface designed for efficiency. The "bubbly" aesthetic is secondary to functional clarity here.  
* **Functionality:**  
  * The editor will have three main tabs: **Rooms**, **Items**, and **Monsters**.  
  * Each tab will display a list of created entities and a form to edit the properties of the selected entity.  
  * Room exits will be defined by inputting the numerical ID of the destination room.  
  * The primary function is to **export** the entire adventure definition into the required rooms.json, items.json, and monsters.json files.

## **5. Data Structures (JSON Format)**

The engine will be driven by a unified Adventure data structure that consolidates all game entities into a single file format, optimized for the Rust backend file system integration while maintaining full compatibility with the TypeScript frontend.

### **5.1. Adventure Object Structure**

The Adventure object serves as a container for all game data, supporting multiple adventures within the game system.

```typescript
interface Adventure {
  // Adventure metadata
  metadata: {
    id: string;                    // Unique identifier (e.g., "caverns-of-doom")
    name: string;                  // Display name for the adventure
    description: string;           // Brief description of the adventure
    version: string;               // Version number (e.g., "1.0.0")
    author: string;                // Adventure creator
    difficulty: "easy" | "medium" | "hard" | "extreme";
    estimatedPlaytime: number;     // Estimated minutes to complete
    tags: string[];                // Tags for categorization (e.g., ["fantasy", "puzzle"])
    createdAt: string;             // ISO timestamp
    updatedAt: string;             // ISO timestamp
  };
  
  // Adventure configuration
  config: {
    startingRoomId: number;        // ID of the room where player begins
    maxLevel: number;              // Maximum level achievable
    startingLevel: number;         // Player's starting level
    startingInventory: number[];   // IDs of items player starts with
    victoryConditions: {           // Conditions for winning the adventure
      type: "collect_items" | "reach_room" | "defeat_monster" | "custom";
      target: number | string;     // Target ID or custom condition
      description: string;         // Human-readable victory description
    };
  };
  
  // Game entities
  entities: {
    rooms: Room[];
    items: Item[];
    monsters: Monster[];
  };
  
  // Adventure-specific state templates
  stateTemplate: {
    playerStateTemplate: Partial<PlayerState>;
    worldStateTemplate: Partial<WorldState>;
  };
}
```

### **5.2. Room Entity Structure**

```typescript
interface Room {
  id: number;                      // Unique identifier within the adventure
  name: string;                    // Room name displayed to player
  description: string;             // Detailed room description
  longDescription?: string;        // Extended description for first visit
  exits: {                         // Connections to other rooms
    [direction: string]: number | null;  // direction: roomId or null
  };
  items: number[];                 // Array of item IDs in this room
  monster?: number | null;         // Monster ID in this room (null if none)
  features?: {                     // Interactive features in the room
    [featureName: string]: {
      description: string;
      interactable: boolean;
      requiredItem?: number;       // Item needed to interact
      action?: string;             // Custom action script
    };
  };
  lighting?: "dark" | "dim" | "bright";  // Affects visibility
  atmosphere?: string;             // Mood/atmosphere description
  visited?: boolean;               // Track if player has visited (runtime state)
}
```

### **5.3. Item Entity Structure**

```typescript
interface Item {
  id: number;                      // Unique identifier within the adventure
  name: string;                    // Item name
  description: string;             // Item description
  type: "consumable" | "weapon" | "armor" | "key" | "treasure" | "misc";
  rarity: "common" | "uncommon" | "rare" | "legendary";
  value?: number;                  // Gold/value of the item
  
  // Type-specific properties
  consumable?: {
    effect: {
      heal?: number;               // HP restoration amount
      damage?: number;             // Damage when used as weapon
      temporaryBuff?: {            // Temporary stat boosts
        stat: "attack" | "defense";
        amount: number;
        duration: number;          // In turns/minutes
      };
    };
    uses?: number;                 // Number of uses (null for single-use)
  };
  
  weapon?: {
    damage: number;                // Base damage
    requiredLevel?: number;        // Minimum level to wield
    damageType?: "slashing" | "piercing" | "bludgeoning" | "magic";
  };
  
  armor?: {
    defense: number;               // Defense bonus
    requiredLevel?: number;        // Minimum level to wear
    slot: "head" | "chest" | "hands" | "feet";
  };
  
  key?: {
    doorId: number;                // ID of door/exit this key opens
    reusable: boolean;             // Whether key is consumed on use
  };
  
  treasure?: {
    value: number;                 // Gold value
    sellable: boolean;
  };
  
  // Common properties
  weight?: number;                 // Item weight (for inventory limits)
  stackable?: boolean;             // Can multiple be stacked
  maxStack?: number;               // Maximum stack size
  usable: boolean;                 // Can be used from inventory
  equippable?: boolean;            // Can be equipped
  icon?: string;                   // Icon identifier
}
```

### **5.4. Monster Entity Structure**

```typescript
interface Monster {
  id: number;                      // Unique identifier within the adventure
  name: string;                    // Monster name
  description: string;             // Monster description
  level: number;                   // Monster level
  hp: number;                      // Health points
  maxHp: number;                   // Maximum health points
  attack: number;                  // Base attack power
  defense: number;                 // Base defense
  xp: number;                      // Experience points awarded
  gold?: number;                   // Gold dropped (0 or null if none)
  
  // Combat behavior
  behavior: {
    aggression: "passive" | "neutral" | "aggressive";
    attackPattern: "basic" | "random" | "smart";
    specialAttack?: {
      name: string;
      damage: number;
      description: string;
      frequency: number;           // 1 in X chance
    };
    weaknesses?: string[];         // Item types or elements it's weak to
    immunities?: string[];         // Damage types it's immune to
  };
  
  // Rewards
  loot: {
    itemIds: number[];             // Items that can be dropped
    dropChances: {                 // Probability for each item
      [itemId: number]: number;    // itemId: percentage (0-100)
    };
    guaranteedItems?: number[];    // Items always dropped
  };
  
  // Appearance
  appearance?: {
    description: string;           // Detailed appearance description
    icon?: string;                 // Icon identifier
    sound?: string;                // Sound effect identifier
  };
  
  // Special properties
  respawnable?: boolean;           // Can monster respawn after defeat
  respawnTime?: number;            // Minutes until respawn
  boss?: boolean;                  // Whether this is a boss monster
}
```

### **5.5. Save Game Structure**

```typescript
interface SaveGame {
  // Save metadata
  metadata: {
    id: string;                    // Unique save identifier
    adventureId: string;           // ID of the adventure being played
    playerName: string;            // Player's chosen name
    saveTimestamp: string;         // ISO timestamp when saved
    playtime: number;              // Total playtime in minutes
    screenshot?: string;           // Base64 encoded screenshot
    version: string;               // Adventure version
  };
  
  // Player state
  playerState: {
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
      [slot: string]: number | null;  // slot: itemId or null
    };
    gold: number;
    stats: {
      roomsVisited: number;
      monstersDefeated: number;
      itemsCollected: number;
      deaths: number;
    };
  };
  
  // World state
  worldState: {
    defeatedMonsters: number[];    // IDs of defeated monsters
    takenItems: {                  // Items taken from rooms
      [roomId: number]: number[];  // roomId: [itemIds]
    };
    unlockedDoors: {               // Unlocked doors/exits
      [roomId: string]: string[];  // roomId: [directions]
    };
    solvedPuzzles: string[];       // IDs of solved puzzles
    triggeredEvents: string[];     // IDs of triggered events
    customState?: {                // Adventure-specific state
      [key: string]: any;
    };
  };
  
  // Game session state
  sessionState: {
    commandHistory: string[];      // Recent commands for undo/redo
    lastActions: GameAction[];     // Recent game actions
    currentObjective?: string;     // Current quest objective
    completedObjectives: string[]; // Completed objectives
  };
}

interface InventoryItem {
  id: number;
  quantity: number;
  durability?: number;             // Current durability (for equipment)
  customProperties?: {             // Item-specific properties
    [key: string]: any;
  };
}

interface GameAction {
  timestamp: string;
  type: "move" | "take" | "use" | "attack" | "talk" | "custom";
  details: {
    [key: string]: any;
  };
  result: string;                  // Text description of what happened
}
```

### **5.6. Adventure List Structure**

For managing multiple adventures:

```typescript
interface AdventureList {
  adventures: AdventureMetadata[];
  lastPlayed?: string;             // ID of last played adventure
  favorites: string[];             // IDs of favorite adventures
}

interface AdventureMetadata {
  id: string;
  name: string;
  description: string;
  author: string;
  difficulty: "easy" | "medium" | "hard" | "extreme";
  version: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  playtime?: number;               // Total playtime across all saves
  completed?: boolean;             // Whether player has completed
  lastPlayed?: string;             // Last played timestamp
}
```

### **5.7. File Organization**

```
adventures/
├── index.json                     # AdventureList (metadata for all adventures)
├── {adventure-id}/
│   ├── adventure.json             # Full Adventure object
│   └── saves/
│       ├── {save-id}.json         # Individual save games
│       └── autosave.json          # Auto-save slot
└── template/
    └── adventure-template.json    # Template for new adventures
```

This unified structure provides:
- **Consolidated data management** with all game entities in a single Adventure object
- **TypeScript compatibility** with full type definitions for the frontend
- **Rust backend optimization** with clear file structure for efficient I/O operations
- **State persistence** with comprehensive save game format
- **Multi-adventure support** with metadata management
- **Extensibility** with custom properties and state templates
- **Performance optimization** with structured data for efficient lookups

## **6. Out of Scope**

The following items are explicitly **not** part of this specification:

* Project Timelines or Deadlines  
* Performance Goals or Benchmarks  
* Security Considerations  
* Multiplayer or Network Functionality