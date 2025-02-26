<script lang="ts">
  import { RARITY_COLORS } from "$lib/shared/constants/items";
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { Tooltip } from "bits-ui";
  import type { Snippet } from "svelte";

  type Props = {
    text: string;
    data: string | number;
    subData?: string | undefined;
    asterisk?: boolean;
    maxed?: boolean;
    dataMaxed?: boolean;
    textRarityColor?: string | undefined;
    dataRarityColor?: string | undefined;
    subDataRarityColor?: string | undefined;
    class?: string | null | undefined;
    children?: Snippet;
  };

  let { text, data, subData = undefined, asterisk = false, maxed = false, dataMaxed = false, textRarityColor = undefined, dataRarityColor = undefined, subDataRarityColor = undefined, class: className = undefined, children }: Props = $props();

  let open = $state(false);
</script>

<Tooltip.Root bind:open group="additional-stats" openDelay={0} closeDelay={0}>
  <Tooltip.Trigger asChild let:builder>
    <button use:builder.action {...builder} class={cn(`text-text/60 my-0 flex items-center gap-1 font-bold data-[is-tooltip=false]:cursor-default`, { "text-maxed": maxed }, className)} data-is-tooltip={asterisk} onpointerdown={() => (open = !open)}>
      <div class={!asterisk ? cn("text-text/60 my-0 flex items-center gap-1 font-bold data-[is-tooltip=false]:cursor-default", { "text-maxed": maxed }, className) : "contents"}>
        <div style={textRarityColor ? `color: var(--§${RARITY_COLORS[textRarityColor]})` : ""} class="capitalize">
          {text}:
        </div>

        <span class={cn("-mr-0.5", maxed || dataMaxed ? "text-gold" : "text-text")}>
          <span style={dataRarityColor ? `color: var(--§${RARITY_COLORS[dataRarityColor]})` : ""}>
            {data}
          </span>

          {#if subData}
            <span class="text-text/80" style={subDataRarityColor ? `color: var(--§${RARITY_COLORS[subDataRarityColor]})` : ""}> {subData}</span>
          {/if}
        </span>

        {#if asterisk}
          *
        {/if}
      </div>
    </button>
  </Tooltip.Trigger>
  {#if asterisk}
    <Tooltip.Content class="bg-background-grey z-50 rounded-lg p-4" transition={flyAndScale} transitionConfig={{ y: 8, duration: 150 }} sideOffset={6} side="top" align="center">
      {@render children?.()}
      <Tooltip.Arrow />
    </Tooltip.Content>
  {/if}
</Tooltip.Root>
