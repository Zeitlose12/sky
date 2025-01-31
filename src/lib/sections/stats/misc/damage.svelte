<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { format } from "numerable";

  const ctx = getProfileCtx();
  const misc = $derived(ctx.misc);
</script>

{#if misc.damage != null}
  <SectionSubtitle class="uppercase!">Damage</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        {#each Object.entries(misc.damage) as [text, data]}
          <AdditionStat text={text.replaceAll("_", " ")} data={format(data.toFixed(3))} />
        {/each}
      </div>
    {/snippet}
  </Items>
{/if}
