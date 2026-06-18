# Memory - Feature 08 Resume PDF Generation

Last updated: 2026-06-18

## What was built

Completed Feature 08 Resume PDF Generation from Profile.

Created:
- `app/api/resume/generate/route.ts`
- `agent/resumeGenerator.tsx`

Modified:
- `components/profile/ResumeSection.tsx`
- `package.json`
- `package-lock.json`
- `context/progress-tracker.md`
- `context/ui-registry.md`

Feature 08 now:
- Uses the signed-in user's saved `profiles` table data as the source of truth.
- Calls GPT-4o to generate polished structured resume content.
- Renders a server-side PDF with `@react-pdf/renderer`.
- Uploads the generated PDF to the active private resume path `resumes/{user_id}/resume.pdf`.
- Updates `profiles.resume_pdf_url` and `profiles.resume_pdf_key`.
- Revalidates `/profile`.
- Wires the existing `Generate Resume from Profile` button to `/api/resume/generate`.
- Shows generating, success, and error states in the resume card.
- Reveals `View Current Resume` immediately after generation succeeds.

## Decisions made

- Resume generation uses saved profile data only. Unsaved draft fields from the form are not included until the user clicks Save Profile.
- The generated resume replaces the active current resume at the existing private storage path.
- Feature 07's extraction behavior remains review-before-save; generation did not change that flow.
- The installed InsForge SDK `storage.upload()` only accepts `(path, file)` in this version, so the implementation matches the existing upload pattern instead of passing an unsupported `upsert` option.
- `@react-pdf/renderer` is now an installed dependency because Feature 08 explicitly requires server-side PDF rendering.

## Problems solved

- `@react-pdf/renderer` was missing from `package.json`; installed it for Feature 08.
- TypeScript rejected passing a Node `Buffer` directly into `Blob`. Fixed by copying the generated buffer into a plain `Uint8Array` before creating the PDF upload `Blob`.
- Confirmed the running dev server is reachable with `curl.exe`; `Invoke-WebRequest` reported `DOWN`, but TCP and curl checks showed localhost was responding.

## Current state

- Feature 01 Homepage is complete.
- Feature 02 Auth is complete.
- Feature 03 PostHog Initialization is complete.
- Feature 04 Database Schema is complete.
- Feature 05 Profile Page - Full UI is complete.
- Feature 06 Profile Save Logic is complete.
- Feature 07 AI Profile Extraction from Resume is complete and confirmed working.
- Feature 08 Resume PDF Generation from Profile is complete.
- Current project phase is Phase 3 - Find Jobs Page.
- Next feature is Feature 09 Find Jobs Page - Full UI.
- `progress-tracker.md` is updated through Feature 08.
- `ui-registry.md` is updated for the Feature 08 resume generation UI/API patterns.
- Full `npm run lint` is still known to fail because ESLint scans `.agents/skills/...` helper scripts; use the scoped lint command.
- `npm install @react-pdf/renderer` reported 4 audit vulnerabilities. No audit fix was run because dependency audit cleanup was outside Feature 08 scope.

Verified after Feature 08 work:
- `npx tsc --noEmit`
- `npx eslint app components actions lib agent proxy.ts`
- `npm run build`
- Local smoke check: `curl.exe -I http://localhost:3000/profile` returns 307 to `/login?next=%2Fprofile`.

## Next session starts with

Run `/remember restore`, then begin Feature 09 Find Jobs Page - Full UI from `context/build-plan.md`.

Before implementing Feature 09:
- Read the required context files from `AGENTS.md`.
- Use `/architect` because Feature 09 is a full page UI feature.
- Preserve the existing top-nav protected route shell and route-level auth check.
- Build with mock data first, no Adzuna or database logic yet.
- Use project tokens only; no raw Tailwind color classes or hardcoded component colors.
- Update `context/progress-tracker.md` and `context/ui-registry.md` after the feature.

## Open questions

- None for Feature 08.
