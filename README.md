# Dieudonné's portfolio

Site perso ([esiakudonne.me](https://esiakudonne.me)) construit avec [Astro](https://astro.build), Tailwind CSS v4 et GSAP.
Disponible en français (`/`), anglais (`/en/`) et espagnol (`/es/`).

## Lancer en local

Node.js 22.22+ requis (voir `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # génère dist/
npm run preview   # sert dist/ comme en production
```

## Structure

- `src/components/` : sections de la page (`Hero.astro`, `Skills.astro`…)
- `src/data/content.ts` : projets, expériences, formations, compétences
- `src/i18n/ui.ts` : traductions FR / EN / ES
- `src/scripts/motion.ts` : animations GSAP ; `hero-canvas.ts` : fond interactif du hero
- `public/` : images, favicon, `CNAME`

## Déploiement

Chaque push sur `main` lance `.github/workflows/deploy.yml`, qui build le site et le publie sur GitHub Pages.
Dans les réglages du repo, **Settings → Pages → Source** doit être sur **GitHub Actions**.
