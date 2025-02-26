import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: "skycrypt",
        project: "javascript-sveltekit"
      }
    }),
    tailwindcss(),
    sveltekit()
  ],
  server: {
    fs: {
      // Allow serving files from static/resourcepacks
      allow: [".."]
    }
  },
  build: {
    sourcemap: true
  }
});
