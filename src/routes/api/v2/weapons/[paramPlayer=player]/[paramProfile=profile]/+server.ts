import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis.js";
import { getWeapons } from "$lib/server/stats/items/category.js";
import { processItems } from "$lib/server/stats/items/processing.js";
import { stripItem, stripItems } from "$lib/server/stats/items/stripping.js";
import { json } from "@sveltejs/kit";
import simdjson from "simdjson";

export async function GET({ params, cookies }) {
  const timeNow = Date.now();
  const { paramProfile } = params;

  const allItemsRaw = await REDIS.get(`profile:${paramProfile}:items`);
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
  const items = simdjson.parse(allItemsRaw as string);

  const allItems = [];
  const validInventories = ["backpack", "inventory", "enderchest"];
  for (const inventory of validInventories) {
    const processedItems = processItems(items[inventory], inventory, packs, { pack: false, category: false });
    allItems.push(...processedItems);
  }

  const weapons = getWeapons(allItems);

  if (dev) {
    console.log(`/api/item/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json({
    weapons: stripItems(weapons.weapons),
    highest_priority_weapon: stripItem(weapons.highest_priority_weapon)
  });
}
