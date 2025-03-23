<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import Item from "$lib/components/Item.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { renderLore, titleCase } from "$lib/shared/helper";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Image from "@lucide/svelte/icons/image";
  import { Avatar, Collapsible } from "bits-ui";
  import { format } from "numerable";
  import { fade } from "svelte/transition";

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const highestPriorityFishingTool = $derived(profile.items.fishing_tools.highest_priority_tool);
  const fishingTools = $derived(profile.items.fishing_tools.tools);
</script>

<SectionSubtitle>Fishing</SectionSubtitle>
<div class="space-y-0.5">
  <AdditionStat text="Items Fished" data={format(profile.fishing.itemsFished)} />
  <AdditionStat text="Treasures Fished" data={format(profile.fishing.treasure)} />
  <AdditionStat text="Large Treasures Fished" data={format(profile.fishing.treasureLarge)} />
  <AdditionStat text="Sea Creatures Killed" data={format(profile.fishing.seaCreaturesFished)} />
  {#if profile.fishing.trophyFish}
    <AdditionStat text="Trophy Fish Fished" data={format(profile.fishing.trophyFish.totalCaught)} />
  {/if}
</div>

<SectionSubtitle>Fishing Rods</SectionSubtitle>
{#if fishingTools.length > 0}
  <Items>
    {#snippet text()}
      <div class="space-y-2">
        {#if highestPriorityFishingTool && highestPriorityFishingTool.display_name}
          <p class="text-text/60 space-x-0.5 leading-6 font-bold capitalize">
            <span>Active Rod:</span>
            {@html renderLore(highestPriorityFishingTool.display_name)}
          </p>
        {/if}
      </div>
    {/snippet}
    {#each fishingTools as tool, index (index)}
      <Item piece={tool} />
    {/each}
  </Items>
{:else}
  <p class="space-x-0.5 leading-6">{profile.username} doesn't have any fishing tools.</p>
{/if}

{#if Object.entries(profile.fishing.kills).find(([_, seaCreature]) => seaCreature.amount > 0)}
  <Collapsible.Root>
    <Collapsible.Trigger class="group flex items-center gap-0.5 pt-4">
      <ChevronDown class="size-5 transition-all duration-300 group-data-[state=open]:-rotate-180" />
      <SectionSubtitle class="my-0">Sea Creatures</SectionSubtitle>
    </Collapsible.Trigger>
    <Collapsible.Content class="mt-4 flex flex-wrap gap-4">
      {@const seaCreatures = Object.entries(profile.fishing.kills)}
      <ScrollItems>
        {#each seaCreatures as [_, seaCreature], index (index)}
          <div class="bg-background/30 flex h-full max-h-56 flex-col rounded-lg p-2 whitespace-nowrap" in:fade|global={{ duration: 300, delay: 25 * (index + 1) }} out:fade|global={{ duration: 300, delay: 5 * (seaCreatures.length - index) }}>
            <div class="border-icon flex h-12 items-center justify-center border-b-2 pb-2 text-center font-bold">
              {seaCreature.name}
            </div>
            <div class="mt-2 flex h-full w-full flex-col items-center justify-center gap-4">
              <Avatar.Root class="flex items-center justify-center">
                <Avatar.Image loading="lazy" src={seaCreature.texture} class="aspect-square size-24 object-contain" />
                <Avatar.Fallback>
                  <Image class="size-24" />
                </Avatar.Fallback>
              </Avatar.Root>
              <div class="text-center font-bold">
                {seaCreature.amount} <span class="text-text/60">Kills</span>
              </div>
            </div>
          </div>
        {/each}
      </ScrollItems>
    </Collapsible.Content>
  </Collapsible.Root>
{/if}

{#if profile.fishing.trophyFish != null && profile.fishing.trophyFish.totalCaught > 0}
  <Collapsible.Root>
    <Collapsible.Trigger class="group flex items-center gap-0.5 pt-4">
      <ChevronDown class="size-5 transition-all duration-300 group-data-[state=open]:-rotate-180" />
      <SectionSubtitle class="my-0">Trophy Fish</SectionSubtitle>
    </Collapsible.Trigger>
    <Collapsible.Content class="mt-4 space-y-4">
      <div class="space-y-0.5">
        {#if profile.fishing.trophyFish}
          <AdditionStat text="Total Caught" data={format(profile.fishing.trophyFish.totalCaught)} />
          <AdditionStat text="Current Stage" data={profile.fishing.trophyFish.stage.name} asterisk={true}>
            <div class="mb-4">
              {#each profile.fishing.trophyFish.stage.progress as tier, index (index)}
                <AdditionStat text={titleCase(tier.tier)} data={`${tier.caught} / ${tier.total}`} />
              {/each}
            </div>
          </AdditionStat>
        {/if}
      </div>

      {#if profile.fishing.trophyFish}
        {@const trophyFishes = Object.entries(profile.fishing.trophyFish.trophyFish)}

        <ScrollItems>
          {#each trophyFishes as [_, trophyFish], index (index)}
            <Chip class="px-4 whitespace-nowrap" animationOptions={{ animate: true, amountOfItems: trophyFishes.length, index: index }} image={{ src: trophyFish.texture }}>
              <div class="flex flex-col">
                <div class="flex flex-col gap-0.5">
                  <h4 class="text-text/60 font-bold">{trophyFish.name} <span class="text-text/70 font-medium">x{format(trophyFish.bronze + trophyFish.silver + trophyFish.gold + trophyFish.diamond)}</span></h4>
                </div>
                <div class="grid grid-cols-2 grid-rows-2">
                  <div class="flex items-center gap-1">
                    <div class="size-4 rounded-full bg-[oklch(55.23%_0.1295_59.21)]"></div>
                    {format(trophyFish.bronze)}
                  </div>
                  <div class="flex items-center gap-1">
                    <div class="size-4 rounded-full bg-[oklch(77.02%_0.0014_286.37)]"></div>
                    {format(trophyFish.silver)}
                  </div>
                  <div class="flex items-center gap-1">
                    <div class="size-4 rounded-full bg-[oklch(82.61%_0.1706_80.88)]"></div>
                    {format(trophyFish.gold)}
                  </div>
                  <div class="flex items-center gap-1">
                    <div class="size-4 rounded-full bg-[oklch(87.66%_0.1178_208.16)]"></div>
                    {format(trophyFish.diamond)}
                  </div>
                </div>
              </div>
              {#snippet tooltip()}
                {@html renderLore(trophyFish.description)}
              {/snippet}
            </Chip>
          {/each}
        </ScrollItems>
      {/if}
    </Collapsible.Content>
  </Collapsible.Root>
{/if}
