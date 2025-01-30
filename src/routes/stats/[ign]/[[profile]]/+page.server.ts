import type { Stats as StatsType } from "$lib/types/stats";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
  const { ign, profile } = params;

  try {
    const data = await fetch(`/api/stats/${ign}${profile ? "/" + profile : ""}`);

    if (!data.ok) {
      error(data.status, "Failed to fetch data");
    }

    const user = (await data.json()) as StatsType;

    return {
      user
    };
  } catch (e) {
    console.error(e);
    error(500, "Failed to fetch data");
  }
}) satisfies PageServerLoad;
