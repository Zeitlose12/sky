import { dev } from "$app/environment";
import { getProfile } from "$lib/server/lib.js";
import { getFarming } from "$lib/server/stats/farming.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const farming = getFarming(profile, profile.members[paramPlayer]);

  if (dev) {
    console.log(`/api/farming/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(farming);
}
