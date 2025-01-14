<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
  import Item from "$lib/components/Item.svelte";
  import type { ProcessedSkyBlockItem } from "$lib/types/stats";
  import { Avatar, ScrollArea, Tabs } from "bits-ui";
  import Image from "lucide-svelte/icons/image";
  import { cubicInOut } from "svelte/easing";
  import { crossfade, fade } from "svelte/transition";

  type Tabs = {
    id: string;
    icon: string;
    items: ProcessedSkyBlockItem[];
    gap: number;
  };

  let { order }: { order: number } = $props();
  let openTab = $state<string>("inv");
  let openStorageTab = $state<string>("0");
  let searchValue = $state<string>("");

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const inventory = $derived(profile.items.inventory.slice(9).concat(profile.items.inventory.slice(0, 9)));
  const backpack = $derived(profile.items.backpack);
  const enderchest = $derived(profile.items.enderchest);
  const vault = $derived(profile.items.personal_vault);
  const accs = $derived(profile.items.talisman_bag);
  const pots = $derived(profile.items.potion_bag);
  const fish = $derived(profile.items.fishing_bag);
  const quiver = $derived(profile.items.quiver);
  const museum = $derived(profile.items.museum);

  const tabs = $derived<Tabs[]>(
    [
      {
        id: "inv",
        icon: `https://crafatar.com/renders/head/${profile.uuid}?overlay`,
        items: inventory,
        gap: 27
      },
      {
        id: "storage",
        icon: "/api/item/chest",
        items: backpack,
        gap: 45
      },
      {
        id: "ender",
        icon: "/api/item/ender_chest",
        items: enderchest,
        gap: 45
      },
      {
        id: "vault",
        icon: "/api/head/f7aadff9ddc546fdcec6ed5919cc39dfa8d0c07ff4bc613a19f2e6d7f2593",
        items: vault,
        gap: 45
      },
      {
        id: "accs",
        icon: "/api/head/961a918c0c49ba8d053e522cb91abc74689367b4d8aa06bfc1ba9154730985ff",
        items: accs,
        gap: 45
      },
      {
        id: "pots",
        icon: "/api/head/9f8b82427b260d0a61e6483fc3b2c35a585851e08a9a9df372548b4168cc817c",
        items: pots,
        gap: 45
      },
      {
        id: "fish",
        icon: "/api/head/eb8e297df6b8dffcf135dba84ec792d420ad8ecb458d144288572a84603b1631",
        items: fish,
        gap: 45
      },
      {
        id: "quiver",
        icon: "/api/head/4cb3acdc11ca747bf710e59f4c8e9b3d949fdd364c6869831ca878f0763d1787",
        items: quiver,
        gap: 45
      },
      {
        id: "museum",
        icon: "/api/head/438cf3f8e54afc3b3f91d20a49f324dca1486007fe545399055524c17941f4dc",
        items: museum,
        gap: 54
      },
      {
        id: "search",
        icon: "/api/item/EYE_OF_ENDER",
        items: [],
        gap: 45
      }
    ].filter((tab) => tab.id === "search" || tab.items.length > 0)
  );

  const allItems = $derived.by(() => {
    return tabs.reduce((acc, tab) => {
      acc.push(...tab.items);
      return acc;
    }, [] as ProcessedSkyBlockItem[]);
  });

  const searchedItems = $derived.by(() => {
    const search = searchValue.trim();
    if (!search) return [];
    const searchedItem = allItems
      .map((item) => {
        const tab = tabs.find((t) => t.items.includes(item));
        return { item, sourceTab: { name: tab?.id || "", icon: tab?.icon || "" } };
      })
      .filter((item) => item.item.display_name?.toLowerCase().includes(searchValue.toLowerCase()))
      .slice(0, 45);
    return searchedItem;
  });

  const [send, receive] = crossfade({
    duration: 300,
    easing: cubicInOut
  });

  $effect(() => {
    if (openTab === "storage") {
      openStorageTab = "0";
    } else if (openTab === "museum") {
      openStorageTab = "19";
    }
  });
</script>

<CollapsibleSection id="Inventory" {order}>
  {#if allItems.length > 0}
    <Tabs.Root bind:value={openTab} class="relative mb-0 rounded-lg bg-background/30 p-5 pt-4 @container">
      <Tabs.List>
        <ScrollArea.Root>
          <ScrollArea.Viewport class="border-b border-icon">
            <ScrollArea.Content class="!flex h-full shrink-0 flex-nowrap items-center gap-3 whitespace-nowrap px-4">
              {#each tabs as tab}
                {@const isActive = openTab === tab.id}
                <Tabs.Trigger value={tab.id} class="group relative flex items-center justify-center gap-0.5 pb-2 text-xs uppercase">
                  <Avatar.Root class="size-8">
                    <Avatar.Image loading="lazy" src={tab.icon} class="size-8 object-contain" />
                    <Avatar.Fallback>
                      <Image class="size-8" />
                    </Avatar.Fallback>
                  </Avatar.Root>
                  {tab.id}
                  {#if isActive}
                    <div class="absolute -bottom-1 h-2 w-full rounded-full bg-icon" in:send={{ key: "active-tab" }} out:receive={{ key: "active-tab" }}></div>
                  {:else}
                    <div class="absolute -bottom-1 h-2 w-full rounded-full bg-icon opacity-0 transition-opacity duration-300 group-hover:opacity-100" out:fade={{ duration: 300 }}></div>
                  {/if}
                </Tabs.Trigger>
              {/each}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Tabs.List>

      {#each tabs as tab}
        <Tabs.Content value={tab.id} asChild let:builder>
          {#if openTab === tab.id}
            {#if tab.id === "storage" || tab.id === "museum"}
              <div use:builder.action {...builder}>
                <Tabs.Root bind:value={openStorageTab}>
                  <Tabs.List class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
                    {#each tab.items as item, index}
                      <Tabs.Trigger asChild let:builder value={item.display_name ? index.toString() : "undefined"}>
                        {#if item.display_name}
                          <div class="group/inventory-tab flex flex-1" in:fade|global={{ duration: 300, delay: 5 * (index + 1) }} use:builder.action {...builder}>
                            {@render itemSnippet(item, index)}
                          </div>
                        {:else}
                          {@render emptyItem(index)}
                        {/if}
                      </Tabs.Trigger>
                    {/each}
                  </Tabs.List>
                  {#if tab.items[Number(openStorageTab)]?.containsItems}
                    {@const containedItems = (tab.items[Number(openStorageTab)].containsItems as ProcessedSkyBlockItem[]) || []}
                    <div class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-8 @md:gap-1.5 @xl:gap-2">
                      {#each containedItems as containedItem, index}
                        {#if index > 0}
                          {#if index % 54 === 0}
                            {@render hr()}
                          {/if}
                        {/if}
                        <Tabs.Content value={openStorageTab.toString()} asChild>
                          {#key openStorageTab}
                            {#if containedItem.display_name}
                              {@render itemSnippet(containedItem, index)}
                            {:else}
                              {@render emptyItem(index)}
                            {/if}
                          {/key}
                        </Tabs.Content>
                      {/each}
                    </div>
                  {/if}
                </Tabs.Root>
              </div>
            {:else if tab.id === "search"}
              <input type="search" placeholder="Search inventory" class="mx-auto mt-4 block w-1/5 rounded-lg bg-text/10 px-2 py-2 font-normal text-text placeholder:text-text/80 focus-visible:outline-none" bind:value={searchValue} />
              {#if searchValue !== "" && searchedItems.length === 0}
                <p class="mx-auto w-fit leading-6">No items found.</p>
              {:else}
                <div use:builder.action {...builder} class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
                  {#each searchedItems as item, index}
                    {#if index > 0}
                      {#if index % 54 === 0}
                        {@render hr()}
                      {/if}
                    {/if}
                    {#if item.item}
                      {@render itemSnippet(item.item, index, item.sourceTab)}
                    {:else}
                      {@render emptyItem(index)}
                    {/if}
                  {/each}
                </div>
              {/if}
            {:else}
              <div use:builder.action {...builder} class="grid grid-cols-[repeat(9,minmax(1.875rem,4.875rem))] place-content-center gap-1 pt-5 @md:gap-1.5 @xl:gap-2">
                {#each tab.items as item, index}
                  {#if index > 0}
                    {#if index % tab.gap === 0}
                      {@render hr()}
                    {/if}
                  {/if}
                  {#if item.display_name}
                    {#if tab.id === "inv"}
                      {@render itemSnippet({ ...item, rarity: item.rarity ?? "uncommon" } as ProcessedSkyBlockItem, index)}
                    {:else}
                      {@render itemSnippet(item, index)}
                    {/if}
                  {:else}
                    {@render emptyItem(index)}
                  {/if}
                {/each}
              </div>
            {/if}
          {/if}
        </Tabs.Content>
      {/each}
    </Tabs.Root>
  {:else}
    <p class="space-x-0.5 leading-6">{profile.username} doesn't have any items.</p>
  {/if}
</CollapsibleSection>

{#snippet itemSnippet(item: ProcessedSkyBlockItem, index: number, tab?: { name: string; icon: string })}
  <Item piece={item} isInventory={true} showRecombobulated={false} showCount={true} inTransitionConfig={{ duration: 300, delay: 5 * (index + 1) }} {tab} />
{/snippet}

{#snippet emptyItem(index: number)}
  <div class="aspect-square rounded bg-text/[0.04]" in:fade|global={{ duration: 300, delay: 5 * (index + 1) }}></div>
{/snippet}

{#snippet hr()}
  <hr class="col-span-full h-4 border-0" />
{/snippet}
