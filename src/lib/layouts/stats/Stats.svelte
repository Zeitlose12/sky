<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import Stat from "$lib/components/Stat.svelte";
  import { getPlayerStats } from "$lib/shared/player_stats";
  import type { Stats } from "$types/stats";
  import { Collapsible } from "bits-ui";
  import { quadInOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const stats = $derived(getPlayerStats(profile as unknown as Stats));
</script>

<div class="stats flex flex-col">
  <Collapsible.Root>
    <Collapsible.Content forceMount class="columns-[12.5rem]">
      {#snippet child({ props, open })}
        {#if open}
          <div {...props} transition:slide={{ duration: 300, easing: quadInOut }}>
            {#each Object.entries(stats) as [statName, statData], index (index)}
              {#if statData.total > 0}
                <Stat stat={statName} {statData} />
              {/if}
            {/each}
          </div>
        {/if}
      {/snippet}
    </Collapsible.Content>
    <Collapsible.Trigger class="bg-text/10 mx-auto mt-3.5 w-full rounded-full p-2.5 text-xs font-semibold uppercase">Show Stats</Collapsible.Trigger>
  </Collapsible.Root>
</div>
