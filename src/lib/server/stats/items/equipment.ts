import * as helper from "$lib/server/helper";
import type { ProcessedItem } from "$types/stats";
import { getStatsFromItems } from "./stats";

export function getEquipment(equipment: ProcessedItem[]) {
  if (equipment.some((a) => helper.getId(a) === "") === true) {
    return {
      equipment: equipment.filter((a) => helper.getId(a) !== "").reverse(),
      stats: {}
    };
  }

  return {
    equipment: equipment.reverse(),
    stats: getStatsFromItems(equipment)
  };
}
