<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { format } from "numerable";

  const ctx = getProfileCtx();
  const misc = $derived(ctx.misc);
</script>

{#if misc.season_of_jerry != null}
  <SectionSubtitle class="uppercase!">Season of Jerry</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        {#each Object.entries(misc.season_of_jerry) as [text, data]}
          <AdditionStat text={text.replaceAll("_", " ")} data={format(data)} />
        {/each}
      </div>
    {/snippet}
  </Items>
{/if}
