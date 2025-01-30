<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import { inviewportSections } from "$lib/stores/internal";
  import { sectionOrderPreferences } from "$lib/stores/preferences";
  import { Button, ScrollArea } from "bits-ui";
  import { onDestroy, onMount } from "svelte";

  let pinned = $state(false);
  let navbarElement = $state<HTMLDivElement>()!;
  let allLinks = $state<Record<string, HTMLAnchorElement>>({});
  let observer: IntersectionObserver;
  let firstActive = $derived(Object.entries($inviewportSections).find(([, v]: [string, boolean]) => v === true)?.[0]);

  function scrollToTab(smooth = true, element?: HTMLElement | null) {
    const link = element ?? document.querySelector<HTMLAnchorElement>(`[href="${location.hash}"]`);
    const scrollableParent = link?.parentElement?.parentElement as HTMLElement;

    if (link == null) {
      console.warn(`could not scroll to ${location.hash} tab because it does not exist`, link);
      return;
    }

    const behavior = smooth ? "smooth" : "auto";
    const left = link.offsetLeft + link.getBoundingClientRect().width / 2 - scrollableParent.getBoundingClientRect().width / 2;
    scrollableParent.scrollTo({ left, behavior });
  }

  function observerInit() {
    observer = new IntersectionObserver(([e]) => (pinned = e.intersectionRatio < 1), {
      threshold: [1],
      rootMargin: `-${parseInt(window.getComputedStyle(navbarElement).getPropertyValue("top")) + 1}px 0px` // shrink the viewport to element top value +1px to trigger observer when element has reach it's sticky position
    });

    observer.observe(navbarElement);
  }

  function observerCleanup() {
    if (observer) observer.disconnect();
  }

  onMount(() => {
    observerInit();
    return () => {
      observerCleanup();
    };
  });

  onDestroy(() => {
    observerCleanup();
  });

  $effect(() => {
    if (firstActive && page.state === "loaded") {
      scrollToTab(true, allLinks[firstActive]);
      replaceState("#" + firstActive, page.state);
    }
  });
</script>

<ScrollArea.Root type="scroll" class="navbar group sticky top-[calc(3rem+env(safe-area-inset-top,0))] z-20" data-pinned={pinned} bind:el={navbarElement}>
  <ScrollArea.Viewport>
    <ScrollArea.Content class="flex! flex-nowrap items-center gap-2 whitespace-nowrap pb-2 font-semibold text-text/80">
      <div class="absolute bottom-[0.4375rem] z-1 h-[2px] w-[calc(100%+0.5rem)] bg-icon"></div>
      <div class="group-data-[pinned=true]:group-data-[mode=light]/html:bg-[#f0f0f0]/92 absolute inset-0 bottom-2 group-data-[pinned=true]:group-data-[mode=dark]/html:bg-[#141414]/90"></div>
      {#each $sectionOrderPreferences as section}
        <Button.Root href="#{section.name}" class="relative px-2 py-3 after:absolute after:left-0 after:top-full after:h-0 after:w-full after:origin-top after:rounded-full after:bg-icon after:transition-all after:duration-100 hover:after:top-[calc(100%-4px)] hover:after:h-2 data-[active=true]:text-text data-[active=true]:after:top-[calc(100%-4px)] data-[active=true]:after:h-2" data-active={$inviewportSections[section.name]} bind:el={allLinks[section.name]}>
          {section.name?.replaceAll("_", " ")}
        </Button.Root>
      {/each}
    </ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>
