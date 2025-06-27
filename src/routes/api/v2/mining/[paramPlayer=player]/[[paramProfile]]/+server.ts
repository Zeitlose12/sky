import { dev } from "$app/environment";
import { fetchPlayer, getProfile } from "$lib/server/lib.js";
import { getMining } from "$lib/server/stats/mining.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const [profile, player] = await Promise.all([getProfile(paramPlayer, paramProfile as string, { cache: true }), fetchPlayer(paramPlayer, { cache: true })]);
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

  const mining = getMining(profile.members[paramPlayer], player, packs);

  if (dev) {
    console.log(`/api/mining/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(mining);
}
