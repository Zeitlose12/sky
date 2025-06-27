import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis";
import { getProfile } from "$lib/server/lib";
import { json } from "@sveltejs/kit";
import { getPreDecodedNetworth } from "skyhelper-networth";

export async function GET({ params, cookies }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const allItemsRaw = await REDIS.get(`items:${paramProfile}:all:object`);
  const allItems = JSON.parse(allItemsRaw);

  const allMuseumRaw = await REDIS.get(`profile:${paramProfile}:allMuseum`);
  const allMuseumItems = JSON.parse(allMuseumRaw);

  const userProfile = profile.members[paramPlayer];

  const bank = profile.banking?.balance ?? 0;
  const networthOptions = {
    onlyNetworth: true,
    returnItemData: false,
    cache: true,
    v2Endpoint: true
  };

  const items = {
    ...allItems,
    wardrobe: allItems.wardrobe.flat(),
    accessories: allItems.talisman_bag,
    storage: allItems.backpack.concat(allItems.backpack.map((i) => i.containsItems).flat()).flat(),
    museum: allMuseumItems
  };

  const networth = await getPreDecodedNetworth(userProfile, items, bank, networthOptions);

  if (dev) {
    console.log(`/api/networth/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(networth);
}
