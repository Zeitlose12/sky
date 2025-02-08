<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import { calculatePercentage, formatNumber, getRarityClass, renderLore } from "$lib/shared/helper";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import type { Garden } from "$types/processed/profile/garden";
  import { Avatar, Collapsible, Progress, Tooltip } from "bits-ui";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import Image from "lucide-svelte/icons/image";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";
  import { format } from "numerable";

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const gardenPromise = $derived<Promise<Garden>>(fetch(`/api/garden/${profile.profile_id.replaceAll("-", "")}`).then((res) => res.json()));
</script>

<Collapsible.Root>
  <Collapsible.Trigger class="group flex items-center gap-0.5">
    <ChevronDown class="size-5 transition-all duration-300 group-data-[state=open]:-rotate-180" />
    <SectionSubtitle class="my-0">Garden</SectionSubtitle>
  </Collapsible.Trigger>
  <Collapsible.Content>
    {#await gardenPromise}
      <LoaderCircle class="size-10 animate-spin" />
    {:then garden}
      {#if garden}
        {@const hasMaxed = garden.level.maxed}
        <div class="mt-2">
          <AdditionStat text="Level" data="{garden.level.level} / {garden.level.maxLevel}" maxed={hasMaxed} asterisk={true}>
            <h3 class="text-text/85 font-bold">
              XP:
              <span class="text-text">
                {format(garden.level.xp)}
              </span>
            </h3>
            <h3 class="text-text/85 font-bold">Progress to next level:</h3>
            <Progress.Root value={garden.level.xpCurrent} max={hasMaxed ? garden.level.xpCurrent : garden.level.xpForNext} class="bg-text/30 relative h-4 w-full overflow-hidden rounded-full">
              <div class="absolute z-10 flex h-full w-full justify-center">
                <div class="shadow-background/50 text-shadow text-xs font-semibold">
                  {formatNumber(garden.level.xpCurrent)} / {formatNumber(garden.level.xpForNext)}
                  XP
                </div>
              </div>
              <div class="bg-skillbar data-[maxed=true]:bg-maxedbar h-full w-full flex-1 rounded-full transition-all duration-1000 ease-in-out" style={`transform: translateX(-${100 - parseFloat(calculatePercentage(garden.level.xpCurrent, hasMaxed ? garden.level.xpCurrent : garden.level.xpForNext))}%)`} data-maxed={hasMaxed}></div>
            </Progress.Root>
          </AdditionStat>
          <AdditionStat text="Composter" data={Object.values(garden.composter).reduce((acc, curr) => acc + curr, 0)} asterisk={true}>
            {#each Object.entries(garden.composter) as [key, value]}
              <h3 class="text-text/85 font-bold">
                <span class="capitalize">{key.replaceAll("_", " ")}</span>:
                <span class="text-text">
                  {value}
                </span>
              </h3>
            {/each}
          </AdditionStat>
          <AdditionStat text="Visitors" data={format(garden.visitors.completed)} asterisk={true}>
            {#each Object.entries(garden.visitors.visitors) as [key, value]}
              <h3 class="text-text/85 font-bold">
                <span class={cn("capitalize", getRarityClass(key, "text"))}>{key}</span>:
                <span class="text-text">
                  {format(value.completed)}
                </span>
              </h3>
            {/each}
          </AdditionStat>
          <AdditionStat text="Unique Visitors" data={garden.visitors.uniqueVisitors} asterisk={true}>
            {#each Object.entries(garden.visitors.visitors) as [key, value]}
              <h3 class="text-text/85 font-bold">
                <span class={cn("capitalize", getRarityClass(key, "text"))}>{key}</span>:
                <span class="text-text">
                  {format(value.unique)}
                </span>
              </h3>
            {/each}
          </AdditionStat>
        </div>
        <div class="mt-5">
          {@render milestones(garden)}
        </div>
        <div class="mt-5">
          {@render upgrades(garden)}
        </div>
        <div class="mt-5">
          {@render plots(garden)}
        </div>
      {/if}
    {:catch}
      <p>Something went wrong while fetching the garden data. Please try again later.</p>
    {/await}
  </Collapsible.Content>
</Collapsible.Root>

{#snippet plots(garden: Garden)}
  <div class="mb-3 flex items-center gap-1 text-base font-semibold uppercase">
    <h3 class="text-xl">Plots</h3>
    <!-- TODO: Add maxed count -->
  </div>
  <div class="bg-background/30 @container relative mb-0 rounded-lg p-5">
    <div class="grid grid-cols-[repeat(5,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
      {#each garden.plot as plot}
        <Tooltip.Root openDelay={0} closeDelay={0} closeOnPointerDown={false} group="garden-plot">
          <Tooltip.Trigger>
            <Avatar.Root class="bg-text/[0.04] flex aspect-square items-center justify-center rounded-sm p-1">
              <Avatar.Image src={plot.texture_path} class="h-auto w-14 [image-rendering:pixelated] select-none" />
              <Avatar.Fallback>
                <Image class="size-full" />
              </Avatar.Fallback>
            </Avatar.Root>
          </Tooltip.Trigger>
          <Tooltip.Content class="bg-background-grey text-text/80 z-50 rounded-lg p-4 font-semibold" transition={flyAndScale} transitionConfig={{ y: 8, duration: 150 }} sideOffset={6} side="top" align="center">
            <Tooltip.Arrow />
            <p>{@html renderLore(plot.display_name)}</p>
          </Tooltip.Content>
        </Tooltip.Root>
      {/each}
    </div>
  </div>
{/snippet}

{#snippet upgrades(garden: Garden)}
  {@const allMaxed = Object.values(garden.cropUpgrades).every((upgrade) => upgrade.level.maxed)}
  <div class="mb-3 flex items-center gap-1 text-base font-semibold uppercase">
    <h3 class="text-xl">Upgrades</h3>
    {#if allMaxed}
      <span class="text-gold">Max!</span>
    {:else}
      <span class="text-text/80">({Object.values(garden.cropUpgrades).filter((upgrade) => upgrade.level.maxed).length} / {Object.values(garden.cropUpgrades).length} max)</span>
    {/if}
  </div>
  <ScrollItems>
    {#each garden.cropUpgrades as upgrade}
      {@const hasMaxed = upgrade.level.maxed}
      <Chip image={{ src: upgrade.texture }} class={cn("h-fit w-fit", { "opacity-50": !upgrade.level.level })}>
        <div class={cn("flex flex-col")}>
          <div class="font-bold whitespace-nowrap">
            <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{upgrade.name}</span>
            <span class={cn({ "text-gold": hasMaxed })}>{upgrade.level.level}</span>
          </div>
        </div>
      </Chip>
    {/each}
  </ScrollItems>
{/snippet}

{#snippet milestones(garden: Garden)}
  {@const allMaxed = Object.values(garden.cropMilestones).every((upgrade) => upgrade.level.maxed)}
  <div class="mb-3 flex items-center gap-1 text-base font-semibold uppercase">
    <h3 class="text-xl">Milestones</h3>
    {#if allMaxed}
      <span class="text-gold">Max!</span>
    {:else}
      <span class="text-text/80">({Object.values(garden.cropMilestones).filter((upgrade) => upgrade.level.maxed).length} / {Object.values(garden.cropUpgrades).length} max)</span>
    {/if}
  </div>
  <ScrollItems>
    {#each garden.cropMilestones as milestone}
      {@const hasMaxed = milestone.level.maxed}
      <Chip image={{ src: milestone.texture }} class={cn("h-fit w-fit flex-col overflow-clip pb-0", { "opacity-50": !milestone.level.xp })}>
        <div class={cn("flex flex-col")}>
          <div class="font-bold whitespace-nowrap">
            <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{milestone.name}</span>
            <span class={cn({ "text-gold": hasMaxed })}>{milestone.level.level}</span>
          </div>
        </div>

        {#snippet progress()}
          <Progress.Root value={milestone.level.xpCurrent} max={hasMaxed ? milestone.level.xpCurrent : milestone.level.xpForNext} class="relative h-4 w-full overflow-hidden ">
            <div class="absolute z-10 flex h-full w-full justify-center">
              <div class="shadow-background/50 text-shadow text-xs font-semibold">
                {formatNumber(milestone.level.xpCurrent)} / {formatNumber(milestone.level.xpForNext)}
                XP
              </div>
            </div>

            <div class="bg-skillbar data-[maxed=true]:bg-maxedbar h-full w-full flex-1 transition-all duration-1000 ease-in-out" style={`transform: translateX(-${100 - parseFloat(calculatePercentage(milestone.level.xpCurrent, hasMaxed ? milestone.level.xpCurrent : milestone.level.xpForNext))}%)`} data-maxed={hasMaxed}></div>
          </Progress.Root>
        {/snippet}
      </Chip>
    {/each}
  </ScrollItems>
{/snippet}
