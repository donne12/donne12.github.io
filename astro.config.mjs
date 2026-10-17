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
  vite: { plugins: [tailwindcss()] },
});
