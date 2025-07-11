<script lang="ts">
  import { page } from "$app/state";
  import HeaderInfo from "$lib/components/header/Info.svelte";
  import Settings from "$lib/components/header/Settings.svelte";
  import CircleAlert from "@lucide/svelte/icons/circle-alert";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import Search from "@lucide/svelte/icons/search";
  import { Avatar, Button } from "bits-ui";
  import { Control, Field } from "formsnap";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { schema } from "../../../routes/schema";

  const form = superForm(page.data.searchForm, {
    validators: zodClient(schema),
    validationMethod: "oninput",
    id: "searchFormNav"
  });

  const { form: formData, enhance, errors, tainted, submitting, isTainted, message } = form;

  message.subscribe((value) => {
    if (value && value.type === "error") {
      toast.error(value.text);
    }
  });
</script>

<header class="bg-header @container fixed top-0 left-0 z-30 h-12 w-full overflow-clip px-2.5 pt-[env(safe-area-inset-top,0)] pr-[max(0.625rem,env(safe-area-inset-right))] pb-[env(safe-area-inset-bottom,0)] pl-[max(0.625rem,env(safe-area-inset-left))] leading-[3rem]">
  <div class="flex h-full w-full justify-center @md:justify-between">
    <div class="flex gap-2">
      <Button.Root href="/" class="flex items-center justify-center gap-2 font-bold" data-sveltekit-preload="hover">
        <Avatar.Root class="size-6 shrink-0 rounded-lg select-none">
          <Avatar.Image loading="lazy" src="/img/app-icons/svg.svg" alt="TimelessView" class="pointer-events-none h-6 select-none" />
          <Avatar.Fallback class="text-text/60 flex h-full items-center justify-center text-lg font-semibold uppercase">SC</Avatar.Fallback>
        </Avatar.Root>
        TimelessView
      </Button.Root>
      <HeaderInfo />
    </div>

    {#if page.url.pathname.startsWith("/stats")}
      <div class="mx-auto my-1.5 w-full max-w-lg px-4 @[38rem]:block">
        <form method="POST" action="/search" use:enhance class="bg-background/20 relative flex h-full w-4/5 items-center justify-start overflow-clip rounded-[1.125rem] @[38rem]:w-full">
          <Field {form} name="query">
            <Control>
              {#snippet children({ props })}
                <input {...props} type="search" required placeholder="Enter username" class="text-text placeholder:text-text/80 hover:bg-background/20 focus-visible:bg-background/20 peer h-full w-full shrink rounded-r-3xl bg-transparent pr-0 pl-2 text-xs font-semibold outline-hidden transition-[colors_border-radius_opacity] duration-300 hover:rounded-r-none focus-visible:rounded-r-none focus-visible:ring-transparent focus-visible:outline-hidden @[38rem]:grow @[38rem]:pl-4 @[38rem]:text-base" bind:value={$formData.query} />
              {/snippet}
            </Control>
          </Field>
          <Button.Root type="submit" class="bg-background/15 peer-hover:bg-background/20 peer-focus-visible:bg-background/20 flex aspect-square h-full items-center justify-center rounded-full transition-all duration-300 peer-hover:rounded-l-none peer-focus-visible:rounded-l-none @[38rem]:aspect-video @[38rem]:px-4">
            {#if $formData.query.length > 0 && isTainted($tainted?.query) && $errors.query !== undefined}
              <CircleAlert class="text-text size-4 @[38rem]:size-6" />
            {:else if $submitting}
              <LoaderCircle class="text-text size-4 animate-spin @[38rem]:size-6" />
            {:else}
              <Search class="text-text size-4 @[38rem]:size-6" />
            {/if}
          </Button.Root>
        </form>
      </div>
    {/if}

    <Settings />
  </div>
</header>
