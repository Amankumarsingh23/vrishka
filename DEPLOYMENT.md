# Deploying Vriksha to Vercel

Git is already initialized locally with a first commit. Everything below picks up from there.

## 1. Push to GitHub

1. Create a new **empty** repo on [github.com/new](https://github.com/new) — don't initialize it with a README/gitignore, since this project already has both.
2. Point your local repo at it and push:
   ```bash
   git remote add origin https://github.com/<your-username>/vriksha.git
   git branch -M main
   git push -u origin main
   ```

## 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo you just pushed.
2. Vercel auto-detects Next.js — leave the build settings as-is (`next build`, output handled automatically).
3. **Before clicking Deploy**, add environment variables (see below) — this matters because the build itself needs them, not just the running app.

## 3. Environment variables

Add these in **Project Settings → Environment Variables** (or in the "Environment Variables" section of the import screen), for **all three** environments — Production, Preview, and Development:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://seuvjvvgwffmnilzydxc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_0jFvWN_l9ZjLXFeAx7CBfA_9IAq3n7s` |

Copy these straight from your local `.env.local`.

**Why all three environments, and why before the first deploy:** these are `NEXT_PUBLIC_` variables, which Next.js inlines into the bundle at *build* time, not read at runtime. I verified this directly — removing them locally and running `npm run build` fails immediately during "Collecting page data" with our own error message ("Missing Supabase env vars…"), not a vague crash. If you deploy before adding them, the build fails the same way on Vercel. Preview deployments (the URLs Vercel generates for pull requests/branches) run their own separate build, so they need the vars too, or every preview will fail.

## 4. Deploy

Click **Deploy**. First build takes ~1-2 minutes. I already ran a clean production build locally (`npm run build`) against this exact codebase and confirmed:
- It compiles and typechecks cleanly
- All three data-driven routes (`/`, `/gallery`, `/flower/[id]`) render dynamically (`ƒ`), server-rendered fresh on every request — not frozen at build-time data. This matters because the app's whole point is live data (Quick Log mutations, live weather), and I found `/` would otherwise have been statically prerendered by Next's default heuristics, only refreshing when `revalidatePath` happened to fire.

## 5. After it's live

Once deployed, Vercel gives you a `https://<project>.vercel.app` URL (and you can attach a custom domain later from Project Settings → Domains).

**Opening it on your phone, from the garden:**
- Vercel URLs are HTTPS by default — no extra config needed for the camera file input to work reliably on mobile browsers.
- Open the URL in your phone's browser, tap the **+** Quick Log button or a bucket's **+ Add photo** tile — tapping either opens a file picker that offers your camera directly (via `capture="environment"`), or your photo library, on both iOS Safari and Android Chrome.
- For an app-like feel without building a full PWA: Safari → Share → "Add to Home Screen", or Chrome → menu → "Add to Home screen." Not required, just convenient — the site works fully in a normal mobile browser tab either way.

## 6. Keeping it updated

Every `git push` to `main` triggers a new production deploy automatically. Pushes to other branches (or PRs) get their own preview URL, using the same env vars.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Build fails at "Collecting page data" with "Missing Supabase env vars" | Env vars weren't set before the build ran — add them and redeploy |
| Dashboard/Gallery/Profile show "No buckets yet" | `supabase/schema.sql`, `rls.sql`, and `seed.sql` haven't been run against this Supabase project yet (SQL Editor, in that order) |
| Photo upload fails with "Bucket not found" | `supabase/storage.sql` hasn't been run yet |
| Weather card shows "Forecast unavailable" | Open-Meteo is unreachable or rate-limiting — it's not a hard dependency, the rest of the dashboard still works |
