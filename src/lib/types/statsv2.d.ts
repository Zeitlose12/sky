import type Skills from "$lib/layouts/stats/Skills.svelte";
import type { ItemStats } from "./processed/profile/stats";
import type { APISettings, ProcessedSkyBlockItem, Rank, Skill } from "./stats";

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

export type ItemsV2 = {
  armor: {
    armor: ProcessedSkyBlockItem[];
    stats: ItemStats;
    set_name?: string;
    set_rarity?: string;
  };
  equipment: {
    equipment: ProcessedSkyBlockItem[];
    stats: ItemStats;
  };
  wardrobe: ProcessedSkyBlockItem[][];
};

export type ItemV2 = {
  display_name: string;
  lore: string[];
  texture_path: string;
  recombobulated: boolean;
  shiny: boolean;
  texture_pack: string;
  wiki?: { fandom?: string; official?: string } | null;
};

export type CategoryItemsV2 = {
  weapons: {
    weapons: ItemV2[];
    highest_priority_weapon: ItemV2 | null;
  };
  farming_tools: {
    tools: ItemV2[];
    highest_priority_tool: ItemV2 | null;
  };
  fishing_tools: {
    tools: ItemV2[];
    highest_priority_tool: ItemV2 | null;
  };
  mining_tools: {
    tools: ItemV2[];
    highest_priority_tool: ItemV2 | null;
  };
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
