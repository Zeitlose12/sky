<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import type { SectionName } from "$lib/sections/types";
  import { inviewportSections } from "$lib/stores/internal";
  import { sectionOrderPreferences } from "$lib/stores/preferences";
  import { Button, ScrollArea } from "bits-ui";
  import { onDestroy, onMount } from "svelte";

  let pinned = $state(false);
  let navbarElement = $state<HTMLDivElement>()!;
  let allLinks = $state<Record<string, HTMLAnchorElement>>({});
  let observer: IntersectionObserver;
  let lowestActive = $derived(
    Object.entries($inviewportSections)
      .filter(([, v]) => v === true)
      .reduce((lowest, [section]) => {
        if (!lowest) return section;
        const lowestElement = document.getElementById(lowest);
        const currentElement = document.getElementById(section);
        if (!lowestElement || !currentElement) return lowest;

        const lowestBottom = lowestElement.getBoundingClientRect().bottom;
        const currentBottom = currentElement.getBoundingClientRect().bottom;
        return currentBottom >= lowestBottom ? section : lowest;
      }, "")
  );

  function handleSectionClick(sectionName: string) {
    Object.keys($inviewportSections).forEach((key) => {
      $inviewportSections[key as SectionName] = false;
    });

    $inviewportSections[sectionName as SectionName] = true;
  }

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
    if (lowestActive && page.state === "loaded") {
      scrollToTab(true, allLinks[lowestActive]);
      replaceState("#" + lowestActive, page.state);
    }
  });
</script>

<ScrollArea.Root type="scroll" class="navbar group sticky top-[calc(3rem+env(safe-area-inset-top,0))] z-20" data-pinned={pinned} bind:el={navbarElement}>
  <ScrollArea.Viewport>
    <ScrollArea.Content class="text-text/80 flex! flex-nowrap items-center gap-2 pb-2 font-semibold whitespace-nowrap">
      <div class="bg-icon absolute bottom-[0.4375rem] z-1 h-[2px] w-[calc(100%+0.5rem)]"></div>
      <div class="absolute inset-0 bottom-2 group-data-[pinned=true]:group-data-[mode=dark]/html:bg-[#141414]/90 group-data-[pinned=true]:group-data-[mode=light]/html:bg-[#f0f0f0]/92"></div>
      {#each $sectionOrderPreferences as section}
        <Button.Root href="#{section.name}" class="after:bg-icon data-[active=true]:text-text relative px-2 py-3 after:absolute after:top-full after:left-0 after:h-0 after:w-full after:origin-top after:rounded-full after:transition-all after:duration-100 hover:after:top-[calc(100%-4px)] hover:after:h-2 data-[active=true]:after:top-[calc(100%-4px)] data-[active=true]:after:h-2" data-active={lowestActive === section.name} bind:el={allLinks[section.name]} on:click={() => handleSectionClick(section.name)}>
          {section.name?.replaceAll("_", " ")}
        </Button.Root>
      {/each}
    </ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>
