import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis";
import { getProfile } from "$lib/server/lib.js";
import { getArmor } from "$lib/server/stats/items/armor";
import { getEquipment } from "$lib/server/stats/items/equipment";
import { processItems } from "$lib/server/stats/items/processing";
import { stripItems } from "$lib/server/stats/items/stripping.js";
import { getRift } from "$lib/server/stats/rift.js";
import { json } from "@sveltejs/kit";
import simdjson from "simdjson";

export async function GET({ params, cookies }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const allItemsRaw = await REDIS.get(`profile:${paramProfile}:items`);
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
  const items = simdjson.parse(allItemsRaw as string);

  const riftArmor = processItems(items["rift_armor"], "rift_armor", packs, { category: false, pack: false });
  const riftEquipment = processItems(items["rift_equipment"], "rift_equipment", packs, { category: false, pack: false });

  const armor = getArmor(riftArmor);
  const equipment = getEquipment(riftEquipment);
  const rift = getRift(profile.members[paramPlayer]);

  if (dev) {
    console.log(`/api/rift/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json({
    ...rift,
    armor: {
      ...armor,
      armor: stripItems(armor.armor)
    },
    equipment: {
      ...equipment,
      equipment: stripItems(equipment.equipment)
    }
  });
}
