# ForgeWorks Industrial

A static-friendly Next.js storefront concept for professional hardware, power tools and construction equipment. The temporary demo brand, products and copy are designed to be replaced through the product data and page components.

## Requirements

- Node.js 20.9 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality commands

```bash
npm run typecheck
npm run build
```

The production build uses Next.js static export (`out/`). To preview the exported site locally after building, run `npm run preview`; the output directory can be uploaded to any static host.

## Project structure

- `app/` — App Router entry, metadata and global design system.
- `components/Home.tsx` — navigation, story sections, searchable catalogue, quotation form, gallery and product detail modal.
- `components/DrillModel.tsx` — procedural Three.js / React Three Fiber cordless drill and orbit interaction.
- `components/ToolVisual.tsx` — original CSS product silhouettes for the demo catalog.
- `lib/products.ts` — editable catalog records and categories.
- `lib/site.ts` — configurable brand name, division, optional contact details and SEO copy.
- `CLAUDE_HANDOFF.md` — current implementation notes and prioritized refinement work.

## Interactions

- Hero drill: slow rotation and pointer-driven Canvas movement.
- Featured drill: drag to rotate, scroll to zoom, reset camera and three product detail hotspots.
- Catalog: category tabs, live search, sort by featured or name, empty state, product details and quote-prefill.
- Gallery: continuous duplicate-track loop, pause on hover/focus or with the control button; respects reduced motion and supports touch scrolling.
- Quote form: browser validation and clear local-only confirmation. No data is transmitted or stored.

## Configuration

Edit `lib/site.ts` for the brand name, division, optional contact details and SEO copy. Edit `lib/products.ts` for product names, categories, specification text, accent tones and visual types. Edit `components/Home.tsx` for page storytelling and layout copy. `NEXT_PUBLIC_QUOTE_ENDPOINT` is reserved in `.env.example` for a future integration, but no endpoint client is implemented.

## Accessibility and performance

Semantic sections, labels, keyboard-operable buttons, focus styles, reduced-motion CSS, responsive product layout and a lightweight procedural model are included. The Canvas is loaded client-side with a loading state and a static CSS illustration fallback when WebGL is unavailable. The site does not bundle external product images or a downloaded model.

## Limitations

- The demo product information and ForgeWorks brand are illustrative and must be replaced with approved client content.
- Enquiry submissions are not delivered. Add a real endpoint, consent/privacy policy and server-side validation before collecting real leads.
- The procedural drill is an original stylized model, not a photogrammetry/CAD-accurate representation.
- Fonts are requested from Google Fonts; system fallbacks remain available when offline.
- No deployment is configured or performed.
