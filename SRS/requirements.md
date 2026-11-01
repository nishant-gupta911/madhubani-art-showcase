# Software Requirements Specification

Priority key: **P0** = must have for launch, **P1** = should have, **P2** = later.

## 1. User Roles
| Role | Description |
|------|-------------|
| Visitor | Browses without an account |
| Customer | Visitor who orders (guest checkout allowed; optional account) |
| Admin (Artist) | Manages everything in the dashboard |

## 2. Functional Requirements

### 2.1 Catalog and Discovery
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Shop page lists products in a responsive grid with image, name, price, stock badge | P0 |
| FR-1.2 | Filter by category, price range, size, availability | P0 |
| FR-1.3 | Sort by newest, price low to high, price high to low, popular | P0 |
| FR-1.4 | Search by name, category or tag, with instant suggestions | P0 |
| FR-1.5 | Product page: image gallery with zoom, description, story behind the art, size, materials, price, stock, delivery estimate | P0 |
| FR-1.6 | "Sold" badge for one-of-a-kind items already purchased (remains visible as portfolio) | P0 |
| FR-1.7 | Related products on the product page | P1 |
| FR-1.8 | Wishlist (local storage, then account-based) | P2 |
| FR-1.9 | Customer reviews with photos | P2 |

### 2.2 Cart and Checkout
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Add/remove/update quantity; cart persists in the browser | P0 |
| FR-2.2 | Mini-cart drawer plus full cart page | P0 |
| FR-2.3 | Guest checkout: name, phone, email, address (pincode auto-fills city and state) | P0 |
| FR-2.4 | Payment options: UPI / cards / netbanking (Razorpay) and Cash on Delivery | P0 |
| FR-2.5 | Server-side price and stock validation at checkout (never trust the client) | P0 |
| FR-2.6 | Shipping charge rules (flat rate / free above a threshold), configurable by admin | P0 |
| FR-2.7 | Order confirmation page plus email, with an order ID | P0 |
| FR-2.8 | Coupon codes | P2 |
| FR-2.9 | "Order via WhatsApp" fallback button with the cart pre-filled | P1 |
| FR-2.10 | Custom / commission order request form (size, theme, budget, reference image upload) | P1 |

### 2.3 Orders
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Order statuses: Placed, Confirmed, Packed, Shipped, Delivered, Cancelled, Refunded | P0 |
| FR-3.2 | Public order tracking by order ID + phone number | P0 |
| FR-3.3 | Customer receives email on each status change | P1 |
| FR-3.4 | Downloadable invoice (PDF) | P1 |
| FR-3.5 | Customer account with order history (email OTP / Google login) | P1 |

### 2.4 Portfolio / Work Showcase
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Gallery page showing all of Mom's work as a masonry grid with lightbox | P0 |
| FR-4.2 | The PDF is rendered **inside the site** as a flip-book / page gallery (converted to optimised images) | P0 |
| FR-4.3 | "Download full portfolio (PDF)" button | P0 |
| FR-4.4 | Gallery items can be tagged by style / theme (Fish, Peacock, Tree of Life, Mithila, etc.) | P1 |
| FR-4.5 | A gallery item can link to a product ("Available in shop") | P1 |
| FR-4.6 | Exhibitions, awards and press section | P2 |

### 2.5 Content Pages
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Home: hero, featured work, categories, artist intro, testimonials, Instagram link | P0 |
| FR-5.2 | About the Artist (story, photo, journey) | P0 |
| FR-5.3 | Story of Madhubani art (heritage, symbols, techniques) | P1 |
| FR-5.4 | Contact page with form, WhatsApp, phone, email, map/location text | P0 |
| FR-5.5 | Policies: Shipping, Returns, Privacy, Terms | P0 |
| FR-5.6 | FAQ | P1 |
| FR-5.7 | Blog / process videos / workshops | P2 |

### 2.6 Admin Dashboard
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | Secure login (admin only) | P0 |
| FR-6.2 | Product CRUD: multiple images (drag to reorder), price, stock, category, tags, publish/draft | P0 |
| FR-6.3 | Mobile-friendly "quick add product" flow (camera upload to product in 3 steps) | P0 |
| FR-6.4 | Order list with filters, details, status update, add tracking number | P0 |
| FR-6.5 | Manage categories, shipping settings, announcement banner | P0 |
| FR-6.6 | Manage gallery items and replace the portfolio PDF | P1 |
| FR-6.7 | Dashboard stats: sales, orders, top products | P1 |
| FR-6.8 | Export orders to CSV | P1 |
| FR-6.9 | Edit About / Home text without code | P1 |

### 2.7 Notifications
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | Email customer on order placed, shipped, delivered | P0 |
| FR-7.2 | Email / WhatsApp-link alert to admin on a new order | P0 |
| FR-7.3 | Low-stock alert | P2 |

## 3. Non-Functional Requirements

### 3.1 Performance
- NFR-1: Lighthouse Performance 90+ on mobile for Home, Shop, Product pages.
- NFR-2: LCP under 2.5 s on 4G; CLS under 0.1; INP under 200 ms.
- NFR-3: All images served as WebP/AVIF, responsive sizes, lazy-loaded, with blur placeholders.
- NFR-4: Catalog and content pages are statically generated (SSG/ISR) and CDN-cached.
- NFR-5: Initial JS bundle per page under 150 KB gzipped where possible.

### 3.2 Scalability and Availability
- NFR-6: Survive traffic spikes (for example a viral Instagram post) on free tiers through CDN caching and few DB calls.
- NFR-7: DB connection reuse in serverless (cached MongoClient); indexes on all query fields.
- NFR-8: Rate limiting on auth, checkout, contact and search APIs.
- NFR-9: Target 99.9% availability (host SLA dependent).

### 3.3 Security
- NFR-10: HTTPS only; secure headers (CSP, HSTS, X-Frame-Options).
- NFR-11: Payment details never touch our server (Razorpay hosted checkout); verify payment signature and webhook server-side.
- NFR-12: Admin routes protected by server-side session checks; strong password plus optional 2FA.
- NFR-13: Input validation (Zod) on every API; protection from NoSQL injection, XSS, CSRF.
- NFR-14: Secrets only in environment variables; never committed.
- NFR-15: Comply with India's DPDP Act basics: privacy policy, minimum data collection, deletion on request.

### 3.4 Usability and Accessibility
- NFR-16: Mobile-first (at least 75% of traffic expected on phones); thumb-friendly controls.
- NFR-17: WCAG 2.1 AA: contrast, keyboard navigation, alt text, focus states, reduced-motion support.
- NFR-18: A first-time customer can finish a purchase without instructions.

### 3.5 SEO and Discoverability
- NFR-19: Semantic HTML, unique titles and meta, Open Graph and Twitter cards (essential for WhatsApp/Instagram sharing).
- NFR-20: Sitemap.xml, robots.txt, JSON-LD (Product, Organization, BreadcrumbList), clean slugs.

### 3.6 Maintainability
- NFR-21: TypeScript strict mode, ESLint, Prettier, consistent folder structure.
- NFR-22: Automated tests for pricing, stock and payment-verification logic.
- NFR-23: Documentation kept current in `/srs`.

### 3.7 Cost
- NFR-24: Rs. 0 monthly infrastructure at launch; usage alerts before any free limit is exceeded.

## 4. Key User Stories
1. As a **visitor**, I want to see beautiful large photos of each painting, so I can judge the detail and quality.
2. As a **buyer**, I want to pay by UPI quickly without creating an account.
3. As a **customer**, I want to track my order without logging in.
4. As a **art lover**, I want to read the story behind a painting, so it feels meaningful to give as a gift.
5. As a **collector**, I want to browse the artist's entire portfolio and download it.
6. As **Mom**, I want to add a new painting from my phone in a few taps.
7. As **Mom**, I want to get a notification the moment someone orders.

## 5. Acceptance Criteria (examples)
- **Checkout:** Given a product with stock 1, when two customers try to buy simultaneously, only one order succeeds; the other sees "just sold".
- **Payment:** Given a successful Razorpay payment, the order moves to "Confirmed" only after server-side signature verification.
- **Portfolio:** Given the PDF has N pages, the gallery shows N images in order, each loading lazily, with total initial load under 1 MB.
- **Admin:** Given a new product with 3 photos, it appears on the shop within 60 seconds of publishing.
