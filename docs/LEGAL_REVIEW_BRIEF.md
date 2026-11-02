# Legal & Tax Review Brief for Vernika Enterprises
**Document Purpose:** Briefing dossier for Chartered Accountant (CA) and Legal Advisor  
**Entity:** Vernika Enterprises (Proprietor: Natasha Gupta)  
**Business Model:** Direct-to-Consumer (D2C) E-commerce Store selling handpainted Madhubani art, handmade textiles, and painted accessories.  
**Platform URL:** `https://vernika.art`  
**Status:** Pre-launch review draft  

---

## 1. Business & Operational Overview

1. **Product Categories:**
   - Original Framed Paintings (Unique 1-of-1 items)
   - Made-to-Order Handpainted Dupattas, Sarees, and Bags
2. **Fulfillment:** Packed and shipped from Faridabad, Haryana via courier services (Shiprocket, India Post, Blue Dart) across India.
3. **Payment Modes:** Online prepaid via Razorpay (UPI, Credit/Debit Cards, Netbanking) and optional Cash on Delivery (COD).

---

## 2. Tax & GST Considerations (For CA Review)

### A. GST Registration Threshold & E-Commerce Exemption:
- **Notification No. 34/2023-Central Tax (effective Oct 1, 2023):** Small unregistered suppliers selling through e-commerce operators (ECOs) are exempt from mandatory Section 24(ix) GST registration if aggregate turnover is within state threshold (₹20 Lakhs / ₹40 Lakhs for goods) and they make intra-state supplies or enroll via the GST Portal with an Enrolment Number.
- **Direct Website Model:** Because this store operates directly via its own website (`vernika.art`) rather than through a marketplace ECO (like Amazon or Flipkart), Section 52 (TCS) does not apply.
- **Action Required from CA:** Confirm whether Natasha should operate initially as an unregistered proprietor issuing a **"Bill of Supply"** or voluntarily register under regular GST (HSN 9701 for original paintings at 12% GST, HSN 5007/5208 for silk/cotton textiles at 5% GST).

### B. Invoicing Implementation:
- The codebase automatically switches invoice templates based on whether `GSTIN` is configured in `settings.json`:
  - If GSTIN is present: Outputs **Tax Invoice** with HSN codes, SGST/CGST breakdown, and seller GSTIN.
  - If GSTIN is absent: Outputs **Bill of Supply / Order Receipt** compliant with Rule 49 of CGST Rules.

---

## 3. Consumer Protection (E-Commerce) Rules, 2020 Compliance

The platform currently includes pre-configured draft legal pages at `/terms`, `/privacy`, `/shipping`, `/returns`, `/cancellation`, `/contact`, and `/grievance`.

### A. Returns & Refunds Policy:
- Handcrafted original paintings and made-to-order customized items are exempt from arbitrary "buyer's remorse" returns once delivered intact.
- **Damaged in Transit:** Full replacement or 100% refund offered if transit damage is reported within 48 hours with unboxing video/photos.
- **Refund Timeline:** 5–7 business days to original payment method via Razorpay refund API.
- **Action Required from Lawyer:** Confirm language conforms to Rule 5(3) of Consumer Protection (E-Commerce) Rules regarding clear refund terms.

### B. Cancellation Policy:
- Orders can be cancelled within 12 hours of placement before dispatch / before custom handpainting begins.

### C. Grievance Officer:
- Mandatory designation of Grievance Redressal Officer published at `/grievance`:
  - Officer: Natasha Gupta
  - Acknowledgement within 48 hours; resolution within 30 days.

---

## 4. Digital Personal Data Protection (DPDP) Act, 2023 Compliance

1. **Minimal Data Collection:** Store collects only:
   - Customer Full Name, Mobile Phone Number, Delivery Address, and Email.
   - Data is used strictly for shipping coordination, courier SMS/WhatsApp updates, and tax receipts.
2. **Payment Card Data (PCI-DSS):**
   - The platform never stores, processes, or transmits credit/debit card numbers or bank credentials.
   - All payment handling is delegated to Razorpay via encrypted iframe tokens.
3. **Customer Consent:** Checkbox consent provided at checkout referencing the Privacy Policy (`/privacy`).
4. **Data Deletion:** Customers may request erasure of their contact details post-delivery by writing to `admin@vernika.art`.

---

## 5. Review Checklist for Advisor Sign-off

- [ ] Confirm HSN codes (9701 for paintings, 5007 for dupattas).
- [ ] Confirm GST threshold applicability for direct web store.
- [ ] Approve transit damage 48-hour reporting clause in Return Policy.
- [ ] Approve DPDP consent terms in Privacy Policy.
- [ ] Authorize removal of the "Draft - needs legal review" banner on `/terms`, `/privacy`, and `/returns`.
