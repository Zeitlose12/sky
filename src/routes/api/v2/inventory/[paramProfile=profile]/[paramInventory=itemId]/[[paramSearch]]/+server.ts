import { REDIS } from "$lib/server/db/redis";
import { processItems } from "$lib/server/stats/items/processing.js";
import { stripItems } from "$lib/server/stats/items/stripping.js";
import { getMuseumItems } from "$lib/server/stats/museum.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { paramProfile, paramInventory, paramSearch } = params;

  const rawItems = await REDIS.get(`profile:${paramProfile}:items`);
  const items = JSON.parse(rawItems as string);

  if (paramInventory === "search" && paramSearch) {
    const combinedItems = [];

    delete items.museum;
    for (const key in items) {
      const item = processItems(items[key], key, [], { pack: false, category: false });
      const containsItems = item.map((i) => i.containsItems || []).flat();
      const allItems = item.concat(containsItems);

      combinedItems.push(...stripItems(allItems));
    }

    const searchQuery = paramSearch.toLowerCase();
    return json(
      combinedItems.filter((item) => {
        const displayName = item.display_name?.toLowerCase() || "";
        return displayName.includes(searchQuery) || (item.lore && item.lore.some((line) => line.toLowerCase().includes(searchQuery)));
      })
    );
  }

  if (paramInventory === "museum") {
    const museumInventory = getMuseumItems(items[paramInventory]).inventory;
    const strippedMuseumInventory = stripItems(museumInventory);

    return json(strippedMuseumInventory);
  }

  const processedItems = processItems(items[paramInventory], paramInventory, [], { pack: false, category: false });
  const strippedItems = stripItems(processedItems);
  return json(strippedItems);
}
