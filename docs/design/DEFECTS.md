# Visual QA & Design Defect Audit (Pre-Redesign Baseline)
**Platform:** Vernika Enterprises  
**Branch:** `theme/poster`  
**Reference Target:** Screen-Printed Gallery Poster Visual Language (Mithila Art Adapted)  
**Screenshots Inspected:** `docs/design/screens/before/` (360px mobile, 768px tablet, 1440px desktop)  

---

## 1. Master Defect Ledger

| Defect ID | Page / Route | Viewport | Defect Description | Severity | Target Resolution in `theme/poster` | Status |
| :---: | :--- | :---: | :--- | :---: | :--- | :---: |
| **DEF-001** | Global / Header | All (360/768/1440) | Navigation uses standard UI pill styling; Cart button is generic; lacks mono micro-type `CART [ 0 ]` gallery look. | Major | Redesign with slim paper bar, small-caps brand mark, monospace nav, and `CART [ N ]` indicator. | Open |
| **DEF-002** | Global / Footer | All (360/768/1440) | Standard multi-column dark footer with newsletter form; lacks the signature exhibition poster architecture, sun disc, and peacock echo. | Critical | Build `PosterFooter` with Surya sun disc, Madhubani peacock SVG, spring echo feathers, seal, barcode, and wave scallop floor. | Open |
| **DEF-003** | Global / Tokens | Codebase | Raw hex colors used inconsistently across CSS and inline styles; no unified 3-ink poster palette. | Major | Establish strict CSS tokens in `src/styles/tokens.css` (`--paper`, `--paper-2`, `--ink`, `--accent`, etc.) mapped into Tailwind. | Open |
| **DEF-004** | Global / Typography | All | Headlines use standard serif/sans without heavy condensed letterpress character; body text lacks typographic hierarchy. | Major | Integrate display condensed sans (Anton / Bebas Neue) via `next/font`, body sans (Inter/DM Sans), and monospace micro-type. | Open |
| **DEF-005** | Global / Buttons | All | Buttons have rounded corners and soft drop shadows instead of tactile screen-printed misregistration offsets. | Major | Implement universal rectangular `Button` component with crisp 2px offset second-color shadow (`box-shadow: 2px 2px 0 var(--accent)`). | Open |
| **DEF-006** | Home (`/`) | Desktop / Mobile | Hero carousel is a generic digital slideshow; lacks exhibition poster framing, registration crosses, and sun disc aura. | Major | Redesign hero into an archival exhibition poster with condensed caps, mono kicker, arch-framed painting, and Surya sun disc. | Open |
| **DEF-007** | Shop (`/shop`) | All | Product cards look like generic e-commerce tiles; lack archival print mounting, `FIG. ##` captions, and woodblock SOLD stamps. | Major | Rebuild `PrintCard` component with 4:5 paper-2 mounting, thin ink rim, mono caption row, and rotated accent SOLD stamp. | Open |
| **DEF-008** | Product (`/shop/[slug]`) | All | Product layout uses generic SaaS border cards rather than an editorial gallery monograph plate. | Major | Restyle with large paper mount, ink rim, display price, mono technical specs table, and authentic motif story. | Open |
| **DEF-009** | Cart & Checkout | 360 / 768 | Full heavy footer distracts from focused conversion flow on cart/checkout pages. | Major | Introduce `variant="compact"` footer (condensed wordmark band + essential links) for Cart, Checkout, Order, Track, Legal. | Open |
| **DEF-010** | Gallery (`/gallery`) | Desktop / Tablet | Portfolio viewer has modern white toolbar; doesn't feel like examining archival plates in an art gallery. | Minor | Restyle with paper background, ink borders, mono `PLATE ##` captions, and letterpress controls. | Open |
| **DEF-011** | Textures & Grain | Global | Flat digital rendering without paper tooth or ink impression; no tangible craft feel. | Minor | Add static pre-baked micro-noise paper grain tile (<8KB) and subtle distressed ink mask to large display wordmarks. | Open |
| **DEF-012** | Form Inputs | 360px Mobile | Input fields in contact, track, and admin have generic rounded borders and inconsistent focus rings. | Minor | Standardize on crisp hairline boxes, mono labels, 2px accent focus ring, and font-size >= 16px to prevent iOS auto-zoom. | Open |

---

## 2. Visual QA Verification Plan
Each defect above will be marked `Fixed` in Wave 2 with links to corresponding after-screenshots in `docs/design/screens/after/`.
