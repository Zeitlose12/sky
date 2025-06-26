import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis.js";
import { getSkilllTools, getWeapons } from "$lib/server/stats/items/category.js";
import { processItems } from "$lib/server/stats/items/processing.js";
import { stripItemsV3, stripItemV3 } from "$lib/server/stats/items/stripping.js";
import type { ProcessedItem } from "$types/stats.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramProfile } = params;

  const rawItems = await REDIS.get(`items:${paramProfile}:all`);
  if (dev) {
    console.log(`/api/item/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  const items = JSON.parse(rawItems as string);
  const allItems = processItems(items, "items", [], { pack: false, category: false });

  const output = {
    weapons: getWeapons(allItems),
    farming_tools: getSkilllTools("farming", allItems),
    mining_tools: getSkilllTools("mining", allItems),
    fishing_tools: getSkilllTools("fishing", allItems)
  };

  return json({
    weapons: {
      weapons: stripItemsV3(output.weapons.weapons),
      highest_priority_weapon: output.weapons.highest_priority_weapon
    },
    farming_tools: {
      tools: stripItemsV3(output.farming_tools.tools as unknown as ProcessedItem[]),
      highest_priority_tool: stripItemV3(output.farming_tools.highest_priority_tool as unknown as ProcessedItem)
    },
    mining_tools: {
      tools: stripItemsV3(output.mining_tools.tools as unknown as ProcessedItem[]),
      highest_priority_tool: stripItemV3(output.mining_tools.highest_priority_tool as unknown as ProcessedItem)
    },
    fishing_tools: {
      tools: stripItemsV3(output.fishing_tools.tools as unknown as ProcessedItem[]),
      highest_priority_tool: stripItemV3(output.fishing_tools.highest_priority_tool as unknown as ProcessedItem)
    }
  });
}
