<script lang="ts">
  import { cn } from "$lib/shared/utils";
  import type { ProcessedSkyBlockItem } from "$lib/types/global";
  import { Avatar } from "bits-ui";
  import Image from "lucide-svelte/icons/image";

  let { piece, isInventory }: { piece: ProcessedSkyBlockItem; isInventory?: boolean } = $props();
</script>

<div class="relative flex aspect-square items-center justify-center overflow-clip p-0">
  <div class="data-[enchanted=true]:shine absolute inset-0 rounded-lg" data-enchanted={piece.shiny}></div>
  <Avatar.Root>
    <Avatar.Image loading="lazy" src={piece.texture_path} alt={piece.display_name} class={cn("data-[enchanted=true]:enchanted h-auto w-14 [image-rendering:pixelated] select-none", isInventory ? "w-8" : "w-14")} data-enchanted={piece.shiny} />
    <Avatar.Fallback>
      <Image class={cn(isInventory ? "size-8" : "size-14")} />
    </Avatar.Fallback>
  </Avatar.Root>
</div>
