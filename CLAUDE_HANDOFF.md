# Claude handoff — ForgeWorks Industrial

## Current build

A static-friendly Next.js App Router website for the temporary ForgeWorks Industrial brand. The first implementation is intentionally a coherent, working foundation for visual fine-tuning and advanced motion work. Do not rebuild the site from scratch.

## Implemented website modules

1. **Cinematic 3D hero:** dark split hero, engineering metrics, pointer response, procedural cordless drill and slow rotation.
2. **Business problems:** three practical procurement/tool-selection friction points.
3. **Solutions:** Problem → Solution → Expected Benefit story and three response cards.
4. **Interactive product collection:** eight editable demo products across seven categories; category tabs, text search, featured/name sorting, product detail modal, empty state and quote prefill.
5. **How we deliver:** four-stage Understand → Select → Quote → Support timeline.
6. **Business impact:** five qualitative expected-value statements; no fabricated metrics or testimonials.
7. **Continuous gallery and contact:** duplicated seamless motion track, hover/focus/button pause, touch scroll behavior, reduced-motion stop, and browser-native locally validated enquiry form.

Navigation, footer, SEO metadata, modal, keyboard labels, empty states, reduced-motion styles and mobile navigation are also implemented.

## Architecture

- `app/page.tsx`: single homepage entry.
- `app/layout.tsx`: metadata and global stylesheet.
- `app/globals.css`: design tokens, base type, buttons, header, hero drawing sheet and category strip.
- `app/sections.css`: problems ledger, method plates, catalogue, inspection bay, stations, impact checklist, gallery conveyor, work-order form, footer and dialog.
- `app/tool-art.css`: code-drawn product silhouettes, WebGL fallback drill, viewer hotspots and loader.
- `components/Home.tsx`: client UI and interaction state; GSAP + ScrollTrigger reveal and intro animation.
- `components/DrillModel.tsx`: client-side React Three Fiber scene using original primitive geometry and materials; Canvas auto-rotation for hero, OrbitControls for featured 360 viewer.
- `components/ToolVisual.tsx`: reusable CSS silhouettes for category/product cards.
- `lib/products.ts`: editable category and product data.
- `lib/site.ts`: configurable demo brand, optional client contact details and SEO copy.

## Working 3D interactions

The drill is not an image. It is modeled from custom Three.js geometry: housing shells, motor casing, vent slots, clutch collar, chuck, steel bit, grip, trigger, battery, charge indicators, belt clip and small side badge. It uses ambient, directional and spot lighting, contact shadows and OrbitControls. Hero viewer uses auto-rotation and zoom disabled. The featured viewer allows orbit, damping, wheel/touch zoom and three accessible detail hotspots.

## Gallery implementation

`galleryProducts` renders two identical ordered passes in `.gallery-track`; its 45-second linear transform moves exactly one repeated pass to create the loop. The CSS animation pauses on hover/focus and the explicit play/pause button. On touch, native horizontal track scrolling is available, with reduced-motion users receiving a static sequence.

## CSS and motion system

**Blueprint system (branch `feat/forgeworks-blueprint-redesign`, 2026-11-14).** The site reads as an engineering drawing / spec sheet rather than a marketing template: drafting paper `#ece9e2`, ink `#121210`, signal orange `#f2601e`; 0px corners, 2px ink rules, hard offset shadows, visible grids, coordinate rulers and hazard-stripe accents. Archivo (variable width axis; display at 62–75% stretch, weight 800–900) with JetBrains Mono for labels and specs. Headline accent words are ink-on-orange "tape" (`.tape`) so the brand orange never carries small or body text on paper. Small orange text uses `--signal-text` on paper and `--signal-on-ink` on dark. GSAP/ScrollTrigger handles reveals, the hero intro and the hero leader-line draw; CSS handles the gallery marquee + conveyor belt and reduced-motion fallbacks.

Page architecture: spec strip → sticky table-row header (indexed nav cells, hazard-edged quote CTA) → hero drawing sheet (rulers, drill with A/B/C leader callouts, title-block table from the featured product spec) → category strip (jumps to and filters the catalogue) → 01 problems ledger → 02 method plates → 03 catalogue (sidebar index with live counts, search, native sort select, product hang tags with part numbers) → 04 inspection bay viewer + spec sheet → 05 process stations → 06 impact checklist (signal-orange section) → gallery conveyor → 07 work-order quote form → footer wordmark.

## Current build/test status

- Implementation complete for the requested seven modules.
- `npm install`: passed; dependencies and lockfile are committed.
- `npm run typecheck`: passed.
- `npm run build`: passed; homepage prerendered as static content.
- Static export smoke check: passed for nine rendered content markers across the hero, challenge, solutions, catalog, process, impact, gallery, contact and brand.
- Visual QA (2026-11-13): headless Chromium (SwiftShader WebGL) at 1440×900, 834×1112 and 390×844. No horizontal overflow at any size. Screenshots in `docs/qa/2026-11-13/` (`before-*` = pre-fix).
- Fixed in QA: hero footer overlapping the CTAs; hero buttons wrapping on tablet; drill cropped on narrow canvases (camera zoom now adapts to canvas aspect); stray "0" in hero spec ruler; "01 — 01" solution indexes; unrendered ↘ glyph; empty grey cells in the 5-item impact grid (desktop and mobile); missing gap at the gallery loop seam; gallery count label (06 vs 8 items); gallery pause button being undone by hover-pause; both Canvases now stop rendering while off screen.
- Interactions verified by script: gallery hover/button pause and seamless loop width, category filter, search empty state + clear, sort, product modal + Escape, viewer hotspot, mobile menu open/close.
- Brand config: `siteConfig.brand.code` (index prefix) and `siteConfig.featuredProductId` drive the hero/viewer labels; the invented hero coordinates were removed — `contact.location` is shown only when set.
- Source is pushed to the public GitHub repository on `main`; production (https://industrial-tools-3d.vercel.app) serves `main` @594ca74.

## Redesign branch QA (2026-11-14, `feat/dongcheng-inspired-redesign`, draft PR #1)

- Branch adds the DongCheng-inspired product-first refresh (light header/hero, refined catalog/gallery) and a React error boundary that swaps the R3F drill for the static CSS drill when WebGL fails.
- Fixed in this pass: desktop hero headline (1051–1440px) overlapped the 3D stage by 6–8px (font clamp reduced; now ≥19px clear); product modal now moves focus to Close, traps Tab, and returns focus to the opening card on close; ~90 small grey label contrast failures lifted to WCAG AA (`#5f6767` on light, `#8d9595` on dark; small step numbers `#b84c14`); 3D-only viewer controls and "Drag to rotate" hidden when the static fallback is shown.
- Verified by script (headless Chromium + SwiftShader): 32/32 checks — WebGL canvases, 360° drag, zoom, reset, all three hotspots (topmost + toggle), nav anchors, category/search/empty state/sort, modal open/focus/Tab/Escape, gallery auto-move/hover pause/button pause/two equal passes infinite loop, mobile touch scroll, reduced-motion stop, form empty/invalid-email/valid local success, mobile menu, no page errors, WebGL-disabled fallback (`--disable-webgl --disable-3d-apis`) with page still usable. Log: `docs/qa/2026-11-14/interaction-results.txt`.
- No horizontal overflow at 1440×900, 834×1112, 390×844; axe-core WCAG 2 A/AA leaves only the large brand-orange headline accents (2.72:1) — kept deliberately as brand identity. Screenshots: `docs/qa/2026-11-14/`.
- Real GPU devices and real touch hardware were not tested; SwiftShader is software WebGL.
- No backend/API is present; quote form intentionally does not send data.

## Blueprint redesign QA (2026-11-14, `feat/forgeworks-blueprint-redesign`)

- Full art-direction and layout rebuild of the presentation layer; data (`lib/`), `DrillModel.tsx`, `ToolVisual.tsx` and all interactions kept.
- Verified (headless Chromium + SwiftShader): 33/33 interaction checks incl. new category-strip filter and native sort select; no page-level horizontal overflow at 1440×900, 834×1112, 390×844; axe-core WCAG 2 A/AA: 0 violations at all three sizes; hero headline and footer wordmark measured to fit from 360 to 1920px. Evidence: `docs/qa/2026-11-14-blueprint/`.
- The hero leader lines point at fixed zones while the drill auto-rotates; they are schematic, not tracked to the model.

## Known limitations / unfinished features

- Drill geometry is an original stylized procedural concept. Refine proportions/materials and add more detailed motor vents, chuck teeth and housing seams if greater photorealism is needed.
- Featured viewer controls support orbit, zoom and reset by remounting the scene to its initial camera state. The zoom control switches between base and enlarged framing.
- Contact form local success only. Build a real endpoint before describing enquiries as received.
- Mobile touch supports native horizontal swipe scrolling of the gallery, not custom pointer-gesture physics.
- WebGL initialization fallback is a static CSS drill illustration. It is intentionally not animated or represented as 3D.
- Product cards use CSS silhouettes. Replace with client-approved imagery or licensed models when available.
- Brand orange `#ef6c28` on ivory is 2.72:1 — passes only as decorative/large display text under a lenient reading; a darker orange would be needed for strict AA on headline accents (client brand decision).
- Google Fonts are loaded via CSS import; consider `next/font` self-hosting if deployment policy permits.
- No individual product routes are included; the product details modal covers the initial catalog experience.

## Asset licence checks

No third-party 3D models, photos or HDRIs are bundled. Product images in `public/products/*.webp` are studio renders of original procedural three.js models written for this project (`scripts/render-products/models.js`), so they carry no external licence or brand. Openly licensed photo libraries were reviewed on 2026-11-14 and rejected because nearly all power-tool photos show other manufacturers' logos. Google Fonts (Archivo, JetBrains Mono, both SIL OFL) load from the public CSS endpoint; confirm client hosting requirements before launch. Any later stock photography or downloaded model must have its licence and attribution documented here.

## Product image pipeline

- `lib/products.ts` gives each product an optional `image` path; `components/ToolVisual.tsx` shows it in catalogue cards, the gallery and the product dialog, and falls back to the code-drawn silhouette when a product has no image or it fails to load.
- To regenerate after editing `scripts/render-products/models.js`: from the repo root run `python3 -m http.server 4318`, then `node scripts/render-products/render.mjs <path-to-a-package.json-that-has-playwright>`. Raw PNGs land in `scripts/render-products/out/` (git-ignored); trim/centre them to 1000×750 WebP in `public/products/` (the 2026-11-14 export used Pillow, quality 82).
- Replace the renders with client-approved photography when available by pointing `image` at the new files.

## Recommended refinement order

1. **Inspect the homepage first** at 1440×900 and 390×844. Fix any text wrapping, section rhythm, model framing or horizontal overflow before adding effects.
2. **Improve 3D shading and proportions** in `components/DrillModel.tsx`: silhouette accuracy, bevels, chuck detail, grip texture, improved side badge, battery lock rails and soft contact shadows. Keep geometry performant and mobile quality capped.
3. **Refine camera feel and framing** at desktop and mobile sizes; tune OrbitControls damping and zoom range while preserving reset to the initial camera/target.
4. **Tune ScrollTrigger** in `components/Home.tsx` for stable cleanup, responsive refresh and reduced-motion behavior. Avoid stacking timelines on hot reload or resize.
5. **Review responsive interaction**: prevent category tabs from trapping horizontal page scroll; verify modal focus/escape behavior and gallery touch scrolling.
6. **Review actual browser motion**: seamless marquee edge, hover pause, keyboard focus pause, touch and reduced motion.
7. **Polish content and replace demo data only after the client supplies approved brand, product and contact information.** Preserve the no-fabricated-capabilities rule.
8. **Form delivery only after client supplies an endpoint and privacy/consent copy.** Add server-side validation and explicit success/error states; never claim local validation means enquiry delivery.

## Files to review first

1. `components/DrillModel.tsx` — procedural model and OrbitControls.
2. `components/Home.tsx` — page modules, state, GSAP and interaction wiring.
3. `app/globals.css`, `app/sections.css`, `app/tool-art.css` — design system, sections and responsive behavior.
4. `lib/products.ts` and `lib/site.ts` — editable demo catalogue and brand/contact/SEO configuration.
5. `README.md` — install, run and architecture notes.
