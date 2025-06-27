import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis.js";
import { fetchPlayer, getProfile } from "$lib/server/lib.js";
import { getEnchanting } from "$lib/server/stats/enchanting";
import { getFarming } from "$lib/server/stats/farming";
import { getFishing } from "$lib/server/stats/fishing.js";
import { getSkilllTools } from "$lib/server/stats/items/category.js";
import { stripItemsV3, stripItemV3 } from "$lib/server/stats/items/stripping.js";
import { getMining } from "$lib/server/stats/mining.js";
import { json } from "@sveltejs/kit";
import { v4 } from "uuid";

export async function GET({ params, cookies }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const [profile, player] = await Promise.all([getProfile(paramPlayer, paramProfile as string, { cache: true }), fetchPlayer(paramPlayer, { cache: true })]);
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

  const allItemsRaw = await REDIS.get(`items:${paramProfile}:all`);
  const allItems = JSON.parse(allItemsRaw);

  const mining = getMining(profile.members[paramPlayer], player, packs);
  mining.tools = getTools(allItems, "mining");
  const farming = getFarming(profile, profile.members[paramPlayer]);
  farming.tools = getTools(allItems, "farming");
  const enchanting = getEnchanting(profile.members[paramPlayer]);
  const fishing = getFishing(profile.members[paramPlayer]);
  fishing.tools = getTools(allItems, "fishing");

  if (dev) {
    console.log(`/api/skills/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json({
    mining,
    farming,
    enchanting,
    fishing
  });
}

function getTools(allItems, skill) {
  const tools = getSkilllTools(skill, allItems);

  for (const tool of tools.tools.concat(tools.highest_priority_tool)) {
    tool.uuid = v4();
    REDIS.set(`item:${tool.uuid}`, JSON.stringify(tool), "EX", 60 * 5); // 5 minutes cache
  }

  return {
    tools: stripItemsV3(tools.tools),
    highest_priority_tool: stripItemV3(tools.highest_priority_tool)
  };
}
