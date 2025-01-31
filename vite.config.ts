import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
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
