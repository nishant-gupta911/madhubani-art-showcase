# Rules

These rules apply to everyone and everything touching this project, including AI coding assistants.
If a rule must be broken, write down why in the pull request or commit.

## 1. Golden Rules
1. **Cost stays at Rs. 0.** Before adding any service, check its free tier and its commercial-use terms.
2. **Mobile first.** Design and test at 360 px width before desktop.
3. **Never trust the client.** Prices, stock, totals and payment status are always computed and verified on the server.
4. **Performance is a feature.** No change ships if it drops Lighthouse mobile below 90 on key pages.
5. **Mom must be able to run it.** If a feature needs a developer to operate, it is not finished.
6. **Simple beats clever.** Prefer boring, well-documented tools and small functions.

## 2. Tech Rules
- Language: **TypeScript (strict)**. No `any` without a comment explaining why.
- Framework: Next.js (App Router), React Server Components by default; use `"use client"` only where interactivity is needed.
- Styling: Tailwind CSS with design tokens from `design.md`. No random hex colours in components.
- Validation: **Zod** schemas shared by client and server.
- Database access only inside `/src/lib/db` and `/src/models`; never from components.
- No secrets in code. Use `.env.local` (git-ignored) and Vercel environment variables. Keep `.env.example` current.
- Dependencies: justify each new package; prefer small ones; run `npm audit` before releases.

## 3. Code Style
- Files: `kebab-case.tsx`; components: `PascalCase`; functions and variables: `camelCase`; constants: `UPPER_SNAKE_CASE`.
- One component per file; keep files under about 250 lines.
- Functions do one thing; early returns over deep nesting.
- Comments explain *why*, not *what*.
- Format with Prettier; lint with ESLint; both must pass before commit (use Husky + lint-staged).

## 4. Git Rules
- Branches: `main` (production), `dev` (integration), `feat/<name>`, `fix/<name>`.
- Never push directly to `main`; use pull requests (self-review counts) and Vercel preview deployments.
- Commit format (Conventional Commits): `feat: add cart drawer`, `fix: stock race on checkout`, `docs: update phases`.
- Small, focused commits; no committing `.env`, `node_modules`, or raw high-resolution originals.

## 5. Security Rules
- Hash passwords with bcrypt/argon2; prefer passwordless (email OTP, Google) for customers.
- Admin: server-side authorisation on **every** admin route and API.
- Verify the Razorpay signature and use webhooks as the source of truth for payment status.
- Sanitise and validate all input; escape output; use parameterised queries / schema validation to prevent NoSQL injection.
- Rate-limit: login, OTP, checkout, contact form, search.
- Uploads: allow only images/PDF, check MIME type and size (max 5 MB per image), strip EXIF GPS data.
- Collect the minimum personal data; never log full phone numbers, addresses or payment data.
- Rotate keys if exposed; enable 2FA on GitHub, Vercel, MongoDB Atlas, Razorpay, Cloudinary.

## 6. Performance Rules
- Use `next/image` (or Cloudinary transforms) for every image; always set width/height and meaningful `alt`.
- Raw photos in the root folder are **source files only**. Export web versions (max 2000 px long edge, WebP/AVIF, under 300 KB each) before use.
- Statically generate public pages (ISR with revalidation, or on-demand revalidation when admin edits).
- No client-side fetching for content that can be rendered on the server.
- Lazy-load below-the-fold sections, the PDF gallery and third-party scripts.
- Fonts: at most 2 families, self-hosted via `next/font`, with `font-display: swap`.
- Animations use `transform`/`opacity` only and respect `prefers-reduced-motion`.

## 7. Database Rules
- Every query field has an index; review slow queries monthly.
- Reuse a single cached MongoClient per serverless instance.
- Store money as **integers in paise** (Rs. 1,299 = 129900), never floats.
- Use transactions or atomic updates (`findOneAndUpdate` with a stock condition) to prevent overselling.
- Soft-delete products and orders (`deletedAt`), never hard-delete orders.
- Weekly backup export; keep the database under 400 MB (free tier is 512 MB), so images never live in MongoDB.

## 8. Business Rules (confirm with Mom, then edit here)
| Topic | Default rule |
|-------|--------------|
| Pricing | Prices in INR, inclusive of GST (if applicable) |
| Original paintings | Quantity 1; marked **Sold** after purchase |
| Prints / products | Stock tracked; "Out of stock" disables Add to Cart |
| Made-to-order | Shows an estimated production time (for example 7 to 14 days) |
| Shipping | Flat Rs. X; free above Rs. Y; ships across India |
| Cash on Delivery | Allowed up to Rs. X; phone verification required |
| Returns | Damaged/wrong item: report within 48 hours with photos. Custom orders are non-returnable |
| Cancellation | Free before "Packed"; not possible after "Shipped" |
| Handmade disclaimer | Slight variation in colour/size is natural and stated on product pages |
| Order IDs | Format `MA-YYMMDD-####` |

## 9. Content Rules
- Tone: warm, respectful, story-driven; credit the Madhubani / Mithila tradition accurately.
- Every product has: at least 3 photos (front, close-up detail, in-room or scale shot), size, medium, and a short story.
- Photos: natural light, plain background, true colours; no heavy filters (it is a trust issue).
- Alt text describes the artwork (for example "Hand-painted Madhubani fish motif in red and black on handmade paper").

## 10. Definition of Done
A task is done when:
- [ ] Works on mobile and desktop and in Chrome, Safari, Firefox
- [ ] Accessible: keyboard, contrast, alt text
- [ ] Validated on server; errors handled with friendly messages
- [ ] Lint, type-check and tests pass
- [ ] Lighthouse mobile 90+ on affected pages
- [ ] Docs updated if behaviour or architecture changed

## 11. Rules for AI Coding Assistants
- Read `/srs/*.md` before writing code; follow `architecture.md` and `design.md` exactly.
- Work phase by phase from `phases.md`; do not build future-phase features early.
- Never invent packages, APIs or env variables; ask when unsure.
- Output complete files with paths; do not leave placeholders such as "...rest of code".
- Never hardcode secrets, prices or product data in components.
- After each task, list what changed and how to test it.
