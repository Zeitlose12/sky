import { dev } from "$app/environment";
import { getProfile } from "$lib/server/lib.js";
import { getBestiary } from "$lib/server/stats/bestiary.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const bestiary = getBestiary(profile);

  if (dev) {
    console.log(`/api/bestiary/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(bestiary);
}
