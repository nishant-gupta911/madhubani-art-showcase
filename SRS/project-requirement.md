# Project Requirement

> Working name: **Madhubani Art Store** (replace with the final brand name)
> Version: 1.0 | Status: Draft | Date: 31 Oct 2026

## 1. Vision
A beautiful, fast, zero-cost-to-run website where **Mom's Madhubani paintings and handmade products** can be
**discovered, admired and ordered**, and where her **complete body of work (PDF portfolio)** can be explored online.
The site should make visitors *want to stay*: it should feel like walking into an art gallery that also has a shop.

## 2. Goals
| # | Goal | Measure of success |
|---|------|--------------------|
| G1 | Let customers order products online | Checkout completes in under 2 minutes |
| G2 | Showcase all of Mom's work, including the PDF portfolio | Every page of the PDF viewable as a gallery |
| G3 | Let Mom manage the store herself, without a developer | She can add a product from her phone in under 3 minutes |
| G4 | Cost nothing to run at the start | Rs. 0 monthly infra on free tiers (see section 7) |
| G5 | Stay fast and stable under traffic spikes | Lighthouse 90+, no downtime on a viral day |
| G6 | Premium, memorable design | Average session over 2 minutes |

## 3. Stakeholders
- **Owner / Artist (Mom):** manages products, orders and portfolio. Low technical skill. Likely Hindi/English.
- **Developer (you):** builds and maintains.
- **Customers:** art lovers, gift buyers, interior designers, collectors. Mostly mobile users in India, some international.

## 4. Scope
### In scope (MVP)
- Home, Shop (catalog), Product detail, Cart, Checkout, Order confirmation, Order tracking
- Portfolio / Gallery (images + PDF viewer + PDF download)
- About the artist and the Madhubani art story
- Contact / custom-order request form, WhatsApp click-to-chat
- Admin dashboard (products, orders, portfolio, site content)
- Online payment (UPI/cards) + Cash on Delivery
- Transactional emails, SEO, analytics

### Later (post-MVP)
- Reviews, wishlist, discount coupons, multi-language (Hindi), blog / workshops,
  international shipping and currency, shipping-aggregator integration, newsletter

### Out of scope
- Marketplace with multiple sellers, mobile native app, own payment gateway

## 5. Assumptions
- Product photos are already in the project root folder (to be moved into `/assets-source` and processed).
- The portfolio PDF exists and is provided by Mom.
- Single seller, single admin account (Mom, optionally the developer).
- Primary market is India (INR, GST considerations, Indian shipping); international comes later.
- Mom has or will create: a Razorpay account (needs PAN and bank account), a WhatsApp Business number.

## 6. Constraints
- **Budget: Rs. 0 for infrastructure.** Only free tiers.
- Must work great on low-end Android phones and slow 4G.
- Developer time is limited, so we choose boring, well-documented tools.
- Payment gateway charges per transaction are unavoidable (about 2% for Razorpay).

## 7. Free-tier stack (summary, details in `architecture.md`)
| Need | Service | Free allowance (verify before launch) |
|------|---------|----------------|
| Frontend + API | Next.js on **Vercel** | See hosting warning below |
| Database | **MongoDB Atlas M0** | 512 MB |
| Images | **Cloudinary** (or Vercel image optimisation) | ~25 credits/month |
| Payments | **Razorpay** | No setup fee, per-transaction fee only |
| Email | **Resend** | ~3,000 emails/month |
| Rate limit / cache | **Upstash Redis** | ~10k commands/day |
| Errors | **Sentry** | Free developer plan |
| Analytics | **Vercel Analytics / Umami / GA4** | Free |

> **Hosting warning:** Vercel's free *Hobby* plan is, per its terms, meant for **personal, non-commercial use**.
> A shop that takes payments is commercial. Before launch, read Vercel's current Fair Use / terms.
> If it is not allowed, the zero-cost alternatives are **Cloudflare Pages** or **Netlify** (both allow commercial
> use on free plans, check current terms). Build the app so the host can be swapped (no host-specific lock-in).

## 8. Risks
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Free-tier limits hit during traffic spike | Site slows or fails | Static generation + CDN caching, optimised images, rate limiting |
| Hosting terms on commercial use | Account suspended | Confirm terms, keep host portable |
| Large PDF slows the site | Poor UX | Convert PDF pages to optimised WebP, lazy-load, offer PDF as optional download |
| Mom finds admin hard | Store goes stale | Very simple, mobile-first admin, Hindi labels, short video guide |
| Fraud / fake COD orders | Lost shipping cost | OTP / phone verification, COD limits, advance for high-value orders |
| Data loss | Lost orders | Atlas backups plus weekly export script |

## 9. Open Questions (need answers before Phase 1 ends)
1. Final brand name and logo? Domain name (about Rs. 600 to 800 per year is the one unavoidable cost)?
2. Product types: only paintings, or also sarees, dupattas, bags, coasters, home decor, prints?
3. Are paintings one-of-a-kind (stock = 1) or made-to-order or both?
4. Ship across India only, or international too?
5. Approximate number of products and pages in the PDF?
6. Does Mom have a GST number? (affects invoices and pricing)
7. Return / refund policy for handmade items?
8. Languages: English only, or Hindi also?
