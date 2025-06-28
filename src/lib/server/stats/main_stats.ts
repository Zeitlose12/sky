import type { GetItemsItems, Member, Profile } from "$types/global";
import type { Player } from "$types/raw/player/lib";
import { FAIRY_SOULS } from "../constants/constants";
import { REDIS } from "../db/redis";
import { fetchMuseum, getDisplayName, getProfiles } from "../lib";
import { getAPISettings } from "./api_settings";
import { getItems } from "./items";
import { getProfileMembers } from "./members";
import { getRank } from "./rank";
import { getSkills } from "./skills";
import { getSkyblockLevel } from "./skyblock_level";

export async function getMainStats(userProfile: Member, profile: Profile, player: Player, packs: string[]) {
  const timeNow = Date.now();

  fetchMuseum(profile.profile_id).then((museumData) => {
    getItems(userProfile, museumData?.[profile.uuid], packs, profile.profile_id).then((items: GetItemsItems) => {
      REDIS.set(`profile:${profile.profile_id}:items`, JSON.stringify(items), {
        EX: 60 * 5 // Cache for 5 minutes
      });

      const mainItems = { armor: items.armor, equipment: items.equipment, wardrobe: items.wardrobe };
      REDIS.set(`profile:${profile.profile_id}:main_items`, JSON.stringify(mainItems), {
        EX: 60 * 5 // Cache for 5 minutes
      });

      console.log(`Items set for ${profile.profile_id} after ${Date.now() - timeNow}ms`);
    });
  });

  const [profiles, members] = await Promise.all([getProfiles(profile.uuid), getProfileMembers(profile.members)]);

  return {
    displayName: getDisplayName(player.displayname, profile.uuid),
    username: player.displayname,
    uuid: profile.uuid,
    profile_id: profile.profile_id,
    profile_cute_name: profile.cute_name,
    game_mode: profile.game_mode,
    selected: profile.selected,
    rank: getRank(player),
    social: player.socialMedia?.links ?? {},

    skills: getSkills(userProfile, profile, null),
    joined: userProfile.profile?.first_join ?? 0,
    // cookieBuffActive: userProfile.profile?.cookie_buff_active ?? false, // TODO: Implement cookie buff on the frontend
    purse: userProfile.currencies?.coin_purse ?? 0,
    bank: profile.banking?.balance ?? 0,
    personalBank: userProfile.profile?.bank_account ?? 0,
    fairySouls: {
      found: userProfile.fairy_soul?.total_collected ?? 0,
      total: FAIRY_SOULS[profile.game_mode ?? "normal"] ?? FAIRY_SOULS["normal"]
    },

    profiles,
    members,
    skyblock_level: getSkyblockLevel(userProfile),
    apiSettings: getAPISettings(profile, userProfile, null)
  };
}
