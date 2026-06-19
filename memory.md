# Memory - Features 13-14 Company Research and Dashboard

Last updated: 2026-06-19 13:58 America/Chicago

## What was built

Completed Feature 13 Company Research Agent.

Created or modified the company research flow:
- `app/api/agent/research/route.ts`
- `agent/research.ts`
- `lib/browserbase.ts`
- `components/job-details/ResearchCompanyButton.tsx`
- `components/job-details/CompanyResearchCard.tsx`
- `app/find-jobs/[id]/page.tsx`

Completed Feature 14 Dashboard Page - Full UI with mock data.

Created:
- `components/dashboard/StatsBar.tsx`
- `components/dashboard/RecentActivity.tsx`
- `components/dashboard/AnalyticsCharts.tsx`

Modified:
- `app/dashboard/page.tsx`
- `context/progress-tracker.md`
- `context/ui-registry.md`

Also resolved the Job Details description preview issue:
- `components/job-details/LoadFullDescriptionButton.tsx` now links users directly to the saved source/apply URL instead of trying Browserbase extraction.
- Removed the attempted automated full-description extraction route/agent after Adzuna returned Access Denied to automated browsing.

## Decisions made

- Feature 13 uses one Browserbase/Stagehand session for company website research and always closes it in `finally`.
- Company research derives an employer homepage from the Adzuna redirect when possible, then falls back safely and still synthesizes a complete dossier if browser research is thin or fails.
- Company research saves the dossier into `jobs.company_research` and renders all nine dossier fields in the existing Job Details card.
- Feature 14 is mock UI only. Real dashboard stat/activity/PostHog data remains deferred to Features 15-17.
- For Feature 14, `context/designs/dashboard.png` is the visual source of truth over the build-plan wording where they differ.
- The dashboard fourth stat is `Jobs This Week`, not `Cover Letters Generated`.
- The dashboard top chart is `Company Research Activity`.
- The dashboard must not render the `Profile needs attention` banner because the uploaded design does not show it.
- Dashboard charts are static CSS/SVG mock visuals, not a new charting dependency.

## Problems solved

- Fixed Feature 13 button flow so `Research Company` waits inline, shows a pending state, saves the dossier, refreshes the page, and renders saved research.
- Fixed Adzuna preview-description handling by changing the truncated-description affordance to open the original source directly. Browserbase extraction for this path was removed because Adzuna can serve Access Denied / suspicious behavior pages to automated requests.
- Fixed Feature 14 dashboard mismatch where a `Profile needs attention` banner appeared above the stats even though it was not in the uploaded design.
- Fixed dashboard chart overflow: x-axis labels and plots now stay inside their cards, and match score bucket labels use nowrap handling.

## Current state

- Phase 1 Foundation is complete.
- Phase 2 Profile Page is complete.
- Phase 3 Find Jobs Page is complete.
- Phase 4 Job Details Page is complete.
- Phase 5 Dashboard has Feature 14 complete.
- Current project phase is Phase 5 - Dashboard.
- Last completed feature is Feature 14 Dashboard Page - Full UI.
- Next feature is Feature 15 Stats Bar - Real Data.
- `context/progress-tracker.md` is updated through Feature 14 and lists Feature 15 next.
- `context/ui-registry.md` is updated with Dashboard Page, Stats Bar, Recent Activity, and Analytics Charts patterns.
- Full `npm run lint` is still known to be avoided because ESLint can scan `.agents/skills/...`; use the scoped lint command.
- Browser plugin verification has repeatedly failed in this environment with a Windows sandbox `spawn setup refresh` error, even though local route/build checks pass.

Verified after latest work:
- `npx tsc --noEmit`
- `npx eslint app components actions lib agent proxy.ts`
- `npm run build`
- Dashboard token scan for raw Tailwind color classes or hex values.
- Confirmed no dashboard references remain to `ProfileAttentionBanner`, `Profile needs attention`, `profileIsComplete`, `completionPercentage`, or `missingFields`.
- Local unauthenticated `/dashboard` returns the expected redirect to `/login?next=%2Fdashboard`.

## Next session starts with

Run `/remember restore`, then begin Feature 15 Stats Bar - Real Data from `context/build-plan.md`.

Before implementing Feature 15:
- Read the required context files from `AGENTS.md` in order.
- Use the InsForge app-code skill because Feature 15 reads dashboard stats from the database.
- Keep `/dashboard` as a Server Component and scope all queries to the signed-in `user_id`.
- Replace only the four stat card values with real data:
  - Total Jobs Found: count `jobs` for the current user.
  - Avg. Match Rate: average `jobs.match_score` for the current user.
  - Companies Researched: count jobs with non-null `company_research` for the current user.
  - Jobs This Week: count jobs with `found_at` in the last seven days for the current user.
- Keep Recent Activity and charts mocked until Features 16 and 17.
- Update `context/progress-tracker.md` and `context/ui-registry.md` after the feature.

## Open questions

- No open questions for completed Features 13-14.
- Feature 15 needs to decide whether trend badges remain mock/static or are hidden/derived when only current aggregate data is available.
