import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis";
import { getProfile } from "$lib/server/lib.js";
import { getArmor } from "$lib/server/stats/items/armor";
import { getEquipment } from "$lib/server/stats/items/equipment";
import { processItems } from "$lib/server/stats/items/processing";
import { stripItemsV3 } from "$lib/server/stats/items/stripping.js";
import { getRift } from "$lib/server/stats/rift.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
  const rift = getRift(profile.members[paramPlayer]);

  const rawItems = await REDIS.get(`profile:${paramProfile}:items`);
  const items = rawItems ? JSON.parse(rawItems) : null;

  const riftArmor = processItems(items["rift_armor"], "rift_armor", packs, { category: false, pack: false });
  const riftEquipment = processItems(items["rift_equipment"], "rift_equipment", packs, { category: false, pack: false });

  const armor = getArmor(riftArmor);
  const equipment = getEquipment(riftEquipment);
  rift.armor = {
    armor: stripItemsV3(armor.armor),
    stats: armor.stats,
    set_name: armor.set_name,
    set_rarity: armor.set_rarity
  };
  rift.equipment = {
    equipment: stripItemsV3(equipment.equipment),
    stats: equipment.stats
  };

  if (dev) {
    console.log(`/api/rift/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(rift);
}
