import type Skills from "$lib/layouts/stats/Skills.svelte";
import type { ItemStats } from "./processed/profile/stats";
import type { APISettings, BestiaryCategory, CatacombsData, CollectionCategory, ForgeItem, MinionCategory, MinionCategoryType, ProcessedExperimentationGame, Rank, Skill, SlayerInfo, TrophyFish } from "./stats";

export type StatsV2 = {
  displayName: string;
  username: string;
  uuid: string;
  profile_id: string;
  profile_cute_name: string;
  game_mode: string;
  selected: boolean;
  rank: Rank | undefined;
  social: Record<string, string>;
  skills: Skills;
  joined: number;
  purse: number;
  bank: number;
  personalBank: number;
  fairySouls: {
    found: number;
    total: number;
  };
  profiles: { profile_id: string; cute_name: string; game_mode: string; selected: boolean }[];
  members: { uuid: string; username: string; removed: boolean }[];
  skyblock_level: Skill;
  apiSettings: APISettings;
};

export type ArmorV2 = {
  armor: {
    armor: ItemV2[];
    stats: ItemStats;
    set_name?: string;
    set_rarity?: string;
  };
  equipment: {
    equipment: ItemV2[];
    stats: ItemStats;
  };
  wardrobe: ItemV2[][];
};

export type ItemV2 = {
  display_name: string;
  lore: string[];
  texture_path: string;
  recombobulated: boolean;
  shiny: boolean;
  texture_pack: string;
  wiki?: { fandom?: string; official?: string } | null;
  uuid: string;
  rarity: string;
  Count?: number;
  containsItems?: ItemV2[];
  isInactive?: boolean;
  isUnique?: boolean;
};

export type WeaponsV2 = {
  weapons: ItemV2[];
  highest_priority_weapon: ItemV2 | null;
};

export type AccessoriesV2 = {
  accessories: ItemV2[];
  missing: ItemV2[];
  upgrades: ItemV2[];
  stats: ItemStats;
  enrichments: Record<string, number>;
  unique: number;
  total: number;
  recombobulated: number;
  totalRecombobulated: number;
  selectedPower: string | null;
  magicalPower: {
    total: number;
    accessories: number;
    abiphone: number;
    riftPrism: number;
    hegemony: {
      rarity: string | null;
      amount: number;
    };
    rarities: Record<string, { amount: number; magicalPower: number }>;
  };
};

export type PetsV2 = {
  pets: ItemV2[];
  missing: ItemV2[];
  amount: number;
  total: number;
  amountSkins: number;
  totalSkins: number;
  totalPetExp: number;
  totalCandyUsed: number;
  petScore?: {
    amount: number;
    stats: Record<string, number>;
    reward: {
      score: number;
      bonus: number;
      unlocked?: boolean;
    }[];
  };
};

export type InventoryV2All = {
  inventory: ItemV2[];
  backpack: ItemV2[];
  enderchest: ItemV2[];
  personal_vault: ItemV2[];
  rift_inventory: ItemV2[];
  rift_enderchest: ItemV2[];
  potion_bag: ItemV2[];
  talisman_bag: ItemV2[];
  fishing_bag: ItemV2[];
  quiver: ItemV2[];
};

export type InventoryV2 = ItemV2[];

export type MiningV2 = {
  level: Skill;
  peak_of_the_mountain: {
    level: number;
    maxLevel: number;
  };
  selectedPickaxeAbility: string;
  tokens: {
    total: number;
    spent: number;
    available: number;
  };
  commissions: {
    milestone: number;
    completions: number;
  };
  crystalHollows: {
    crystalHollowsLastAccess: number;
    nucleusRuns: number;
    progress: {
      crystals: Record<string, string>;
      parts: Record<string, string>;
    };
  };
  powder: {
    mithril: {
      spent: number;
      total: number;
      available: number;
    };
    gemstone: {
      spent: number;
      total: number;
      available: number;
    };
    glacite: {
      spent: number;
      total: number;
      available: number;
    };
  };
  forge: ForgeItem[];
  hotm: ItemV2[];
  glaciteTunnels: {
    mineshaftsEntered: number;
    fossilDust: number;
    corpses: {
      found: number;
      corpses: {
        name: string;
        amount: number;
        texture_path: string;
      }[];
    };
    fossils: {
      found: number;
      fossils: {
        name: string;
        found: boolean;
        texture_path: string;
      }[];
    };
  };
  tools: {
    tools: ItemV2[];
    highest_priority_tool: ItemV2;
  };
};

export type FarmingV2 = {
  uniqueGolds: number;
  copper: number;
  pelts: number;
  medals: Record<
    string,
    {
      amount: number;
      total: number;
    }
  >;
  contestsAttended: number;
  contests: Record<string, Contest>;
  weight: {
    totalWeight: number;
    bonusWeight: number;
    cropsWeight: number;
    bonusSources: Record<string, number>;
    crops: { name: string; id: string; amount: number }[];
  };
  tools: {
    tools: ItemV2[];
    highest_priority_tool: ItemV2;
  };
};

export type FishingV2 = {
  itemsFished: number;
  treasure: number;
  treasureLarge: number;
  seaCreaturesFished: number;
  shredderFished: number;
  shredderBait: number;
  kills: { id: string; name: string; texture: string; amount: number }[];
  trophyFish: {
    totalCaught: number;
    stage: {
      name: string;
      progress: {
        tier: string;
        caught: number;
        total: number;
      }[];
    };
    trophyFish: TrophyFish[];
  } | null;
  tools: {
    tools: ItemV2[];
    highest_priority_tool: ItemV2;
  };
};

export type SlayerV2 = {
  unlocked: boolean;
  data: Record<string, SlayerInfo>;
  stats: Record<string, number>;
  totalSlayerExp: number;
};

export type DungeonsV2 = {
  unlocked: boolean;
  level: Skill;
  classes: {
    selectedClass: string;
    classes: Record<string, Skill>;
    classAverage: number;
    classAverageWithProgress: number;
    totalClassExp: number;
  };
  stats: {
    secrets: {
      found: number;
      secretsPerRun: number;
    };
    highestFloorBeatenNormal: number;
    highestFloorBeatenMaster: number;
    bloodMobKills: number;
  };
  catacombs: CatacombsData[] | null;
  master_catacombs: CatacombsData[] | null;
};

export type MinionsV2 = {
  minions: Record<MinionCategoryType, MinionCategory>;
  totalMinions: number;
  maxedMinions: number;
  totalTiers: number;
  maxedTiers: number;
  minionsSlots: {
    bonusSlots: number;
    current: number;
    next: number;
  };
};

export type BestiaryV2 = {
  level: number;
  maxLevel: number;
  familiesUnlocked: number;
  familiesCompleted: number;
  totalFamilies: number;
  familyTiers: number;
  maxFamilyTiers: number;
  categories: Record<string, BestiaryCategory>;
};

export type CollectionsV2 = {
  categories: Record<string, CollectionCategory>;
  totalCollections: number;
  maxedCollections: number;
};

export type CrimsonIsleV2 = {
  unlocked: boolean;
  factions: {
    selectedFaction: string;
    barbariansReputation: number;
    magesReputation: number;
  };
  kuudra: {
    totalKills: number;
    tiers: {
      name: string;
      id: string;
      texture: string;
      kills: number;
    }[];
  };
  dojo: {
    totalPoints: number;
    challenges: {
      name: string;
      id: string;
      texture: string;
      points: number;
      time: number;
      rank: string;
    }[];
  };
};

export type RiftV2 = {
  visits: number;
  motes: {
    purse: number;
    lifetime: number;
    orbs: number;
  };
  enigma: {
    souls: number;
    totalSouls: number;
  };
  castle: {
    grubberStacks: number;
    maxBurgers: number;
  };
  porhtal: {
    porhtalsFound: number;
    porhtals: {
      name: string;
      texture: string;
      unlocked: boolean;
    }[];
  };
  timecharms: {
    timecharmsFound: number;
    timecharms: {
      name: string;
      id: string;
      texture: string;
      unlocked: boolean;
      unlockedAt: number;
    }[];
  };
  armor: {
    armor: ItemV2[];
    stats: ItemStats;
    set_name?: string;
    set_rarity?: string;
  };
  equipment: {
    equipment: ItemV2[];
    stats: ItemStats;
  };
};

export type MiscV2 = {
  essence: {
    name: string;
    id: string;
    texture: string;
    amount: number;
  }[];
  kills: {
    total_kills: number;
    total_deaths: number;
    kills: { id: string; name: string; amount: number }[];
    deaths: { id: string; name: string; amount: number }[];
  };
  races: {
    [id: string]: {
      name: string;
      races: Record<
        string,
        | { name: string; time: number }
        | {
            with_return: Record<string, { name: string; time: number }> | null;
            no_return: Record<string, { name: string; time: number }> | null;
          }
        | null
      >;
    };
  };
  gifts: {
    given: number;
    received: number;
  };
  season_of_jerry: {
    most_snowballs_hit: number;
    most_damage_dealt: number;
    most_magma_damage_dealt: number;
    most_cannonballs_hit: number;
  };
  dragons?: {
    ender_crystals_destroyed: number;
    most_damage: Record<string, number>;
    fastest_kill: Record<string, number>;
    last_hits: Record<string, number>;
    deaths: Record<string, number>;
  };
  endstone_protector: {
    kills: number;
    deaths: number;
  };
  damage: {
    highest_critical_damage: number;
  };
  pet_milestones: {
    sea_creatures_killed: {
      amount: number;
      rarity: string;
      total: number;
      progress: string;
    };
    ores_mined: {
      amount: number;
      rarity: string;
      total: number;
      progress: string;
    };
  };
  mythological_event: {
    kills: number;
    burrows_dug_next: {
      total: number;
      [burrow: string]: number;
    };
    burrows_dug_combat: {
      total: number;
      [burrow: string]: number;
    };
    burrows_dug_treasure: {
      total: number;
      [burrow: string]: number;
    };
    burrows_chains_complete: {
      total: number;
      [burrow: string]: number;
    };
  };
  effects: {
    active: string[];
    paused: string[];
    disabled: string[];
  };
  profile_upgrades: Record<string, number>;
  auctions: {
    bids: number;
    highest_bid: number;
    won: number;
    total_bought: Record<string, number>;
    gold_spent: number;
    created: number;
    fees: number;
    completed: number;
    total_sold: Record<string, number>;
    gold_earned: number;
    no_bids: number;
  };
  claimed_items: {
    [key: string]: number;
  };
  uncategorized: {
    [key: string]: number | string | boolean;
  };
};

export type EnchantingV2 = {
  unlocked: boolean;
  data: {
    [string: string]: ProcessedExperimentationGame;
  };
};

export type SkillsV2 = {
  mining: MiningV2;
  farming: FarmingV2;
  enchanting: EnchantingV2;
  fishing: FishingV2;
};
