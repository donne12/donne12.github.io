import { CV_LINKS, extra, ui } from "./ui";

export const languages = { fr: "Français", en: "English", es: "Español" } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = "fr";

type Key = keyof (typeof ui)["fr"] | keyof (typeof extra)["fr"];

export function useTranslations(lang: Lang) {
  const dict: Record<string, string> = { ...ui[lang], ...extra[lang] };
  const fallback: Record<string, string> = { ...ui[defaultLang], ...extra[defaultLang] };
  return (key: Key) => dict[key] ?? fallback[key] ?? key;
}

export const cvLink = (lang: Lang) => CV_LINKS[lang];

export const pathFor = (lang: Lang) => (lang === defaultLang ? "/" : `/${lang}/`);
