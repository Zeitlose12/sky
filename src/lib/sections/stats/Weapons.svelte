<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
  import Error from "$lib/components/Error.svelte";
  import Item from "$lib/components/Item.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import { renderLore } from "$lib/shared/helper";
  import type { WeaponsV2 } from "$types/statsv2";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<WeaponsV2>({
    queryKey: [SectionName.WEAPONS, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.WEAPONS, profileUUID, profileId)
  });

  const weapons = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });
</script>

<CollapsibleSection id="Weapons" {order}>
  {#if $query.isPending}
    <LoaderCircle class="text-icon mx-auto animate-spin" />
  {/if}
  {#if $query.error}
    <Error />
  {/if}
  {#if $query.isSuccess && $query.data && weapons}
    {#if weapons.weapons.length}
      <Items>
        {#snippet text()}
          <div>
            {#if weapons.highest_priority_weapon?.display_name}
              <p class="font-bold">
                <span class="text-text/60">Active Weapon: </span>
                {@html renderLore(weapons.highest_priority_weapon.display_name)}
              </p>
            {/if}
          </div>
        {/snippet}

        {#if weapons.weapons.length}
          {#each weapons.weapons as weapon, index (index)}
            <Item piece={weapon} />
          {/each}
        {/if}
      </Items>
    {:else}
      <p class="space-x-0.5 leading-6">{profile.username} has no weapons</p>
    {/if}
  {/if}
</CollapsibleSection>
