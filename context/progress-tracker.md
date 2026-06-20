# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 5 - Dashboard
**Last completed:** 17 Analytics Charts - InsForge Data
**Next:** Complete

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
- [x] 08 Resume PDF Generation from Profile

### Phase 3 - Find Jobs Page

- [x] 09 Find Jobs Page - Full UI
- [x] 10 Adzuna Job Discovery
- [x] 11 Filter + Sort + Pagination

### Phase 4 - Job Details Page

- [x] 12 Job Details Page - Full UI
- [x] 13 Company Research Agent

### Phase 5 - Dashboard

- [x] 14 Dashboard Page - Full UI
- [x] 15 Stats Bar - Real Data
- [x] 16 Recent Activity - Real Data
- [x] 17 Analytics Charts - InsForge Data

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
- 2026-06-18: Completed Feature 08 by adding `app/api/resume/generate/route.ts` and `agent/resumeGenerator.tsx`; the generate route reads the signed-in user's saved profile, asks GPT-4o for polished structured resume content, renders a server-side PDF with `@react-pdf/renderer`, uploads it to the active private resume path `resumes/{user_id}/resume.pdf`, updates `resume_pdf_url` and `resume_pdf_key`, and revalidates `/profile`.
- 2026-06-18: Wired the existing `Generate Resume from Profile` button in `ResumeSection` to `/api/resume/generate` with generating, success, and error states. Resume generation uses saved profile data only; unsaved draft fields still require Save Profile before generation. Feature 07's review-before-save extraction flow remains unchanged.
- 2026-06-19: Completed Feature 09 Find Jobs Page Full UI with mock data. Replaced the `/find-jobs` placeholder with the screenshot-matched search card, success banner, filter toolbar, jobs table, match score bars, and pagination. No Adzuna, database listing, filtering, sorting, or pagination logic was added; that remains deferred to Features 10 and 11.
- 2026-06-19: Followed `context/designs/find-jobs.png` over the build-plan column list where they differ. The screenshot does not show a Source column, so Feature 09 omits it for visual fidelity.
- 2026-06-19: Completed Feature 10 by adding `lib/adzuna.ts`, `agent/matcher.ts`, `agent/adzuna.ts`, `agent/types.ts`, `lib/utils.ts`, and `app/api/agent/find/route.ts`. Search now validates input, authenticates the user, loads the saved profile, creates an `agent_runs` record, calls Adzuna with `category=it-jobs`, scores results with GPT-4o, saves jobs with `source: "search"`, logs agent activity, updates the run status, and fires `job_search_started` / `job_found` PostHog events.
- 2026-06-19: Feature 10 initially kept the jobs table mock/static, but the review resolution now lists saved search jobs from InsForge and refreshes the table after each successful search. Real filtering, sorting, and full pagination remain Feature 11. The search card shows loading, success, and error states from the real `/api/agent/find` response.
- 2026-06-19: Added the shared `MATCH_THRESHOLD = 70` constant in `lib/utils.ts` and used it for strong-match counting instead of hardcoding the threshold in agent code.
- 2026-06-19: Resolved the Feature 10 review issue where searches appeared to return identical results. `/find-jobs` now reads the signed-in user's saved jobs from InsForge, the search form refreshes the server-rendered table after success, and the agent no longer saves fallback zero-score rows when scoring fails. If Adzuna returns jobs but none can be scored, the run fails with a user-safe error instead of reporting a misleading successful search.
- 2026-06-19: Tightened the Feature 10 table refresh behavior after different role searches still appeared unchanged. Successful searches now route to `/find-jobs?runId={id}` and the page filters saved jobs by that run, while the default `/find-jobs` view falls back to recent saved jobs sorted by `created_at`.
- 2026-06-19: Completed Feature 11 by wiring the Find Jobs toolbar and pagination to URL query state. `/find-jobs` now supports `q`, `filter`, `sort`, `page`, and `runId`, applies user-scoped InsForge filters for high/low matches, sorts by match score/newest/oldest, filters company/title text on the server, paginates at 20 jobs per page, preserves run-scoped results after a search, and displays the Jobs by Adzuna credit in the listing footer.
- 2026-06-19: Updated Adzuna job persistence so new discoveries store `found_at` as the JobPilot discovery time. This keeps the Feature 11 Newest sort aligned with when the user found the job, not the original Adzuna posting timestamp.
- 2026-06-19: Completed Feature 12 by replacing the `/find-jobs/[id]` placeholder with the screenshot-matched Job Details page. The route now authenticates the user, loads the selected job through an owner-scoped InsForge query, renders the real header, info cards, AI match reasoning, skill comparison, job description, company research empty state, and external apply actions. Company research generation remains deferred to Feature 13.
- 2026-06-19: Completed Feature 13 by adding `app/api/agent/research/route.ts`, `agent/research.ts`, and `lib/browserbase.ts`; company research now authenticates the user, loads the owner-scoped job and profile, derives the employer homepage from the Adzuna redirect when possible, runs a single Browserbase/Stagehand session with Zod-backed extraction, synthesizes a complete GPT-4o dossier, saves it to `jobs.company_research`, revalidates the job details route, and fires `company_researched`.
- 2026-06-19: Feature 13 added the inline `ResearchCompanyButton` client component and extended `CompanyResearchCard` to render all dossier fields: company overview, tech stack, culture, why this role, your edge, gaps to address, smart questions, interview prep, and sources. The button shows `Researching...`, displays user-safe errors, and refreshes the server-rendered page after success.
- 2026-06-19: Completed Feature 14 Dashboard Page Full UI with mock data. Replaced the `/dashboard` placeholder with the screenshot-matched stat cards, recent activity timeline, Company Research Activity bar chart, Jobs Found Over Time line chart, Match Score Distribution bar chart, and active Dashboard nav state.
- 2026-06-19: Followed `context/designs/dashboard.png` over the build-plan wording where they differ. The screenshot uses `Jobs This Week` as the fourth stat and `Company Research Activity` as the top chart, so Feature 14 uses those labels while leaving real dashboard data for Features 15-17.
- 2026-06-19: Reviewed Feature 14 against the uploaded dashboard design and removed the dashboard `Profile needs attention` banner because it is not present in `context/designs/dashboard.png`. The chart layouts now keep plots and axis labels inside their cards so score buckets and day labels do not spill below or outside the dashboard cards.
- 2026-06-19: Completed Feature 15 by wiring the dashboard stat cards to owner-scoped InsForge `jobs` data. `/dashboard` now calculates Total Jobs Found, Avg. Match Rate, Companies Researched, and Jobs This Week from the signed-in user's saved jobs while leaving Recent Activity and charts mocked for Features 16 and 17.
- 2026-06-19: Removed mock trend badges from the real stats cards because week-over-week comparison data is not part of Feature 15.
- 2026-06-19: Completed Feature 16 by wiring the dashboard Recent Activity card to owner-scoped InsForge data. `/dashboard` now queries completed `agent_runs` and recently updated `jobs`, normalizes completed job searches and company research entries into a single feed, sorts by timestamp, caps the feed at 10 entries, and keeps analytics charts mocked for Feature 17.
- 2026-06-19: Company research activity uses `jobs.updated_at` as the activity timestamp because saving `jobs.company_research` updates the row through the existing trigger.
- 2026-06-19: Completed Feature 17 by wiring dashboard analytics charts to PostHog Query API HogQL reads. `/dashboard` now fetches `job_found` and `company_researched` event aggregates for the signed-in user, renders Jobs Found Over Time, Match Score Distribution, and Company Research Activity from real PostHog data, and falls back to empty chart states when credentials are missing or queries fail.
- 2026-06-19: Feature 17 intentionally reused the existing CSS/SVG chart components instead of installing Recharts, because Recharts was not in the approved dependency list and the Feature 14 chart visuals already matched the dashboard design.
- 2026-06-19: Patched Feature 17 after analytics cards did not update despite captured PostHog activity. Root causes found in local env/config: `NEXT_PUBLIC_POSTHOG_HOST` points at the ingestion host `https://us.i.posthog.com`, while HogQL queries need the app/API host; `.env.local` also did not contain `POSTHOG_PROJECT_ID` or `POSTHOG_PERSONAL_API_KEY`. The helper now supports `POSTHOG_QUERY_HOST`, derives `https://us.posthog.com` from the ingestion host when possible, and filters events by both `distinct_id` and `properties.userId`.
- 2026-06-19: Reworked Feature 17 to use InsForge `jobs` as the authoritative dashboard analytics source instead of PostHog Query API. `/dashboard` now derives Jobs Found Over Time from `jobs.found_at`, Match Score Distribution from `jobs.match_score`, and Company Research Activity from non-empty `jobs.company_research` grouped by `jobs.updated_at`. PostHog capture remains in place for product analytics but is no longer used for dashboard chart reads.
- 2026-06-18: After Feature 08, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, and `npm run build` pass. Local dev server is running at `http://localhost:3000`; `curl.exe -I http://localhost:3000/profile` returns 307 to `/login?next=%2Fprofile`. `npm install @react-pdf/renderer` completed and reported 4 audit vulnerabilities; no audit fix was run because dependency audit cleanup is outside Feature 08 scope.
- 2026-06-19: After Feature 09, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, and `npm run build` pass.
- 2026-06-19: After Feature 10, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, and `npm run build` pass. Local unauthenticated `POST /api/agent/find` with valid JSON returns 401 and `{ "success": false, "error": "Please sign in before finding jobs." }`.
- 2026-06-19: After resolving the Feature 10 review issue, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and a Find Jobs token class scan pass.
- 2026-06-19: After adding run-scoped Find Jobs table updates, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and a Find Jobs token class scan pass.
- 2026-06-19: After Feature 11, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and a Find Jobs token class scan pass.
- 2026-06-19: After Feature 12, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, a Job Details token class scan, and an ASCII scan pass. Local unauthenticated `GET /find-jobs/00000000-0000-0000-0000-000000000000` redirects to `/login?next=%2Ffind-jobs%2F00000000-0000-0000-0000-000000000000`.
- 2026-06-19: After Feature 13, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and a Job Details token class scan pass. Local API smoke checks pass: invalid `POST /api/agent/research` returns 400 and unauthenticated valid JSON returns 401 with `{ "success": false, "error": "Please sign in before researching a company." }`. In-app browser verification could not run because the browser Node runtime repeatedly failed with a Windows sandbox spawn error.
- 2026-06-19: `npm install @browserbasehq/sdk @browserbasehq/stagehand zod` completed for Feature 13 and reported 24 audit vulnerabilities. No audit fix was run because dependency audit cleanup is outside Feature 13 scope.
- 2026-06-19: Fixed job descriptions being cut off mid-sentence when Adzuna only returned a preview snippet. `lib/adzuna.ts` now can follow the listing URL and extract a fuller description from JobPosting JSON-LD, metadata, or body text; job discovery saves the expanded description when available, and the Job Details page attempts the same fallback for existing saved jobs whose descriptions look truncated. `npx tsc --noEmit`, scoped ESLint, `npm run build`, a Job Details token class scan, and an ASCII scan pass after the fix.
- 2026-06-19: Ran `/recover` after the first job-description truncation fix did not resolve the issue. Diagnosis: this was a wrong-foundation failure, not a card-height bug; plain server fetches cannot reliably recover full job posts from Adzuna redirects. Added `agent/jobDescription.ts`, `app/api/agent/job-description/route.ts`, and `components/job-details/LoadFullDescriptionButton.tsx`; truncated Job Details descriptions now show an inline action that uses static extraction first, then Browserbase/Stagehand, saves the longer description back to `jobs.about_role`, and refreshes the page. `npx tsc --noEmit`, scoped ESLint, `npm run build`, token scan, ASCII scan, invalid-request smoke, and unauthenticated smoke pass.
- 2026-06-19: Strengthened the full-description loader after the first Browserbase path still returned "original job post did not expose a longer description." The Stagehand path now extracts once from the current page, actively clicks through Adzuna/listing-wrapper "original job post/apply/full details" actions when present, extracts again from the active page/new tab, and finally falls back to raw page text before failing. `npx tsc --noEmit`, scoped ESLint, `npm run build`, and an ASCII scan pass.
- 2026-06-19: Replaced the failed full-description extraction flow after Adzuna returned an Access Denied / suspicious behavior page to Browserbase. Removed `agent/jobDescription.ts` and `app/api/agent/job-description/route.ts`; the truncated-description notice now links directly to the saved source/apply URL in a new tab with an `Open source` action. `npm run build`, `npx tsc --noEmit`, scoped ESLint, and a Job Details token scan pass after the pivot.
- 2026-06-19: After Feature 14, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and a Dashboard token class scan pass. An ASCII scan of touched app/component files passes; the only non-ASCII hits are pre-existing punctuation in context docs. In-app browser verification was not run because the browser Node runtime had previously failed repeatedly with a Windows sandbox spawn error.
- 2026-06-19: After the Feature 14 chart/banner correction, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and a Dashboard token class scan pass.
- 2026-06-19: After Feature 15, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and a Dashboard token class scan pass. The verification commands required approved escalation because the Windows sandbox hit `spawn setup refresh` before running them.
- 2026-06-19: After Feature 16, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and a Dashboard token class scan pass. The verification commands required approved escalation because the Windows sandbox hit `spawn setup refresh` before running them.
- 2026-06-19: After Feature 17, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and a Dashboard token class scan pass. The verification commands required approved escalation because the Windows sandbox hit `spawn setup refresh` before running them.
- 2026-06-19: After reworking Feature 17 to use InsForge `jobs` for dashboard analytics, `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and a Dashboard token class scan pass. The verification commands required approved escalation because the Windows sandbox hit `spawn setup refresh` before running them.
- 2026-06-19: Dashboard polish capped Recent Activity at the latest 50 merged entries, fixed the card height to match the adjacent Company Research Activity card, and moved overflow to an internal scroll region so long activity histories do not stretch the dashboard top row.
- 2026-06-19: Navbar polish restored the shared Log out action on protected routes by removing route-level `showSignOut={false}` overrides from Dashboard, Find Jobs, and Profile. `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and a `showSignOut={false}` route scan pass; verification required approved escalation because the Windows sandbox hit `spawn setup refresh`.
- 2026-06-19: Logout redirect polish changed the shared `signOut` Server Action to clear auth cookies and redirect to the homepage `/` instead of `/login`. `npx tsc --noEmit`, scoped `npx eslint app components actions lib agent proxy.ts`, `npm run build`, and an auth-action scan for the old exact `redirect("/login")` call pass; verification required approved escalation because the Windows sandbox hit `spawn setup refresh`.
