import { dev } from "$app/environment";
import { getProfile } from "$lib/server/lib.js";
import { getEnchanting } from "$lib/server/stats/enchanting.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const enchanting = getEnchanting(profile.members[paramPlayer]);

  if (dev) {
    console.log(`/api/enchanting/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(enchanting);
}
