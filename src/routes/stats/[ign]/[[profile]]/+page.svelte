<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { page } from "$app/state";
  import { setProfileCtx } from "$ctx/profile.svelte";
  import Error from "$lib/components/Error.svelte";
  import Main from "$lib/layouts/stats/Main.svelte";
  import { api } from "$lib/shared/api";
  import type { StatsV2 } from "$types/statsv2";
  import { createQuery } from "@tanstack/svelte-query";
  import { tick, untrack } from "svelte";

  let { ign, profile } = page.params;

  const query = createQuery<StatsV2>({
    queryKey: ["profile", ign, profile],
    queryFn: () => api(fetch).getProfile(ign, profile)
  });

  // Initialize the profile context
  setProfileCtx($query.data!);

  // Update the profile context when the data changes
  $effect(() => {
    const abortController = new AbortController();
    setProfileCtx($query.data!);

    untrack(() => {
      if (!$query.data) return;

      const { username, profile_cute_name } = $query.data;
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

{#if $query.isPending}
  Loading...
{/if}
{#if $query.error}
  <Error />
{/if}
{#if $query.isSuccess}
  {#if $query.data}
    <Main />
  {/if}
{/if}
