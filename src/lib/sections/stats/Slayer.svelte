<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import AdditionStat from "$lib/components/AdditionStat.svelte";
  import Bonus from "$lib/components/Bonus.svelte";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
  import { calculatePercentage } from "$lib/shared/helper";
  import { Avatar, Progress } from "bits-ui";
  import Image from "lucide-svelte/icons/image";
  import { format } from "numerable";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
  const slayer = $derived(profile.slayer);
</script>

<CollapsibleSection id="Slayer" {order}>
  <div class="space-y-4">
    {#if slayer.unlocked === false}
      <p class="space-x-0.5 leading-6">{profile.username} hasn't unlocked Slayers yet.</p>
    {:else}
      <div class="pt-4 pb-1.5">
        <AdditionStat text="Total Slayer XP" data={format(slayer.totalSlayerExp)} />
      </div>
      <div class="flex flex-wrap gap-5">
        {#each Object.entries(slayer.data) as [key, value], index (index)}
          {#if value.level.xp > 0}
            <div class="bg-background/30 relative flex min-w-[min(20.625rem,100vw)] flex-col items-center gap-1 space-y-5 overflow-hidden rounded-lg">
              <div class="border-icon flex w-full items-center justify-center gap-1.5 border-b-2 py-2 text-center font-semibold uppercase">
                <Avatar.Root>
                  <Avatar.Image loading="lazy" src={value.texture} class="size-8 object-contain" />
                  <Avatar.Fallback>
                    <Image class="size-8" />
                  </Avatar.Fallback>
                </Avatar.Root>
                {value.name}
              </div>
              <div class="flex h-full w-full flex-wrap gap-5 px-5 uppercase">
                {#each Object.entries(value.kills) as [key, killValue], index (index)}
                  <div class="text-text/60 flex flex-col items-center gap-1 text-sm font-bold">
                    <span>
                      {#if !isNaN(Number(key))}
                        Tier {["I", "II", "III", "IV", "V"][Number(key) - 1]}
                      {:else}
                        {key}
                      {/if}
                    </span>
                    <span class="text-text">
                      {format(killValue)}
                    </span>
                  </div>
                {/each}
              </div>
              <div class="w-full">
                <p class="text-text/60 mb-2 w-full space-y-5 px-5 text-center font-semibold capitalize">
                  {key} Level {value.level.level}
                </p>

                <Progress.Root value={value.level.xp} max={value.level.xpForNext} class="bg-text/30 group h-4 w-full overflow-hidden" data-maxed={value.level.maxed}>
                  <div class="absolute z-10 flex h-full w-full justify-center">
                    <div class="shadow-background/50 text-shadow text-xs font-semibold">
                      {#if value.level.maxed}
                        {format(value.level.xp)}
                      {:else}
                        {format(value.level.xp)} / {format(value.level.xpForNext)}
                      {/if}
                      XP
                    </div>
                  </div>
                  <div class="h-full w-full flex-1 transition-all duration-1000 ease-in-out group-data-[maxed=false]:[background:var(--skillbar)] group-data-[maxed=true]:[background:var(--maxedbar)]" style={`transform: translateX(-${100 - parseFloat(calculatePercentage(value.level.xp, value.level.maxed ? value.level.xp : value.level.xpForNext))}%)`}></div>
                </Progress.Root>
              </div>
            </div>
          {/if}
        {/each}
      </div>
      <Bonus title="Bonus:" stats={slayer.stats} />
    {/if}
  </div>
</CollapsibleSection>
