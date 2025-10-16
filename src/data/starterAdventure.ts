// ============================================================================
// Bubbly Quest - Starter Adventure: The Crystal Caverns
// ============================================================================

import type { Adventure } from '@/types';

export const starterAdventure: Adventure = {
  metadata: {
    id: 'the-crystal-caverns',
    name: 'The Crystal Caverns',
    description:
      'A mysterious cave system filled with glowing crystals and ancient treasures. Perfect for beginner adventurers!',
    version: '1.0.0',
    author: 'Bubbly Quest Team',
    difficulty: 'easy',
    estimatedPlaytime: 20,
    tags: ['fantasy', 'beginner', 'combat', 'exploration'],
    createdAt: new Date('2025-10-16').toISOString(),
    updatedAt: new Date('2025-10-16').toISOString(),
  },

  config: {
    startingRoomId: 0,
    maxLevel: 5,
    startingLevel: 1,
    startingInventory: [0], // Start with torch
    victoryConditions: {
      type: 'defeat_monster',
      target: 2, // Crystal Guardian (boss)
      description: 'Defeat the Crystal Guardian to complete the adventure!',
    },
  },

  entities: {
    // ========================================================================
    // ITEMS
    // ========================================================================
    items: [
      {
        id: 0,
        name: 'Torch',
        description: 'A sturdy wooden torch that illuminates dark passages.',
        type: 'misc',
        rarity: 'common',
        usable: false,
        icon: 'flame',
      },
      {
        id: 1,
        name: 'Health Potion',
        description: 'A small vial of red liquid that restores 30 HP.',
        type: 'consumable',
        rarity: 'common',
        value: 15,
        consumable: {
          effect: {
            heal: 30,
          },
          uses: 1,
        },
        usable: true,
        stackable: true,
        maxStack: 5,
      },
      {
        id: 2,
        name: 'Iron Sword',
        description: 'A well-balanced iron sword. A reliable weapon for any adventurer.',
        type: 'weapon',
        rarity: 'common',
        value: 50,
        weapon: {
          damage: 10,
          damageType: 'slashing',
        },
        usable: false,
        equippable: true,
        weight: 5,
      },
      {
        id: 3,
        name: 'Leather Armor',
        description: 'Light but sturdy armor made from cured leather.',
        type: 'armor',
        rarity: 'common',
        value: 40,
        armor: {
          defense: 5,
          slot: 'chest',
        },
        usable: false,
        equippable: true,
        weight: 8,
      },
      {
        id: 4,
        name: 'Crystal Key',
        description: 'A shimmering key made of pure crystal. It glows with an inner light.',
        type: 'key',
        rarity: 'rare',
        key: {
          doorId: 4, // Opens exit from treasure room
          reusable: true,
        },
        usable: true,
        icon: 'key',
      },
      {
        id: 5,
        name: 'Ancient Gold Coins',
        description: 'A small pouch filled with ancient gold coins.',
        type: 'treasure',
        rarity: 'uncommon',
        value: 100,
        treasure: {
          value: 100,
          sellable: true,
        },
        usable: false,
        stackable: true,
      },
      {
        id: 6,
        name: 'Mega Health Potion',
        description: 'A large vial of sparkling red liquid that fully restores HP.',
        type: 'consumable',
        rarity: 'rare',
        value: 50,
        consumable: {
          effect: {
            heal: 100,
          },
          uses: 1,
        },
        usable: true,
        stackable: true,
        maxStack: 3,
      },
      {
        id: 7,
        name: 'Crystal Shard',
        description: 'A sharp fragment of enchanted crystal. It hums with magical energy.',
        type: 'weapon',
        rarity: 'rare',
        value: 150,
        weapon: {
          damage: 20,
          damageType: 'magic',
        },
        usable: false,
        equippable: true,
        weight: 2,
      },
    ],

    // ========================================================================
    // MONSTERS
    // ========================================================================
    monsters: [
      {
        id: 0,
        name: 'Goblin Scout',
        description: 'A small, green-skinned creature with sharp teeth and a crude spear.',
        level: 1,
        hp: 25,
        maxHp: 25,
        attack: 5,
        defense: 2,
        xp: 15,
        gold: 5,
        behavior: {
          aggression: 'aggressive',
          attackPattern: 'basic',
        },
        loot: {
          itemIds: [1], // Health Potion
          dropChances: {
            1: 50, // 50% chance to drop health potion
          },
        },
        appearance: {
          description: 'The goblin wields a rusty spear and eyes you hungrily.',
        },
      },
      {
        id: 1,
        name: 'Cave Bat',
        description: 'A large bat with leathery wings and glowing red eyes.',
        level: 2,
        hp: 20,
        maxHp: 20,
        attack: 7,
        defense: 1,
        xp: 20,
        gold: 3,
        behavior: {
          aggression: 'neutral',
          attackPattern: 'random',
          weaknesses: ['fire'],
        },
        loot: {
          itemIds: [1],
          dropChances: {
            1: 30,
          },
        },
        appearance: {
          description: 'The bat hangs from the ceiling, screeching at your presence.',
        },
      },
      {
        id: 2,
        name: 'Crystal Guardian',
        description:
          'A massive golem made of glowing crystal shards. Its eyes burn with an ancient power.',
        level: 5,
        hp: 100,
        maxHp: 100,
        attack: 15,
        defense: 10,
        xp: 100,
        gold: 50,
        behavior: {
          aggression: 'aggressive',
          attackPattern: 'smart',
          specialAttack: {
            name: 'Crystal Barrage',
            damage: 25,
            description: 'The guardian launches a storm of razor-sharp crystal shards!',
            frequency: 3, // 1 in 3 chance
          },
          immunities: ['magic'],
        },
        loot: {
          itemIds: [4, 5, 6, 7], // Crystal Key, Gold, Mega Potion, Crystal Shard
          dropChances: {
            5: 100, // Always drops gold
            6: 75, // 75% mega potion
            7: 50, // 50% crystal shard
          },
          guaranteedItems: [4], // Always drops Crystal Key
        },
        appearance: {
          description:
            'The Crystal Guardian towers above you, its body pulsing with ethereal light.',
        },
        boss: true,
      },
    ],

    // ========================================================================
    // ROOMS
    // ========================================================================
    rooms: [
      {
        id: 0,
        name: 'Cavern Entrance',
        description:
          'You stand at the mouth of a cave. Cool air flows from within, carrying the scent of minerals and mystery. Glowing crystals on the walls provide a soft blue light.',
        longDescription:
          'The entrance to the Crystal Caverns yawns before you like a great mouth. Stalactites hang from above like stone teeth, and a faint humming sound echoes from deep within. The walls are studded with small, glowing crystals that pulse with a gentle rhythm, as if the cave itself is breathing. To the north, a passage leads deeper into darkness. To the east, you see a faint shimmer of brighter light.',
        exits: {
          north: 1,
          east: 2,
          south: null,
          west: null,
        },
        items: [1], // Health Potion
        features: {
          crystals: {
            description: 'Small glowing crystals embedded in the cave walls.',
            interactable: false,
          },
        },
        lighting: 'dim',
        atmosphere: 'The air is cool and slightly damp.',
      },
      {
        id: 1,
        name: 'Dark Passage',
        description:
          'A narrow, winding passage stretches before you. Without your torch, this would be pitch black. Strange sounds echo from somewhere ahead.',
        longDescription:
          'The passage twists and turns, forcing you to move carefully. Your torch casts dancing shadows on the rough stone walls. The ceiling is low here, and you can hear the drip-drip-drip of water somewhere in the darkness. Occasionally, you hear the flutter of wings and high-pitched squeaking.',
        exits: {
          north: 3,
          south: 0,
          east: null,
          west: null,
        },
        items: [],
        monster: 1, // Cave Bat
        features: {
          water: {
            description: 'Small puddles of crystal-clear water dot the floor.',
            interactable: false,
          },
        },
        lighting: 'dark',
        atmosphere: 'The darkness feels oppressive, and strange sounds echo all around.',
      },
      {
        id: 2,
        name: 'Crystal Chamber',
        description:
          'A breathtaking chamber filled with massive glowing crystals. They cast a prismatic light that dances across every surface.',
        longDescription:
          'You step into a natural cathedral of stone and crystal. Enormous crystals, some as tall as trees, rise from the floor and hang from the ceiling. They glow with an inner light that shifts through all the colors of the rainbow. The air here feels charged with energy, making your skin tingle. The beauty is almost overwhelming.',
        exits: {
          west: 0,
          north: 3,
          east: null,
          south: null,
        },
        items: [2, 3], // Iron Sword, Leather Armor
        features: {
          'large-crystal': {
            description:
              'A massive crystal in the center of the room pulses with an especially bright light.',
            interactable: true,
            action: 'The crystal hums when you touch it, filling you with warmth and energy.',
          },
        },
        lighting: 'bright',
        atmosphere: 'The air sparkles with magical energy.',
      },
      {
        id: 3,
        name: 'Treasure Room',
        description:
          'An ancient treasure chamber! Gold coins and precious items are scattered across the floor, but a massive crystal guardian blocks the exit.',
        longDescription:
          "You've found it - a hidden treasure room from a long-lost civilization. Ancient chests lie open, their contents spilled across the stone floor. Gold coins glint in the crystal light, and magical artifacts pulse with power. But your excitement is quickly tempered by the sight of an enormous crystal golem standing before the northern exit. Its faceted eyes fix upon you, and it begins to move...",
        exits: {
          south: 2,
          west: 1,
          north: 4, // Locked until guardian defeated
          east: null,
        },
        items: [5], // Ancient Gold Coins
        monster: 2, // Crystal Guardian (boss)
        features: {
          'ancient-chest': {
            description: 'An ornate chest made of dark wood and gold inlay.',
            interactable: true,
            requiredItem: 4, // Crystal Key (obtained from defeating guardian)
            action: 'The chest opens with a satisfying click, revealing treasures within!',
          },
        },
        lighting: 'bright',
        atmosphere: 'Ancient power fills this chamber, both wonderful and terrible.',
      },
      {
        id: 4,
        name: 'Victory Chamber',
        description:
          'Beyond the guardian lies the heart of the caverns - a chamber of pure, radiant crystal.',
        longDescription:
          'You step into a chamber of impossible beauty. The walls, floor, and ceiling are made of a single, enormous crystal that glows with pure white light. At the center stands a pedestal holding an ancient tome - the legendary Crystal Codex. You have conquered the Crystal Caverns!',
        exits: {
          south: 3,
          north: null,
          east: null,
          west: null,
        },
        items: [6, 7], // Mega Health Potion, Crystal Shard
        features: {
          pedestal: {
            description: 'A crystal pedestal holding an ancient book that glows softly.',
            interactable: true,
            action:
              'You reverently take the Crystal Codex. Its pages shimmer with ancient knowledge.',
          },
        },
        lighting: 'bright',
        atmosphere: 'Peace and power radiate from every surface.',
      },
    ],
  },

  stateTemplate: {
    playerStateTemplate: {
      level: 1,
      currentHp: 50,
      maxHp: 50,
      currentXp: 0,
      xpToNextLevel: 50,
      attack: 5,
      defense: 3,
      gold: 10,
      equipment: {
        head: null,
        chest: null,
        hands: null,
        feet: null,
        weapon: null,
      },
      stats: {
        roomsVisited: 0,
        monstersDefeated: 0,
        itemsCollected: 0,
        deaths: 0,
      },
    },
    worldStateTemplate: {
      defeatedMonsters: [],
      takenItems: {},
      unlockedDoors: {},
      solvedPuzzles: [],
      triggeredEvents: [],
    },
  },
};
