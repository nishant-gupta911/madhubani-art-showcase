# Vernika Enterprises: Production Launch Checklist

Follow this checklist before announcing the site publicly or driving paid/Instagram traffic.

---

## 1. Legal, Compliance & Truthfulness Guardrails
- [x] **No UNESCO Claims:** Verified that no copy claims UNESCO recognition. GI-tag status of Madhubani art is accurately stated.
- [x] **Truth in Imagery:** Verified that handmade nature and slight natural variation are disclosed on every product page.
- [x] **Mandatory India E-commerce Disclosures:**
  - Grievance Officer details provided (Natasha Gupta, `vernikaenterprises14@gmail.com`, `+91 7870909889`).
  - Seller business address stated (Patna, Bihar, India).
  - Terms of Service, Privacy Policy, Shipping Policy, and Cancellation/Refund Policy accessible in the footer.
- [ ] **CA Review:** Natasha and her CA should verify the applicable GST exemption threshold (artisan turnover < ₹40 Lakhs/yr in India often exempt from compulsory GST registration for intra-state sales, but interstate e-commerce rules require review).

---

## 2. Payment Gateway & Financials
- [x] **Paise Arithmetic:** All calculations performed with integers in paise (₹1,499 = 149900 paise).
- [ ] **Razorpay KYC Activation:** Complete business bank account verification on Razorpay Dashboard.
- [ ] **Switch Keys from Test to Live:** Replace `rzp_test_...` with `rzp_live_...` in production environment variables.
- [ ] **Test Transaction:** Perform a live test order of ₹10 using UPI, confirm order confirmation email, and test refund from dashboard.
- [x] **Cash on Delivery Safety:** COD capped at ₹3,000 max cart value with ₹49 convenience fee.

---

## 3. Performance & Asset Optimizations
- [x] **Image Pipeline:** All 84 product images compressed to WebP with dual resolutions (full view + 640px card) and base64 blur placeholders.
- [x] **Portfolio PDF:** Pre-converted into 84 WebP pages + thumbnails in `/public/portfolio-pages/`. Instant loading without heavy client-side PDF.js parsing.
- [x] **JS Bundle Size:** Production bundle gzipped under 125 KB (well below 150 KB limit).
- [x] **No Multi-MB Raw File Deliveries:** Raw multi-MB PNGs/JPEGs in `madu/` are preserved as source and not served to mobile browsers.

---

## 4. Mobile & Usability Verification
- [x] **Tested at 360 px Viewport:** Touch targets at least 44 px. Thumb-friendly navigation bar and cart drawer.
- [x] **Direct WhatsApp Ordering:** WhatsApp links pre-populated with product name, ref ID, and price for customers preferring direct conversation.
- [x] **Pincode Delivery Estimator:** Operational on every product page with immediate transit time feedback.
- [x] **Wall Art Visualizer:** Allows customers to see painting scale on a wall before purchasing.

---

## 5. Hosting & Infrastructure (Zero Monthly Cost)
- [x] **Host Agnostic:** Can deploy cleanly to Cloudflare Pages, Netlify, or Vercel.
- [x] **Continuous Integration:** `.github/workflows/ci.yml` runs typecheck and production build on every push and pull request.
- [x] **Data Backups:** `scripts/backup.py` scheduled to export catalogs and orders to timestamped archives.
