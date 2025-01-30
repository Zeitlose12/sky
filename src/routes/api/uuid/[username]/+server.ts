import { getUUID } from "$lib/server/lib";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  try {
    const username = await getUUID(params.username, { cache: true });
    return json({ username });
  } catch (error) {
    console.error(error);
    return json({ error }, { status: 500 });
  }
};
