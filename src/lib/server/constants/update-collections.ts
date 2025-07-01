import { building } from "$app/environment";
import type { Collection } from "$lib/server/constants/collections";
import MONGO from "$lib/server/db/mongo";

export const COLLECTIONS = new Map<string, Collection>();

export async function updateCollectionConstants() {
  if (building) return;

  const collections = await MONGO.collection("collections").findOne({});
  if (collections?.collections == null) {
    return;
  }

  for (const category in collections.collections) {
    // TODO: Make this more robust
    if (["lastUpdated", "_id"].includes(category)) {
      continue;
    }

    COLLECTIONS.set(category, collections.collections[category] as Collection);
  }

  console.info("[COLLECTIONS] Updated collection constants");
}

setTimeout(updateCollectionConstants, 1000 * 60 * 60 * 12); // 12 hours
