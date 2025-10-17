# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bubbly Quest** is a desktop text-based adventure game engine built with Tauri, React, and TypeScript. It follows a "JavaScript-first" architecture where the frontend handles all game logic, and Rust is used minimally for file system operations only.

The project includes two applications:
- **Game Player**: Text-based RPG with command-based interaction, combat, inventory, and save systems
- **Adventure Editor** ("Fabula Machina"): Tool for creating custom adventures

## Development Commands

### Essential Commands
```bash
npm run dev              # Start Tauri dev mode with hot reload (Vite on port 1420)
npm run build            # Build TypeScript and create production bundle
npm run tauri dev        # Alias for npm run dev (starts Tauri development)
npm run tauri build      # Build production Tauri application for Windows

npm run lint             # Run ESLint with max 0 warnings
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format TS/TSX/CSS/MD with Prettier + Rust with cargo fmt
npm run test             # Run tests (currently placeholder)
npm run check            # Full check: lint + format + tsc + cargo check + test
```

### Running Individual Checks
```bash
npx tsc --noEmit         # TypeScript type checking (no emit)
cargo check              # Check Rust code (in src-tauri/)
cd src-tauri && cargo fmt    # Format Rust code
cd src-tauri && cargo build # Build Rust backend
```

## Architecture

### State Management (Zustand)

Three separate stores manage application state:
- **Game Store**: Player stats, current location, inventory, world state
- **UI Store**: Theme, animation states, menu visibility
- **Adventure Store**: Currently loaded adventure data (rooms, items, monsters)

Stores are defined in `src/stores/` and exported via `src/stores/index.ts`.

### Frontend Responsibilities (TypeScript/React)
- All game engine logic (movement, combat, inventory)
- Command parser with natural language support, synonyms, and compound commands
- State management with Zustand
- File system operations via Tauri FS plugin
- Data parsing and management (adventures, saves)
- UI rendering with React and animations via Framer Motion

### Backend Responsibilities (Rust)
Uses the **Tauri File System Plugin** (`@tauri-apps/plugin-fs`) for all file operations:
- No custom Rust commands needed - the plugin handles all file I/O
- File operations are called directly from TypeScript using the plugin's JavaScript API
- Common operations: `readTextFile()`, `writeTextFile()`, `create()`, `readDir()`, `exists()`
- Uses `BaseDirectory` enum for safe, scoped file access (e.g., `BaseDirectory.AppData`)
- Prevents path traversal attacks and provides configurable permissions

**No game logic in Rust** - all logic stays in JavaScript/TypeScript.

**Example usage:**
```typescript
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

// Read adventure file
const adventure = await readTextFile('adventures/my-adventure/adventure.json', {
  baseDir: BaseDirectory.AppData
});

// Write save game
await writeTextFile('saves/slot1.json', JSON.stringify(saveData), {
  baseDir: BaseDirectory.AppData
});
```

### Logging System

The application includes a comprehensive logging system that captures events from both Rust and JavaScript:

**Configuration:**
- Rust backend uses `tauri-plugin-log` with three targets:
  - **LogDir**: Saves logs to `bubbly_quest.log` in the app's Local AppData directory
  - **Stdout**: Console output for development
  - **Webview**: Browser developer console
- Frontend uses `@tauri-apps/plugin-log` with `attachConsole()` to capture all console statements

**Log File Location:**
- Windows: `C:\Users\joaqu\AppData\Local\com.iamkaf.bubbly-quest\logs\bubbly_quest.log`
- macOS: `~/Library/Logs/com.iamkaf.bubbly-quest/bubbly_quest.log`
- Linux: `~/.local/share/com.iamkaf.bubbly-quest/logs/bubbly_quest.log`

**Usage Examples:**
```typescript
// Frontend logging
import { info, warn, error } from '@tauri-apps/plugin-log';

info('Player entered new room');
warn('Low health warning');
error('Failed to save game');

// Rust logging
use log::{info, warn, error};

info!("Application started");
warn!("Deprecated feature used");
error!("Failed to read file");
```

### TypeScript Path Aliases
```typescript
"@/*"           -> "src/*"
"@/components/*" -> "src/components/*"
"@/stores/*"     -> "src/stores/*"
"@/styles/*"     -> "src/styles/*"
"@/types/*"      -> "src/types/*"
"@/utils/*"      -> "src/utils/*"
```

Configured in both `tsconfig.json` and `vite.config.ts`.

## Data Structures

All game data uses a unified Adventure structure defined in TypeScript interfaces:

### Adventure Object
Contains metadata, config, and all game entities (rooms, items, monsters) in a single consolidated structure. See `instructions.md` for complete type definitions.

### File Organization
```
adventures/
├── index.json                      # AdventureList metadata
├── {adventure-id}/
│   ├── adventure.json              # Full Adventure object
│   └── saves/
│       ├── {save-id}.json          # Save games
│       └── autosave.json           # Auto-save slot
└── template/
    └── adventure-template.json     # New adventure template
```

### Key Entity Structures
- **Room**: id, name, description, exits (direction -> roomId), items, monster, features, lighting
- **Item**: id, name, type (consumable/weapon/armor/key/treasure), rarity, type-specific properties
- **Monster**: id, name, level, hp, attack, defense, behavior, loot, special attacks
- **SaveGame**: metadata, playerState, worldState, sessionState with command history

## UI & Styling

### Theme System
- Implemented with CSS Custom Properties via `data-theme` attribute
- 10+ themes required (5 light, 5 dark)
- Defined in `src/styles/themes.css`
- Fonts: Baloo 2 (body), Rubik Mono One (titles)
- CSS variables: `--bg-primary`, `--text-primary`, `--accent-primary`, etc.

### Design Philosophy
- Playful, toy-like aesthetic with heavily rounded corners
- Micro-animations are core to UX (bouncy buttons, text typing, wiggle/glow effects)
- Framer Motion for all animations
- Phosphor React for consistent iconography

## Command Parser
The parser supports:
- Basic commands: "go north", "take potion", "attack goblin"
- Direction aliases: "n", "north", "forward"
- Synonyms: "get"/"take"/"grab"
- Compound commands: "take sword and attack goblin"
- Context awareness: "attack" auto-targets monster in room
- Shortcuts: "i" for inventory

## Development Notes

- **Platform**: Windows desktop only
- **Bundler**: Vite (port 1420 for dev server)
- **Strict TypeScript**: Enabled with no unused locals/parameters
- **Linting**: ESLint with React, TypeScript, and Prettier integration
- **Code Style**: Prettier with 100 char width, 2 spaces, single quotes

## Project Status

Currently in **Phase 2** (Core Architecture & State Management) - Complete Zustand store architecture, routing, theme system with 8 themes, and base UI components. See `TODO.md` for the complete 10-phase implementation plan.

Next phase: Data structures & file system integration with Tauri FS plugin (Phase 3).

## Testing & Validation

- **Dev Server**: User manages the dev server manually - do not start, stop, or interact with it
- **Browser Testing**: Never use Playwright or browser automation tools - this is a Tauri desktop application, not a web app
- **Validation Commands**:
  - React/TypeScript validation: `npx tsc --noEmit`
  - Rust/Tauri validation: `cargo check` (run from src-tauri/ directory)