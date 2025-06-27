import { dev } from "$app/environment";
import { getProfile } from "$lib/server/lib.js";
import { getRift } from "$lib/server/stats/rift.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const rift = getRift(profile.members[paramPlayer]);

  if (dev) {
    console.log(`/api/rift/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(rift);
}
