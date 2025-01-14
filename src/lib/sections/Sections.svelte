<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import Accessories from "$lib/sections/stats/Accessories.svelte";
  import Armor from "$lib/sections/stats/Armor.svelte";
  import Bestiary from "$lib/sections/stats/Bestiary.svelte";
  import Collections from "$lib/sections/stats/Collections.svelte";
  import CrimsonIsle from "$lib/sections/stats/CrimsonIsle.svelte";
  import Dungeons from "$lib/sections/stats/Dungeons.svelte";
  import Inventory from "$lib/sections/stats/Inventory.svelte";
  import Minions from "$lib/sections/stats/Minions.svelte";
  import Misc from "$lib/sections/stats/MiscSection.svelte";
  import Pets from "$lib/sections/stats/Pets.svelte";
  import Rift from "$lib/sections/stats/Rift.svelte";
  import Skills from "$lib/sections/stats/SkillsSection.svelte";
  import Slayer from "$lib/sections/stats/Slayer.svelte";
  import Weapons from "$lib/sections/stats/Weapons.svelte";
  import type { SectionName } from "$lib/sections/types";
  import { sectionOrderPreferences } from "$lib/stores/preferences";

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  function findIndex(id: SectionName) {
    return $sectionOrderPreferences.findIndex((section) => section.name === id);
  }
</script>

{#if profile.items && profile.items.armor && profile.items.equipment && profile.items.wardrobe}
  <Armor order={findIndex("Armor")} />
{/if}
{#if profile.items && profile.items.weapons}
  <Weapons order={findIndex("Weapons")} />
{/if}
{#if profile.accessories}
  <Accessories order={findIndex("Accessories")} />
{/if}
{#if profile.pets}
  <Pets order={findIndex("Pets")} />
{/if}
{#if profile.items}
  <Inventory order={findIndex("Inventory")} />
{/if}
{#if profile.skills}
  <Skills order={findIndex("Skills")} />
{/if}
{#if profile.dungeons}
  <Dungeons order={findIndex("Dungeons")} />
{/if}
{#if profile.slayer}
  <Slayer order={findIndex("Slayer")} />
{/if}
{#if profile.minions}
  <Minions order={findIndex("Minions")} />
{/if}
{#if profile.bestiary}
  <Bestiary order={findIndex("Bestiary")} />
{/if}
{#if profile.collections}
  <Collections order={findIndex("Collections")} />
{/if}
{#if profile.crimson_isle}
  <CrimsonIsle order={findIndex("Crimson_Isle")} />
{/if}
{#if profile.rift}
  <Rift order={findIndex("Rift")} />
{/if}
{#if profile.misc}
  <Misc order={findIndex("Misc")} />
{/if}
