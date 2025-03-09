<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
  import ScrollItems from "$lib/components/scroll-items.svelte";
  import SectionSubtitle from "$lib/components/SectionSubtitle.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { formatTime } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import { format } from "numerable";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const isle = $derived(profile.crimson_isle);
</script>

<CollapsibleSection id="Crimson Isle" {order}>
  <Items class="flex-col">
    {#snippet text()}
      <div>
        <AdditionStat text="Selected Faction" class="capitalize" data={isle.factions.selectedFaction} />
        <AdditionStat text="Mage Reputation" data={format(isle.factions.magesReputation)} maxed={isle.factions.magesReputation >= 12000} />
        <AdditionStat text="Barbarian Reputation" data={format(isle.factions.barbariansReputation)} maxed={isle.factions.barbariansReputation >= 12000} />
      </div>
    {/snippet}

    {#if isle.kuudra.totalKills}
      <div class="flex flex-col gap-4">
        <SectionSubtitle class="my-0">Kuudra Completions</SectionSubtitle>
        <AdditionStat text="Total Completions" data={isle.kuudra.totalKills} />
        <div class="flex flex-wrap gap-4">
          {#each isle.kuudra.tiers as tier, index (index)}
            {@const hasUnlocked = tier.kills}
            <Chip image={{ src: tier.texture }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
              <div class={cn("flex flex-col")}>
                <div class="font-bold">
                  <span class="opacity-60">{tier.name}</span>
                  <div class="text-sm">
                    <span class="opacity-60">Kills:</span>
                    <span class="text-text">{format(tier.kills)}</span>
                  </div>
                </div>
              </div>
            </Chip>
          {/each}
        </div>
      </div>
    {/if}

    {#if isle.dojo.totalPoints}
      <div class="flex flex-col gap-4">
        <SectionSubtitle class="my-0">Dojo Completions</SectionSubtitle>
        <AdditionStat text="Total Points" data={format(isle.dojo.totalPoints)} maxed={isle.dojo.totalPoints >= 7000} />
      </div>

      <ScrollItems>
        {#each isle.dojo.challenges as challenge, index (index)}
          {@const hasMaxed = challenge.points >= 1000}
          {@const hasUnlocked = challenge.points}
          <Chip image={{ src: challenge.texture }} class={cn("h-fit w-fit", { "opacity-50": !hasUnlocked })}>
            <div class={cn("flex flex-col")}>
              <div class="font-bold whitespace-nowrap">
                <span class={cn(hasMaxed ? "text-maxed" : "opacity-60")}>{challenge.name}</span>
                <div class="text-sm">
                  <span class="opacity-60">Points:</span>
                  <span class="text-text">{format(challenge.points)}</span>
                </div>
                <div class="text-sm">
                  <span class="opacity-60">Rank:</span>
                  <span class="text-text">{challenge.rank}</span>
                </div>
                <div class="text-sm">
                  <span class="opacity-60">Time:</span>
                  <span class="text-text">{formatTime(challenge.time)}</span>
                </div>
              </div>
            </div>
          </Chip>
        {/each}
      </ScrollItems>
    {/if}
  </Items>
</CollapsibleSection>
