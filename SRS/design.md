# Design (UI / UX)

## 1. Design Intent
**"A gallery you can shop in."** The site should feel like a warm, handmade, culturally rooted art space:
the paintings are the heroes, and the interface stays calm so the art can glow.
Avoid generic template-shop looks. Use Madhubani's visual language (borders, fish, peacocks, sun, tree of life, line patterns) as subtle *accents*, never as clutter.

**Feelings to evoke:** warmth, craft, heritage, trust, delight.
**Keywords:** earthy, vivid-but-balanced, hand-drawn, spacious, story-led.

## 2. Colour System
Taken from traditional Madhubani natural pigments. Define as CSS variables and Tailwind tokens.

| Token | Hex | Use |
|-------|-----|-----|
| `--paper` | `#FBF5E9` | Page background (handmade-paper cream) |
| `--paper-deep` | `#F3E7D1` | Section alternation, cards |
| `--ink` | `#2A1A14` | Body text (warm near-black) |
| `--ink-soft` | `#6B5547` | Secondary text |
| `--vermilion` | `#B8321F` | **Primary** brand and CTAs |
| `--vermilion-dark` | `#8F2415` | Hover/pressed |
| `--turmeric` | `#E0A21B` | Highlights, badges, stars |
| `--indigo` | `#24406B` | Links, trust elements, secondary actions |
| `--leaf` | `#4C7A4F` | Success, "In stock" |
| `--rose` | `#D96A7A` | Soft accents, illustrations |
| `--line` | `#E4D3B5` | Borders, dividers |

Rules:
- CTA text on vermilion: white, contrast over 4.5:1 (verify).
- Maximum 2 accent colours per screen section.
- Dark mode is **not** planned for v1 (art colours must stay true).

## 3. Typography
| Role | Font (free, Google Fonts via `next/font`) | Notes |
|------|-------------------------------------------|-------|
| Headings | **Cormorant Garamond** or **Playfair Display** (600) | Elegant, gallery feel |
| Body/UI | **Inter** or **Nunito Sans** (400/500/600) | Highly legible on mobile |
| Optional accent (Hindi) | **Noto Serif Devanagari / Noto Sans Devanagari** | Only if Hindi added |

Scale (mobile -> desktop): H1 36 -> 64, H2 28 -> 44, H3 22 -> 30, body 16 -> 17, small 14. Line height 1.6 for body. Max line length 65 characters.

## 4. Layout, Spacing and Shape
- 8-pt spacing scale (4, 8, 12, 16, 24, 32, 48, 64, 96).
- Container max width 1280 px; generous whitespace (sections 64 to 96 px vertical on desktop).
- Radius: 12 px cards, 999 px pills, 8 px inputs. Images in softly rounded frames or arch shapes.
- Shadows: soft, warm (`0 8px 30px rgba(42,26,20,.08)`).
- Breakpoints: 360 / 640 / 768 / 1024 / 1280.
- Madhubani **border strip** (SVG, repeating) as section dividers and around hero/featured frames.

## 5. Signature Visual Elements
1. **Madhubani border** (fish, leaves, dots) as a thin repeating SVG divider.
2. **Arch / frame crops** for hero and featured paintings.
3. **Hand-drawn underline** under key headings (SVG stroke animation on scroll).
4. **Paper texture** at about 3% opacity on the background (tiny optimised PNG).
5. **"Handmade by [Mom's name]" seal** badge on product pages: trust and story.

## 6. Components
| Component | Details |
|-----------|---------|
| Header | Sticky; logo left, nav centre (Shop, Gallery, About, Contact), search + cart right; shrinks on scroll; mobile: hamburger drawer + bottom quick bar |
| Announcement bar | Free shipping / festive offer; dismissible |
| Product card | 4:5 image, second image on hover (desktop), name, price, "Sold"/"Few left" badge, quick-add; entire card clickable |
| Product gallery | Swipeable thumbnails, pinch/click zoom, 360-style detail shots, optional "view on wall" mock |
| Buttons | Primary (vermilion filled), Secondary (indigo outline), Ghost; 48 px min height; clear loading state |
| Inputs | Floating labels, inline validation, large tap targets, correct mobile keyboards (`inputmode`) |
| Cart drawer | Slides from the right; thumbnail, qty stepper, subtotal, free-shipping progress bar |
| Toasts | Bottom on mobile, top-right on desktop |
| Skeletons | For all async areas, matched to final layout (no layout shift) |
| Lightbox | Fullscreen, swipe/arrow keys/esc, caption, share |
| Empty/error states | Friendly illustrated message plus next action |
| Sticky mobile CTA | "Add to cart / Buy now" bar on product page |

## 7. Page Blueprints

### Home
1. **Hero:** large painting in an arch frame, headline ("Stories painted by hand"), sub-line, CTAs *Shop Paintings* and *Explore Gallery*. Gentle parallax/fade-in.
2. **Trust strip:** Handmade, Ships across India, Secure payment, Certificate of authenticity.
3. **Shop by category:** 4 to 6 illustrated tiles.
4. **Featured paintings:** horizontal scroll on mobile, 4-column grid on desktop.
5. **Meet the artist:** photo, short story, link to About.
6. **Process strip:** sketch -> natural colours -> outlining -> finished (short looping video or image sequence).
7. **Gallery teaser:** masonry of 6 images -> "View full portfolio".
8. **Testimonials / Instagram feed link.**
9. **Newsletter / WhatsApp join + footer.**

### Shop
Left filter panel (desktop) or bottom-sheet filters (mobile), sort dropdown, result count, active-filter chips, grid with infinite scroll or "Load more", skeleton loading.

### Product
Gallery left, details right (desktop) / stacked (mobile). Order: title, price, availability, short story, size/medium selectors, CTA, delivery estimate by pincode, accordion (details, care, shipping/returns), **"The story behind this painting"** block, related products.

### Cart and Checkout
Single-page, three clear steps (Contact -> Address -> Payment), progress indicator, order summary always visible, minimal fields, trust badges, WhatsApp help link. **Guest checkout by default.**

### Gallery / Portfolio
Masonry grid with theme filters; **PDF flip-book viewer** (swipe on mobile, arrows on desktop, page counter, fullscreen); prominent *Download portfolio (PDF)* button.

### About
Large portrait, personal story in first person, timeline, awards/exhibitions, process photos, signature graphic.

### Admin
Clean, plain, large type, big buttons, bottom tab bar on mobile (Orders, Products, Add, Gallery, Settings). Quick-add flow: **Photo -> Name & price -> Publish**. Colour-coded order statuses.

## 8. UX Principles
- **Art first:** big, crisp images; minimal UI chrome.
- **Few taps to buy:** Add to cart in 1 tap; checkout in under 2 minutes.
- **Reduce anxiety:** show shipping, returns and payment security near the CTA; clear "Sold" vs "Available" states.
- **Tell stories:** each product has a short story, which converts browsers into emotional buyers.
- **Immediate feedback:** every action has a visible response (button states, toasts, skeletons).
- **Forgiving forms:** autosave address, inline errors in plain language, no data loss on refresh.
- **Easy contact:** WhatsApp floating button (not blocking the sticky CTA).

## 9. Motion
- Duration 200 to 400 ms; easing `cubic-bezier(.22,1,.36,1)`.
- Use for: fade/slide-up on scroll reveal, cart drawer, image zoom, hand-drawn underline, hover lift on cards.
- Respect `prefers-reduced-motion`: disable parallax and large movements.
- Never animate layout properties (use transform/opacity) to protect performance.

## 10. Imagery Guidelines
- Product shots: plain warm-white background, soft natural light, straight-on and a 45-degree detail.
- Add one lifestyle shot per product (painting on a wall) to show scale.
- Consistent aspect ratios (4:5 cards; originals keep their true ratio on the product page).
- Export sizes: card 640 px, product 1600 px, zoom 2400 px; WebP/AVIF; blur placeholder for every image.

## 11. Accessibility Checklist
- Contrast AA for all text and UI states; focus ring visible (2 px indigo).
- All interactive elements keyboard-reachable; skip-to-content link.
- Alt text for every artwork; decorative patterns `aria-hidden`.
- Touch targets 44 px minimum; no hover-only information.
- Form labels, error announcements via `aria-live`.
- Lightbox/drawer trap focus and close with Esc.

## 12. Voice and Microcopy
Warm, simple, respectful. Short sentences. Examples:
- Add to cart: "Add to cart"; success: "Added. Beautiful choice."
- Sold: "This piece has found its home. Explore similar work."
- Empty cart: "Your cart is waiting for some colour."
- 404: "This page wandered off the canvas."
- Custom order: "Dreaming of something unique? Tell us your idea."

## 13. Design Deliverables and Process
1. Moodboard (Madhubani references, palette) -> Mom's approval
2. Low-fidelity wireframes for the 8 key pages (mobile first) in Figma (free tier) or on paper
3. High-fidelity mock of Home + Product + Checkout
4. Build the component library in code (Phase 1), then review with Mom on a Vercel preview link
5. Usability test with 3 to 5 people (family and friends): can they buy a painting without help?
