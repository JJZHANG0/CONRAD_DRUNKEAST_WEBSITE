# DRUNKEAST · TEAM「深海」

**From the abyss to the source.**

A fully redesigned bilingual website for a proposed seabed sediment-plume treatment concept. Seven independent pages combine a scroll-driven 3D ocean journey, modular equipment, particle-scale explanations and a shared-scene comparison.

- Website: https://jjzhang0.github.io/CONRAD_DRUNKEAST_WEBSITE/
- Repository: https://github.com/JJZHANG0/CONRAD_DRUNKEAST_WEBSITE

## Run locally

Node 22.13+ is required (`.nvmrc`).

```sh
cd app
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

`app/dist` is the static output. Every page has its own HTML entry, so direct links and refresh work on GitHub Pages without SPA rewrites. Relative asset URLs support the repository subdirectory.

## Pages

| Page | Experience |
| --- | --- |
| `index.html` | Seven continuous scroll-driven camera chapters: surface, descent, collection, plume, source treatment, control, pullback |
| `challenge.html` | Sediment disturbance, dispersion, deposition and limits of the proposed intervention |
| `technology.html` | Independent capture, flocculation, separation and controlled-pathway particle animations |
| `system.html` | Orbit/zoom, module selection, illustrative exploded assembly, cutaway and module descriptions |
| `simulation.html` | Scissor-rendered before/after comparison using the same camera, particle seeds and time; divider and current controls |
| `validation.html` | Seven research metrics, proposed methods and explicit unvalidated status |
| `partnership.html` | Application areas, proposed commercial pathway, team context and a local collaboration-brief download |

## Content and scientific boundaries

The redesign uses the supplied `TEAM「深海」_Lean_Canvas_BMC.pdf` (two pages) and the newer **FROM THE ABYSS TO THE SOURCE** creative brief. They differ on deployment: the Canvas proposes onboard treatment, while the newer brief explicitly requires source treatment at the seabed. This website follows the newer seabed direction, with the source discrepancy documented here and deployment uncertainties disclosed in the system description. The original documents were not republished.

The Canvas supports the proposed bio-based flocculation and solid–liquid separation approach, validation priorities, prospective customers and business pathways. It provides no measured results, final equipment geometry, established operating depth, confirmed partners or public team email. The site does not invent these. The modules, collector, frame, intake and release paths are original **conceptual** models, not a validated engineering design.

Particle motions are deterministic visual choreography, not a calibrated fluid/chemical solver. Scene coordinates, timing, current control and capture fraction are illustrative. Particles remain represented in either residual-dispersion or retention pathways; the comparison is not a measured removal-efficiency estimate. Bio-based chemistry is not described as inherently safe. Reagent residues, oxygen demand and ecotoxicity remain explicit test priorities. Source treatment does not resolve every mining impact or replace environmental assessment.

Research-context links point to the 2025 Nature Communications benthic-plume study and the 2020 Scientific Reports plume-modelling study. These independent studies explain the environmental context, not validation of this team's system.

The partnership form downloads a UTF-8 draft locally. It does not send, upload or persist contact information. Language preference is stored locally and carried in URLs; no analytics, remote fonts, external runtime scripts or backend is used.

## Architecture

- `app/src/experience/Experience.tsx`: all seven page structures, bilingual navigation, interaction state and local download.
- `app/src/content/project.ts`: shared bilingual chapter, process and validation content.
- `app/src/experience/Scene.tsx`: scene lifecycle, cameras, lighting, adaptation, orbit/picking and split rendering.
- `app/src/experience/models.ts`: original procedural collector, treatment skid, terrain, nodules and vessel.
- `app/src/experience/ocean.ts`: animated ocean surface, sky and underwater light-volume shaders.
- `app/src/experience/particle-model.mjs`: deterministic illustrative particle paths and micro-scale choreography.
- `app/src/experience/experience.css`: responsive visual system.
- `app/public/seabed-fallback.svg`: static fallback for unavailable WebGL.
- `app/tests/particle-model.test.mjs`: five trajectory/representation invariants.

Rendering respects reduced-motion preference, pauses offscreen and in background tabs, caps pixel ratio and reduces resolution after sustained slow frames. System controls and module selectors support keyboard access; process tabs support arrow-key navigation. WebGL/context failure displays a static schematic without removing the written project pages.

The former starter UI and single-pipe scene have been removed from the active application. They remain available in Git history; the original supplied model archive remains in the ignored local `design_assets` directory.

## Verification and publishing

- TypeScript and multi-page production build.
- Five Node tests: deterministic paths, unchanged residual paths and retained particle representation, illustrative flow direction, retention region and finite microscopic states.
- Browser checks: desktop scene rendering, stage switching, module selection, explode/cutaway, divider/current/reset controls, mobile navigation, seven-page 390px layout without horizontal overflow, seven validation metrics, local form download and language persistence after reload.
- WebGL fallback is implemented; physical mobile GPU performance and all browser engines are not exhaustively tested. Software checks are not physical or ecological validation.

On every push to `main`, `.github/workflows/deploy-pages.yml` performs a clean dependency install, runs the particle checks, builds all seven pages and publishes to GitHub Pages.
