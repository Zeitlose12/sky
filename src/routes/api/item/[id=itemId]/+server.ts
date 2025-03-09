import { renderItem } from "$lib/server/helper/renderer";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, cookies, url }) => {
  const { id } = params;
  const isStatic = url.searchParams.get("static") !== null;

  try {
    const [newId, damage] = id.split(":");
    const packs = JSON.parse(cookies.get("disabledPacks") || "[]");
    const attachment = await renderItem(newId, {
      damage: isNaN(parseInt(damage)) ? 0 : parseInt(damage),
      packs,
      static: isStatic
    });

    return new Response(attachment.image, {
      headers: {
        "Content-Type": "image/png"
      }
    });
  } catch (errorMsg) {
    console.log("ERROR:", errorMsg);
    throw error(500, "Internal server error");
  }
};
