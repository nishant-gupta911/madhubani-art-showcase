# Assumptions Log

1. **Brand & Artist Identity:** Brand name is "Vernika Enterprises", created and handpainted by Natasha Gupta in Patna, Bihar (configurable via `NEXT_PUBLIC_SELLER_CITY`).
2. **Contact Details:** Phone / WhatsApp: `+91 7870909889`, Email: `vernikaenterprises14@gmail.com`. Location: Patna, Bihar, India (configurable via `NEXT_PUBLIC_SELLER_CITY` in `site.ts`).
3. **Legal Status of Madhubani Art:** Madhubani (Mithila) art is a GI-tagged (Geographical Indication) traditional handicraft of Bihar. Any claims in images referencing "UNESCO" are inaccurate catalog typos and will not be repeated in copy.
4. **Primary Market & Currency:** India-first market, all prices displayed in INR (₹) inclusive of GST, calculated and stored in integer **paise**.
5. **Product Types & Fulfillment:** 
   - Original paintings are one-of-a-kind (initial stock = 1). Once purchased, they transition to `sold` and remain viewable in the gallery/portfolio.
   - Dupattas, angvastras, bags, and files default to `made_to_order` with 5 to 10 days production lead time unless explicit stock is maintained.
6. **Paint Medium & Techniques:** Products are labeled as "handpainted" using fabric and acrylic colors on handmade paper, cotton, silk, and canvas. Per truthfulness guardrails, no unconfirmed "100% natural dyes" marketing claims are made.
7. **Framing:** Paintings are framed in sleek black frames with acid-free cream mat boards unless custom unframed rolled option is requested.
8. **Shipping Model:** Flat ₹79 prepaid shipping for orders below ₹1,499. **Free shipping** across India on orders ₹1,499 and above. All original paintings ship free. COD fee is ₹49 (allowed for orders up to ₹3,000).
9. **Zero Monthly Infra Cost:** System is architected to run seamlessly on free tiers (Vercel, MongoDB Atlas M0, Cloudinary, Razorpay test/live, Resend, Upstash Redis).
10. **Single Admin:** Natasha Gupta manages products and orders via mobile-optimized responsive admin dashboard.
