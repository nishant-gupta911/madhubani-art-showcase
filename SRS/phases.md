# Development Phases

Estimates assume about 2 hours per day of focused work. Adjust to your pace.
Do not start a phase until the previous phase's **exit criteria** are met.

```
Phase 0  Foundation & Assets        (3-4 days)
Phase 1  Design System & Static UI  (1 week)
Phase 2  Database & Catalog         (1 week)
Phase 3  Cart & Checkout & Payments (1.5 weeks)
Phase 4  Admin Dashboard            (1.5 weeks)
Phase 5  Portfolio & PDF Gallery    (4-5 days)
Phase 6  Polish, SEO, Performance   (1 week)
Phase 7  Testing & Launch           (1 week)
Phase 8  Post-launch Growth         (ongoing)
```

---

## Phase 0: Foundation and Assets
**Goal:** Everything needed to start building without surprises.
- [ ] Answer the open questions in `project-requirement.md`
- [ ] Decide the brand name; buy a domain (only paid item)
- [ ] Create accounts: GitHub, Vercel, MongoDB Atlas, Cloudinary, Razorpay (start KYC early, it takes days), Resend, Upstash, Sentry
- [ ] Confirm Vercel Hobby commercial-use terms, or choose Cloudflare Pages/Netlify
- [ ] Initialise the repo: Next.js + TypeScript + Tailwind + ESLint + Prettier + Husky
- [ ] Move original images from the root into `/assets-source/` (git-ignored if large)
- [ ] Write an image pipeline script (sharp): resize, convert to WebP/AVIF, generate blur placeholders
- [ ] Spreadsheet of all products: name, category, size, medium, price, story, image file names
- [ ] Get the portfolio PDF; count the pages
- [ ] Set up `.env.example`, folder structure from `architecture.md`, and CI (lint + typecheck)

**Exit:** Repo deploys a "Coming soon" page to Vercel preview; all accounts ready.

---

## Phase 1: Design System and Static UI
**Goal:** The look and feel, with dummy data, so Mom can approve it early.
- [ ] Tailwind tokens: colours, fonts, spacing, radii, shadows (from `design.md`)
- [ ] Core components: Button, Input, Badge, Card, Modal, Drawer, Toast, Skeleton
- [ ] Layout: Header (sticky, search, cart icon), Footer, Announcement bar, mobile menu
- [ ] Madhubani border/pattern SVG assets
- [ ] Pages with mock data: Home, Shop, Product, Cart, Checkout, About, Contact, Gallery
- [ ] Responsive checks at 360, 768, 1024, 1440 px

**Exit:** Clickable, polished static prototype; **Mom approves the look**.

---

## Phase 2: Database and Catalog
**Goal:** Real data driving the shop.
- [ ] Connect MongoDB Atlas (cached client, indexes)
- [ ] Models: Product, Category, Order, Customer, GalleryItem, Settings, Admin
- [ ] Seed script: import products from the spreadsheet plus processed images
- [ ] Upload processed images to Cloudinary (or `/public`); save URLs in DB
- [ ] Shop page: filters, sort, search, pagination or infinite scroll
- [ ] Product page with gallery and zoom; related products
- [ ] SSG/ISR + on-demand revalidation
- [ ] SEO basics: metadata, Open Graph, sitemap, JSON-LD for products

**Exit:** All real products browsable; pages load fast; Lighthouse 90+.

---

## Phase 3: Cart, Checkout and Payments
**Goal:** A customer can order and pay.
- [ ] Cart state (Zustand) persisted in localStorage; cart drawer
- [ ] Checkout form with Zod validation; pincode lookup
- [ ] Server API: validate cart, recompute prices, check/reserve stock atomically
- [ ] Razorpay: create order, hosted checkout, **signature verification**, **webhook**
- [ ] Cash on Delivery flow with phone OTP
- [ ] Order creation, order ID generation, confirmation page
- [ ] Emails (Resend): customer confirmation, admin new-order alert
- [ ] Order tracking page (order ID + phone)
- [ ] Rate limiting (Upstash) on checkout and OTP
- [ ] Test with Razorpay **test mode** end to end, including failures and retries

**Exit:** Test-mode orders complete; no overselling in a double-click/parallel test.

---

## Phase 4: Admin Dashboard
**Goal:** Mom runs the store alone.
- [ ] Auth (Auth.js): admin login, protected routes and APIs
- [ ] Dashboard home: today's orders, revenue, low stock
- [ ] Products: list, create, edit, publish/unpublish, mark sold; direct-to-Cloudinary upload with drag-reorder
- [ ] Mobile "quick add" flow (photo, name, price, done)
- [ ] Orders: list, filter, detail, status updates, tracking number, triggers customer emails
- [ ] Settings: shipping rates, announcement banner, contact details
- [ ] Gallery and portfolio PDF management
- [ ] Hindi/English labels (optional) and a 5-minute screen-recorded guide for Mom

**Exit:** Mom adds a product and processes a test order by herself.

---

## Phase 5: Portfolio and PDF Gallery
**Goal:** Show everything she has created, beautifully.
- [ ] Convert PDF pages to WebP images (script with `pdftoppm`/`sharp`, run offline)
- [ ] Gallery page: masonry grid, lightbox with swipe/keyboard, lazy loading
- [ ] Flip-book or scroll-story viewer for the PDF pages
- [ ] Filters by theme/style/year; "Available in shop" links
- [ ] "Download portfolio PDF" button (file served from CDN storage)
- [ ] Artist story section with timeline and process photos

**Exit:** Every PDF page viewable on mobile without lag; PDF downloadable.

---

## Phase 6: Polish, SEO and Performance
- [ ] Micro-interactions, page transitions, skeletons, empty and error states, custom 404
- [ ] Accessibility audit (axe, keyboard-only run)
- [ ] Performance pass: bundle analysis, image sizes, font loading, caching headers
- [ ] SEO: structured data, canonical URLs, alt text review, Search Console, Bing
- [ ] Analytics + Sentry configured; policy pages written
- [ ] Social sharing previews tested on WhatsApp, Instagram, Facebook
- [ ] Security headers (CSP, HSTS) and dependency audit

**Exit:** Lighthouse mobile 90+ on all key pages; axe has no critical issues.

---

## Phase 7: Testing and Launch
- [ ] Unit tests: pricing, stock, order ID, payment verification
- [ ] E2E tests (Playwright): browse, add to cart, checkout (test mode), admin add product
- [ ] Load test (k6 or Artillery) on cached pages and APIs; check free-tier headroom
- [ ] Real devices: low-end Android, iPhone, slow 4G throttling
- [ ] Switch Razorpay to **live mode**; place a real Rs. 1-10 order and refund it
- [ ] Backup and restore drill for MongoDB
- [ ] Connect the custom domain; HTTPS; redirects
- [ ] Soft launch to family and friends, fix bugs, then public launch (Instagram, WhatsApp status)

**Exit:** First real customer order delivered successfully.

---

## Phase 8: Post-launch Growth
- Reviews and testimonials, coupons, newsletter, Hindi version
- Shipping aggregator (Shiprocket) integration and automated tracking
- Blog / process videos / workshop bookings
- International shipping and multi-currency
- Google Merchant Center listing (free product listings)
- Instagram/Facebook shop sync, abandoned-cart emails
- Monthly review: traffic, conversion, free-tier usage, costs

---

## Milestone Summary
| Milestone | After phase | Demo |
|-----------|------------|------|
| M1 Design approved | 1 | Prototype link to Mom |
| M2 Catalog live (read-only) | 2 | Browsable shop |
| M3 First test order | 3 | Paid test-mode order |
| M4 Mom-operable | 4 | Mom adds product and ships order |
| M5 Launch-ready | 7 | Live payment verified |
