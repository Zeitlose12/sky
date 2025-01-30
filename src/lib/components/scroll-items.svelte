<script lang="ts">
  import { ScrollArea } from "bits-ui";
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
  };
  let { children }: Props = $props();
</script>

<ScrollArea.Root class="relative max-w-full" type="scroll">
  <ScrollArea.Viewport class="max-md:pb-4">
    <ScrollArea.Content class="flex! flex-nowrap gap-4 md:flex-wrap">
      {@render children?.()}
    </ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="horizontal" class="flex h-2.5 w-full touch-none select-none rounded-full transition-all md:hidden">
    <ScrollArea.Thumb class="flex rounded-full bg-icon" />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
