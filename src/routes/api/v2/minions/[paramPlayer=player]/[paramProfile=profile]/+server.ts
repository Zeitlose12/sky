import { dev } from "$app/environment";
import { getProfile } from "$lib/server/lib.js";
import { getMinions } from "$lib/server/stats/minions.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const minions = getMinions(profile);

  if (dev) {
    console.log(`/api/minions/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(minions);
}
