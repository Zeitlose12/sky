<script lang="ts">
  import { browser } from "$app/environment";
  import { getProfileCtx } from "$ctx/profile.svelte";
  import ItemContent from "$lib/components/item/item-content.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { IsHover } from "$lib/hooks/is-hover.svelte";
  import AdditionalStats from "$lib/layouts/stats/AdditionalStats.svelte";
  import PlayerProfile from "$lib/layouts/stats/PlayerProfile.svelte";
  import Skills from "$lib/layouts/stats/Skills.svelte";
  import Stats from "$lib/layouts/stats/Stats.svelte";
  import Sections from "$lib/sections/Sections.svelte";
  import { flyAndScale } from "$lib/shared/utils";
  import { itemContent, showItem } from "$lib/stores/internal";
  import { Button, Dialog } from "bits-ui";
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  import { Drawer } from "vaul-svelte";

  const isHover = getContext<IsHover>("isHover");

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
</script>

<SEO />

<div class="relative @container/parent">
  <div class="fixed left-0 top-1/2 z-10 hidden h-dvh w-[30vw] -translate-y-1/2 @container @[75rem]/parent:block">
    {#if browser && window.innerWidth >= 1200}
      {#await import('$lib/components/Skin3D.svelte') then { default: Skin3D }}
        <Skin3D class="h-full" />
      {/await}
    {/if}
  </div>

  <!-- ! Enable once 132549134 from https://webkit.org/blog/16186/release-notes-for-safari-technology-preview-206/ is added to stable  -->
  <!-- <div class="fixed right-0 top-0 min-h-dvh w-full backdrop-blur-lg group-data-[mode=dark]/html:backdrop-brightness-50 group-data-[mode=light]/html:backdrop-brightness-100 @[75rem]/parent:w-[calc(100%-30vw)]"></div> -->

  <main data-vaul-drawer-wrapper class="relative mx-auto mt-12 min-h-dvh backdrop-blur-lg @container group-data-[mode=dark]/html:backdrop-brightness-50 group-data-[mode=light]/html:backdrop-brightness-100 @[75rem]/parent:ml-[30vw]">
    {#if profile.errors && Object.keys(profile.errors).length > 0}
      <div class="space-y-5 bg-red-600 p-4 @[75rem]/parent:p-8">
        <h3 class="text-2xl font-semibold">An unexpected error has occurred</h3>
        {#each Object.entries(profile.errors) as [error, message]}
          {error}: {message}
        {/each}
        <p>Please report this error on our <Button.Root target="_blank" href="https://discord.gg/cNgADv2kEQ" class="underline">Discord</Button.Root></p>
      </div>
    {/if}
    <div class="space-y-5 p-4 @[75rem]/parent:p-8">
      <PlayerProfile />
      <Skills />
      <Stats />
      <AdditionalStats />
    </div>

    <Navbar />

    <div class="flex flex-col flex-nowrap gap-y-5 p-4 @[75rem]/parent:p-8">
      {#await import('$lib/components/APINotice.svelte') then { default: Notice }}
        <Notice />
      {/await}

      <Sections />
    </div>
  </main>
</div>

{#if isHover.current}
  <Dialog.Root
    bind:open={$showItem}
    onOpenChange={(open) => {
      if (!open) itemContent.set(undefined);
    }}>
    <Dialog.Portal>
      <Dialog.Overlay transition={fade} transitionConfig={{ duration: 150 }} class="fixed inset-0 z-40 bg-black/80" />
      <Dialog.Content class="fixed left-[50%] top-[50%] z-50 flex max-h-[calc(96%-3rem)] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 -translate-y-1/2 select-text flex-col overflow-hidden rounded-lg bg-background-lore font-icomoon" transition={flyAndScale} transitionConfig={{ x: -8, duration: 150 }}>
        {#if $itemContent}
          <ItemContent piece={$itemContent} />
        {/if}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
{:else}
  <Drawer.Root
    bind:open={$showItem}
    shouldScaleBackground={true}
    setBackgroundColorOnScale={false}
    onOpenChange={(open) => {
      if (!open) itemContent.set(undefined);
    }}>
    <Drawer.Portal>
      <Drawer.Overlay class="fixed inset-0 z-40 bg-black/80" />
      <Drawer.Content class="fixed bottom-0 left-0 right-0 z-50 flex max-h-[96%] flex-col rounded-t-[10px] bg-background-lore">
        {#if $itemContent}
          <ItemContent piece={$itemContent} isDrawer={true} />
        {/if}
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
{/if}

<svg xmlns="http://www.w3.org/2000/svg" height="0" width="0" style="position: fixed;">
  <filter id="enchanted-glint">
    <feImage href="/img/enchanted-glint.png" />
    <feComposite in2="SourceGraphic" operator="in" />
    <feBlend in="SourceGraphic" mode="screen" />
  </filter>
</svg>
