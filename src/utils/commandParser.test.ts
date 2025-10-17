// ============================================================================
// Bubbly Quest Command Parser Tests
// ============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  parseCommand,
  parseCompoundCommand,
  validateCommand,
  CommandHistory,
  getAutocompleteSuggestions,
} from './commandParser';
import type { CommandContext } from '@/types/commands';

// ----------------------------------------------------------------------------
// Test Fixtures
// ----------------------------------------------------------------------------

const mockContext: CommandContext = {
  currentRoomId: 1,
  availableExits: ['north', 'south', 'east'],
  visibleItems: ['health potion', 'iron sword', 'torch'],
  visibleMonster: 'goblin scout',
  visibleFeatures: ['ancient chest', 'mysterious door'],
  inventoryItems: ['torch', 'rusty key'],
  equippedItems: ['leather armor'],
  inCombat: false,
};

// ----------------------------------------------------------------------------
// Basic Command Recognition Tests
// ----------------------------------------------------------------------------

describe('Basic Command Recognition', () => {
  it('should parse empty input', () => {
    const result = parseCommand('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should parse "go north" command', () => {
    const result = parseCommand('go north');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('movement');
    expect(result.verb).toBe('go');
    expect(result.direction).toBe('north');
  });

  it('should parse "take sword" command', () => {
    const result = parseCommand('take sword');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('interaction');
    expect(result.verb).toBe('take');
    expect(result.target).toBe('sword');
  });

  it('should parse "attack goblin" command', () => {
    const result = parseCommand('attack goblin');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('combat');
    expect(result.verb).toBe('attack');
    expect(result.target).toBe('goblin');
  });

  it('should parse "look" command', () => {
    const result = parseCommand('look');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('information');
    expect(result.verb).toBe('look');
  });

  it('should parse "look at sword" command', () => {
    const result = parseCommand('look at sword');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('information');
    expect(result.verb).toBe('look');
    expect(result.target).toBe('sword');
  });

  it('should parse "use potion" command', () => {
    const result = parseCommand('use potion');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('interaction');
    expect(result.verb).toBe('use');
    expect(result.target).toBe('potion');
  });

  it('should parse "drop sword" command', () => {
    const result = parseCommand('drop sword');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('interaction');
    expect(result.verb).toBe('drop');
    expect(result.target).toBe('sword');
  });

  it('should parse "help" command', () => {
    const result = parseCommand('help');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('system');
    expect(result.verb).toBe('help');
  });

  it('should handle unknown commands', () => {
    const result = parseCommand('xyz123');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

// ----------------------------------------------------------------------------
// Synonym Support Tests
// ----------------------------------------------------------------------------

describe('Synonym Support', () => {
  it('should recognize "get" as synonym for "take"', () => {
    const result = parseCommand('get sword');
    expect(result.verb).toBe('take');
    expect(result.target).toBe('sword');
  });

  it('should recognize "grab" as synonym for "take"', () => {
    const result = parseCommand('grab potion');
    expect(result.verb).toBe('take');
    expect(result.target).toBe('potion');
  });

  it('should recognize "fight" as synonym for "attack"', () => {
    const result = parseCommand('fight goblin');
    expect(result.verb).toBe('attack');
    expect(result.target).toBe('goblin');
  });

  it('should recognize "examine" as synonym for "look"', () => {
    const result = parseCommand('examine chest');
    expect(result.verb).toBe('look');
    expect(result.target).toBe('chest');
  });

  it('should recognize "walk" as synonym for "go"', () => {
    const result = parseCommand('walk north');
    expect(result.verb).toBe('go');
    expect(result.direction).toBe('north');
  });
});

// ----------------------------------------------------------------------------
// Direction Aliases Tests
// ----------------------------------------------------------------------------

describe('Direction Aliases', () => {
  it('should recognize "n" as north', () => {
    const result = parseCommand('go n');
    expect(result.direction).toBe('north');
  });

  it('should recognize "s" as south', () => {
    const result = parseCommand('go s');
    expect(result.direction).toBe('south');
  });

  it('should recognize "e" as east', () => {
    const result = parseCommand('go e');
    expect(result.direction).toBe('east');
  });

  it('should recognize "w" as west', () => {
    const result = parseCommand('go w');
    expect(result.direction).toBe('west');
  });

  it('should recognize "ne" as northeast', () => {
    const result = parseCommand('go ne');
    expect(result.direction).toBe('northeast');
  });

  it('should recognize "nw" as northwest', () => {
    const result = parseCommand('go nw');
    expect(result.direction).toBe('northwest');
  });

  it('should recognize "se" as southeast', () => {
    const result = parseCommand('go se');
    expect(result.direction).toBe('southeast');
  });

  it('should recognize "sw" as southwest', () => {
    const result = parseCommand('go sw');
    expect(result.direction).toBe('southwest');
  });

  it('should recognize "u" as up', () => {
    const result = parseCommand('go u');
    expect(result.direction).toBe('up');
  });

  it('should recognize "d" as down', () => {
    const result = parseCommand('go d');
    expect(result.direction).toBe('down');
  });

  it('should handle implicit "go" for directions', () => {
    const result = parseCommand('north');
    expect(result.verb).toBe('go');
    expect(result.direction).toBe('north');
  });

  it('should handle implicit "go" with direction aliases', () => {
    const result = parseCommand('n');
    expect(result.verb).toBe('go');
    expect(result.direction).toBe('north');
  });
});

// ----------------------------------------------------------------------------
// Inventory Shortcuts Tests
// ----------------------------------------------------------------------------

describe('Inventory Shortcuts', () => {
  it('should recognize "i" shortcut', () => {
    const result = parseCommand('i');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('inventory');
    expect(result.verb).toBe('inventory');
  });

  it('should recognize "inv" shortcut', () => {
    const result = parseCommand('inv');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('inventory');
    expect(result.verb).toBe('inventory');
  });

  it('should recognize "inventory" command', () => {
    const result = parseCommand('inventory');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('inventory');
    expect(result.verb).toBe('inventory');
  });

  it('should recognize "stats" command', () => {
    const result = parseCommand('stats');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('information');
    expect(result.verb).toBe('stats');
  });
});

// ----------------------------------------------------------------------------
// Context-Aware Processing Tests
// ----------------------------------------------------------------------------

describe('Context-Aware Processing', () => {
  it('should auto-target visible monster when attacking without target', () => {
    const result = parseCommand('attack', mockContext);
    expect(result.valid).toBe(true);
    expect(result.target).toBe('goblin scout');
  });

  it('should match partial item names with visible items', () => {
    const result = parseCommand('take health', mockContext);
    expect(result.target).toBe('health potion');
  });

  it('should match partial item names in inventory', () => {
    const result = parseCommand('drop rusty', mockContext);
    expect(result.target).toBe('rusty key');
  });

  it('should match features when examining', () => {
    const result = parseCommand('look at ancient', mockContext);
    expect(result.target).toBe('ancient chest');
  });
});

// ----------------------------------------------------------------------------
// Compound Command Support Tests
// ----------------------------------------------------------------------------

describe('Compound Command Support', () => {
  it('should parse compound command with "and"', () => {
    const results = parseCompoundCommand('take sword and attack goblin');
    expect(results).toHaveLength(2);
    expect(results[0].verb).toBe('take');
    expect(results[0].target).toBe('sword');
    expect(results[1].verb).toBe('attack');
    expect(results[1].target).toBe('goblin');
  });

  it('should parse compound command with "then"', () => {
    const results = parseCompoundCommand('go north then look');
    expect(results).toHaveLength(2);
    expect(results[0].verb).toBe('go');
    expect(results[0].direction).toBe('north');
    expect(results[1].verb).toBe('look');
  });

  it('should parse compound command with comma', () => {
    const results = parseCompoundCommand('take potion, use potion');
    expect(results).toHaveLength(2);
    expect(results[0].verb).toBe('take');
    expect(results[0].target).toBe('potion');
    expect(results[1].verb).toBe('use');
    expect(results[1].target).toBe('potion');
  });

  it('should handle single command as compound command', () => {
    const results = parseCompoundCommand('go north');
    expect(results).toHaveLength(1);
    expect(results[0].verb).toBe('go');
  });
});

// ----------------------------------------------------------------------------
// Command Validation Tests
// ----------------------------------------------------------------------------

describe('Command Validation', () => {
  it('should validate movement to available exit', () => {
    const command = parseCommand('go north');
    const validated = validateCommand(command, mockContext);
    expect(validated.valid).toBe(true);
  });

  it('should invalidate movement to unavailable exit', () => {
    const command = parseCommand('go west');
    const validated = validateCommand(command, mockContext);
    expect(validated.valid).toBe(false);
    expect(validated.error).toContain("can't go west");
  });

  it('should validate attack when monster is present', () => {
    const command = parseCommand('attack', mockContext);
    const validated = validateCommand(command, mockContext);
    expect(validated.valid).toBe(true);
  });

  it('should invalidate attack when no monster present', () => {
    const contextNoMonster = { ...mockContext, visibleMonster: undefined };
    const command = parseCommand('attack', contextNoMonster);
    const validated = validateCommand(command, contextNoMonster);
    expect(validated.valid).toBe(false);
    expect(validated.error).toContain('attack');
  });
});

// ----------------------------------------------------------------------------
// Command History Tests
// ----------------------------------------------------------------------------

describe('Command History', () => {
  let history: CommandHistory;

  beforeEach(() => {
    history = new CommandHistory(10);
  });

  it('should add commands to history', () => {
    history.add('go north');
    history.add('take sword');
    expect(history.getAll()).toHaveLength(2);
  });

  it('should not add empty commands', () => {
    history.add('');
    history.add('   ');
    expect(history.getAll()).toHaveLength(0);
  });

  it('should not add duplicate consecutive commands', () => {
    history.add('go north');
    history.add('go north');
    expect(history.getAll()).toHaveLength(1);
  });

  it('should navigate backward through history', () => {
    history.add('go north');
    history.add('take sword');
    history.add('attack goblin');

    expect(history.getPrevious()).toBe('attack goblin');
    expect(history.getPrevious()).toBe('take sword');
    expect(history.getPrevious()).toBe('go north');
    expect(history.getPrevious()).toBe('go north'); // Should stay at first
  });

  it('should navigate forward through history', () => {
    history.add('go north');
    history.add('take sword');

    history.getPrevious(); // 'take sword'
    history.getPrevious(); // 'go north'

    expect(history.getNext()).toBe('take sword');
    expect(history.getNext()).toBe(''); // At end
  });

  it('should respect max size', () => {
    const smallHistory = new CommandHistory(3);
    smallHistory.add('command1');
    smallHistory.add('command2');
    smallHistory.add('command3');
    smallHistory.add('command4');

    expect(smallHistory.getAll()).toHaveLength(3);
    expect(smallHistory.getAll()[0]).toBe('command2');
  });

  it('should get recent commands', () => {
    history.add('cmd1');
    history.add('cmd2');
    history.add('cmd3');
    history.add('cmd4');

    const recent = history.getRecent(2);
    expect(recent).toHaveLength(2);
    expect(recent[0]).toBe('cmd3');
    expect(recent[1]).toBe('cmd4');
  });

  it('should clear history', () => {
    history.add('go north');
    history.add('take sword');
    history.clear();
    expect(history.getAll()).toHaveLength(0);
  });
});

// ----------------------------------------------------------------------------
// Autocomplete Tests
// ----------------------------------------------------------------------------

describe('Autocomplete Suggestions', () => {
  it('should suggest verbs', () => {
    const suggestions = getAutocompleteSuggestions('ta');
    expect(suggestions).toContain('take');
  });

  it('should suggest directions', () => {
    const suggestions = getAutocompleteSuggestions('nor');
    expect(suggestions).toContain('north');
  });

  it('should suggest visible items from context', () => {
    const suggestions = getAutocompleteSuggestions('health', mockContext);
    expect(suggestions).toContain('health potion');
  });

  it('should suggest inventory items from context', () => {
    const suggestions = getAutocompleteSuggestions('torch', mockContext);
    expect(suggestions).toContain('torch');
  });

  it('should return empty array for empty input', () => {
    const suggestions = getAutocompleteSuggestions('');
    expect(suggestions).toHaveLength(0);
  });

  it('should limit suggestions to 10', () => {
    const suggestions = getAutocompleteSuggestions('a'); // Many matches
    expect(suggestions.length).toBeLessThanOrEqual(10);
  });

  it('should remove duplicates', () => {
    const suggestions = getAutocompleteSuggestions('torch', mockContext);
    const uniqueSuggestions = new Set(suggestions);
    expect(suggestions.length).toBe(uniqueSuggestions.size);
  });
});

// ----------------------------------------------------------------------------
// Edge Cases and Special Scenarios Tests
// ----------------------------------------------------------------------------

describe('Edge Cases and Special Scenarios', () => {
  it('should handle extra whitespace', () => {
    const result = parseCommand('  go   north  ');
    expect(result.verb).toBe('go');
    expect(result.direction).toBe('north');
  });

  it('should handle mixed case', () => {
    const result = parseCommand('Go NoRtH');
    expect(result.verb).toBe('go');
    expect(result.direction).toBe('north');
  });

  it('should filter ignore words', () => {
    const result = parseCommand('go to the north');
    expect(result.direction).toBe('north');
  });

  it('should handle multi-word targets', () => {
    const result = parseCommand('take health potion');
    expect(result.target).toBe('health potion');
  });

  it('should handle equip command', () => {
    const result = parseCommand('equip iron sword');
    expect(result.valid).toBe(true);
    expect(result.verb).toBe('equip');
    expect(result.target).toBe('iron sword');
  });

  it('should handle unequip command', () => {
    const result = parseCommand('unequip leather armor');
    expect(result.valid).toBe(true);
    expect(result.verb).toBe('unequip');
    expect(result.target).toBe('leather armor');
  });

  it('should require target for take command', () => {
    const result = parseCommand('take');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should require direction for go command', () => {
    const result = parseCommand('go');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle "?" as help shortcut', () => {
    const result = parseCommand('?');
    expect(result.valid).toBe(true);
    expect(result.verb).toBe('help');
  });
});
