# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 1 - Foundation
**Last completed:** 02 Auth
**Next:** 03 PostHog Initialization

---

## Progress

### Phase 1 - Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [ ] 03 PostHog Initialization
- [ ] 04 Database Schema

### Phase 2 - Profile Page

- [ ] 05 Profile Page - Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 - Find Jobs Page

- [ ] 09 Find Jobs Page - Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 - Job Details Page

- [ ] 12 Job Details Page - Full UI
- [ ] 13 Company Research Agent

### Phase 5 - Dashboard

- [ ] 14 Dashboard Page - Full UI
- [ ] 15 Stats Bar - Real Data
- [ ] 16 Recent Activity - Real Data
- [ ] 17 Analytics Charts - PostHog Data

---

## Decisions Made During Build

- 2026-06-11: Built homepage as server components in `components/layout` and `components/homepage`, with `app/page.tsx` only composing the route.
- 2026-06-11: Switched root font from Geist to Inter via `next/font/google` to match project UI rules.
- 2026-06-11: Used existing `public/images` assets for the dashboard preview, job list, agent log, and testimonial avatar. The agent log filename remains `agnet-log.png` because that is the current asset path.
- 2026-06-11: Added token-backed global helper classes `landing-gradient` and `landing-stripes` for the landing page background treatments without hardcoded component colors.
- 2026-06-11: Implemented InsForge OAuth auth with the current `@insforge/sdk/ssr` helpers. OAuth start runs in Server Actions, callback exchange runs in `app/api/auth/callback`, refresh runs at `app/api/auth/refresh`, and protected routes are guarded by Next.js 16 `proxy.ts`.
- 2026-06-11: Added minimal authenticated route shells for `/dashboard`, `/profile`, `/find-jobs`, and `/find-jobs/[id]` so auth redirects land on real protected pages without pre-building later feature UI.
- 2026-06-11: Added authenticated `AppHeader` with Dashboard, Find Jobs, Profile navigation and a Server Action-backed Log out button on protected route shells.

---

## Notes

- 2026-06-11: `npm run build` passes. Full `npm run lint` currently fails because ESLint scans `.agents/skills/...` helper scripts with CommonJS `require()`; scoped `npx eslint app components` passes.
- 2026-06-11: Dev server was started on `http://127.0.0.1:3000`; the homepage returns HTTP 200.
- 2026-06-11: After auth, `npm run build` passes and scoped `npx eslint app components actions lib proxy.ts` passes.
- 2026-06-11: Local dev smoke test passes: `/login` returns 200, and unauthenticated `/dashboard` redirects to `/login?next=%2Fdashboard`.
- 2026-06-11: Ran `/recover` for OAuth start failure. Root cause was `.env.local` having a key-shaped value in `NEXT_PUBLIC_INSFORGE_URL`; fixed it to `https://8xgwy8td.us-east.insforge.app` and added `NEXT_PUBLIC_APP_URL=http://localhost:3000`. Sanitized OAuth diagnostic returned `{ hasUrl: true, hasCodeVerifier: true, error: null }`.
- 2026-06-11: After adding logout UI, `npm run build` passes and scoped `npx eslint app components actions lib proxy.ts` passes.
- 2026-06-11: Fixed auth proxy session refresh handling so InsForge cookie writes update the request cookie store, redirect responses preserve refreshed or cleared cookies, and route gating uses the refreshed access token result. `npm run build`, scoped ESLint, and local `/login` + `/dashboard` smoke tests pass.
