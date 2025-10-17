// ============================================================================
// Bubbly Quest - File System Service
// ============================================================================
// Wrapper for Tauri FS Plugin with validation and error handling

import {
  readTextFile,
  writeTextFile,
  readDir,
  exists,
  mkdir,
  BaseDirectory,
} from '@tauri-apps/plugin-fs';
import { info, warn, error } from '@tauri-apps/plugin-log';
import type { Adventure, AdventureList, SaveGame } from '@/types';
import { safeValidateAdventure, safeValidateAdventureList, safeValidateSaveGame } from '@/schemas';

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------

const ADVENTURES_DIR = 'adventures';
const SAVES_DIR = 'saves';
const TEMPLATE_DIR = 'template';
const INDEX_FILE = 'adventures/index.json';
const ADVENTURE_FILE = 'adventure.json';
const AUTOSAVE_FILE = 'autosave.json';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface FileSystemError {
  type: 'not_found' | 'validation' | 'parse' | 'write' | 'unknown';
  message: string;
  details?: unknown;
}

export type FileSystemResult<T> =
  | { success: true; data: T }
  | { success: false; error: FileSystemError };

// ----------------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------------

function createError(
  type: FileSystemError['type'],
  message: string,
  details?: unknown,
): FileSystemError {
  return { type, message, details };
}

function wrapResult<T>(data: T): FileSystemResult<T> {
  return { success: true, data };
}

function wrapError(error: FileSystemError): FileSystemResult<never> {
  return { success: false, error };
}

// ----------------------------------------------------------------------------
// Directory Management
// ----------------------------------------------------------------------------

/**
 * Ensures the directory structure exists, creating it if necessary
 */
export async function ensureDirectoryStructure(): Promise<FileSystemResult<void>> {
  try {
    info('Checking directory structure');

    // Check if adventures directory exists
    const adventuresExists = await exists(ADVENTURES_DIR, {
      baseDir: BaseDirectory.AppData,
    });

    if (!adventuresExists) {
      info('Creating adventures directory structure');
      // Create adventures directory
      await mkdir(ADVENTURES_DIR, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });

      // Create template directory
      await mkdir(`${ADVENTURES_DIR}/${TEMPLATE_DIR}`, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });

      info('Directory structure created successfully');
    } else {
      info('Directory structure already exists');
    }

    return wrapResult(undefined);
  } catch (err) {
    error(`Failed to create directory structure: ${err}`);
    return wrapError(createError('unknown', 'Failed to create directory structure', err));
  }
}

/**
 * Creates a directory for a new adventure
 */
export async function createAdventureDirectory(
  adventureId: string,
): Promise<FileSystemResult<void>> {
  try {
    const adventurePath = `${ADVENTURES_DIR}/${adventureId}`;
    info(`Creating adventure directory: ${adventureId}`);

    await mkdir(adventurePath, {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });

    await mkdir(`${adventurePath}/${SAVES_DIR}`, {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });

    info(`Adventure directory created successfully: ${adventureId}`);
    return wrapResult(undefined);
  } catch (err) {
    error(`Failed to create adventure directory: ${adventureId} - ${err}`);
    return wrapError(
      createError('unknown', `Failed to create adventure directory: ${adventureId}`, err),
    );
  }
}

// ----------------------------------------------------------------------------
// Adventure Operations
// ----------------------------------------------------------------------------

/**
 * Reads an adventure from the file system
 */
export async function readAdventure(adventureId: string): Promise<FileSystemResult<Adventure>> {
  try {
    const path = `${ADVENTURES_DIR}/${adventureId}/${ADVENTURE_FILE}`;
    info(`Reading adventure: ${adventureId}`);

    // Check if file exists
    const fileExists = await exists(path, {
      baseDir: BaseDirectory.AppData,
    });

    if (!fileExists) {
      warn(`Adventure not found: ${adventureId}`);
      return wrapError(createError('not_found', `Adventure not found: ${adventureId}`));
    }

    // Read file
    const content = await readTextFile(path, {
      baseDir: BaseDirectory.AppData,
    });

    // Parse JSON
    let data: unknown;
    try {
      data = JSON.parse(content);
    } catch (parseErr) {
      error(`Failed to parse adventure JSON: ${adventureId} - ${parseErr}`);
      return wrapError(
        createError('parse', `Failed to parse adventure JSON: ${adventureId}`, parseErr),
      );
    }

    // Validate with Zod
    const validation = safeValidateAdventure(data);
    if (!validation.success) {
      console.error(`[FileSystem] Adventure validation failed for ${adventureId}:`);
      console.error(validation.error.format());
      error(
        `Adventure validation failed: ${adventureId} - ${validation.error.issues.map((i) => i.message).join(', ')}`,
      );
      return wrapError(
        createError('validation', `Adventure validation failed: ${adventureId}`, validation.error),
      );
    }

    info(`Adventure read successfully: ${adventureId}`);
    return wrapResult(validation.data);
  } catch (err) {
    error(`Failed to read adventure: ${adventureId} - ${err}`);
    return wrapError(createError('unknown', `Failed to read adventure: ${adventureId}`, err));
  }
}

/**
 * Writes an adventure to the file system
 */
export async function writeAdventure(adventure: Adventure): Promise<FileSystemResult<void>> {
  try {
    // Validate before writing
    const validation = safeValidateAdventure(adventure);
    if (!validation.success) {
      console.error('[FileSystem] Adventure validation failed before write:');
      console.error(validation.error.format());
      error(
        `Adventure validation failed before write - ${validation.error.issues.map((i) => i.message).join(', ')}`,
      );
      return wrapError(
        createError('validation', 'Adventure validation failed before write', validation.error),
      );
    }

    const adventureId = adventure.metadata.id;
    const path = `${ADVENTURES_DIR}/${adventureId}/${ADVENTURE_FILE}`;
    info(`Writing adventure: ${adventureId}`);

    // Ensure directory exists
    const dirResult = await createAdventureDirectory(adventureId);
    if (!dirResult.success) {
      return dirResult;
    }

    // Write file
    await writeTextFile(path, JSON.stringify(adventure, null, 2), {
      baseDir: BaseDirectory.AppData,
    });

    info(`Adventure written successfully: ${adventureId}`);
    return wrapResult(undefined);
  } catch (err) {
    error(`Failed to write adventure: ${adventure.metadata.id} - ${err}`);
    return wrapError(
      createError('write', `Failed to write adventure: ${adventure.metadata.id}`, err),
    );
  }
}

/**
 * Lists all adventures by reading the directory
 */
export async function listAdventures(): Promise<FileSystemResult<string[]>> {
  try {
    const dirExists = await exists(ADVENTURES_DIR, {
      baseDir: BaseDirectory.AppData,
    });

    if (!dirExists) {
      return wrapResult([]);
    }

    const entries = await readDir(ADVENTURES_DIR, {
      baseDir: BaseDirectory.AppData,
    });

    // Filter for directories only, exclude template
    const adventureIds = entries
      .filter((entry) => entry.isDirectory && entry.name !== TEMPLATE_DIR)
      .map((entry) => entry.name);

    return wrapResult(adventureIds);
  } catch (err) {
    return wrapError(createError('unknown', 'Failed to list adventures', err));
  }
}

// ----------------------------------------------------------------------------
// Adventure List (Index) Operations
// ----------------------------------------------------------------------------

/**
 * Reads the adventure index file
 */
export async function readAdventureList(): Promise<FileSystemResult<AdventureList>> {
  try {
    const fileExists = await exists(INDEX_FILE, {
      baseDir: BaseDirectory.AppData,
    });

    if (!fileExists) {
      // Return empty list if index doesn't exist
      return wrapResult({
        adventures: [],
        favorites: [],
      });
    }

    const content = await readTextFile(INDEX_FILE, {
      baseDir: BaseDirectory.AppData,
    });

    let data: unknown;
    try {
      data = JSON.parse(content);
    } catch (parseErr) {
      return wrapError(createError('parse', 'Failed to parse adventure list JSON', parseErr));
    }

    const validation = safeValidateAdventureList(data);
    if (!validation.success) {
      console.error('[FileSystem] Adventure list validation failed:');
      console.error(validation.error.format());
      return wrapError(
        createError('validation', 'Adventure list validation failed', validation.error),
      );
    }

    return wrapResult(validation.data);
  } catch (err) {
    return wrapError(createError('unknown', 'Failed to read adventure list', err));
  }
}

/**
 * Writes the adventure index file
 */
export async function writeAdventureList(list: AdventureList): Promise<FileSystemResult<void>> {
  try {
    const validation = safeValidateAdventureList(list);
    if (!validation.success) {
      console.error('[FileSystem] Adventure list validation failed before write:');
      console.error(validation.error.format());
      return wrapError(
        createError(
          'validation',
          'Adventure list validation failed before write',
          validation.error,
        ),
      );
    }

    await writeTextFile(INDEX_FILE, JSON.stringify(list, null, 2), {
      baseDir: BaseDirectory.AppData,
    });

    return wrapResult(undefined);
  } catch (err) {
    return wrapError(createError('write', 'Failed to write adventure list', err));
  }
}

// ----------------------------------------------------------------------------
// Save Game Operations
// ----------------------------------------------------------------------------

/**
 * Reads a save game file
 */
export async function readSaveGame(
  adventureId: string,
  saveId: string,
): Promise<FileSystemResult<SaveGame>> {
  try {
    const path = `${ADVENTURES_DIR}/${adventureId}/${SAVES_DIR}/${saveId}.json`;

    const fileExists = await exists(path, {
      baseDir: BaseDirectory.AppData,
    });

    if (!fileExists) {
      return wrapError(createError('not_found', `Save game not found: ${adventureId}/${saveId}`));
    }

    const content = await readTextFile(path, {
      baseDir: BaseDirectory.AppData,
    });

    let data: unknown;
    try {
      data = JSON.parse(content);
    } catch (parseErr) {
      return wrapError(createError('parse', `Failed to parse save game JSON: ${saveId}`, parseErr));
    }

    const validation = safeValidateSaveGame(data);
    if (!validation.success) {
      console.error(`[FileSystem] Save game validation failed for ${saveId}:`);
      console.error(validation.error.format());
      return wrapError(
        createError('validation', `Save game validation failed: ${saveId}`, validation.error),
      );
    }

    return wrapResult(validation.data);
  } catch (err) {
    return wrapError(createError('unknown', `Failed to read save game: ${saveId}`, err));
  }
}

/**
 * Writes a save game file
 */
export async function writeSaveGame(
  adventureId: string,
  saveGame: SaveGame,
): Promise<FileSystemResult<void>> {
  try {
    const validation = safeValidateSaveGame(saveGame);
    if (!validation.success) {
      console.error('[FileSystem] Save game validation failed before write:');
      console.error(validation.error.format());
      return wrapError(
        createError('validation', 'Save game validation failed before write', validation.error),
      );
    }

    const saveId = saveGame.metadata.id;
    const path = `${ADVENTURES_DIR}/${adventureId}/${SAVES_DIR}/${saveId}.json`;

    // Ensure saves directory exists
    const savesDir = `${ADVENTURES_DIR}/${adventureId}/${SAVES_DIR}`;
    const dirExists = await exists(savesDir, {
      baseDir: BaseDirectory.AppData,
    });

    if (!dirExists) {
      await mkdir(savesDir, {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });
    }

    await writeTextFile(path, JSON.stringify(saveGame, null, 2), {
      baseDir: BaseDirectory.AppData,
    });

    return wrapResult(undefined);
  } catch (err) {
    return wrapError(
      createError('write', `Failed to write save game: ${saveGame.metadata.id}`, err),
    );
  }
}

/**
 * Writes an autosave file
 */
export async function writeAutosave(
  adventureId: string,
  saveGame: SaveGame,
): Promise<FileSystemResult<void>> {
  try {
    const validation = safeValidateSaveGame(saveGame);
    if (!validation.success) {
      console.error('[FileSystem] Autosave validation failed before write:');
      console.error(validation.error.format());
      return wrapError(
        createError('validation', 'Autosave validation failed before write', validation.error),
      );
    }

    const path = `${ADVENTURES_DIR}/${adventureId}/${SAVES_DIR}/${AUTOSAVE_FILE}`;

    await writeTextFile(path, JSON.stringify(saveGame, null, 2), {
      baseDir: BaseDirectory.AppData,
    });

    return wrapResult(undefined);
  } catch (err) {
    return wrapError(createError('write', 'Failed to write autosave', err));
  }
}

/**
 * Lists all save games for an adventure
 */
export async function listSaveGames(adventureId: string): Promise<FileSystemResult<string[]>> {
  try {
    const savesPath = `${ADVENTURES_DIR}/${adventureId}/${SAVES_DIR}`;

    const dirExists = await exists(savesPath, {
      baseDir: BaseDirectory.AppData,
    });

    if (!dirExists) {
      return wrapResult([]);
    }

    const entries = await readDir(savesPath, {
      baseDir: BaseDirectory.AppData,
    });

    // Filter for JSON files, exclude autosave
    const saveIds = entries
      .filter(
        (entry) => entry.isFile && entry.name.endsWith('.json') && entry.name !== AUTOSAVE_FILE,
      )
      .map((entry) => entry.name.replace('.json', ''));

    return wrapResult(saveIds);
  } catch (err) {
    return wrapError(createError('unknown', `Failed to list save games for ${adventureId}`, err));
  }
}
