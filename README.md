# Neplio Health

A frontend-only tracker for the 30-day fat loss roster (`docs/21-Day Fat Loss Roster — Dipesh.docx`).
React + Vite, no backend.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

## Views

| Tab       | For       | What it does |
|-----------|-----------|--------------|
| Me        | you       | Today's day number, checklist, meals, steps, note, rules, start date |
| Food      | you       | 30-day diet roster; tap a meal to mark it eaten; swap options |
| Exercise  | you       | Walk roster by week; tick walks, log steps |
| Timeline  | you       | Daily timetable with a "now" marker, 30-day progress grid, weigh-ins + chart |
| Kitchen   | the cook  | Menu per day with ingredient quantities, shopping list (3/7 days), inventory with stock levels |

## File-driven data

The plan itself lives in `src/data/*.json` — edit these to change the plan:

- `profile.json` — targets, rules, start date, weigh-in days
- `dietRoster.json` / `exerciseRoster.json` — the 30-day rosters
- `mealOptions.json` — swap options and notes
- `timetable.json` — the daily schedule
- `recipes.json` — ingredients per dish (drives the cook's shopping list)
- `inventory.json` — ingredients, units, starting stock, reorder level

Your progress (ticks, steps, weigh-ins, stock) is saved in the browser's localStorage.
Use **Export / Import** in the footer to back it up or move it to another device as a `.json` file.

## Deploying to Vercel

It's a static Vite build, so no server config is needed (`vercel.json` pins framework/output).
Navigation is hash-based (`#food`, `#kitchen`), so no SPA rewrites are needed.

```
npm i -g vercel
vercel           # first run links the project, makes a preview deploy
vercel --prod    # promote to production
```

Or push to GitHub and import the repo at vercel.com/new — every push gets a preview URL.

Things to know:

- **Data stays per device.** Each browser has its own localStorage, so the cook's phone and yours
  won't share stock or ticks. Use Export/Import to sync, or add shared storage later
  (e.g. Vercel Blob or Upstash Redis via the Marketplace) if that becomes a pain.
- **The deployed URL is public.** Your name, weight and plan are baked into the bundle.
  Turn on Deployment Protection (Project → Settings → Deployment Protection) if you want it private.

### CI/CD (GitHub Actions)

`.github/workflows/deploy.yml` builds every push and PR, then:

- push to `master` → production deploy (https://neplio-health.vercel.app)
- pull request into `master` → preview deploy, URL commented on the PR

Required repository secrets (Settings → Secrets and variables → Actions):

| Secret              | Where to get it |
|---------------------|-----------------|
| `VERCEL_TOKEN`      | vercel.com/account/tokens → Create token |
| `VERCEL_ORG_ID`     | `orgId` in `.vercel/project.json` (after `vercel link`) |
| `VERCEL_PROJECT_ID` | `projectId` in `.vercel/project.json` |
