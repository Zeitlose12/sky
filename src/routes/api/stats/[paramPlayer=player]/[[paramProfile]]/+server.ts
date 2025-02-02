import { dev } from "$app/environment";
import { fetchMuseum, fetchPlayer, getProfile } from "$lib/server/lib";
import { getStats } from "$lib/server/stats";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

type APIError = { message: string };

export const GET: RequestHandler = async ({ params, cookies }) => {
  try {
    const timeNow = Date.now();
    const { paramPlayer, paramProfile = null } = params;

    const [profile, player] = await Promise.all([getProfile(paramPlayer, paramProfile, { cache: true }), fetchPlayer(paramPlayer, { cache: true })]);
    const museum = await fetchMuseum(profile.profile_id);

    const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
    const stats = await getStats(profile, player, { museum, packs });

    if (dev) {
      console.log(`/api/stats/${paramPlayer}${paramProfile ? `/${paramProfile}` : ""} took ${Date.now() - timeNow}ms`);
    }

    return json(stats);
  } catch (e) {
    return error(500, (e as APIError).message);
  }
};
