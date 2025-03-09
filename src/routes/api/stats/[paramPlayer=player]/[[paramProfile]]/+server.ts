import { dev } from "$app/environment";
import { fetchMuseum, fetchPlayer, getProfile } from "$lib/server/lib";
import { getStats } from "$lib/server/stats";
import { error, json } from "@sveltejs/kit";
import { promisify } from "util";
import { gzip } from "zlib";
import type { RequestHandler } from "./$types";

const gzipPromise = promisify(gzip);

type APIError = { message: string };

export const GET: RequestHandler = async ({ params, cookies, request }) => {
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

    const acceptsGzip = request.headers.get("accept-encoding")?.includes("gzip");
    if (acceptsGzip) {
      const jsonData = JSON.stringify(stats);
      const compressedData = await gzipPromise(jsonData);
      return new Response(compressedData, {
        headers: {
          "Content-Type": "application/json",
          "Content-Encoding": "gzip"
        }
      });
    }

    return json(stats);
  } catch (e) {
    return error(500, (e as APIError).message);
  }
};
