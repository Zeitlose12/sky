import type { AccessoriesV2, ArmorV2, BestiaryV2, CollectionsV2, CrimsonIsleV2, DungeonsV2, EnchantingV2, FarmingV2, FishingV2, InventoryV2, InventoryV2All, ItemV2, MiningV2, MinionsV2, MiscV2, NetworthV2, PetsV2, RiftV2, SkillsV2, SlayerV2, StatsV2, WeaponsV2 } from "$types/statsv2";

// Enum for section names
export enum SectionName {
  NETWORTH = "networth",

  SKILLS = "skills",
  ARMOR = "armor",
  MINING = "mining",
  FARMING = "farming",
  FISHING = "fishing",
  SLAYER = "slayer",
  DUNGEONS = "dungeons",
  MINIONS = "minions",
  BESTIARY = "bestiary",
  COLLECTIONS = "collections",
  CRIMSON_ISLE = "crimson_isle",
  RIFT = "rift",
  MISC = "misc",
  ENCHANTING = "enchanting",
  ACCESSORIES = "accessories",
  PETS = "pets",
  WEAPONS = "weapons",
  INVENTORY = "inventory"
}

// Type mapping for section names to their corresponding types
type SectionTypeMap = {
  [SectionName.NETWORTH]: NetworthV2;
  [SectionName.SKILLS]: SkillsV2;
  [SectionName.ARMOR]: ArmorV2;
  [SectionName.MINING]: MiningV2;
  [SectionName.FARMING]: FarmingV2;
  [SectionName.FISHING]: FishingV2;
  [SectionName.SLAYER]: SlayerV2;
  [SectionName.DUNGEONS]: DungeonsV2;
  [SectionName.MINIONS]: MinionsV2;
  [SectionName.BESTIARY]: BestiaryV2;
  [SectionName.COLLECTIONS]: CollectionsV2;
  [SectionName.CRIMSON_ISLE]: CrimsonIsleV2;
  [SectionName.RIFT]: RiftV2;
  [SectionName.MISC]: MiscV2;
  [SectionName.ENCHANTING]: EnchantingV2;
  [SectionName.ACCESSORIES]: AccessoriesV2;
  [SectionName.PETS]: PetsV2;
  [SectionName.WEAPONS]: WeaponsV2;
  [SectionName.INVENTORY]: InventoryV2;
};

export const api = (customFetch = fetch) => ({
  getProfile: async (ign: string, profile?: string): Promise<StatsV2 & { message?: string }> => {
    const response = await customFetch(`/api/v2/stats/${ign}${profile ? "/" + profile : ""}`);
    if (!response.ok && response.status !== 500) {
      throw new Error(`${response.status} - Failed to fetch data - ${response.statusText}`);
    }
    const data = (await response.json()) as StatsV2 & { message?: string };
    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  },
  getItem: async (itemUUID: string): Promise<ItemV2> => {
    const response = await customFetch(`/api/v2/item/${itemUUID}`);
    if (!response.ok && response.status !== 500) {
      throw new Error(`${response.status} - Failed to fetch item - ${response.statusText}`);
    }
    const data = (await response.json()) as ItemV2 & { message?: string };
    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  },
  getSection: async <T extends keyof SectionTypeMap>(sectionName: T, ign: string, profile?: string): Promise<SectionTypeMap[T]> => {
    const response = await customFetch(`/api/v2/${sectionName}/${ign}${profile ? "/" + profile : ""}`);
    if (!response.ok && response.status !== 500) {
      throw new Error(`${response.status} - Failed to fetch section - ${response.statusText}`);
    }
    const data = (await response.json()) as SectionTypeMap[T] & { message?: string };
    if (data.message) {
      throw new Error(data.message);
    }
    return data;
  },
  // Generic inventory function - returns InventoryV2 if tab specified, InventoryV2All if not
  getInventory: <T extends string | undefined = undefined>(profile?: string, inventoryTab?: T): Promise<T extends string ? InventoryV2 : InventoryV2All> => {
    return (async () => {
      const response = await customFetch(`/api/v2/inventory/${profile || ""}${inventoryTab ? `/${inventoryTab}` : ""}`);
      if (!response.ok && response.status !== 500) {
        throw new Error(`${response.status} - Failed to fetch inventory - ${response.statusText}`);
      }
      const data = (await response.json()) as (T extends string ? InventoryV2 : InventoryV2All) & { message?: string };
      if (data.message) {
        throw new Error(data.message);
      }
      return data;
    })();
  }
});
