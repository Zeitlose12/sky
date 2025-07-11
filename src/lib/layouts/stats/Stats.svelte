<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import Error from "$lib/components/Error.svelte";
  import Stat from "$lib/components/Stat.svelte";
  import { api, SectionName } from "$lib/shared/api";
  import type { PlayerStatsV2 } from "$types/statsv2";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { createQuery } from "@tanstack/svelte-query";
  import { Collapsible } from "bits-ui";
  import { quadInOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const profileUUID = $derived(profile.uuid);
  const profileId = $derived(profile.profile_id);

  const query = createQuery<PlayerStatsV2>({
    queryKey: [SectionName.STATS, profileUUID, profileId],
    queryFn: () => api(fetch).getSection(SectionName.STATS, profileUUID, profileId),
    enabled: false
  });

  const stats = $derived.by(() => {
    if ($query.isPending || $query.error || !$query.data) return;
    return $query.data;
  });
</script>

<div class="stats flex flex-col">
  <Collapsible.Root
    onOpenChange={(open) => {
      if (open && !$query.isFetched) {
        $query.refetch();
      }
    }}>
    <Collapsible.Content forceMount class="columns-[12.5rem]">
      {#snippet child({ props, open })}
        {#if open}
          {#if $query.isPending}
            <LoaderCircle class="text-icon animate-spin" />
          {/if}
          {#if $query.error}
            <Error />
          {/if}
          {#if $query.isSuccess && $query.data && stats}
            <div {...props} transition:slide={{ duration: 300, easing: quadInOut }}>
              {#each Object.entries(stats) as [statName, statData], index (index)}
                {#if statData.total > 0}
                  <Stat stat={statName} {statData} />
                {/if}
              {/each}
            </div>
          {/if}
        {/if}
      {/snippet}
    </Collapsible.Content>
    <Collapsible.Trigger class="bg-text/10 mx-auto mt-3.5 w-full rounded-full p-2.5 text-xs font-semibold uppercase">Show Stats</Collapsible.Trigger>
  </Collapsible.Root>
</div>
