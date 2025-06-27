import { dev } from "$app/environment";
import { fetchPlayer, getProfile, getUUID } from "$lib/server/lib";
import { getMainStats } from "$lib/server/stats/main_stats.js";
import { json } from "@sveltejs/kit";

/*
const packs = JSON.parse(cookies.get("disabledPacks") || "[]");

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
*/
export async function GET({ params, cookies }) {
  const timeNow = Date.now();
  const { paramPlayer, paramProfile = null } = params;

  const uuid = await getUUID(paramPlayer, { cache: true });
  const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
  const [profile, player] = await Promise.all([getProfile(uuid, paramProfile, { cache: true }), fetchPlayer(uuid, { cache: true })]);

  const stats = await getMainStats(profile.members[profile.uuid], profile, player, packs);
  if (dev) {
    console.log(`/api/stats/${paramPlayer}${paramProfile ? `/${paramProfile}` : ""} took ${Date.now() - timeNow}ms`);
  }

  return json(stats);
}
