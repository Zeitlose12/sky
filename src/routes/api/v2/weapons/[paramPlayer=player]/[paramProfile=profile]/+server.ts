import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis.js";
import { getWeapons } from "$lib/server/stats/items/category.js";
import { stripItem, stripItems } from "$lib/server/stats/items/stripping.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramProfile } = params;

  const rawItems = await REDIS.get(`items:${paramProfile}:all`);
  if (dev) {
    console.log(`/api/item/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  const items = JSON.parse(rawItems as string);
  // const allItems = processItems(items, "items", [], { pack: false, category: false });
  const weapons = getWeapons(items);

  return json({
    weapons: stripItems(weapons.weapons),
    highest_priority_weapon: stripItem(weapons.highest_priority_weapon)
  });
}
