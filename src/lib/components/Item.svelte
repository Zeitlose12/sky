<script lang="ts">
  import type { IsHover } from "$lib/hooks/is-hover.svelte";
  import { RARITIES, RARITY_COLORS } from "$lib/shared/constants/items";
  import { getRarityClass } from "$lib/shared/helper";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { itemContent, showItem } from "$lib/stores/internal";
  import { wikiOrderPreferences } from "$lib/stores/wiki";
  import type { ProcessedSkyBlockItem, ProcessedSkyblockPet } from "$lib/types/global";
  import { Avatar, Tooltip } from "bits-ui";
  import Image from "lucide-svelte/icons/image";
  import { IsInViewport } from "runed";
  import { getContext } from "svelte";
  import { derived as derivedStore } from "svelte/store";
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
  };

  let { piece, isInventory, showCount, showRecombobulated, tab }: Props = $props();
  let targetNode = $state<HTMLButtonElement>()!;
  let hasBeenInViewport = $state(false);

  const inViewport = new IsInViewport(() => targetNode, { rootMargin: "200px 0px", threshold: 0 });
  const skyblockItem = $derived(piece as ProcessedSkyBlockItem);
  const bgColor = $derived(getRarityClass(piece.rarity ?? ("common".toLowerCase() as string), "bg"));
  const recombobulated = $derived(showRecombobulated && (skyblockItem.recombobulated ?? false));
  const enchanted = $derived(skyblockItem.shiny);
  const shine = $derived(enchanted || skyblockItem.shiny);
  const showNumbers = $derived(showCount && (skyblockItem.Count ?? 0) > 1);

  const isHover = getContext<IsHover>("isHover");

  // Get the wiki link for the item
  const wikiInfo = derivedStore<typeof wikiOrderPreferences, { url: string; name: string } | undefined>(wikiOrderPreferences, ($wikiOrderPreferences) => {
    const wiki = skyblockItem.wiki as unknown as ProcessedSkyBlockItem["wiki"];
    if (!wiki) return undefined;

    // Try to get the preferred wiki link first, then fall back to any available link
    const preference = $wikiOrderPreferences[0].name.toLowerCase();

    // Type-safe approach: check if the preference is a valid key
    if (preference === "fandom" && wiki.fandom) {
      return { url: wiki.fandom, name: "Fandom" };
    } else if (preference === "official" && wiki.official) {
      return { url: wiki.official, name: "Official" };
    }

    // If no preferred links are available, return any available link or null
    if (wiki.fandom) {
      return { url: wiki.fandom, name: "Fandom" };
    } else if (wiki.official) {
      return { url: wiki.official, name: "Official" };
    }

    return undefined;
  });

  $effect(() => {
    if (inViewport.current && !hasBeenInViewport) {
      hasBeenInViewport = true;
    }
  });
</script>

<Tooltip.Root group="armor" disableHoverableContent={true} openDelay={0} closeDelay={0}>
  <Tooltip.Trigger
    oncontextmenu={(e) => {
      if (!$wikiInfo) return;
      e.preventDefault();
      window.open($wikiInfo.url, "_blank");
    }}
    class="nice-colors-dark"
    bind:el={targetNode}
    onclick={() => {
      if (skyblockItem.containsItems) return;
      itemContent.set(piece);
      showItem.set(true);
    }}>
    <div class={cn(`relative flex aspect-square items-center justify-center overflow-clip`, isInventory ? "p-0" : `rounded-lg p-2 ${bgColor}`)}>
      <div class={cn("absolute inset-0 rounded-lg", { shine: shine })}></div>
      {#if hasBeenInViewport}
        <Avatar.Root>
          <Avatar.Image loading="lazy" src={piece.texture_path} alt={piece.display_name} class="lazy data-[enchanted=true]:enchanted h-auto w-14 [image-rendering:pixelated] select-none" data-enchanted={enchanted} />
          <Avatar.Fallback>
            <Image class={cn(isInventory ? "size-8 sm:size-14" : "size-14")} />
          </Avatar.Fallback>
        </Avatar.Root>
      {:else}
        <div>
          <Image class={cn(isInventory ? "size-8 sm:size-14" : "size-14")} />
        </div>
      {/if}

      {#if recombobulated}
        <div class="absolute -top-3 -right-3 z-10 size-6 rotate-45 bg-(--color)" style="--color: var(--§{RARITY_COLORS[RARITIES[RARITIES.indexOf(piece.rarity ?? 'common') - 1]]})"></div>
      {/if}
      {#if showNumbers}
        <div class="text-shadow-[.1em_.1em_.1em_#000] absolute right-0.5 bottom-0.5 text-sm font-semibold text-white sm:text-2xl">
          {skyblockItem.Count}
        </div>
      {/if}
    </div>
  </Tooltip.Trigger>
  {#if isHover.current}
    <Tooltip.Content class="bg-background-lore font-icomoon z-50 flex max-h-[calc(96%-3rem)] max-w-lg flex-col overflow-hidden rounded-lg select-text" transition={flyAndScale} transitionConfig={{ x: -8, duration: 150 }} sideOffset={8} side="right" align="center">
      <Content {piece} {tab} wiki={$wikiInfo} />
    </Tooltip.Content>
  {/if}
</Tooltip.Root>
