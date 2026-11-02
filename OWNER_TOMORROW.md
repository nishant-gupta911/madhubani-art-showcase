# OWNER TOMORROW RUNBOOK: LAUNCH CHECKLIST
**Store:** Vernika Enterprises (Madhubani Art by Natasha Gupta)  
**Total Estimated Time:** 45–60 minutes  
**Goal:** Connect your production accounts, verify with ONE command, deploy to Netlify, and launch.

---

## Stage 1: Create Free Accounts (15 mins)

Open each service in your browser and register (all have permanent ₹0/month free tiers):

- [ ] **1. MongoDB Atlas** (Database)  
  - URL: [cloud.mongodb.com](https://cloud.mongodb.com)  
  - Create free **M0 Sandbox cluster** in `ap-south-1` (Mumbai).  
  - In *Database Access*: create user `vernika_admin` with password.  
  - In *Network Access*: click **Add IP Address** > select **Allow Access from Anywhere** (`0.0.0.0/0`).  
  - Click **Connect** > **Drivers** > copy connection string.  
  - *If you see connection timeout:* Ensure `0.0.0.0/0` is active in Network Access.

- [ ] **2. Razorpay** (Payment Gateway)  
  - URL: [dashboard.razorpay.com](https://dashboard.razorpay.com)  
  - Sign up with your business/personal details.  
  - Toggle to **TEST MODE** (top bar).  
  - Go to **Settings > API Keys** > click **Generate Key**.  
  - Save `Key ID` (`rzp_test_...`) and `Key Secret`.  
  - Under **Webhooks**, add endpoint: `https://your-domain.netlify.app/api/webhooks/razorpay` with events: `order.paid`, `payment.failed`.

- [ ] **3. Cloudinary** (Image CDN & Admin Uploads)  
  - URL: [cloudinary.com](https://cloudinary.com)  
  - Free account (25 credits/mo).  
  - From Dashboard, copy: `Cloud Name`, `API Key`, `API Secret`.

- [ ] **4. Resend** (Transactional Receipts)  
  - URL: [resend.com](https://resend.com)  
  - Sign up, go to **API Keys** > create key with Full Access.  
  - Copy `re_...` key.

- [ ] **5. Upstash Redis** (Distributed Rate Limiting)  
  - URL: [console.upstash.com/redis](https://console.upstash.com/redis)  
  - Create free Redis database in Asia (Mumbai / Singapore).  
  - In database details, copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

---

## Stage 2: Paste Keys into `.env.local` (5 mins)

- [ ] Open `.env.local` in your editor and paste the copied values:

```bash
MONGODB_URI="mongodb+srv://vernika_admin:YOUR_PASSWORD@cluster0.abcde.mongodb.net/vernika?retryWrites=true&w=majority"
NEXT_PUBLIC_SITE_URL="https://vernika.art"
NEXT_PUBLIC_SELLER_CITY="Faridabad"
NEXT_PUBLIC_SELLER_STATE="Haryana"

ADMIN_EMAIL="admin@vernika.art"
ADMIN_PASSWORD_HASH="$2a$12$..."   # Generate with: node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD', 12))"
SESSION_SECRET="GENERATE_AT_LEAST_32_RANDOM_CHARACTERS_STRING"

NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."

CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

RESEND_API_KEY="re_..."
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```

---

## Stage 3: Run ONE Verification Command (2 mins)

- [ ] Run this single verification command:
```bash
npm run live:check
```

### Success Looks Like:
```
SERVICE                  STATUS            LATENCY     DETAIL
-------------------------------------------------------------------------------------------------------
MongoDB Atlas            PASS              48ms        Connected, ping OK, unique indexes verified
Razorpay (Test Mode)     PASS              210ms       Created test order order_P... for ₹1
Cloudinary               PASS              340ms       Signed upload & delete round-trip verified
Resend Email             PASS              180ms       Probe email sent to admin@...
Upstash Redis            PASS              62ms        Distributed rate limiting store verified
Admin Auth               PASS              2ms         Password hash format verified
-------------------------------------------------------------------------------------------------------
✅ Live check completed without fatal errors.
```

- [ ] **If any row says FAIL:** The table will print the exact one-line fix hint. Fix it and re-run until all 6 show `PASS`.

---

## Stage 4: Seed Database with Clean Catalog (1 min)

- [ ] Seed your live MongoDB Atlas cluster with all 66 products:
```bash
npm run db:seed
```
*Success looks like: `Products seeded: 66 created/updated. Product indexes built.`*

---

## Stage 5: Deploy to Netlify (10 mins)

- [ ] **1. Create private GitHub repo & push:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/vernika-enterprises.git
git push -u origin main
```
- [ ] **2. Connect to Netlify:**
  - Go to [app.netlify.com](https://app.netlify.com) > **Add new site** > **Import an existing project**.
  - Choose GitHub > select `vernika-enterprises`.
  - Build command: `npm run build`
  - Publish directory: `.next`
  - In **Site configuration > Environment variables**, paste the exact variables from `.env.local`.
  - Click **Deploy Site**.
- [ ] **3. Run Production Smoke Check:**
```bash
NEXT_PUBLIC_SITE_URL="https://your-site.netlify.app" npm run smoke:prod
```
*All 14 health and security checks will report green PASS.*

---

## Stage 6: Natasha's Art & Pricing Review (15 mins)

- [ ] **1. Review & edit prices / stock:**
  - Open `scripts/products-review.csv` in Excel or Google Sheets.
  - Check prices (`priceInr`) and stock.
  - Set `claimsConfirmed="yes"` for all reviewed items.
  - Run update:
```bash
npm run import:products
```

- [ ] **2. High-priority photos:**
  - For top-selling paintings (Ref `P01` to `P10`), follow `docs/PHOTO_GUIDE.md` to photograph under daylight.
  - Log into Admin (`/admin`), click **Edit Product**, and drag-and-drop the photo. Signed Cloudinary upload will optimize it automatically.

- [ ] **3. Legal pages sign-off:**
  - Share `docs/LEGAL_REVIEW_BRIEF.md` with your CA / legal advisor.
  - Remove the "Draft - needs legal review" banner once approved.

---

## Stage 7: Place ONE Test Order (3 mins)

- [ ] Open your live site in an incognito window.
- [ ] Add an artwork to bag, proceed to Checkout.
- [ ] Fill address, click **Pay with UPI / Card (Test Mode)**.
- [ ] In the Razorpay modal, select **Netbanking** or **UPI** > click **Success**.
- [ ] **Verify:**
  - Redirected to `/order/[orderId]` receipt.
  - Email receipt arrives in customer inbox.
  - Inventory decrements by 1 in MongoDB Atlas.
  - Order shows as `paid` in Admin dashboard (`/admin`).

---

## Stage 8: Switch to Live Payments (After Razorpay KYC)

- [ ] Once Razorpay finishes KYC verification (usually 24–48 hours):
  - Toggle Razorpay Dashboard from **Test** to **Live**.
  - Generate Live API keys (`rzp_live_...`).
  - Update `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` in Netlify Environment Variables.
  - Trigger deploy. Real payments will now be accepted!
