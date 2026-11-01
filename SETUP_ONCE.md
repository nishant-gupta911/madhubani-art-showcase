# SETUP ONCE (about 20 minutes, then never again)

Do these in order. After step 6 you paste ONE prompt (`MASTER_PROMPT_3_ONE_SHOT.md`) and walk away.

## 1. Keep the Mac awake (macOS, your paths show /Users/nishant)
Open a **separate Terminal window** (not Antigravity's terminal) and run:

```bash
caffeinate -dimsu
```
- Leave that window open. Press Ctrl+C when you are done. It stops the Mac from sleeping while it runs.
- Keep the **charger plugged in** and the **lid open** (closing the lid on a MacBook still sleeps it, unless it is on power with an external display).
- Turn off Low Power Mode, and use a stable Wi-Fi connection. You can lower the screen brightness yourself.
- Quit apps you do not need (browser tabs, video calls) so Antigravity, Node and Chrome have memory.

## 2. Update and pick models
- Update Antigravity to the latest version.
- Orchestrator / payments / security work: use the strongest model you have quota for.
- Mechanical work (formatting, docs, simple tests): the prompt tells sub-agents to use the fast/cheap model (Flash-class) if your plan has one.

## 3. Let the agent run without stopping to ask you
An unattended run stalls every time the agent waits for an approval click. In Antigravity settings, allow terminal commands to run automatically **but keep a deny list**:
- Allow: `npm`, `npx`, `node`, `git add/commit/status/diff/log`, `ls`, `cat`, `grep`, `playwright`, `lighthouse`, `k6`/`autocannon`.
- Deny: `rm -rf`, `sudo`, `git push`, `curl ... | sh`, anything that deploys, and any path outside this project folder.
(Setting names differ by version; if unsure, keep approvals on for anything not in the allow list.)

## 4. Install the helpers (review each before installing; only these)
Third-party skills are instructions your agent will obey, and some include scripts. Open each repo, read `SKILL.md` and any `scripts/`, and install only what you are comfortable with.

1. **Ponytail** (writes less, simpler code; saves tokens). Repo: `github.com/DietrichGebert/ponytail`.
   - Antigravity **IDE** loads only its always-on rules (no commands): copy the Antigravity rules file from the repo (see its README) into `.agents/rules/`. Rules are capped at 12,000 characters, so keep it small.
   - Antigravity **CLI** (`agy`): `agy plugin install https://github.com/DietrichGebert/ponytail`
   - Important: make it apply only to UI/boilerplate. The master prompt switches it off for payments, auth, stock and database code, where "shortcuts" are dangerous.
2. **Karpathy guidelines skill** (simple, surgical changes): copy `.agents/skills/karpathy-guidelines/` from `github.com/multica-ai/andrej-karpathy-skills` into this project's `.agents/skills/`.
3. **Three focused skills** from `toilahuongg/google-antigravity-kit` (run in the project folder):
   ```bash
   npx skills add https://github.com/toilahuongg/google-antigravity-kit --skill mongoose
   npx skills add https://github.com/toilahuongg/google-antigravity-kit --skill typescript
   npx skills add https://github.com/toilahuongg/google-antigravity-kit --skill vercel-react-best-practices
   ```
Do **not** install big bundles (50+ skills). Every skill's name and description is loaded at the start of each session, which costs tokens.

## 5. Add three MCP servers (browser testing + fresh docs)
In Antigravity: agent panel "..." menu -> **Manage MCP Servers** -> **View raw config**, or edit `.agents/mcp_config.json` in this project (global: `~/.gemini/config/mcp_config.json`). Paste:

```json
{
  "mcpServers": {
    "chrome-devtools": { "command": "npx", "args": ["-y", "chrome-devtools-mcp@latest"] },
    "playwright":      { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] },
    "context7":        { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] }
  }
}
```
Chrome DevTools MCP needs Node 22+ and current Chrome. Restart Antigravity. Use these official package names only; some blogs list wrong names. Keep to these three: every extra tool costs tokens.

## 6. Fill `.env.local` properly (the last audit could not verify these)
- `MONGODB_URI` = your **MongoDB Atlas** URI (not 127.0.0.1).
- Razorpay **test mode** keys: the last run said authentication failed. In the Razorpay dashboard switch to Test Mode, generate a fresh Key ID and Secret, paste with no spaces or quotes.
- `CLOUDINARY_*`, `RESEND_API_KEY`, `UPSTASH_REDIS_REST_*`, `CRON_SECRET`, `SESSION_SECRET`.
- `NEXT_PUBLIC_SELLER_CITY` and `NEXT_PUBLIC_SELLER_STATE` = the real values.
- Do not buy or assume a domain yet; leave `NEXT_PUBLIC_SITE_URL` as `http://localhost:3000` until you have one.

## 7. Start
1. Make sure everything is committed (`git status` clean).
2. Open **Agent Manager**, start one new conversation named `Orchestrator`.
3. Paste the full contents of `srs/MASTER_PROMPT_3_ONE_SHOT.md`. Send.
4. Go clean for Diwali. When you return, read the top of `AUDIT_REPORT.md` and `OWNER_ACTIONS.md`.

If you see a bell/notification asking for approval, click Run only for commands that are inside this project.
