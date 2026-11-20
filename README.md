# DRUNKEAST — From the abyss to the source

A bilingual, responsive Conrad Challenge team website built with React, TypeScript, Vite and Three.js. The deep-sea visual direction combines a live industrial module, cool studio reflections, fine particles and restrained editorial typography.

- Website: https://jjzhang0.github.io/CONRAD_DRUNKEAST_WEBSITE/
- Repository: https://github.com/JJZHANG0/CONRAD_DRUNKEAST_WEBSITE

## Develop

Use Node 22.13+ (`.nvmrc`).

```sh
cd app
npm ci
npm run dev
```

```sh
cd app
npm run build
npm run preview
```

The static output is `app/dist`. Vite uses relative asset paths for GitHub Pages repository hosting. The app uses section anchors, so deep links and reloads require no server rewrite.

## Experience

- English / Simplified Chinese with saved language preference.
- Live PBR industrial pipe model using the supplied `02-G4-0017` geometry, with a redesigned clean metal finish.
- Drag to orbit, automatic rotation, pause, reset, and surface / illustrative exploded / wireframe modes.
- Fullscreen 3D studio, scroll-to-zoom, keyboard focus management and Escape dismissal.
- Responsive desktop / tablet / mobile layouts, mobile navigation and visible focus states.
- Respects reduced-motion preference; rendering pauses offscreen and in background tabs. Pixel ratio is capped for smaller screens.
- Static SVG fallback if the WebGL context or model is unavailable.
- Engineering component accordion and a downloadable partnership discussion template. The download is local; nothing is submitted.

## Content provenance

The supplied `app` contained a Vite starter page, and `design_assets/02-G4-0017.zip` contained a flanged industrial pipe visualization. No full Kimi page, project brief, member roster, contact email or validated performance data was present. The site therefore presents DRUNKEAST as a deep-sea engineering **concept**, based on the user's team/project direction and repository name. Editorial vision and approach copy are proposed presentation text, not research findings. No product depth/pressure rating, clients, measured performance, awards or registered trademark is claimed.

Replace the introductory copy with the team's confirmed brief when available. Add verified member profiles and a public contact channel before treating the site as a complete factual company profile.

## Source map

- `app/src/pages/Home.tsx`: bilingual page content, navigation, studio UI and local brief download.
- `app/src/components/OceanScene.tsx`: lighting, materials, model framing, interaction and resource lifecycle.
- `app/src/lib/model/`: original asset modules adapted for Vite and robust gzip handling.
- `app/public/model/`: supplied compressed geometry/textures, orientation, receipt and original documentation/license.
- `app/public/model-preview.svg`: original code-authored schematic/fallback.
- `app/src/App.css`: visual system and responsive layouts.
- `.github/workflows/deploy-pages.yml`: automatic build and GitHub Pages deployment on pushes to `main`.

The asset loader preserves its original Z-up to Y-up transform; outer groups handle placement. The exploded view is an illustrative spatial separation, not an assembly simulation. Supplied geometry retains its original licensing/provenance; see `app/public/model/README.md` and `THREE-LICENSE.txt`.

## Verification

TypeScript and production builds are checked locally. Browser checks cover desktop (1440 × 900) and mobile (390 × 844), model load, studio opening/closing, all three view modes, reset, pause, engineering accordion, bilingual navigation, language persistence and local brief download. Mobile horizontal overflow was checked. Browser/GPU checks do not validate physical product performance.
