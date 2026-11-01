# Operational Runbook & Maintenance Guide
**Platform:** Vernika Enterprises Handpainted Madhubani E-Commerce  
**System Architecture:** Next.js 16 (App Router) + MongoDB Atlas + Razorpay + Cloudinary + Resend + Upstash  
**Maintainer:** Lead Technical Engineer & Natasha Gupta Studio  

---

## 1. System Health Checks & Verification

To verify full system health, run the master verification command from the project root:
```bash
npm run verify
```
This executes:
1. Environment & Connectivity Checks (`npm run env:check`)
2. Content & Catalog Truthfulness Lint (`npm run content:lint`)
3. Strict TypeScript Compilation (`npx tsc --noEmit`)
4. Vitest Unit & Integration Suites (`npm test`)
5. Playwright E2E Browser Testing Matrix (`npx playwright test`)
6. Autocannon Concurrency & Load Benchmark (`npm run load:test`)
7. Dependency Security Vulnerability Audit (`npm audit --omit=dev`)

Results and logs are automatically archived into `docs/audit/evidence/verify-summary.txt`.

---

## 2. Inventory Management & Double-Sold Painting Mitigation

### The Constraint
Original Madhubani paintings have `stock = 1`. A unique piece cannot be sold twice under any circumstances.

### Atomic Reservation Protocol
1. **At Checkout Initiation (`/api/checkout`):**
   - MongoDB executes an atomic update query:
     ```javascript
     Product.findOneAndUpdate(
       { _id: item.productId, stock: { $gte: item.qty } },
       { $inc: { stock: -item.qty } },
       { new: true, session }
     )
     ```
   - If stock is 0, the query returns `null`, the reservation fails immediately, and the buyer receives HTTP 409 Conflict with `Stock reservation failed`.
   - The pending order document is created with `expiresAt = Date.now() + 15 * 60 * 1000` (15 minutes).

2. **Order Expiration & Stock Release:**
   - **Lazy Release:** Whenever `/api/availability` or `/api/shop` is queried, expired pending orders automatically release reserved stock back into available inventory (`stockReleased: true`).
   - **Background Cron:** The route `/api/cron/release-abandoned-orders` runs every 15 minutes to release reservations for orders where payment was never completed.

3. **Payment Failure Webhook:**
   - If Razorpay sends `payment.failed`, the webhook handler (`/api/webhooks/razorpay`) immediately increments stock back by the order quantities and marks the order `payment.status = 'failed'`.

### What to do if a double-order occurs (Manual Disaster Recovery)
If an edge-case offline transaction or simultaneous manual override leads to an overcommitted original painting:
1. Open `/admin` > Orders.
2. Filter by status `Confirmed` or `Payment Received`.
3. Locate the duplicate order.
4. Click **Contact Customer** or initiate a full refund via Razorpay Dashboard.
5. Alternatively, offer the customer a custom commissioned remake by Natasha Gupta with a 10-15 day delivery timeline.

---

## 3. Order ID Format & Tracking

Orders use human-readable sequential IDs formatted as:
```
VE-YYMMDD-####
Example: VE-261101-0042
```
Customers can track orders at `https://<DOMAIN>/track` using either:
- The full Order ID (`VE-261101-0042`)
- The customer's 10-digit mobile number or email address

---

## 4. Cash on Delivery (COD) OTP Verification & Confirmation

To eliminate bogus COD orders and prevent courier return-to-origin (RTO) charges:
1. When a customer selects COD, `/api/otp/send` dispatches a 6-digit OTP via email (and SMS when integrated).
2. The user has 5 attempts to enter the OTP before the number is locked for 15 minutes.
3. In `/admin` > Orders, COD orders are flagged with a yellow **COD Pending Confirmation** badge.
4. Natasha or the fulfillment team calls the customer on WhatsApp/phone to confirm address details, then clicks **Confirm COD Order** in Admin to proceed to packing.

---

## 5. Security & Credential Rotation Procedures

### Admin Password Reset
If the admin password needs to be changed:
1. Run:
   ```bash
   npm run admin:create
   ```
2. Enter the new password and copy the resulting hash.
3. Update `ADMIN_PASSWORD_HASH` in `.env.local` and in Vercel Environment Variables.
4. Redeploy or restart the process.

### Session Secret Rotation
To immediately invalidate all existing admin sessions:
1. Generate a new 32-character random string:
   ```bash
   openssl rand -base64 32
   ```
2. Update `SESSION_SECRET` in environment variables. All active admin sessions will be rejected on their next request.

### Razorpay Webhook Secret Rotation
1. In Razorpay Dashboard, generate a new Webhook Secret.
2. Update `RAZORPAY_WEBHOOK_SECRET` in Vercel.
3. Trigger a test event from the Razorpay dashboard to verify HTTP 200 response.

---

## 6. Database Backup & Disaster Recovery

### Manual Atlas Dump
```bash
mongodump --uri="<MONGODB_ATLAS_URI>" --out="./backup/$(date +%Y%m%d_%H%M%S)"
```

### Restore from Dump
```bash
mongorestore --uri="<MONGODB_ATLAS_URI>" --drop "./backup/<TIMESTAMP>"
```

---

## 7. Troubleshooting Matrix

| Symptom | Probable Cause | Corrective Action |
| :--- | :--- | :--- |
| **Checkout returns HTTP 429** | Sliding-window rate limit hit (>10 checkout attempts/min per IP) | Wait 60 seconds; verify Upstash Redis connectivity in `.env.local` |
| **Razorpay script does not load** | CSP header blocking or network connectivity | Verify `https://checkout.razorpay.com` is in `script-src` in `next.config.mjs` |
| **Order not marked paid** | Webhook secret mismatch or delayed webhook delivery | Check `/api/webhooks/razorpay` server logs. Admin can click "Verify Razorpay Payment" in `/admin` |
| **Quick-Add image fails** | Cloudinary credentials unset or payload > 10MB | Verify `CLOUDINARY_*` env variables; ensure image is JPEG/WebP < 10MB |
| **Build fails with "FATAL: NEXT_PUBLIC_SELLER_CITY"** | Production build attempted without setting seller city | Set `NEXT_PUBLIC_SELLER_CITY="Patna"` in build environment |
