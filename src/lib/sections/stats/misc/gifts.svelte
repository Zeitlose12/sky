<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { format } from "numerable";

  const ctx = getProfileCtx();
  const misc = $derived(ctx.misc);
</script>

{#if misc.gifts != null}
  <SectionSubtitle class="uppercase!">Gifts</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        {#each Object.entries(misc.gifts) as [text, data], index (index)}
          <AdditionStat text={text.replaceAll("_", " ")} data={format(data)} />
        {/each}
      </div>
    {/snippet}
  </Items>
{/if}
