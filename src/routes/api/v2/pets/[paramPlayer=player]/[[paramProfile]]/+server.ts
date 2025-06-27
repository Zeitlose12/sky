import { dev } from "$app/environment";
import { getProfile } from "$lib/server/lib.js";
import { getPets } from "$lib/server/stats/pets.js";
import type { GetItemsItems } from "$types/stats";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const pets = await getPets(profile.members[paramPlayer], [] as GetItemsItems, profile);

  if (dev) {
    console.log(`/api/pets/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(pets);
}
