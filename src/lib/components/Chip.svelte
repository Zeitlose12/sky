<script lang="ts">
  import { cn, flyAndScale } from "$lib/shared/utils";
  import { Avatar, Tooltip } from "bits-ui";
  import Image from "lucide-svelte/icons/image";
  import { IsInViewport } from "runed";
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";

  type AnimationOptions =
    | {
        animate: true;
        index: number;
        amountOfItems: number;
      }
    | {
        animate: false;
        index?: number;
        amountOfItems?: number;
      };

  type ImageProps = {
    src: string;
    class?: string;
  };

  type Props = {
    animationOptions?: AnimationOptions;
    image: ImageProps;
    class?: string;
    children?: Snippet;
    progress?: Snippet;
    tooltip?: Snippet;
  };

  let { animationOptions = { animate: false }, image, class: classNames, children, progress, tooltip }: Props = $props();

  let targetNode = $state<HTMLDivElement>()!;
  let hasBeenInViewport = $state(false);

  const inViewport = new IsInViewport(() => targetNode, { rootMargin: "200px 0px", threshold: 0 });

  $effect(() => {
    if (inViewport.current && !hasBeenInViewport) {
      hasBeenInViewport = true;
    }
  });
</script>

<Tooltip.Root group="chip" openDelay={0} closeDelay={0}>
  <Tooltip.Trigger asChild let:builder>
    <div bind:this={targetNode} class={cn("bg-background/30 flex w-full max-w-fit items-center gap-2 rounded-lg py-2", classNames)} use:builder.action {...builder} in:fade|global={{ duration: animationOptions.animate ? 300 : 0, delay: animationOptions.animate ? 25 * (animationOptions.index + 1) : 0 }} out:fade|global={{ duration: animationOptions.animate ? 300 : 0, delay: animationOptions.animate ? 25 * (animationOptions.amountOfItems - animationOptions.index) : 0 }}>
      <div class="flex items-center gap-2 px-2">
        {#if hasBeenInViewport}
          <Avatar.Root class="aspect-square size-12">
            <Avatar.Image loading="lazy" src={image.src} class={cn("size-full object-contain", image.class)} />
            <Avatar.Fallback>
              <Image class="size-full" />
            </Avatar.Fallback>
          </Avatar.Root>
        {:else}
          <div>
            <Image class="size-12" />
          </div>
        {/if}
        {@render children?.()}
      </div>
      {@render progress?.()}
    </div>
  </Tooltip.Trigger>
  {#if tooltip}
    <Tooltip.Content class="bg-background-grey z-50 rounded-lg p-4" transition={flyAndScale} transitionConfig={{ y: 8, duration: 150 }} sideOffset={6} side="top" align="center">
      {@render tooltip()}
      <Tooltip.Arrow />
    </Tooltip.Content>
  {/if}
</Tooltip.Root>
