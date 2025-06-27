import { dev } from "$app/environment";
import { fetchPlayer, getProfile } from "$lib/server/lib.js";
import { getEnchanting } from "$lib/server/stats/enchanting";
import { getFarming } from "$lib/server/stats/farming";
import { getFishing } from "$lib/server/stats/fishing.js";
import { getMining } from "$lib/server/stats/mining.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const [profile, player] = await Promise.all([getProfile(paramPlayer, paramProfile as string, { cache: true }), fetchPlayer(paramPlayer, { cache: true })]);
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

  const mining = getMining(profile.members[paramPlayer], player, packs);
  const farming = getFarming(profile, profile.members[paramPlayer]);
  const enchanting = getEnchanting(profile.members[paramPlayer]);
  const fishing = getFishing(profile.members[paramPlayer]);

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
