import { dev } from "$app/environment";
import { REDIS } from "$lib/server/db/redis.js";
import { processItems } from "$lib/server/stats/items/processing.js";
import { stripItem } from "$lib/server/stats/items/stripping";
import { titleCase } from "$lib/shared/helper.js";
import { json } from "@sveltejs/kit";

const ICONS = {
  inventory: "https://crafatar.com/renders/head/${profile.uuid}?overlay",
  backpack: "/api/item/chest",
  enderchest: "/api/item/ender_chest",
  personal_vault: "/api/head/f7aadff9ddc546fdcec6ed5919cc39dfa8d0c07ff4bc613a19f2e6d7f2593",
  talisman_bag: "/api/head/961a918c0c49ba8d053e522cb91abc74689367b4d8aa06bfc1ba9154730985ff",
  potion_bag: "/api/head/9f8b82427b260d0a61e6483fc3b2c35a585851e08a9a9df372548b4168cc817c",
  fishing_bag: "/api/head/eb8e297df6b8dffcf135dba84ec792d420ad8ecb458d144288572a84603b1631",
  quiver: "/api/head/4cb3acdc11ca747bf710e59f4c8e9b3d949fdd364c6869831ca878f0763d1787",
  museum: "/api/head/438cf3f8e54afc3b3f91d20a49f324dca1486007fe545399055524c17941f4dc",
  rift_inventory: "/api/head/445240fcf1a9796327dda5593985343af9121a7156bc76e3d6b341b02e6a6e52",
  rift_enderchest: "/api/head/a6cc486c2be1cb9dfcb2e53dd9a3e9a883bfadb27cb956f1896d602b4067",
  search: "/api/item/EYE_OF_ENDER"
};

export async function GET({ params }) {
  const timeNow = Date.now();
  const { itemId } = params;

  // Simulate slow connection/delay
  // const delay = 3000; // 1 second delay
  // console.log(`Simulating ${delay}ms delay for /api/item/${itemId}`);
  // await new Promise((resolve) => setTimeout(resolve, delay));

  const rawItem = await REDIS.get(`item:${itemId}`);
  if (dev) {
    console.log(`/api/item/${itemId} took ${Date.now() - timeNow}ms`);
  }

  const item = JSON.parse(rawItem);
  const processedItems = processItems([item], "item", [], { category: false, pack: false });

  const itemData = stripItem(processedItems[0]);
  const source = processedItems[0].extra.source;
  itemData.sourceTab = { name: titleCase(source), icon: ICONS[source] };

  return json(itemData);
}
