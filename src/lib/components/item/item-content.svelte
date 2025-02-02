<script lang="ts">
  import ContainedItem from "$lib/components/ContainedItem.svelte";
  import { packConfigs } from "$lib/shared/constants/packs";
  import { getRarityClass, removeFormatting, renderLore } from "$lib/shared/helper";
  import { cn } from "$lib/shared/utils";
  import type { ProcessedSkyBlockItem, ProcessedSkyblockPet } from "$lib/types/global";
  import { Avatar, Button } from "bits-ui";
  import Image from "lucide-svelte/icons/image";

  type Props = {
    piece: ProcessedSkyBlockItem | ProcessedSkyblockPet;
    isDrawer?: boolean;
    tab?: {
      name: string;
      icon: string;
    };
  };
  let { piece, isDrawer, tab }: Props = $props();

  const skyblockItem = $derived(piece as ProcessedSkyBlockItem);
  const itemName = $derived(skyblockItem.display_name ?? "???");
  const itemNameHtml = $derived(renderLore(itemName));
  const isMulticolor = $derived((itemNameHtml.match(/<\/span>/g) || []).length > 1);
  const bgColor = $derived(getRarityClass(piece.rarity ?? ("common".toLowerCase() as string), "bg"));
  const enchanted = $derived(skyblockItem.shiny);
  const packData = $derived(packConfigs.find((pack) => pack.id === skyblockItem.texture_pack));
</script>

<div class={cn(`nice-colors-dark flex flex-nowrap items-center justify-center gap-4 p-5`, { "rounded-t-[10px]": isDrawer }, bgColor)}>
  <Avatar.Root class="shrink-0 px-2">
    <Avatar.Image loading="lazy" src={piece.texture_path} alt={piece.display_name} class="data-[enchanted=true]:enchanted h-auto w-8 flex-none shrink-0 overflow-hidden [image-rendering:pixelated]" data-enchanted={enchanted} />
    <Avatar.Fallback>
      <Image class="size-8" />
    </Avatar.Fallback>
  </Avatar.Root>

  <p class="data-[multicolor=true]:bg-background-lore data-[multicolor=false]:text-text relative text-center text-base font-semibold text-wrap uppercase data-[multicolor=true]:rounded-full data-[multicolor=true]:px-2 data-[multicolor=true]:py-1 sm:text-lg" data-multicolor={isMulticolor}>
    {@html isMulticolor ? itemNameHtml : removeFormatting(itemNameHtml)}
  </p>
</div>
<div class="w-full overflow-auto">
  <div class="w-full p-6 leading-snug font-semibold">
    {#each skyblockItem.lore as lore}
      {@html renderLore(lore)}
    {/each}

    {#if Array.isArray(skyblockItem.containsItems) && !skyblockItem.containsItems.every((item) => Object.keys(item).length === 0)}
      <div class="border-text/10 mt-4 border-t pt-4">
        <div class="grid grid-cols-9 gap-1">
          {#each skyblockItem.containsItems.slice(0, Math.min(skyblockItem.containsItems.length, 54)) as containedItem}
            {#if containedItem.texture_path}
              <div class="bg-text/[0.04] flex aspect-square items-center justify-center rounded-sm">
                <ContainedItem piece={containedItem} isInventory={true} />
              </div>
            {:else}
              <div class="bg-text/[0.04] aspect-square rounded-sm"></div>
            {/if}
          {/each}
        </div>
      </div>
    {/if}

    {#if typeof tab === "object" && tab.icon}
      <div class="mt-4">
        <div class="bg-text/[0.05] hover:bg-text/[0.08] flex items-center justify-between gap-4 rounded-[0.625rem] p-2 transition-colors">
          <div class="flex items-center gap-2">
            <Avatar.Root class="shrink-0 select-none">
              <Avatar.Image loading="lazy" src={tab.icon} alt={tab.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none" />
              <Avatar.Fallback class="bg-icon/90 flex size-10 items-center justify-center rounded-lg text-center font-semibold uppercase">
                {tab.name.slice(0, 2)}
              </Avatar.Fallback>
            </Avatar.Root>
            <div class="text-link font-semibold">
              You can find this item in the <span class="capitalize">{tab.name}</span> tab
            </div>
          </div>
        </div>
      </div>
    {/if}
    {#if packData}
      <div class="mt-4">
        <Button.Root href={packData.link} target="_blank">
          <div class="bg-text/[0.05] hover:bg-text/[0.08] flex items-center justify-between gap-4 rounded-[0.625rem] p-2 transition-colors">
            <div class="flex items-center gap-2">
              <Avatar.Root class="shrink-0 select-none">
                <Avatar.Image loading="lazy" src="/resourcepacks/{packData.folder}/pack.png" alt={packData.name} class="pointer-events-none aspect-square size-10 h-full rounded-lg select-none" />
                <Avatar.Fallback class="bg-icon/90 flex size-10 items-center justify-center rounded-lg text-center font-semibold uppercase">
                  {packData.name.slice(0, 2)}
                </Avatar.Fallback>
              </Avatar.Root>
              <div class="flex flex-col">
                <div class="text-link font-semibold">
                  <span class="underline">
                    {packData.name}
                  </span>
                  <span class="text-text/60 text-sm">{packData.version}</span>
                </div>
                <div class="text-text/60 text-sm">
                  by <span class="text-text/80">{packData.author}</span>
                </div>
              </div>
            </div>
          </div>
        </Button.Root>
      </div>
    {/if}
  </div>
</div>
