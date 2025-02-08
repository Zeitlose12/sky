<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import CollapsibleSection from "$lib/components/CollapsibleSection.svelte";
  import Item from "$lib/components/Item.svelte";
  import Items from "$lib/layouts/stats/Items.svelte";
  import { renderLore } from "$lib/shared/helper";

  let { order }: { order: number } = $props();

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);
</script>

<CollapsibleSection id="Weapons" {order}>
  {#if profile.items.weapons.weapons.length}
    <Items>
      {#snippet text()}
        <div>
          {#if profile.items.weapons?.highest_priority_weapon?.display_name}
            <p class="font-bold">
              <span class="text-text/60">Active Weapon: </span>
              {@html renderLore(profile.items.weapons.highest_priority_weapon.display_name)}
            </p>
          {/if}
        </div>
      {/snippet}

      {#if profile.items.weapons.weapons.length}
        {#each profile.items.weapons.weapons as weapon}
          <Item piece={weapon} />
        {/each}
      {/if}
    </Items>
  {:else}
    <p class="space-x-0.5 leading-6">{profile.username} has no weapons</p>
  {/if}
</CollapsibleSection>
