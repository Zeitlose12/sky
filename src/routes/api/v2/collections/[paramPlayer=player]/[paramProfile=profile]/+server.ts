import { dev } from "$app/environment";
import { getProfile } from "$lib/server/lib.js";
import { getCollections } from "$lib/server/stats/collections.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const collections = await getCollections(profile.members[paramPlayer], profile);

  if (dev) {
    console.log(`/api/collections/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(collections);
}
