<script lang="ts">
  import { page } from "$app/state";
  import { Button } from "bits-ui";
</script>

<main class="flex h-screen w-full flex-col items-center justify-center">
  <div class="flex w-full max-w-md flex-col items-center justify-center gap-3 rounded-lg p-6 backdrop-blur-lg backdrop-brightness-50">
    <h1 class="text-center text-2xl font-semibold">Oops! Something went wrong</h1>
    <p>Try again or contact us if the problem persists.</p>
    <Button.Root href="/" class="bg-icon dark:text-text mx-auto flex w-full max-w-fit items-center justify-center rounded-3xl px-6 py-3 text-base font-bold text-white uppercase transition-all duration-150 [text-shadow:0_0_3px_rgba(0,0,0,.5)] hover:scale-[1.015] disabled:opacity-50">Go home</Button.Root>
  </div>
  <p class="text-text/40 text-xs">{page.status}: {page.error?.message}</p>
</main>
