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
  import Content from "./item/item-content.svelte";

  type Props = {
    piece: ProcessedSkyBlockItem | ProcessedSkyblockPet;
    isInventory?: boolean;
    showCount?: boolean;
    showRecombobulated?: boolean;
  };

  let { piece, isInventory, showCount, showRecombobulated }: Props = $props();

  const skyblockItem = $derived(piece as ProcessedSkyBlockItem);
  const bgColor = $derived(getRarityClass(piece.rarity ?? ("common".toLowerCase() as string), "bg"));
  const recombobulated = $derived(showRecombobulated && (skyblockItem.recombobulated ?? false));
  const enchanted = $derived(skyblockItem.shiny);
  const shine = $derived(enchanted || skyblockItem.shiny);
  const showNumbers = $derived(showCount && (skyblockItem.Count ?? 0) > 1);

  const isHover = getContext<IsHover>("isHover");
</script>

<Tooltip.Root group="armor" disableHoverableContent={true} openDelay={0} closeDelay={0}>
  <Tooltip.Trigger
    class="nice-colors-dark"
    onclick={() => {
      if (skyblockItem.containsItems) return;
      itemContent.set(piece);
      showItem.set(true);
    }}>
    <div class={cn(`relative flex aspect-square items-center justify-center overflow-clip`, isInventory ? "p-0" : `rounded-lg p-2 ${bgColor}`)}>
      <div class={cn("absolute inset-0 rounded-lg", { shine: shine })}></div>
      <Avatar.Root>
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
    </div>
  </Tooltip.Trigger>
  {#if isHover.current}
    <Tooltip.Content class="z-50 flex max-h-[calc(96%-3rem)] max-w-lg select-text flex-col overflow-hidden rounded-lg bg-background-lore font-icomoon" transition={flyAndScale} transitionConfig={{ x: -8, duration: 150 }} sideOffset={8} side="right" align="center">
      <Content {piece} {isInventory} {showCount} {showRecombobulated} />
    </Tooltip.Content>
  {/if}
</Tooltip.Root>
