import type { SectionName } from "$lib/sections/types";
import type { ProcessedSkyBlockItem, ProcessedSkyblockPet } from "$types/global";
import type { Snippet } from "svelte";
import { writable } from "svelte/store";

export const showItem = writable<boolean>(false);
export const itemContent = writable<ProcessedSkyBlockItem | ProcessedSkyblockPet | undefined>();
export const inviewportSections = writable<Record<SectionName, boolean>>({
  Armor: false,
  Weapons: false,
  Accessories: false,
  Pets: false,
  Inventory: false,
  Skills: false,
  Dungeons: false,
  Slayer: false,
  Minions: false,
  Bestiary: false,
  Collections: false,
  Crimson_Isle: false,
  Rift: false,
  Misc: false
});
export const content = writable<Snippet | undefined>(undefined);
