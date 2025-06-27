<script lang="ts">
  import { PUBLIC_DISCORD_INVITE } from "$env/static/public";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import { Button } from "bits-ui";
</script>

<div class="space-y-5 rounded-lg bg-red-700 p-4 text-red-200 @[75rem]/parent:p-8">
  <div class="justify-starts flex items-center gap-2">
    <CircleX class="size-8" />
    <h3 class="text-2xl font-semibold">An unexpected error has occurred</h3>
  </div>
  <p>Please report this error on our <Button.Root target="_blank" href={PUBLIC_DISCORD_INVITE} class="underline">Discord</Button.Root></p>
</div>
