import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis.js";
import { getProfile } from "$lib/server/lib.js";
import { getAccessories } from "$lib/server/stats/accessories.js";
import { processItems } from "$lib/server/stats/items/processing.js";
import { stripItemsV3 } from "$lib/server/stats/items/stripping.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const rawItems = await REDIS.get(`items:${paramProfile}:all:object`);
  const items = JSON.parse(rawItems as string);

  for (const key in items) {
    items[key] = processItems(items[key], key, [], { pack: true, category: false });
  }

  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

  const profile = await getProfile(paramPlayer, paramProfile, { cache: true });
  const accessories = await getAccessories(profile.members[paramPlayer], items, packs);
  console.log(accessories);
  console.log(items);

  accessories.accessories = stripItemsV3(accessories.accessories);
  accessories.upgrades = stripItemsV3(accessories.upgrades);
  accessories.missing = stripItemsV3(accessories.missing);
  if (dev) {
    console.log(`/api/accessories/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(accessories);
}
