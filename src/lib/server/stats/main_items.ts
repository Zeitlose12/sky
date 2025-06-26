import { REDIS } from "../db/redis";
import { getArmor } from "./items/armor";
import { getEquipment } from "./items/equipment";
import { processItems } from "./items/processing";
import { stripItemsV3 } from "./items/stripping";
import { getWardrobe } from "./items/wardrobe";

export async function getMainItems(profileId: string, packs: string[]) {
  const rawItems = await REDIS.get(`profile:${profileId}:main_items`);
  const items = rawItems ? JSON.parse(rawItems) : null;

  for (const key in items) {
    items[key] = processItems(items[key], key, packs, { category: true, pack: false });
  }

  const armor = getArmor(items.armor);
  const equipment = getEquipment(items.equipment);

  return {
    armor: {
      armor: stripItemsV3(armor.armor),
      stats: armor.stats,
      set_name: armor.set_name,
      set_rarity: armor.set_rarity
    },
    equipment: {
      equipment: stripItemsV3(equipment.equipment),
      stats: equipment.stats
    },
    wardrobe: getWardrobe(items.wardrobe).map((set) => stripItemsV3(set))
  };
}
