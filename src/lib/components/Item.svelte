<script lang="ts">
  import type { IsHover } from "$lib/hooks/is-hover.svelte";
  import { RARITIES, RARITY_COLORS } from "$lib/shared/constants/items";
  import { getRarityClass } from "$lib/shared/helper";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { getItemQuery, itemContent, showItem } from "$lib/stores/internal";
  import type { ItemV2 } from "$types/statsv2";
  import Image from "@lucide/svelte/icons/image";
  import { Avatar, Tooltip } from "bits-ui";
  import { IsInViewport } from "runed";
  import { getContext } from "svelte";
  import Content from "./item/item-content.svelte";

  type Props = {
    piece: ItemV2;
    isInventory?: boolean;
    showCount?: boolean;
    showRecombobulated?: boolean;
    tab?: {
      name: string;
      icon: string;
    };
  };

  let { piece, isInventory, showCount, showRecombobulated, tab }: Props = $props();
  let targetNode = $state<HTMLButtonElement | null>(null);
  let hasBeenInViewport = $state(false);
  let open = $state(false);

  const item = getItemQuery(piece.uuid);

  const inViewport = new IsInViewport(() => targetNode, { rootMargin: "200px 0px", threshold: 0 });
  const skyblockItem = $derived({ ...piece, ...$item.data });
  const bgColor = $derived(getRarityClass(piece.rarity ?? ("common".toLowerCase() as string), "bg"));
  const recombobulated = $derived(showRecombobulated && (skyblockItem.recombobulated ?? false));
  const enchanted = $derived(skyblockItem.texture_path.includes("/api/leather/") ? false : skyblockItem.shiny);
  const shine = $derived(enchanted || skyblockItem.shiny);
  const showNumbers = $derived(showCount && (skyblockItem.Count ?? 0) > 1);

  const isHover = getContext<IsHover>("isHover");

  async function getItemData() {
    if ($item.isSuccess) return;
    await $item.refetch();
  }

  $effect(() => {
    if (inViewport.current && !hasBeenInViewport) {
      hasBeenInViewport = true;
    }
  });
</script>

<Tooltip.Root
  bind:open
  disableHoverableContent={true}
  ignoreNonKeyboardFocus={true}
  delayDuration={100}
  onOpenChange={async (open) => {
    if (open) getItemData();
  }}>
  <Tooltip.Trigger
    class="nice-colors-dark"
    bind:ref={targetNode}
    onclick={() => {
      itemContent.set(skyblockItem);
      if (!isHover.current) getItemData();
      if (skyblockItem.containsItems) return;
      showItem.set(true);
    }}>
    <div class={cn(`relative flex aspect-square items-center justify-center overflow-clip`, isInventory ? "p-0" : `rounded-lg p-2 ${bgColor}`)}>
      <div class={cn("absolute inset-0 rounded-lg", { shine: shine })}></div>
      {#if hasBeenInViewport}
        <Avatar.Root>
          <Avatar.Image loading="lazy" src={piece.texture_path} alt={piece.display_name} class="lazy data-[enchanted=true]:enchanted h-auto w-14 select-none [image-rendering:pixelated]" data-enchanted={enchanted} />
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
  <Tooltip.Portal>
    {#if isHover.current}
      <Tooltip.Content forceMount class="bg-background-lore font-icomoon z-50 flex max-h-[calc(96vh-3rem)] max-w-lg flex-col overflow-clip rounded-lg select-text" sideOffset={8} side="right" align="center">
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale={{ y: 8, duration: 150 }}>
                {#if $item.error}
                  An error has occurred:
                  {$item.error.message}
                {:else}
                  <Content piece={skyblockItem} {tab} isLoading={$item.isPending} />
                {/if}
              </div>
            </div>
          {/if}
        {/snippet}
      </Tooltip.Content>
    {/if}
  </Tooltip.Portal>
</Tooltip.Root>
