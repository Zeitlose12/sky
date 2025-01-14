<script lang="ts">
  import type { IsHover } from "$lib/hooks/is-hover.svelte";
  import { RARITIES, RARITY_COLORS } from "$lib/shared/constants/items";
  import { getRarityClass } from "$lib/shared/helper";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { itemContent, showItem } from "$lib/stores/internal";
  import type { ProcessedSkyBlockItem, ProcessedSkyblockPet } from "$lib/types/global";
  import { Avatar, Tooltip } from "bits-ui";
  import Image from "lucide-svelte/icons/image";
  import { getContext } from "svelte";
  import { fade, type FadeParams } from "svelte/transition";
  import Content from "./item/item-content.svelte";

  type Props = {
    piece: ProcessedSkyBlockItem | ProcessedSkyblockPet;
    isInventory?: boolean;
    showCount?: boolean;
    showRecombobulated?: boolean;
    tab?: {
      name: string;
      icon: string;
    };
    inTransitionConfig?: FadeParams;
  };
  let { piece, isInventory, showCount, showRecombobulated, tab, inTransitionConfig }: Props = $props();

  const skyblockItem = $derived(piece as ProcessedSkyBlockItem);
  const bgColor = $derived(getRarityClass(piece.rarity ?? ("common".toLowerCase() as string), "bg"));
  const recombobulated = $derived(showRecombobulated && (skyblockItem.recombobulated ?? false));
  const enchanted = $derived(skyblockItem.shiny);
  const shine = $derived(enchanted || skyblockItem.shiny);
  const showNumbers = $derived(showCount && (skyblockItem.Count ?? 0) > 1);

  const isHover = getContext<IsHover>("isHover");
</script>

<Tooltip.Root group="armor" disableHoverableContent={true} openDelay={0} closeDelay={0}>
  <Tooltip.Trigger asChild let:builder>
    <button
      class={cn(`nice-colors-dark relative flex aspect-square items-center justify-center overflow-clip`, isInventory ? "rounded bg-text/[0.04] p-0 group-data-[state=active]/inventory-tab:bg-text/10" : `rounded-lg p-2 ${bgColor}`, { shine: shine })}
      use:builder.action
      {...builder}
      in:fade|global={inTransitionConfig ?? { duration: 0 }}
      onclick={() => {
        if (skyblockItem.containsItems) return;
        itemContent.set(piece);
        showItem.set(true);
      }}>
      <Avatar.Root class="flex items-center justify-center">
        <Avatar.Image loading="lazy" src={piece.texture_path} alt={piece.display_name} class="data-[enchanted=true]:enchanted h-auto w-14 select-none [image-rendering:pixelated]" data-enchanted={enchanted} />
        <Avatar.Fallback>
          <Image class={cn(isInventory ? "size-8 sm:size-14" : "size-14")} />
        </Avatar.Fallback>
      </Avatar.Root>
      {#if recombobulated}
        <div class="absolute -right-3 -top-3 z-10 size-6 rotate-45 bg-[--color]" style="--color: var(--§{RARITY_COLORS[RARITIES[RARITIES.indexOf(piece.rarity ?? 'common') - 1]]})"></div>
      {/if}
      {#if showNumbers}
        <div class="absolute bottom-0.5 right-0.5 text-sm font-semibold text-white text-shadow-[.1em_.1em_.1em_#000] sm:text-2xl">
          {skyblockItem.Count}
        </div>
      {/if}
    </button>
  </Tooltip.Trigger>
  {#if isHover.current}
    <Tooltip.Content class="z-50 flex max-h-[calc(96%-3rem)] max-w-lg select-text flex-col overflow-hidden rounded-lg bg-background-lore font-icomoon" transition={flyAndScale} transitionConfig={{ x: -8, duration: 150 }} sideOffset={8} side="right" align="center">
      <Content {piece} {tab} />
    </Tooltip.Content>
  {/if}
</Tooltip.Root>
