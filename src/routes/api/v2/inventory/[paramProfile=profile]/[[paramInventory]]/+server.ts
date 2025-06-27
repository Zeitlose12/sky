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
  } else if (paramInventory === "search") {
    const combinedItems = [];
    for (const key in items) {
      const item = processItems(items[key], key, [], { pack: false, category: false });
      const containsItems = item.map((i) => i.containsItems || []).flat();
      const allItems = item.concat(containsItems);

      for (const i of allItems) {
        if (i.containsItems) {
          delete i.containsItems;
        }
      }

      combinedItems.push(...stripItemsV3(allItems));
    }

    output = combinedItems.filter((item) => item.uuid);
  } else {
    output = stripItemsV3(processItems(items[paramInventory], paramInventory, [], { pack: false, category: false }));
  }

  if (dev) {
    console.log(`/api/inventory/${paramProfile}/${paramInventory} took ${Date.now() - timeNow}ms`);
  }

  return json(output);
}
