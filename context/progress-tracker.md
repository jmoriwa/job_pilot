# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 - Profile Page
**Last completed:** 07 AI Profile Extraction from Resume
**Next:** 08 Resume PDF Generation from Profile

---

## Progress

### Phase 1 - Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 - Profile Page

- [x] 05 Profile Page - Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
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
- 2026-06-12: Added PostHog browser and server clients in `lib/`, root provider initialization, approved event capture helpers, authenticated user identification, and logout reset.
- 2026-06-12: Created the initial InsForge schema migrations for `profiles`, `agent_runs`, `jobs`, and `agent_logs` with owner-scoped RLS, indexes, constraints, grants, and timestamp triggers. Added profile completion fields plus `resume_pdf_key` to support upcoming profile and storage workflows. Added path-scoped `storage.objects` RLS policies for the private `resumes` bucket.
- 2026-06-12: Built the full mock-data `/profile` UI to match `context/designs/profile.png`, using dedicated profile components and keeping save, upload, extraction, and generation logic deferred to later features.
- 2026-06-12: Closed the prior open questions by deferring `.agents/` ESLint ignore work and dependency audit cleanup outside Feature 05 scope.
- 2026-06-16: Wired `/profile` to real InsForge profile data with server-side prefill, a `saveProfile` Server Action, private resume PDF upload to the `resumes` bucket at object key `resumes/{user_id}/resume.pdf`, completion metadata calculation, and post-save `revalidatePath("/profile")`.
- 2026-06-16: Kept AI resume extraction and generated resume PDF creation deferred to Features 07 and 08; Feature 06 only saves manually entered profile data and uploaded resume files.
- 2026-06-16: Fixed resume selection UX so choosing a PDF auto-submits the profile form, runs the resume upload path immediately, and shows an uploading state instead of silently waiting for Save Profile.
- 2026-06-16: Improved resume upload confirmation so successful uploads show both the top-level success message `Resume uploaded: {filename}` and inline `Uploaded {filename}` text in the resume card.
- 2026-06-16: Added a `View Current Resume` link to the resume card that appears when a saved or newly uploaded resume URL is available and opens the PDF in a new tab.
- 2026-06-16: Replaced the raw private InsForge resume URL with authenticated route `app/api/resume/current/route.ts`; the route reads `resume_pdf_key`, downloads from the `resumes` bucket using the signed-in user's session, and streams the PDF inline.
- 2026-06-16: Completed Feature 07 by adding `app/api/resume/extract/route.ts` and `agent/resume.ts`; the extract route reads the signed-in user's saved private resume, parses PDF text with `pdf-parse`, asks GPT-4o for structured profile JSON, normalizes it through `lib/profile.ts`, and returns draft profile data without saving it.
- 2026-06-16: Added the approved `openai` and `pdf-parse` dependencies for resume extraction.
- 2026-06-16: Changed `ProfileFormShell` to own a client-side draft profile and remount `ProfileInformationForm` after extraction so visible uncontrolled form fields are filled for review before the user clicks Save Profile.
- 2026-06-16: Added the `Extract from Resume` action to `ResumeSection`; it appears only when a current resume exists, shows extracting/error/success states, and leaves persistence to the existing Save Profile flow.

---

## Notes

- 2026-06-11: `npm run build` passes. Full `npm run lint` currently fails because ESLint scans `.agents/skills/...` helper scripts with CommonJS `require()`; scoped `npx eslint app components` passes.
- 2026-06-11: Dev server was started on `http://127.0.0.1:3000`; the homepage returns HTTP 200.
- 2026-06-11: After auth, `npm run build` passes and scoped `npx eslint app components actions lib proxy.ts` passes.
- 2026-06-11: Local dev smoke test passes: `/login` returns 200, and unauthenticated `/dashboard` redirects to `/login?next=%2Fdashboard`.
- 2026-06-11: Ran `/recover` for OAuth start failure. Root cause was `.env.local` having a key-shaped value in `NEXT_PUBLIC_INSFORGE_URL`; fixed it to `https://8xgwy8td.us-east.insforge.app` and added `NEXT_PUBLIC_APP_URL=http://localhost:3000`. Sanitized OAuth diagnostic returned `{ hasUrl: true, hasCodeVerifier: true, error: null }`.
- 2026-06-11: After adding logout UI, `npm run build` passes and scoped `npx eslint app components actions lib proxy.ts` passes.
- 2026-06-11: Fixed auth proxy session refresh handling so InsForge cookie writes update the request cookie store, redirect responses preserve refreshed or cleared cookies, and route gating uses the refreshed access token result. `npm run build`, scoped ESLint, and local `/login` + `/dashboard` smoke tests pass.
- 2026-06-12: After PostHog initialization, `npm run build` passes and scoped `npx eslint app components actions lib proxy.ts` passes.
- 2026-06-12: Feature 04 migrations `20260612012756_create-jobpilot-schema.sql` and `20260612013245_create-resumes-storage-policies.sql` applied successfully to `Joe_JobPilot`. Verified all four tables exist, RLS is enabled, 16 owner table policies are present, 4 resumes storage policies are present, and the private `resumes` storage bucket exists.
- 2026-06-12: Feature 05 verification was attempted, but the sandbox failed to start normal commands and the approval reviewer rejected escalated `npm run build` / scoped ESLint due to usage limits. Run `npm run build` and `npx eslint app components actions lib proxy.ts` next time verification is available.
- 2026-06-16: After Feature 06, `npx tsc --noEmit`, scoped `npx eslint app components actions lib proxy.ts`, and `npm run build` pass. Local dev server is running at `http://127.0.0.1:3000`; `/login` returns 200 and unauthenticated `/profile` redirects to `/login?next=%2Fprofile`.
- 2026-06-16: After the resume upload UX fix, scoped `npx eslint app components actions lib proxy.ts` and `npm run build` pass.
- 2026-06-16: After the uploaded filename confirmation fix, scoped `npx eslint app components actions lib proxy.ts` and `npm run build` pass.
- 2026-06-16: After adding the current resume view link, scoped `npx eslint app components actions lib proxy.ts` and `npm run build` pass.
- 2026-06-16: After fixing private resume viewing, scoped `npx eslint app components actions lib proxy.ts` and `npm run build` pass. Unauthenticated `GET /api/resume/current` redirects to `/login?next=%2Fprofile`.
- 2026-06-16: After Feature 07, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, and `npm run build` pass.
- 2026-06-16: Feature 07 local smoke checks against the running dev server pass for unauthenticated behavior: `/profile` returns 307 and `POST /api/resume/extract` returns 401 with `{ success: false, error: "Please sign in before extracting your resume." }`.
- 2026-06-16: `npm install openai pdf-parse` completed but reported 4 audit vulnerabilities and a non-fatal cleanup warning for a nested `node_modules` directory. No audit fix was run because dependency audit cleanup is outside Feature 07 scope.
- 2026-06-16: Patched Feature 07 extraction after the UI returned the generic `Could not extract profile details from this resume.` message. The extraction agent now uses a larger OpenAI completion budget, caps resume prompt text length, and returns specific user-safe messages for PDF parse failures, OpenAI auth/rate-limit/API failures, empty responses, and incomplete JSON. `npx tsc --noEmit`, scoped ESLint, and `npm run build` pass after the patch.
- 2026-06-16: Ran `/recover` after the same generic Feature 07 extraction error persisted. Diagnosed the remaining issue as masked failure reporting: the client catch and agent outer catch could still collapse non-JSON route failures or unexpected extraction failures into the old generic message. Patched `ResumeSection` to safely parse JSON/non-JSON responses and show status-specific diagnostics, and patched `agent/resume.ts` to return a user-safe preparation failure message for unexpected post-processing errors. `npx tsc --noEmit`, scoped ESLint, and `npm run build` pass.
- 2026-06-17: Removed the final exact `Could not extract profile details from this resume.` fallback from `ResumeSection`; source search now has no instances of that string in `app`, `components`, `agent`, or `lib`. Extraction fetch now sends `Accept: application/json`, `cache: "no-store"`, and reports missing error details with the HTTP status. `npx tsc --noEmit`, scoped ESLint, and `npm run build` pass.
- 2026-06-17: Extended Feature 07 to support scanned/image-based PDFs. `agent/resume.ts` now keeps text extraction as the primary path, but when extracted PDF text is under 100 characters it renders up to the first 3 PDF pages as data URL screenshots using `pdf-parse` and sends those images to GPT-4o vision for structured profile extraction. `npx tsc --noEmit`, scoped ESLint, and `npm run build` pass.
- 2026-06-17: Improved Feature 07 OpenAI failure diagnostics after scanned-PDF fallback reached OpenAI but returned `OpenAI could not process this resume right now.` The user-facing error now includes safe OpenAI metadata when available: status, code, type, and request ID. `npx tsc --noEmit`, scoped ESLint, and `npm run build` pass.
- 2026-06-17: Tightened scanned-PDF OpenAI transport failure handling after the fallback still returned the non-API generic error. Reduced vision fallback payload to the first 2 pages at 1000px width and changed non-API OpenAI failures to surface the safe JavaScript error name/message, e.g. `APIConnectionError` or `TypeError: fetch failed`. `npx tsc --noEmit`, scoped ESLint, and `npm run build` pass.
- 2026-06-17: Fixed scanned-PDF fallback runtime failure where `pdfjs` tried to load `.next/dev/server/chunks/pdf.worker.mjs`. `agent/resume.ts` now explicitly resolves `pdfjs-dist/legacy/build/pdf.worker.mjs` with `createRequire(import.meta.url)`, passes it to `PDFParse.setWorker()` as a file URL, and configures the worker before text extraction or screenshot rendering. `npx tsc --noEmit`, scoped ESLint, and `npm run build` pass.
- 2026-06-17: Adjusted the pdfjs worker fix after Turbopack rewrote `require.resolve()` into a bundled `[project]... [app-route]` pseudo-path. `agent/resume.ts` now constructs the worker path directly from `process.cwd()/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs` before converting it to a file URL for `PDFParse.setWorker()`. `npx tsc --noEmit`, scoped ESLint, and `npm run build` pass.
- 2026-06-17: User confirmed Feature 07 resume extraction now works end to end after the direct `process.cwd()` pdfjs worker path fix. The working flow is private resume download from InsForge Storage, text extraction for text PDFs, scanned-PDF screenshot fallback for image PDFs, GPT-4o extraction, and review-before-save profile form fill.
- 2026-06-17: Updated `ProfileFormShell` so after the Save Profile Server Action returns a status message, the page smooth-scrolls to the top. This keeps profile completion updates after save only, while bringing the user back to the banner/status area. `npx tsc --noEmit`, scoped ESLint, and `npm run build` pass.
