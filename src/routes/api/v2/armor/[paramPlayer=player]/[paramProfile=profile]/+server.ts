import { dev } from "$app/environment";
import { getMainItems } from "$lib/server/stats/main_items.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, cookies }) {
  const timeNow = Date.now();
  const { paramProfile = null } = params;

  const profileId = paramProfile;
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

  const stats = await getMainItems(profileId as string, packs);
  if (dev) {
    console.log(`/api/items/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(stats);
}
