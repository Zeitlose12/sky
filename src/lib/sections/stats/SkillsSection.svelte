<script lang="ts">
  import { setDynamicCtx } from "$ctx/dynamic.svelte";
  import { getProfileCtx } from "$ctx/profile.svelte";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
  import Error from "$lib/components/Error.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import type { SkillsV2 } from "$types/statsv2";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import Enchanting from "./skills/enchanting.svelte";
  import Farming from "./skills/farming.svelte";
  import Fishing from "./skills/fishing.svelte";
  import Mining from "./skills/mining.svelte";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<SkillsV2>({
    queryKey: [SectionName.SKILLS, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.SKILLS, profileUUID, profileId)
  });

  const skills = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });

  setDynamicCtx(SectionName.SKILLS, () => skills);
</script>

<CollapsibleSection id="Skills" class="pt-4" {order}>
  {#if $query.isPending}
    <LoaderCircle class="text-icon mx-auto animate-spin" />
  {/if}
  {#if $query.error}
    <Error />
  {/if}
  {#if $query.isSuccess && $query.data && skills}
    {#if profile.items && profile.items.mining_tools && profile.mining}
      <Mining />
    {:else}
      <p class="space-x-0.5 leading-6">{profile.username} doesn't have anything related to mining.</p>
    {/if}
    {#if profile.items && profile.items.farming_tools && profile.farming}
      <Farming />
    {:else}
      <p class="space-x-0.5 leading-6">{profile.username} doesn't have anything related to farming.</p>
    {/if}
    {#if profile.items && profile.items.fishing_bag && profile.fishing}
      <Fishing />
    {:else}
      <p class="space-x-0.5 leading-6">{profile.username} doesn't have anything related to fishing.</p>
    {/if}
    {#if profile.enchanting}
      <Enchanting />
    {:else}
      <p class="space-x-0.5 leading-6">{profile.username} doesn't have anything related to enchanting.</p>
    {/if}
  {/if}
</CollapsibleSection>
