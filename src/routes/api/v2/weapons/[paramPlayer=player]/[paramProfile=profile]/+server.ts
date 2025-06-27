import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis.js";
import { getWeapons } from "$lib/server/stats/items/category.js";
import { processItems } from "$lib/server/stats/items/processing.js";
import { stripItemsV3, stripItemV3 } from "$lib/server/stats/items/stripping.js";
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
  const weapons = getWeapons(allItems);

  return json({
    weapons: stripItemsV3(weapons.weapons),
    highest_priority_weapon: stripItemV3(weapons.highest_priority_weapon)
  });
}
