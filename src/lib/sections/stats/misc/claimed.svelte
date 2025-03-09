<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { formatDate, formatDistanceToNowStrict } from "date-fns";

  const ctx = getProfileCtx();
  const misc = $derived(ctx.misc);
</script>

{#if misc.claimed_items != null}
  <SectionSubtitle class="uppercase!">Claimed Items</SectionSubtitle>
  <Items>
    {#snippet text()}
      <div>
        {#each Object.entries(misc.claimed_items) as [item, time], index (index)}
          <AdditionStat
            text={item.replaceAll("_", " ")}
            data={formatDistanceToNowStrict(time, {
              addSuffix: true
            })}
            asterisk={true}>
            {formatDate(time, "'Claimed on' dd MMMM yyyy 'at' HH:mm")}
          </AdditionStat>
        {/each}
      </div>
    {/snippet}
  </Items>
{/if}
