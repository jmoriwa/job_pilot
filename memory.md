# Memory - Feature 07 Resume Extraction

Last updated: 2026-06-17

## What was built

Completed Feature 07 AI Profile Extraction from Resume.

Created:
- `app/api/resume/extract/route.ts`
- `agent/resume.ts`

Modified:
- `components/profile/ResumeSection.tsx`
- `components/profile/ProfileFormShell.tsx`
- `app/profile/page.tsx`
- `lib/profile.ts`
- `package.json`
- `package-lock.json`
- `context/progress-tracker.md`
- `context/ui-registry.md`

Feature 07 now:
- Reads the signed-in user's saved private resume from InsForge Storage using `resume_pdf_key`.
- Extracts text from text-based PDFs with `pdf-parse`.
- Falls back for scanned/image-based PDFs by rendering up to the first 2 pages at 1000px width and sending those page images to GPT-4o vision.
- Normalizes OpenAI output through `lib/profile.ts`.
- Fills the visible profile form as a draft for review.
- Does not save extracted fields until the user clicks Save Profile.
- Smooth-scrolls to the top after the Save Profile Server Action returns a status message, so the user sees the updated completion banner/status area.

## Decisions made

- Resume extraction is review-before-save. The extraction route returns draft profile data only; the existing `saveProfile` Server Action remains the persistence path.
- Text-based PDF extraction stays the primary path because it is faster and cheaper.
- Scanned/image PDFs are supported through a GPT-4o vision fallback rather than adding a separate OCR dependency.
- The scanned-PDF fallback uses a small image payload by default: first 2 pages, 1000px wide.
- The pdfjs worker path is configured manually from `process.cwd()/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs` and converted to a file URL before calling `PDFParse.setWorker()`. Do not switch this back to `require.resolve()`; Turbopack rewrites that into a bundled pseudo-path that fails at runtime.
- User-facing extraction errors are human-readable and safe. Server logs may include diagnostic status/code/request metadata, but no secrets are persisted.
- Profile completion still updates only after Save Profile; the new scroll behavior simply returns the user to the updated banner/status area after save.

## Problems solved

- Fixed stale generic extraction error handling. `ResumeSection` now parses JSON and non-JSON responses separately and no longer contains the old fallback string `Could not extract profile details from this resume.`
- Diagnosed that the user's uploaded PDF was image/scanned enough that normal text extraction returned too little text.
- Added scanned-PDF support via `pdf-parse` screenshots plus GPT-4o vision.
- Fixed the pdfjs worker failure where Next/Turbopack first looked for `.next/dev/server/chunks/pdf.worker.mjs`, then rewrote `require.resolve()` into a `[project]... [app-route]` pseudo-path. The direct `process.cwd()` worker path fixed it.
- Added post-save smooth scroll to top in `ProfileFormShell` after the Server Action returns a status message.
- User confirmed the extraction flow now works perfectly.

## Current state

- Feature 01 Homepage is complete.
- Feature 02 Auth is complete.
- Feature 03 PostHog Initialization is complete.
- Feature 04 Database Schema is complete.
- Feature 05 Profile Page - Full UI is complete.
- Feature 06 Profile Save Logic is complete.
- Feature 07 AI Profile Extraction from Resume is complete and confirmed working.
- Profile save now scrolls to the top after the save response so the updated progress banner/status area is visible.
- Next feature is Feature 08 Resume PDF Generation from Profile.
- `progress-tracker.md` is updated through Feature 07, including the scanned-PDF fallback and final user confirmation.
- `ui-registry.md` is updated for the Feature 07 ResumeSection/ProfileFormShell extraction UI patterns.
- Full `npm run lint` is still known to fail because ESLint scans `.agents/skills/...` helper scripts; use the scoped lint command.

Verified after Feature 07 work:
- `npx tsc --noEmit`
- `npx eslint app components actions lib agent proxy.ts`
- `npm run build`

## Next session starts with

Run `/remember restore`, then begin Feature 08 Resume PDF Generation from Profile from `context/build-plan.md`.

Before implementing Feature 08:
- Read the required context files from `AGENTS.md`.
- Use relevant installed skills/docs before touching OpenAI, InsForge, Next.js, or PDF generation APIs.
- Preserve Feature 07's review-before-save extraction flow.
- Keep `agent/resume.ts` pdfjs worker setup intact unless replacing the scanned-PDF rendering strategy entirely.
- Feature 08 should generate a clean professional resume PDF from current saved profile data, upload it to InsForge Storage at the existing active resume path, and update `resume_pdf_url` / `resume_pdf_key`.
- Update `context/progress-tracker.md` and `context/ui-registry.md` after the feature.

## Open questions

- None for Feature 07.
