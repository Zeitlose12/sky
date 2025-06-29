import { dev } from "$app/environment";
import { getMainItems } from "$lib/server/stats/main_items.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const timeNow = Date.now();
  const { paramProfile = null } = params;

  const stats = await getMainItems(paramProfile as string);
  if (dev) {
    console.log(`/api/items/${paramProfile} took ${Date.now() - timeNow}ms`);
  }

  return json(stats);
}
