// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://esiakudonne.me",
  i18n: {
    locales: ["fr", "en", "es"],
    defaultLocale: "fr",
    routing: { prefixDefaultLocale: false },
  },
  // Inline the (small, gzipped) stylesheet: saves a render-blocking request before first paint.
  build: { inlineStylesheets: "always" },
  vite: { plugins: [tailwindcss()] },
});
