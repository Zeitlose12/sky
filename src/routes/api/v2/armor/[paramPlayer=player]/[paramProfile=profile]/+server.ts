import { getMainItems } from "$lib/server/stats/main_items.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { paramProfile = null } = params;

  const stats = await getMainItems(paramProfile as string);

  return json(stats);
}
