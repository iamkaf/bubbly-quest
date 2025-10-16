// ============================================================================
// Bubbly Quest - Initialization Service
// ============================================================================
// Handles app initialization, directory setup, and first-run configuration

import type { AdventureList } from '@/types';
import {
  ensureDirectoryStructure,
  readAdventureList,
  writeAdventureList,
  writeAdventure,
  readAdventure,
} from './fileSystem';
import { starterAdventure } from '@/data/starterAdventure';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface InitializationResult {
  success: boolean;
  isFirstRun: boolean;
  adventureList: AdventureList | null;
  errors: string[];
}

// ----------------------------------------------------------------------------
// Initialization Logic
// ----------------------------------------------------------------------------

/**
 * Initializes the application on startup
 * - Creates directory structure if needed
 * - Writes starter adventure on first run
 * - Loads adventure list
 */
export async function initializeApp(): Promise<InitializationResult> {
  const errors: string[] = [];
  let isFirstRun = false;
  let adventureList: AdventureList | null = null;

  // Step 1: Ensure directory structure exists
  console.log('[Init] Ensuring directory structure...');
  const dirResult = await ensureDirectoryStructure();
  if (!dirResult.success) {
    errors.push(`Failed to create directories: ${dirResult.error.message}`);
    return {
      success: false,
      isFirstRun,
      adventureList: null,
      errors,
    };
  }

  // Step 2: Check if adventure list exists (determines first run)
  console.log('[Init] Checking for existing adventure list...');
  const listResult = await readAdventureList();

  if (!listResult.success) {
    errors.push(`Failed to read adventure list: ${listResult.error.message}`);
    return {
      success: false,
      isFirstRun,
      adventureList: null,
      errors,
    };
  }

  // Step 3: If no adventures exist, this is first run
  if (listResult.data.adventures.length === 0) {
    console.log('[Init] First run detected - setting up starter adventure...');
    isFirstRun = true;

    // Write starter adventure
    const writeResult = await writeAdventure(starterAdventure);
    if (!writeResult.success) {
      errors.push(`Failed to write starter adventure: ${writeResult.error.message}`);
      return {
        success: false,
        isFirstRun,
        adventureList: null,
        errors,
      };
    }

    // Verify it was written correctly
    const verifyResult = await readAdventure(starterAdventure.metadata.id);
    if (!verifyResult.success) {
      errors.push(`Failed to verify starter adventure: ${verifyResult.error.message}`);
      return {
        success: false,
        isFirstRun,
        adventureList: null,
        errors,
      };
    }

    // Create adventure list with starter adventure
    adventureList = {
      adventures: [starterAdventure.metadata],
      favorites: [],
    };

    // Write adventure list
    const writeListResult = await writeAdventureList(adventureList);
    if (!writeListResult.success) {
      errors.push(`Failed to write adventure list: ${writeListResult.error.message}`);
      return {
        success: false,
        isFirstRun,
        adventureList: null,
        errors,
      };
    }

    console.log('[Init] Starter adventure created successfully!');
  } else {
    console.log(`[Init] Found ${listResult.data.adventures.length} existing adventure(s)`);
    adventureList = listResult.data;
  }

  // Step 4: Success
  console.log('[Init] Initialization complete!');
  return {
    success: true,
    isFirstRun,
    adventureList,
    errors,
  };
}

/**
 * Validates the current installation
 * Checks that all adventures listed in index.json actually exist
 */
export async function validateInstallation(): Promise<{
  valid: boolean;
  missingAdventures: string[];
  errors: string[];
}> {
  const missingAdventures: string[] = [];
  const errors: string[] = [];

  // Read adventure list
  const listResult = await readAdventureList();
  if (!listResult.success) {
    errors.push(`Failed to read adventure list: ${listResult.error.message}`);
    return { valid: false, missingAdventures, errors };
  }

  // Check each adventure exists
  for (const metadata of listResult.data.adventures) {
    const adventureResult = await readAdventure(metadata.id);
    if (!adventureResult.success) {
      missingAdventures.push(metadata.id);
      errors.push(`Missing adventure: ${metadata.id} (${metadata.name})`);
    }
  }

  return {
    valid: missingAdventures.length === 0 && errors.length === 0,
    missingAdventures,
    errors,
  };
}

/**
 * Repairs the installation by removing invalid adventures from the list
 */
export async function repairInstallation(): Promise<{
  success: boolean;
  repairedCount: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let repairedCount = 0;

  // Validate first
  const validation = await validateInstallation();

  if (validation.valid) {
    return { success: true, repairedCount: 0, errors: [] };
  }

  // Read adventure list
  const listResult = await readAdventureList();
  if (!listResult.success) {
    errors.push(`Failed to read adventure list: ${listResult.error.message}`);
    return { success: false, repairedCount, errors };
  }

  // Filter out missing adventures
  const validAdventures = listResult.data.adventures.filter(
    (metadata) => !validation.missingAdventures.includes(metadata.id),
  );

  repairedCount = listResult.data.adventures.length - validAdventures.length;

  // Update adventure list
  const updatedList: AdventureList = {
    ...listResult.data,
    adventures: validAdventures,
  };

  const writeResult = await writeAdventureList(updatedList);
  if (!writeResult.success) {
    errors.push(`Failed to write repaired adventure list: ${writeResult.error.message}`);
    return { success: false, repairedCount, errors };
  }

  console.log(`[Repair] Removed ${repairedCount} invalid adventure(s) from index`);

  return { success: true, repairedCount, errors };
}
