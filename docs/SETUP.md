# Setup & Account Provisioning Guide

This step-by-step guide explains how to set up all zero-cost accounts and services required to run **Vernika Enterprises**.

---

## 1. Accounts Checklist (All ₹0 / month)

| # | Service | Purpose | Free Tier Limit | Sign-up Link |
|---|---|---|---|---|
| 1 | **GitHub** | Code repository & version control | Unlimited public/private | [github.com](https://github.com) |
| 2 | **Cloudflare / Vercel** | Web hosting & Edge CDN | Unlimited bandwidth (Cloudflare) | [cloudflare.com](https://cloudflare.com) |
| 3 | **MongoDB Atlas** | Database for orders, catalog, users | 512 MB storage (M0 free cluster) | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| 4 | **Razorpay** | Payment Gateway (UPI, Cards, COD) | ₹0 setup fee, per-transaction fee (~2%) | [razorpay.com](https://razorpay.com) |
| 5 | **Cloudinary** | Image transformation & CDN | 25 monthly transformation credits | [cloudinary.com](https://cloudinary.com) |
| 6 | **Resend** | Transactional Order Emails | 3,000 emails / month | [resend.com](https://resend.com) |
| 7 | **Upstash Redis** | Serverless API Rate Limiting | 10,000 commands / day | [upstash.com](https://upstash.com) |

---

## 2. Step-by-Step Configuration

### Step 2.1: MongoDB Atlas (Database)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Click **Create Deployment** > select **M0 (Free)** > choose AWS region `ap-south-1 (Mumbai)` for lowest latency in India.
3. Under **Security Quickstart**:
   - Create a Database User (e.g., `vernika_admin`) and generate a secure password.
   - Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere, required for serverless hosting).
4. Click **Connect** > **Drivers** > copy connection string:
   ```
   MONGODB_URI="mongodb+srv://vernika_admin:<password>@cluster0.xxxxx.mongodb.net/vernika_store?retryWrites=true&w=majority"
   ```

### Step 2.2: Razorpay (India Payments)
1. Register at [razorpay.com](https://dashboard.razorpay.com/signup).
2. Start the KYC onboarding process (requires PAN card, business bank account details, and Aadhaar).
3. While KYC is under review, toggle to **Test Mode**:
   - Navigate to **Settings** > **API Keys** > click **Generate Test Key**.
   - Copy `Key Id` (starts with `rzp_test_...`) and `Key Secret`.
   - Add these to `.env.local` or host environment variables.
4. Set up Webhooks:
   - Go to **Settings** > **Webhooks** > **Add New Webhook**.
   - URL: `https://your-domain.com/api/webhooks/razorpay`
   - Secret: enter a random 16+ character string (set as `RAZORPAY_WEBHOOK_SECRET`).
   - Active Events: select `payment.captured`, `order.paid`, `payment.failed`.

### Step 2.3: Cloudinary (Product Media)
1. Sign up for a free tier at [cloudinary.com](https://cloudinary.com).
2. From the Dashboard, copy:
   - `Cloud Name`
   - `API Key`
   - `API Secret`
3. Add to your `.env` configuration.

### Step 2.4: Resend (Order Confirmation Emails)
1. Sign up at [resend.com](https://resend.com).
2. Go to **API Keys** > **Create API Key** (name: `vernika-production`).
3. Add your custom domain (e.g. `vernikaenterprises.com`) and add the 3 DKIM DNS records to your domain registrar so emails arrive directly in customers' inboxes.

---

## 3. Local Development Setup

1. Clone repository:
   ```bash
   git clone https://github.com/your-username/vernika-enterprises.git
   cd vernika-enterprises
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env.local
   ```
4. Run image pipeline to build WebP catalog assets:
   ```bash
   python3 scripts/image_pipeline.py
   python3 scripts/pdf_to_images.py
   ```
5. Start local server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your mobile device or browser.
