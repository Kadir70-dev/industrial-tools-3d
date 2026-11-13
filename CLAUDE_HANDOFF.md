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
- `app/globals.css`: typography, responsive layout, visual system, CSS tool silhouettes, gallery animation and reduced-motion styles.
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

Palette variables live at the top of `app/globals.css`. Space Grotesk is used for display, DM Sans for body and DM Mono for technical labels. Warm ivory and deep graphite sections alternate; orange is reserved for functional emphasis. GSAP/ScrollTrigger handles entry reveals and hero intro; the hero camera subtly shifts with page scroll. CSS handles the product gallery, ticker, timeline, hover details and reduced-motion fallback.

## Current build/test status

- Implementation complete for the requested seven modules.
- `npm install`: passed; dependencies and lockfile are committed.
- `npm run typecheck`: passed.
- `npm run build`: passed; homepage prerendered as static content.
- Static export smoke check: passed for nine rendered content markers across the hero, challenge, solutions, catalog, process, impact, gallery, contact and brand.
- Browser review: the preview browser rejected the local URL under its URL security policy. Desktop/mobile visual QA and screenshot capture remain outstanding.
- Static preview server could not be started in this managed runtime because Node reported `uv_interface_addresses` system error 1; `out/` was generated successfully.
- Source is pushed to the public GitHub repository on `main`; no deployment has been run.
- No backend/API is present; quote form intentionally does not send data.

## Known limitations / unfinished features

- Drill geometry is an original stylized procedural concept. Refine proportions/materials and add more detailed motor vents, chuck teeth and housing seams if greater photorealism is needed.
- Featured viewer controls support orbit, zoom and reset by remounting the scene to its initial camera state. The zoom control switches between base and enlarged framing.
- Contact form local success only. Build a real endpoint before describing enquiries as received.
- Mobile touch supports native horizontal swipe scrolling of the gallery, not custom pointer-gesture physics.
- WebGL initialization fallback is a static CSS drill illustration. It is intentionally not animated or represented as 3D.
- Product cards use CSS silhouettes. Replace with client-approved imagery or licensed models when available.
- Google Fonts are loaded via CSS import; consider `next/font` self-hosting if deployment policy permits.
- No individual product routes are included; the product details modal covers the initial catalog experience.

## Asset licence checks

No external 3D or product photo assets are bundled. The tool visuals and drill are original code-generated geometry/CSS. Google Fonts are loaded from their public CSS endpoint; confirm client hosting and font licence requirements before launch. Any later stock/product photography, HDRI or downloadable model added by Claude must have licence/usage rights documented and attribution included where required.

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
3. `app/globals.css` — full design system and responsive behavior.
4. `lib/products.ts` and `lib/site.ts` — editable demo catalogue and brand/contact/SEO configuration.
5. `README.md` — install, run and architecture notes.
