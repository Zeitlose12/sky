<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import { setProfileCtx } from "$ctx/profile.svelte";
  import Main from "$lib/layouts/stats/Main.svelte";
  import { api } from "$lib/shared/api";
  import type { ValidStats } from "$types/stats";
  import type { StatsV2 } from "$types/statsv2";
  import { createQuery } from "@tanstack/svelte-query";
  import { tick, untrack } from "svelte";

  let { ign, profile } = page.params;

  const user = createQuery<StatsV2>({
    queryKey: ["profile", ign, profile],
    queryFn: () => api(fetch).getProfile(ign, profile)
  });

  // Initialize the profile context
  setProfileCtx($user.data as unknown as ValidStats);

  // Update the profile context when the data changes
  $effect(() => {
    const abortController = new AbortController();
    setProfileCtx($user.data as unknown as ValidStats);

    untrack(() => {
      if (!$user.data) return;

      const { username, profile_cute_name } = $user.data;
      if (!username) return;

      const current = page.url.pathname;
      const wanted = `/stats/${username}/${profile_cute_name || ""}`;

      // Update the URL to match the username and cute name
      if (current !== wanted) {
        const newUrl = page.url.toString().replace(current, wanted);

        // Only proceed if not aborted
        if (!abortController.signal.aborted) {
          tick()
            .then(() => {
              if (!abortController.signal.aborted) {
                replaceState(newUrl, page.state);
              }
            })
            .catch(() => {});
        }
      }
    });

    return () => {
      abortController.abort();
    };
  });
</script>

{#if $user.isPending}
  Loading...
{/if}
{#if $user.error}
  An error has occurred:
  {$user.error.message}
{/if}
{#if $user.isSuccess}
  {#if $user.data}
    <Main />
  {/if}
{/if}
