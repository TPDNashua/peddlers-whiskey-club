# Peddler's Whiskey Club (Starter)

A ready-to-deploy Next.js + Supabase starter for a simple, user-friendly Whiskey Club.

## What you get
- **Join** page (`/join`): members sign up with name + phone/email (Supabase table `members`).
- **Member** page (`/me`): shows points, badges, and generates a short-lived QR for redemption.
- **Staff** page (`/staff`): PIN-locked; search member, award points (+1 pour, +2 flight), scan redemption QR.
- **API routes**: `/api/award`, `/api/redeem`, `/api/scan`.
- **DB schema**: tables for `members`, `pours`, `rewards`, `redemptions`, `bottles`, `achievements`, `staff_users`.
- **Future POS hook (SkyTab-ready)**: `/api/pos-ingest` for itemized receipts; whitelist whiskey SKUs; award points automatically.

## One-time setup (about 20 minutes)
1) **Create Supabase project** (free tier is fine).
2) **Run** the SQL in `supabase/schema.sql` using the Supabase SQL editor.
3) Copy Project URL + anon + service role keys into `.env.local`.
4) **Deploy** to Vercel (or run locally with `npm i && npm run dev`).

## Env vars
See `.env.example`. Service role key is used only by server-side API routes.

## Local dev
```bash
npm i
cp .env.example .env.local  # fill in values
npm run dev
```

## Deploy
- Vercel: Import the repo, add env vars, and deploy. Next.js App Router works out of the box.
- Supabase: Hosted Postgres + Auth; keys in Vercel Project Settings.

## Notes
- Auth is simplified: we identify members by phone/email (no password). You can upgrade to Supabase Auth magic links later.
- The `/api/scan` honors 3-minute QR codes generated on `/me`. Staff must confirm redemption in `/staff`.
- Add Row-Level Security (RLS) later if you expose client-side queries; this MVP calls server routes for mutations.
- SkyTab integration: once SkyTab webhooks are available, point them at `/api/pos-ingest` and map SKUs to bottles in `bottles`.