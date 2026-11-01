# Plain-Language Owner & Natasha Action Plan
**Platform:** Vernika Enterprises by Natasha Gupta — Handpainted Madhubani Art  
**Release Tag:** `v1.0.0-rc2`  
**Operating Cost Target:** ₹0 / month fixed cost  

---

## 1. Ordered Checklist Before Public Launch

Follow these steps in exact order to take the store live:

### Step 1: Provision Free MongoDB Atlas Database (₹0/mo)
1. Sign up at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create an **M0 Shared Free Tier Cluster** in region `ap-south-1` (Mumbai).
3. Under **Database Access**, create a user `vernika_admin` with a strong password.
4. Under **Network Access**, add `0.0.0.0/0` (Allow from anywhere) so serverless hosting can connect.
5. Copy the connection string into `.env.local` and your hosting environment variables:
   ```env
   MONGODB_URI="mongodb+srv://vernika_admin:<PASSWORD>@cluster0.xxxxx.mongodb.net/vernika_store?retryWrites=true&w=majority"
   ```
6. Run `npm run seed` once from your terminal to populate the 66 catalog artworks and create indexes in Atlas.

---

### Step 2: Fix Razorpay Test Keys & Complete Merchant KYC
1. Log in to [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Toggle the switch to **Test Mode**.
3. Under **Settings > API Keys**, click **Generate Key**.
4. Copy the Key ID and Key Secret into `.env.local`:
   ```env
   RAZORPAY_KEY_ID="rzp_test_..."
   RAZORPAY_KEY_SECRET="..."
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
   ```
5. Run `npm run env:check` in your terminal to verify that the key passes authentication.
6. Under **Settings > Webhooks**, add endpoint `https://<YOUR_DOMAIN>/api/webhooks/razorpay` with events `payment.captured`, `payment.failed`, and `order.paid`.
7. Once test orders are verified, submit your business KYC documents on Razorpay to activate **Live Mode**.

---

### Step 3: Cloudinary Free Account for Natasha's Photos (₹0/mo)
1. Sign up at [cloudinary.com](https://cloudinary.com) (25 GB free storage/bandwidth).
2. Copy your Cloud Name, API Key, and API Secret into `.env.local` and your hosting provider:
   ```env
   CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   ```
3. This allows Natasha to photograph paintings on her phone and upload them instantly from `/admin`.

---

### Step 4: Resend Account for Customer Order Confirmation Emails (₹0/mo)
1. Sign up at [resend.com](https://resend.com) (3,000 free emails/month).
2. Generate an API Key and set:
   ```env
   RESEND_API_KEY="re_..."
   EMAIL_FROM="Vernika Enterprises <orders@vernikaenterprises.com>"
   ADMIN_NOTIFY_EMAIL="vernikaenterprises14@gmail.com"
   ```
3. Add the DNS TXT and MX records in your domain registrar to verify `vernikaenterprises.com`.

---

### Step 5: Upstash Redis for Rate Limiting (₹0/mo)
1. Sign up at [upstash.com](https://upstash.com) (10,000 commands/day free).
2. Create a database in Mumbai (`ap-south-1`).
3. Copy the REST parameters:
   ```env
   UPSTASH_REDIS_REST_URL="https://...upstash.io"
   UPSTASH_REDIS_REST_TOKEN="..."
   ```

---

### Step 6: Generate Natasha's Admin Password
1. In your terminal, run:
   ```bash
   npm run admin:create
   ```
2. Enter Natasha's secure master password.
3. Copy the printed hash into your environment variables:
   ```env
   ADMIN_EMAIL="vernikaenterprises14@gmail.com"
   ADMIN_PASSWORD_HASH="$2a$12$..."
   SESSION_SECRET="<generate a 32+ character random string>"
   ```

---

### Step 7: Pricing & Legal Policy Review with CA
1. Review the prices in `/shop` with Natasha to confirm frameless vs. framed pricing bands.
2. Have your Chartered Accountant or legal counsel review the draft policy pages:
   - `/terms` (Terms of Service)
   - `/privacy` (Privacy Policy)
   - `/shipping` (Shipping & Delivery times)
   - `/returns` (Damaged-item return window)
   - `/cancellation` (Pre-dispatch cancellation terms)
3. Once GST registration is finalized, update the GSTIN in Admin Settings (`/admin > Settings`).

---

### Step 8: Replace Staged Photos with Authentic Studio Pictures
1. Photograph Natasha at work in her Mithila painting studio in Patna.
2. Replace `/public/artist-natasha.webp` with the authentic portrait.
3. Use the Mobile Quick-Add tool in `/admin` to add new custom paintings as Natasha creates them.

---

### Step 9: Deploy to Netlify (Commercial Free Tier)
*(Detailed instructions in [`docs/HOSTING.md`](file:///Users/nishant/Documents/mom%20madubani/madhubani-art-showcase%20/docs/HOSTING.md))*
1. Connect your GitHub repository to Netlify.
2. Build command: `npm run build`, Publish directory: `.next`.
3. Add all environment variables listed above.
4. Point DNS for `vernikaenterprises.com` to Netlify.

---

### Step 10: Place First Real ₹10 Test Order & Soft Launch
1. In `/admin`, create a private test artwork priced at ₹10.
2. Go to the storefront on your mobile phone, add it to your bag, and complete a real UPI payment via Razorpay.
3. Confirm that:
   - The money arrives in your Razorpay dashboard.
   - The order confirmation email is delivered to your inbox.
   - The order appears in `/admin` with status **Confirmed**.
   - The stock for that item decreases by 1.
4. Issue a refund for the ₹10 transaction from the Razorpay dashboard to verify the refund pipeline.
5. Delete or unpublish the test artwork, share the link with close family/friends for feedback (soft launch), and then begin public sales!
