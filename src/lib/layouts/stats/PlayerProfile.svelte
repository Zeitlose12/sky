<script lang="ts">
  import { getProfileCtx } from "$ctx/profile.svelte";
  import { flyAndScale } from "$lib/shared/utils";
  import { favorites } from "$lib/stores/favorites";
  import { Avatar, Button, DropdownMenu, Tooltip } from "bits-ui";
  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import ExternalLink from "lucide-svelte/icons/external-link";
  import Link from "lucide-svelte/icons/link";
  import Star from "lucide-svelte/icons/star";
  import { toast } from "svelte-sonner";

  let toastId: string | number = $state(0);
  let showMore = $state(false);
  let open = $state(false);

  const ctx = getProfileCtx();
  const profile = $derived(ctx.profile);

  const iconMapper: Record<string, string> = {
    TWITTER: "x-twitter.svg",
    YOUTUBE: "youtube.svg",
    INSTAGRAM: "instagram.svg",
    TIKTOK: "tiktok.svg",
    TWITCH: "twitch.svg",
    DISCORD: "discord.svg",
    HYPIXEL: "hypixel.png"
  };

  function copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    toast.dismiss(toastId);
    toastId = toast.success(`Copied ${value} to your clipboard!`);
  }
</script>

<div class="flex flex-wrap items-center gap-x-2 gap-y-3 text-4xl">
  Stats for
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class="inline-flex items-center rounded-full bg-[oklch(59.65%_0_0)]/20 py-2 pr-4 pl-2 align-middle text-3xl font-semibold whitespace-nowrap">
      <div class="relative flex items-center justify-center overflow-hidden rounded-full bg-[var(--color)] px-2 py-1 text-xl" style={`--color:${profile.rank?.rankColor}`}>
        <div class="relative z-20 inline-flex justify-between gap-3 text-lg font-bold">
          <span>{profile.rank?.rankText}</span>
          {#if profile.rank?.plusText}
            <span>{profile.rank.plusText}</span>
          {/if}
        </div>
        <div class="absolute top-0 -right-3 bottom-0 z-10 h-14 w-1/2 skew-x-[-20deg] bg-[var(--plusColor)]" style={`--plusColor:${profile.rank?.plusColor ?? profile.rank?.rankColor}`}></div>
      </div>
      <span class="pl-4">{profile.displayName}</span>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="bg-background-grey/95 z-50 min-w-64 overflow-hidden rounded-lg text-3xl font-semibold" align="start" side="bottom" transition={flyAndScale} transitionConfig={{ y: -8, duration: 150 }}>
      {#each profile.members as member (member.uuid)}
        {#if member.username !== profile.username}
          <DropdownMenu.Item href={`/stats/${member.username}/${profile.profile_cute_name}`} class="hover:bg-text/20 flex items-center p-4" data-sveltekit-preload-code="viewport">
            <span class="pl-4 {member.removed ? 'line-through' : ''}">
              {member.username}
            </span>
          </DropdownMenu.Item>
        {/if}
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  on
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class="inline-flex items-center rounded-full bg-[oklch(59.65%_0_0)]/20 px-4 py-2 align-middle text-3xl font-semibold">
      {profile.profile_cute_name}
    </DropdownMenu.Trigger>

    <DropdownMenu.Content class="bg-background-grey/95  z-50 min-w-64 overflow-hidden rounded-lg text-3xl font-semibold" align="start" side="bottom" transition={flyAndScale} transitionConfig={{ y: -8, duration: 150 }}>
      {#each profile.profiles ?? [] as otherProfile (otherProfile.profile_id)}
        {#if otherProfile.profile_id !== profile.profile_id}
          <DropdownMenu.Item href={`/stats/${profile.username}/${otherProfile.cute_name}`} class="hover:bg-text/20 flex items-center p-4" data-sveltekit-preload-code="viewport">
            {otherProfile.cute_name}
            {#if otherProfile.game_mode === "bingo"}
              🎲
            {/if}
            {#if otherProfile.game_mode === "ironman"}
              🥋
            {/if}
            {#if otherProfile.game_mode === "island"}
              🌴
            {/if}
          </DropdownMenu.Item>
        {/if}
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>

<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
  <Tooltip.Root bind:open openDelay={0} closeDelay={0} closeOnPointerDown={false}>
    <Tooltip.Trigger asChild let:builder>
      <button
        use:builder.action
        {...builder}
        class="bg-icon/90 hover:bg-icon aspect-square rounded-full p-2 transition-opacity duration-150"
        onclick={() => {
          if (!$favorites.includes(profile.uuid)) {
            favorites.set([...$favorites, profile.uuid]);
            toast.dismiss(toastId);
            toastId = toast.success(`Added ${profile.username} to your favorites!`);
          } else {
            favorites.set($favorites.filter((uuid) => uuid !== profile.uuid));
            toast.dismiss(toastId);
            toastId = toast.success(`Removed ${profile.username} from your favorites!`);
          }
        }}
        onpointerdown={() => (open = !open)}>
        {#if $favorites.includes(profile.uuid)}
          <Star class="size-4 fill-white" />
        {:else}
          <Star class="size-4" />
        {/if}
      </button>
    </Tooltip.Trigger>
    <Tooltip.Content class="bg-background-grey text-text/80 z-50 rounded-lg p-4 font-semibold" transition={flyAndScale} transitionConfig={{ y: 8, duration: 150 }} sideOffset={6} side="top" align="center">
      <Tooltip.Arrow />
      {#if $favorites.includes(profile.uuid)}
        <p>Remove from favorites</p>
      {:else}
        <p>Add to favorites</p>
      {/if}
    </Tooltip.Content>
  </Tooltip.Root>

  <Button.Root
    class="bg-icon/90 hover:bg-icon aspect-square rounded-full p-2 transition-opacity duration-150"
    onclick={() => {
      copyToClipboard(window.location.href);
    }}>
    <Link class="size-4" />
  </Button.Root>

  <Button.Root href={`https://plancke.io/hypixel/player/stats/${profile.username}`} target="_blank" class="bg-icon/90 hover:bg-icon flex items-center justify-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-opacity duration-150">
    Plancke <ExternalLink class="size-4" />
  </Button.Root>

  <Button.Root href={`https://elitebot.dev/@${profile.username}/${profile.profile_cute_name}`} target="_blank" class="bg-icon/90 hover:bg-icon flex items-center justify-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-opacity duration-150">
    Elite <ExternalLink class="size-4" />
  </Button.Root>

  <Button.Root
    class="bg-icon/90 hover:bg-icon hidden items-center justify-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-opacity duration-150 data-[visible=true]:flex"
    data-visible={showMore}
    onclick={() => {
      copyToClipboard(profile.uuid);
    }}>
    Copy UUID
  </Button.Root>

  {#each Object.entries(profile.social) as [key, value], index (index)}
    {#if key === "DISCORD"}
      <Button.Root class="bg-icon/90 hover:bg-icon hidden items-center justify-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-opacity duration-150 data-[visible=true]:flex" data-visible={showMore} on:click={() => copyToClipboard(value)}>
        <Avatar.Root>
          <Avatar.Image loading="lazy" src="/img/icons/{iconMapper[key]}" alt="{profile.username}'s {key.toLocaleLowerCase()}" class="size-4 text-white" />
          <Avatar.Fallback>
            {profile.username.slice(0, 2)}
          </Avatar.Fallback>
        </Avatar.Root>
        {value}
      </Button.Root>
    {:else}
      <Button.Root href={value} target="_blank" class="bg-icon/90 hover:bg-icon hidden aspect-square items-center justify-center gap-1.5 rounded-full px-2 py-1 font-semibold transition-opacity duration-150 data-[visible=true]:flex" data-visible={showMore}>
        <Avatar.Root>
          <Avatar.Image loading="lazy" src="/img/icons/{iconMapper[key]}" alt="{profile.username}'s {key.toLocaleLowerCase()}" class="size-4 text-white" />
          <Avatar.Fallback>
            {profile.username.slice(0, 2)}
          </Avatar.Fallback>
        </Avatar.Root>
      </Button.Root>
    {/if}
  {/each}

  <Button.Root class="bg-icon/90 hover:bg-icon rounded-full p-2 transition-opacity duration-150" on:click={() => (showMore = !showMore)}>
    {#if showMore}
      <ChevronLeft class="size-4" />
    {:else}
      <ChevronRight class="size-4" />
    {/if}
  </Button.Root>
</div>
