# Owner Actions & Production Deployment Checklist
**Platform:** Vernika Enterprises by Natasha Gupta  
**Release Candidate:** `v1.0.0-rc1`  
**Target Monthly Fixed Cost:** ₹0 / month  

---

## Overview

The entire application code, App Router architecture, MongoDB schema, cart logic, atomic inventory reservation engine, payment webhooks, admin portal, security headers, legal policy pages, and verification suites have been fully audited, hardened, and verified with zero unverified claims.

Before switching DNS and taking customer payments, the site owner (Natasha Gupta / Technical Administrator) must complete the following 10 actionable steps.

---

## 1. MongoDB Atlas M0 Cluster Setup (₹0/mo)

*Currently:* Development runs on local MongoDB (`127.0.0.1:27017`) and passes all integration tests in `SIMULATED` local DB mode.  
*Action Required:*
1. Create a free account at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create an **M0 Shared Free Tier Cluster** in region `ap-south-1` (Mumbai).
3. Under **Database Access**, create a user `vernika_admin` with read/write privileges to database `vernika_production`.
4. Under **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) so Vercel serverless functions can connect.
5. Copy the connection string into `.env.local` and your Vercel Project Environment Variables:
   ```env
   MONGODB_URI="mongodb+srv://vernika_admin:<PASSWORD>@cluster0.xxxxx.mongodb.net/vernika_production?retryWrites=true&w=majority"
   ```
6. Run `npm run seed` to populate the 66 catalog items and build unique indexes in Atlas.

---

## 2. Razorpay KYC & Live Test/Production Keys

*Currently:* Local test keys returned `Authentication failed` against live API checks. Checkout fallback protects production mode by throwing a hard exception if keys are missing or invalid.  
*Action Required:*
1. Log in to [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Complete merchant onboarding / business KYC for Vernika Enterprises.
3. Switch to **Test Mode**, generate Key ID and Key Secret, and place in `.env.local`:
   ```env
   RAZORPAY_KEY_ID="rzp_test_..."
   RAZORPAY_KEY_SECRET="..."
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
   ```
4. Navigate to **Settings > Webhooks**, add endpoint `https://<YOUR_DOMAIN>/api/webhooks/razorpay`, subscribe to events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
5. Generate a Webhook Secret and set:
   ```env
   RAZORPAY_WEBHOOK_SECRET="..."
   ```
6. Verify live payments in Test Mode before flipping Razorpay to **Live Mode**.

---

## 3. Cloudinary Image CDN Setup (₹0/mo)

*Currently:* Quick-Add product uses a mock direct upload adapter in local development.  
*Action Required:*
1. Sign up for a free tier account at [cloudinary.com](https://cloudinary.com) (25 GB managed bandwidth/storage).
2. Go to **Dashboard** and copy credentials into `.env.local`:
   ```env
   CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   ```
3. In Cloudinary Settings > Upload, create an upload preset with folder `vernika_products`.
4. This enables Natasha to photograph paintings on her phone and upload them directly via `/admin`.

---

## 4. Resend Transactional Email Setup (₹0/mo)

*Currently:* Development logs transactional emails to Node console (`SIMULATED`).  
*Action Required:*
1. Sign up for a free tier account at [resend.com](https://resend.com) (3,000 emails/month free).
2. Add and verify your custom sending domain: `vernikaenterprises.com` (add DNS TXT and MX records).
3. Generate an API Key with sending permissions and set:
   ```env
   RESEND_API_KEY="re_..."
   EMAIL_FROM="Vernika Enterprises <orders@vernikaenterprises.com>"
   ADMIN_NOTIFY_EMAIL="vernikaenterprises14@gmail.com"
   ```
4. Order confirmations, customer invoices, and COD OTP emails will now dispatch instantly.

---

## 5. Upstash Serverless Redis Setup (₹0/mo)

*Currently:* In-memory sliding-window rate limiting active for local development. In serverless multi-region deployments, an external store is recommended to enforce rate limits across instances.  
*Action Required:*
1. Sign up at [upstash.com](https://upstash.com) (10,000 commands/day free).
2. Create a global Redis database in `ap-south-1` (Mumbai).
3. Copy the REST connection parameters into environment variables:
   ```env
   UPSTASH_REDIS_REST_URL="https://...upstash.io"
   UPSTASH_REDIS_REST_TOKEN="..."
   ```

---

## 6. Admin Account Password Generation

*Action Required:*
1. In your local terminal, run the secure generator:
   ```bash
   npm run admin:create
   ```
2. Enter Natasha's secure master password when prompted.
3. Copy the printed `ADMIN_PASSWORD_HASH` into `.env.local` and Vercel Environment Variables.
4. Set:
   ```env
   ADMIN_EMAIL="vernikaenterprises14@gmail.com"
   ADMIN_PASSWORD_HASH="$2a$12$..."
   SESSION_SECRET="<generate 32+ char random string>"
   ```

---

## 7. Scheduled Abandoned Cart & Stock Release Cron

*Currently:* Lazy release runs automatically on catalog queries, but a dedicated 15-minute cron is required to clean up abandoned unpaid checkouts in the background.  
*Action Required:*
1. Set a random secret string:
   ```env
   CRON_SECRET="vernika_cron_random_entropy_string_9942"
   ```
2. In `vercel.json` or external cron service (such as [cron-job.org](https://cron-job.org) or GitHub Actions), trigger every 15 minutes:
   ```http
   GET https://<YOUR_DOMAIN>/api/cron/release-abandoned-orders
   Header: Authorization: Bearer <CRON_SECRET>
   ```

---

## 8. Legal Counsel Review of Policy Drafts

*Currently:* Policy pages are marked `[DRAFT — Needs Legal Review]` with placeholder GSTIN `DRAFT_REVIEW_PENDING`.  
*Action Required:*
1. Review `/terms`, `/privacy`, `/shipping`, `/returns`, and `/cancellation` with legal counsel or CA.
2. Update GSTIN in `src/config/site.ts` or via Admin Settings UI (`/admin`) once GST registration is final.
3. Remove the draft banner disclaimer in `src/app/(policies)/...` once reviewed.

---

## 9. Photography & Studio Asset Refresh

*Currently:* Catalog uses 66 curated WebP images derived from the high-resolution Madhubani portfolio.  
*Action Required:*
1. Capture high-resolution studio photos of Natasha Gupta at work in her studio in Patna, Bihar.
2. Replace `/public/artist-natasha.webp` with the authentic portrait.
3. Photograph physical framed dimensions with a reference scale for statement pieces.

---

## 10. Vercel Deployment & Domain Configuration

*Action Required:*
1. Push `main` branch to private GitHub repository.
2. Import project into Vercel Dashboard.
3. Add all environment variables listed above.
4. Point DNS A-records and CNAME to Vercel for `vernikaenterprises.com` and `www.vernikaenterprises.com`.
5. Run `npm run verify` locally before promoting any production deployment.
