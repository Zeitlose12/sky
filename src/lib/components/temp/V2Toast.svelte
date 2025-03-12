<script lang="ts">
  import { PUBLIC_DISCORD_INVITE } from "$env/static/public";
  import { internalPreferences } from "$lib/stores/preferences";
  import { Button } from "bits-ui";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let showClose = $state(false);

  setTimeout(() => {
    showClose = true;
  }, 5000);
</script>

{#snippet link(href: string, text: string)}
  <Button.Root {href} target="_blank" class="text-link underline">
    {text}
  </Button.Root>
{/snippet}

<div class="text-text w-full space-y-4 p-5 font-medium text-pretty select-none">
  <h3 class="text-2xl font-bold whitespace-nowrap sm:text-3xl">Welcome to <span class="text-link">SkyCrypt v2</span></h3>
  <p>We have written SkyCrypt from the ground up to be faster, more reliable, and more feature-rich than ever before using the latest web technologies</p>
  <p>
    As with any new software, there may be bugs or missing features. If you find any issues, or have any suggestions, please let us know on our {@render link(PUBLIC_DISCORD_INVITE, "Discord server")}.
  </p>
  <p>
    P.S. Take a look at {@render link("https://minionah.com", "MinionAH")}, it's made by one of the developers that worked on SkyCrypt v2!
  </p>
  <Button.Root
    class="bg-link/80 dark:text-text w-full rounded-lg py-2 text-white opacity-30 transition-opacity duration-1000 disabled:cursor-not-allowed data-[show=true]:opacity-100"
    disabled={!showClose}
    data-show={showClose}
    onclick={() => {
      dispatch("closeToast");
      internalPreferences.update((state) => ({ ...state, hasSeenv2Toast: true }));
    }}>Close</Button.Root>
</div>
