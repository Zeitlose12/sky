import { getGarden } from "$lib/server/lib";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const { paramProfile } = params;

  const garden = await getGarden(paramProfile);

  return json(garden);
};
