import type { Stats as StatsType } from "$lib/types/stats";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type APIError = { body?: { message?: string } };

export const load = (async ({ params, fetch }) => {
  const { ign, profile } = params;

  try {
    const data = await fetch(`/api/stats/${ign}${profile ? "/" + profile : ""}`);
    if (!data.ok && data.status !== 500) {
      error(data.status, "Failed to fetch data");
    }

    const user = (await data.json()) as StatsType & { message?: string };
    if (user.message) {
      error(404, user.message);
    }

    return { user };
  } catch (e) {
    error(500, (e as APIError).body?.message ?? "Failed to fetch data");
  }
}) satisfies PageServerLoad;
