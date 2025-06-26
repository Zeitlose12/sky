import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis.js";
import { processItems } from "$lib/server/stats/items/processing.js";
import { stripItem } from "$lib/server/stats/items/stripping.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { itemId } = params;

  const rawItem = await REDIS.get(`item:${itemId}`);
  if (dev) {
    console.log(`/api/item/${itemId} took ${Date.now() - timeNow}ms`);
  }

  const item = JSON.parse(rawItem);
  const processedItems = processItems([item], "item", [], { endpoint: true });

  return json(stripItem(processedItems[0]));
}
