import { dev } from "$app/environment";
import { getProfile } from "$lib/server/lib.js";
import { getCrimsonIsle } from "$lib/server/stats/crimson_isle.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const crimsonIsle = getCrimsonIsle(profile.members[paramPlayer]);

  if (dev) {
    console.log(`/api/crimson_isle/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(crimsonIsle);
}
