# Hosting & Deployment Guide

> **Important Policy Note on Vercel Hobby:**
> Vercel's free Hobby plan is specified for personal, non-commercial use. E-commerce sites that process live financial transactions may be flagged for commercial activity.
> This website is engineered to be **100% host-agnostic**: it can run without any code modification on **Cloudflare Pages**, **Netlify**, or **Vercel**.

## 1. Zero-Cost Hosting Options

| Platform | Free Tier Suitability | Commercial Terms | Custom Domain | Build Command |
|---|---|---|---|---|
| **Cloudflare Pages** | Excellent (Unlimited bandwidth, edge compute) | Permitted on free tier | Free SSL included | `npm run build` |
| **Netlify** | Great (100 GB bandwidth, serverless functions) | Permitted on free tier | Free SSL included | `npm run build` |
| **Vercel** | Fast developer setup (preview URLs) | Hobby terms specify non-commercial use | Free SSL included | `npm run build` |

---

## 2. Deploying to Cloudflare Pages (Recommended for ₹0/mo Commercial Use)

1. Sign up for a free account at [cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your GitHub repository `vernika-enterprises`.
4. Configure Build settings:
   - **Framework preset:** `Next.js` or `Vite` (depending on build mode)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist` (or `.next` / `out`)
5. Add your Environment Variables in the Cloudflare dashboard (copy from `.env.example`).
6. Click **Save and Deploy**. Cloudflare automatically provisions global Edge CDN and free SSL.

---

## 3. Deploying to Netlify (Alternative ₹0/mo Host)

1. Sign up at [netlify.com](https://app.netlify.com).
2. Click **Add new site** > **Import an existing project** from GitHub.
3. Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add environment variables under **Site configuration** > **Environment variables**.
5. Click **Deploy Site**.

---

## 4. Custom Domain Setup (vernikaenterprises.com or .in)

1. Purchase a domain from Namecheap or Porkbun (~₹600–₹800/yr).
2. In your host's DNS settings (Cloudflare/Netlify):
   - Add CNAME record: `@` or `www` pointing to the provided host target.
3. SSL certificate will automatically generate within 10–15 minutes.
