# **⚡ C.H.A.R.G.E. — Full Technical Specification**

## **Complete Headless Adventure Role-Playing Game Engine**

### **1\. 🧭 Overview & Core Philosophy**

C.H.A.R.G.E. is a TypeScript-based, headless text adventure & dungeon crawler engine designed for maximum portability and testability. It is built to run in any JavaScript environment, including Node.js, the browser, or a native application wrapper like Tauri.

#### **Design Principles**

* **Headless-First**: All game logic is completely decoupled from any UI layer. The engine's core is a set of callable TypeScript modules.  
* **Modular & Pure**: Each subsystem (combat, world, items) is isolated in its own module, with clearly defined responsibilities and minimal side effects.  
* **Centralized, Reactive State**: All game state is held within a single Zustand store. Logic modules read from the store and dispatch actions to mutate it, creating a predictable, unidirectional data flow.  
* **Data-Driven**: Game content is defined within a single adventure.json file. The world is built on a coordinate-based grid (x, y), allowing the engine to easily support visual maps and fog of war in a consuming UI.

### **2\. 🏗️ Technology Stack & Project Structure**

* **Language**: TypeScript  
* **State Management**: Zustand  
* **Environment**: Node.js / Browser / Tauri

#### **Project Structure**

src/  
├─ charge/  
│  ├─ core/  
│  │  ├─ world.ts         \# Grid-based navigation and environment interaction  
│  │  ├─ items.ts         \# Item registry, effects, inventory actions  
│  │  ├─ combat.ts        \# Turn-based combat logic and enemy AI  
│  │  ├─ player.ts        \# Player stats, leveling, XP, and status  
│  │  ├─ parser.ts        \# Command interpreter (\[verb\] \[target\] format)  
│  │  ├─ loader.ts        \# Parses adventure.json and populates the store  
│  │  ├─ map.ts           \# Map discovery and rendering logic  
│  │  ├─ rest.ts          \# Rest/camp mechanic with ambush risk  
│  │  ├─ quest.ts         \# Quest management and progression  
│  │  ├─ dialogue.ts      \# Dialogue trees and NPC interaction  
│  │  └─ event.ts         \# "Show Runner" \- Global event and trigger processor  
│  ├─ meta/  
│  │  ├─ persistence.ts   \# Export/import game state as JSON  
│  │  └─ debug.ts         \# Developer/test commands  
│  ├─ types/  
│  │  ├─ entities.ts      \# Core interfaces for game objects  
│  │  ├─ adventure.ts     \# Interfaces for the adventure.json structure  
│  │  └─ state.ts         \# Zustand store and slice type definitions  
│  ├─ store/  
│  │  └─ gameStore.ts     \# Zustand store implementation  
│  └─ engine.ts          \# Main orchestrator (public API for C.H.A.R.G.E.)  
└─ index.ts               \# App entry — imports and uses the engine

### **3\. 🧩 State Management (gameStore.ts)**

#### **state.ts \- Type Definitions**

import type { Player, Enemy, Room, Item, NPC, Quest, DialogueTree, Coordinates, GameEvent } from './entities';  
import type { AdventureData } from './adventure';

// PlayerState, CombatState, QuestState would be defined here...

export interface WorldState {  
  world: {  
    rooms: Record\<string, Room\>;   
    items: Record\<string, Item\>;  
    enemies: Record\<string, Enemy\>;  
    npcs: Record\<string, NPC\>;  
    dialogue: Record\<string, DialogueTree\>;  
    currentRoomCoords: Coordinates;  
    discoveredRoomCoords: string\[\];  
  };  
}

export interface NarrativeState {  
    quests: Record\<string, Quest\>;  
    events: GameEvent\[\]; // Holds all global events from the adventure  
}

export interface MetaState {  
  adventureTitle: string;  
  mode: 'exploration' | 'combat' | 'dialogue' | 'menu';  
  log: string\[\];  
  globalFlags: Record\<string, any\>;  
  gameOver: 'win' | 'lose' | null; // New state to signal game end  
}

export interface GameStore extends PlayerState, WorldState, CombatState, NarrativeState, MetaState {  
  startNewAdventure: (adventure: AdventureData) \=\> void;  
  resumeAdventure: (stateJson: string, adventureData: AdventureData) \=\> void;  
  executeCommand: (input: string) \=\> void;  
  // ... other actions  
}

### **4\. 🧱 Core Entity Types (entities.ts & adventure.ts)**

// src/charge/types/entities.ts

// ... (other interfaces like Coordinates, Room, Item, etc.)

export type ActionType \= 'SET\_FLAG' | 'ADD\_LOG' | 'UPDATE\_QUEST' | 'MODIFY\_ROOM' | 'GAME\_OVER';

export interface Action {  
    type: ActionType;  
    \[key: string\]: any;   
    // Example for GAME\_OVER: { type: 'GAME\_OVER', status: 'win', message: 'You have saved the kingdom\!' }  
}

export interface GameEvent {  
    id: string;  
    conditions: Condition\[\];  
    actions: Action\[\];  
    hasFired?: boolean; // Optional: used internally by the engine  
}

// src/charge/types/adventure.ts

export interface AdventureMeta {  
    id: string;  
    title: string;  
    author: string;  
    version: string;  
    startCoords: Coordinates;  
    introText: string\[\];  
    resumeText: string;  
}

export interface AdventureData {  
    meta: AdventureMeta;  
    world: {  
        rooms: Room\[\];  
        items: Record\<string, Item\>;  
        enemies: Record\<string, Enemy\>;  
        npcs: Record\<string, NPC\>;  
    };  
    narrative: {  
        quests: Record\<string, Quest\>;  
        dialogue: Record\<string, DialogueTree\>;  
        events: GameEvent\[\];  
        globalFlags: Record\<string, any\>;  
    };  
}

### **5\. 📖 The adventure.json Specification**

#### **Top-Level Structure**

{  
  "meta": {  
    "id": "the-crystal-caves",  
    "title": "The Crystal Caves",  
    "author": "An Author",  
    "version": "1.0.0",  
    "startCoords": { "x": 0, "y": 0 },  
    "introText": \[  
      "The wind howls around you.",  
      "Before you stands the dark entrance to the Crystal Caves.",  
      "Your adventure begins."  
    \],  
    "resumeText": "Welcome back to {adventureTitle}. You are in {currentRoomName}."  
  },  
  "world": { "...": "..." },  
  "narrative": {  
      "quests": { "...": "..." },  
      "dialogue": { "...": "..." },  
      "events": \[  
          {  
              "id": "win\_game\_event",  
              "conditions": \[  
                  { "type": "FLAG\_IS", "flag": "final\_boss\_defeated", "value": true },  
                  { "type": "QUEST\_STATE\_IS", "questId": "main\_quest", "state": "completed" }  
              \],  
              "actions": \[  
                  { "type": "GAME\_OVER", "status": "win", "message": "With the final foe vanquished, peace returns to the land. You are victorious\!" }  
              \]  
          }  
      \],  
      "globalFlags": { "...": "..." }  
  }  
}

### **6\. ⚙️ Core Modules Highlights**

* **loader.ts**: Responsible for parsing the adventure.json and populating the Zustand store. It maps the rooms array to a coordinate-keyed record for efficient lookups.  
* **parser.ts**: Interprets player input (e.g., "go north", "talk merchant", "use potion") and calls the appropriate functions in other modules.  
* **event.ts ("The Show Runner")**: The core of the narrative engine. After every player command, it runs processEvents(), checking all defined events against the current game state. If an event's conditions are met, it executes the associated actions, including setting the gameOver state.

### **7\. 🚀 Engine Entrypoint (engine.ts)**

The public API for the C.H.A.R.G.E. library.

* **startNewAdventure(adventureData)**:  
  1. Fully resets the game state, setting gameOver: null.  
  2. Calls loader.loadAdventure(adventureData).  
  3. Adds each line from adventureData.meta.introText to the game log.  
  4. Calls event.processEvents() to fire any starting events.  
* **resumeAdventure(savedStateJson, adventureData)**:  
  1. Calls persistence.importState(savedStateJson) to load the saved progress.  
  2. Formats the resumeText template from adventureData.meta with current state values (e.g., adventure title, current room name).  
  3. Adds the formatted string to the game log.  
* **executeCommand(input)**:  
  1. Sends the input to the parser.  
  2. After the command logic is complete, calls event.processEvents() to check for any triggered narrative events.  
* **subscribe(callback)**: Allows the consuming UI to listen for state changes.  
* **getState()**: Returns a snapshot of the current state.  
* **exportState()**: Returns a JSON string of the current state for saving.

### **8\. 🔧 Technical Tooling & Deployment**

This section details the build system, testing framework, and publishing strategy.

#### **Build System & Bundling**

* **Bundler**: **Rolldown** will be used to compile and bundle the TypeScript source code.  
* **Output**: The build will generate a dist directory with both **ESM (ECMAScript Modules)** and **CJS (CommonJS)** bundles for maximum compatibility.

#### **Testing Framework**

* **Framework**: **Vitest** is the chosen testing framework for its speed and modern API.  
* **Strategy**: Unit tests will be co-located with source files to verify the logic of each module in isolation, using a mock Zustand store.

#### **Packaging & Publishing**

* **Package Manager**: **npm** will be used for dependency management and publishing.  
* **package.json**: Will be configured with "type": "module" and main, module, and exports fields to support both ESM and CJS environments correctly. It will also point to the generated TypeScript declaration files (.d.ts).  
* **Registry**: The package will be published to the public **npm registry**.