import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis";
import { processItems } from "$lib/server/stats/items/processing.js";
import { stripItemsV3 } from "$lib/server/stats/items/stripping.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const timeNow = Date.now();
  const { paramProfile = null, paramInventory = null } = params;

  const rawItems = await REDIS.get(`items:${paramProfile}:all:object`);
  const items = JSON.parse(rawItems as string);

  let output = {};
  if (!paramInventory) {
    for (const key in items) {
      output[key] = stripItemsV3(processItems(items[key], key, [], { pack: false, category: false }));
    }
  } else {
    output = stripItemsV3(processItems(items[paramInventory], paramInventory, [], { pack: false, category: false }));
  }

  if (dev) {
    console.log(`/api/inventory/${paramProfile}/${paramInventory} took ${Date.now() - timeNow}ms`);
  }

  return json(output);
}
