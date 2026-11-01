# Honest Hosting & Deployment Guide
**Platform:** Vernika Enterprises by Natasha Gupta  
**Stack:** Next.js 16 (App Router) + Mongoose / MongoDB Atlas (TCP Socket)  
**Cost Objective:** ₹0 / month fixed cost  

---

## 1. Vercel Hobby Terms & Policy Truth

According to Vercel's official documentation ([vercel.com/docs/pricing/plans/hobby](https://vercel.com/docs/pricing/plans/hobby)):
> "The Hobby plan is meant for personal, non-commercial use. Commercial projects, such as e-commerce stores, paid subscription platforms, or client sites, require the Pro tier ($20/month per seat)."

While Vercel Hobby is excellent for staging, testing, and private previews, running an active commercial e-commerce storefront on Vercel Hobby risks policy enforcement and service disruption.

---

## 2. Free Commercial-Permitted Hosting Options for Next.js 16 + Mongoose

Because this application uses **Next.js 16 App Router** with **Mongoose** (which requires persistent TCP sockets to communicate with MongoDB Atlas), the hosting environment must run in a standard Node.js runtime (not a pure V8 isolate like Cloudflare Workers without Hyperdrive).

| Host | Commercial Use on Free Tier? | Runtime Compatibility (Next.js 16 + Mongoose TCP) | Free Quota | Recommendation |
| :--- | :---: | :---: | :---: | :--- |
| **Netlify** | **YES** (Permitted) | **Native Node.js Serverless** (`@netlify/plugin-nextjs`) | 100 GB bandwidth, 300 build mins/mo | **PRIMARY RECOMMENDATION (₹0/mo)** |
| **Render** | **YES** (Permitted) | **Native Node Container** (`next start`) | 750 hours/mo (sleeps after 15m idle) | **FALLBACK RECOMMENDATION (₹0/mo)** |
| **Vercel** | **NO** (Hobby = non-commercial) | Full native support | 100 GB bandwidth | Staging/Dev Only |
| **Cloudflare Pages** | **YES** (Permitted) | Edge Workers (TCP requires Hyperdrive / Data API) | Unlimited bandwidth | Requires DB adapter refactor |

---

## 3. Primary Recommendation: Netlify Free Tier (`NOT RUN`)

Netlify permits commercial e-commerce on its free tier and fully supports Next.js App Router using standard AWS Lambda Node.js runtimes that support Mongoose connection pooling.

### Exact Deploy Steps:
1. Push `main` branch to private GitHub repository.
2. Sign up at [netlify.com](https://app.netlify.com).
3. Click **Add new site > Import an existing project from GitHub**.
4. Select repository `vernika-enterprises`.
5. Configuration settings:
   - **Base directory:** (leave blank)
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Functions directory:** (managed automatically by `@netlify/plugin-nextjs`)
6. Under **Environment variables**, copy every variable from `.env.example`:
   - `MONGODB_URI` (Atlas Mumbai connection string)
   - `NEXTAUTH_URL` (`https://vernikaenterprises.com` or temporary Netlify subdomain)
   - `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`
   - `NEXT_PUBLIC_SELLER_CITY="Patna"`, `NEXT_PUBLIC_SELLER_STATE="Bihar"`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFY_EMAIL`
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - `CRON_SECRET`
7. Click **Deploy Site**.
8. In Netlify Site Settings > **Domain Management**, add custom domain `vernikaenterprises.com` and point DNS CNAME to the Netlify target.

---

## 4. Fallback Recommendation: Render Free Web Service (`NOT RUN`)

Render provides a standard Docker / Node.js container service on its free tier with full TCP networking.

### Exact Deploy Steps:
1. Sign up at [render.com](https://render.com).
2. Click **New + > Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Instance Type:** Free (512 MB RAM, 0.1 CPU)
5. Add environment variables.
6. Click **Create Web Service**.

*Note on Render Free Tier:* Web services spin down after 15 minutes of inactivity and take ~30-50 seconds to wake on the next visit. Netlify does not spin down in this manner and is therefore the preferred primary choice.

---

## 5. Verification Status

In accordance with Section 4.4 of `MASTER_PROMPT_3_ONE_SHOT.md`:
* Hosting analysis and terms citation: `REAL`
* Actual cloud deployment to Netlify or Render: `NOT RUN` (The AI coding assistant is strictly forbidden from triggering live production cloud deployments without owner presence).
