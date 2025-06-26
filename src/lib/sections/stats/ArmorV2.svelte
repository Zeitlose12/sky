<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import Bonus from "$lib/components/Bonus.svelte";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
  import Item from "$lib/components/Item.svelte";
  import Wardrobe from "$lib/components/Wardrobe.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { getRarityClass } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import { createQuery } from "@tanstack/svelte-query";
  import { ScrollArea } from "bits-ui";

  let { order }: { order: number } = $props();

  const query = createQuery({
    queryKey: ["items"],
    queryFn: async () => await fetch("/api/v2/items/9bef8fd9-82a8-4a0c-ba47-c3f6dfe8f836").then((r) => r.json())
  });

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const armor = $derived(profile.items.armor);
  const equipment = $derived(profile.items.equipment);
  const wardrobe = $derived(profile.items.wardrobe);
  const firstWardrobeItems = $derived(wardrobe.map((wardrobeItems) => wardrobeItems.find((piece) => piece)));
</script>

<CollapsibleSection id="Armor" {order}>

      {#if $query.isPending}
      Loading...
    {/if}
    {#if $query.error}
      An error has occurred:
      {$query.error.message}
    {/if}
    {#if $query.isSuccess}
      <div>
        <p>{$query.data}</p>
      </div>
    {/if}
  <!-- <Items>
    {#snippet text()}
      {#if armor.armor.length > 0 && !armor.armor.every((piece) => !piece.display_name)}
        {#if armor.set_name}
          <p class="text-text/60 space-x-0.5 leading-6 font-bold capitalize">
            <span>Set:</span>
            <span class={cn(getRarityClass(armor.set_rarity ?? "", "text"))}>{armor.set_name}</span>
          </p>
        {/if}
      {/if}
    {/snippet}

    {#if armor.armor.length > 0 && !armor.armor.every((piece) => !piece.display_name)}
      {#each armor.armor as piece, index (index)}
        {#if piece.display_name}
          <Item {piece} />
        {/if}
      {/each}
    {:else}
      <p class="space-x-0.5 leading-6">{profile.username} has no armor equipped</p>
    {/if}
    {#snippet info()}
      <Bonus stats={armor.stats} />
    {/snippet}
  </Items> -->

  <!-- <Items subtitle="Equipment">
    {#if equipment.equipment.length > 0}
      {#each equipment.equipment as piece, index (index)}
        <Item {piece} />
      {/each}
    {:else}
      <p class="space-x-0.5 leading-6">{profile.username} has no equipment equipped</p>
    {/if}
    {#snippet info()}
      <Bonus stats={equipment.stats} />
    {/snippet}
  </Items> -->

  <!-- {#if wardrobe.length > 0}
    <Items subtitle="Wardrobe">
      <div class="max-w-full"> -->
        <!-- min height was calc by: each piece of armor was 72px with a 8px gap and scrollbar was 2.5px and some more for gap for scrollbar -->
        <!-- <ScrollArea.Root class="relative min-h-[335px]" type="auto">
          <ScrollArea.Viewport>
            <div class="flex flex-row gap-6 md:gap-3">
              {#each firstWardrobeItems as _, i (i)}
                <div class="min-h-[4.5rem] min-w-[4.5rem]">
                  <Wardrobe wardrobeItems={wardrobe[i]} />
                </div>
              {/each}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="horizontal" class="mt-2 flex h-2.5 w-full touch-none rounded-full transition-all select-none">
            <ScrollArea.Thumb class="bg-icon flex rounded-full" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Root>
      </div>
    </Items>
  {/if} -->
</CollapsibleSection>
