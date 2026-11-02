# Screen-Printed Gallery Poster Theme Specification
**Platform:** Vernika Enterprises (Handpainted Madhubani Art by Natasha Gupta)  
**Theme Philosophy:** An archival gallery exhibition poster celebrating authentic Mithila folk art. Quiet, warm paper pages allow the intricate, handpainted artwork to be the loudest voice. Typography, tactile ink impressions, and deliberate misregistration evoke traditional screen-printing craftsmanship.

---

## 1. Color System (The 3-Ink Palette)
Defined as CSS custom properties in `src/styles/tokens.css` and mapped into Tailwind:

| Token | Hex Value | Semantic Role & Contrast Rule |
| :--- | :---: | :--- |
| `--paper` | `#FBF3E2` | Canvas/page background; natural unbleached handmade paper. |
| `--paper-2` | `#F3E7D1` | Card mounting mats, alternate sections, table zebra stripes. |
| `--ink` | `#1E130E` | Primary text, dark bands, line drawings (warm near-black, ratio > 14:1 on paper). |
| `--accent` | `#B8321F` | Vermilion mineral pigment; Surya sun disc, display wordmarks, primary CTAs. (Hover: `#8E1F14`). |
| `--turmeric` | `#E0A21B` | Haldi gold; subtle highlights on dark ink bands (ratio > 5:1 on ink). |
| `--indigo` | `#24527A` | Neel deep blue; informational badges, secondary links, provenance markers. |
| `--leaf` | `#4C7A4F` | Forest green; stock availability, verified authentic checkmarks. |
| `--line` | `rgba(30,19,14,0.18)` | Crisp 1px structural framing, borders, registration marks. |

**Strict Rule:** A single viewport shows paper + ink + at most ONE loud accent. All text complies with WCAG 2.1 AA (>= 4.5:1). No raw hex values outside `tokens.css`.

---

## 2. Typography Hierarchy
1. **Display Headings:** **Bebas Neue** (or Anton) via `next/font/google`.
   - All uppercase, tight tracking (`-0.01em` to `0.02em`), heavy condensed weight.
   - Used for: exhibition titles, hero headlines, section headers, giant footer wordmark.
2. **Body & Prose:** **Inter** (or DM Sans).
   - 16px base, 1.6 line height, warm ink color.
   - Used for: art descriptions, Natasha's story, policy text, checkout forms.
3. **Micro-Type & Labels:** **JetBrains Mono** (or system monospace stack).
   - 11px to 13px, all uppercase, wide tracking (`0.18em` to `0.28em`).
   - Used for: `FIG. 01 / FISH MANDALA`, price tags, navigation links, barcodes, specs.
   - Note: Form `<input>` elements maintain `>= 16px` font size to prevent iOS auto-zoom.

---

## 3. Print Textures & Tactile Ornaments
- **Paper Grain:** One static pre-baked noise PNG/WebP under 8 KB applied as a light 4% background overlay on `body`. Zero runtime SVG filter overhead.
- **Distressed Ink:** Static CSS SVG mask on display titles giving the impression of woodblock / screen-print ink bleed.
- **Misregistration Offset:** Buttons, badges, and cards feature a crisp 2px offset second-color shadow (`box-shadow: 2px 2px 0 var(--accent)`) instead of digital blur shadows.
- **Madhubani Motifs:** Clean repeating SVG border ribbons (leaf serrations, wave scallops) and registration crosses (`+`) acting as framing elements.

---

## 4. Universal UI Components (`src/components/ui/`)
- **Button:** Rectangular, sharp corners, 48px min touch target, monospace uppercase, misregistration offset on hover/focus.
- **PrintCard (Product Card):** 4:5 image mounted on `--paper-2` with thin ink rim; monospace caption row (`FIG. 01` + price); rotated red `SOLD` woodblock stamp on out-of-stock originals.
- **HeaderBar:** Minimalist paper bar, small-caps brand logo, monospace navigation links, `CART [ 2 ]` counter.
- **MarqueeTicker:** Pure CSS single-line ribbon (`FISH · PEACOCK · LOTUS · TREE OF LIFE · SURYA`) paused on hover and disabled under `prefers-reduced-motion`.

---

## 5. PosterFooter Architecture & Motion
Located at `src/components/layout/PosterFooter/`:
- **Server Shell (`PosterFooter.tsx`):** Pre-renders all SEO links, store categories, copyright, and legal disclosures without JavaScript.
- **Client Motion Island (`PosterStage.client.tsx`):** Dynamically imported (< 20 KB gz), activates only when nearing viewport.
  - **Surya Sun Disc:** Vermilion circle behind the motif.
  - **Peacock Echo Wheel:** Madhubani peacock vector with 7 fanned tail feathers per side. Feathers respond to pointer physics with spring lag (`stiffness = 200 / (1 + 0.5*i)`).
  - **Touch & Accessibility:** Gentle idle sway (+-8 deg) on touch screens; static open fan under `prefers-reduced-motion`.
  - **Replay Button:** Clicking the sun disc replays the entrance animation.
  - **Compact Variant:** A condensed 260px footer for Cart, Checkout, Order, Track, and Legal pages.
