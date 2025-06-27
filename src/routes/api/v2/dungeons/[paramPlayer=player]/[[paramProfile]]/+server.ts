import { dev } from "$app/environment";
import { getProfile } from "$lib/server/lib.js";
import { getDungeons } from "$lib/server/stats/dungeons.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile } = params;

  const profile = await getProfile(paramPlayer, paramProfile as string, { cache: true });

  const dungeons = getDungeons(profile.members[paramPlayer]);

  if (dev) {
    console.log(`/api/dungeons/${paramPlayer}/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(dungeons);
}
