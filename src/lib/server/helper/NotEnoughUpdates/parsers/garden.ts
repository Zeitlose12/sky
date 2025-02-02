import type { NEUGardenRaw } from "$types/global";
import type { NEUGardenConstants } from "$types/processed/NotEnoughUpdates/garden";

function getPlotLayout(plots: NEUGardenRaw["plots"]) {
  return Object.keys(plots).sort((aId, bId) => {
    const a = plots[aId];
    const b = plots[bId];

    return a.y === b.y ? a.x - b.x : a.y - b.y;
  });
}

function formatXPTable(xpTable: NEUGardenRaw["garden_exp"]) {
  const output = {} as Record<number, number>;
  for (const [level, xp] of Object.entries(xpTable)) {
    output[Number(level) + 1] = xp;
  }

  return output;
}

function formatCropMilestones(milestones: NEUGardenRaw["crop_milestones"]) {
  const output = {} as Record<string, Record<number, number>>;
  for (const key in milestones) {
    output[key] = formatXPTable(milestones[key]);
  }

  return output;
}

export function formatGardenConstants(gardenData: NEUGardenRaw) {
  return {
    visitors: gardenData.visitors,
    plots: getPlotLayout(gardenData.plots),
    gardenXp: formatXPTable(gardenData.garden_exp),
    cropMilestones: formatCropMilestones(gardenData.crop_milestones),
    barnSkins: gardenData.barn,
    plotCosts: gardenData.plot_costs
  } as NEUGardenConstants;
}
