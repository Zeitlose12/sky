<script lang="ts">
  import { RARITIES, RARITY_COLORS } from "$lib/shared/constants/items";
  import { getRarityClass } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import { getItemQuery, itemContent, itemTab, showItem, showItemTooltip, tooltipAnchor } from "$lib/stores/internal";
  import type { ItemV2 } from "$types/statsv2";
  import Image from "@lucide/svelte/icons/image";
  import { Avatar, Tooltip, type AvatarImageLoadingStatus } from "bits-ui";
  import { IsInViewport } from "runed";

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
  let loadingStatus = $state<AvatarImageLoadingStatus>();

  const item = getItemQuery(piece.uuid);

  const inViewport = new IsInViewport(() => targetNode, { rootMargin: "200px 0px", threshold: 0 });
  const skyblockItem = $derived({ ...piece, ...$item.data });
  const bgColor = $derived(getRarityClass(piece.rarity ?? ("common".toLowerCase() as string), "bg"));
  const recombobulated = $derived(showRecombobulated && (skyblockItem.recombobulated ?? false));
  const enchanted = $derived(skyblockItem.texture_path.includes("/api/leather/") ? false : skyblockItem.shiny);
  const shine = $derived(enchanted || skyblockItem.shiny);
  const showNumbers = $derived(showCount && (skyblockItem.Count ?? 0) > 1);

  async function getItemData() {
    if ($item.isSuccess) return;
    await $item.refetch();
  }

  async function loadItemData(openValue: boolean, modal: boolean = false) {
    if (openValue) {
      itemContent.set(skyblockItem);
      itemTab.set(tab);
      getItemData();
      if (modal) {
        if (skyblockItem.containsItems) return;
        showItem.set(true);
      } else {
        if (targetNode) {
          tooltipAnchor.set(targetNode);
          showItemTooltip.set(true);
        }
      }
    } else {
      showItemTooltip.set(false);
      tooltipAnchor.set(null!);
      itemContent.set(undefined!);
      itemTab.set(undefined!);
    }
  }

  $effect(() => {
    if (inViewport.current && !hasBeenInViewport) {
      hasBeenInViewport = true;
      loadingStatus = "loading";
    }
  });
</script>

<Tooltip.Root bind:open disableHoverableContent={true} ignoreNonKeyboardFocus={true} disabled={!inViewport.current} delayDuration={100} onOpenChange={async (open) => await loadItemData(open)}>
  <Tooltip.Trigger class={cn(`nice-colors-dark relative flex aspect-square items-center justify-center overflow-clip`, isInventory ? "p-0" : `rounded-lg p-2 ${bgColor}`)} bind:ref={targetNode} onpointerdown={async () => await loadItemData(true, true)}>
    {#snippet child({ props })}
      <div {...props}>
        {#if shine}
          <div class="shine absolute inset-0 rounded-lg"></div>
        {/if}
        {#if hasBeenInViewport || loadingStatus === "loading" || loadingStatus === "error"}
          <Avatar.Root bind:loadingStatus>
            {#snippet child({ props })}
              <Avatar.Image loading="lazy" src={piece.texture_path} alt={piece.display_name} class="lazy data-[enchanted=true]:enchanted h-auto w-14 select-none [image-rendering:pixelated]" data-enchanted={enchanted} {...props} />
            {/snippet}
          </Avatar.Root>
        {:else}
          <Image class={cn(isInventory ? "size-8 sm:size-14" : "size-14")} />
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
    {/snippet}
  </Tooltip.Trigger>
</Tooltip.Root>
