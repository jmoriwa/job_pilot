# Memory - Auth Session

Last updated: 2026-06-12 00:45 -05:00

## What was built

Completed Feature 02 Auth from `context/build-plan.md`.

Created:
- `actions/auth.ts`
- `app/(auth)/login/page.tsx`
- `app/api/auth/callback/route.ts`
- `app/api/auth/refresh/route.ts`
- `app/dashboard/page.tsx`
- `app/profile/page.tsx`
- `app/find-jobs/page.tsx`
- `app/find-jobs/[id]/page.tsx`
- `components/layout/AppHeader.tsx`
- `lib/insforge-client.ts`
- `lib/insforge-server.ts`
- `lib/insforge-config.ts`
- `proxy.ts`

Modified:
- `package.json` and `package-lock.json` now include `@insforge/sdk`.
- `.env.local` was corrected for local auth configuration without committing secrets.
- `context/progress-tracker.md` marks `02 Auth` complete and sets `03 PostHog Initialization` as next.
- `context/ui-registry.md` captures Login Page, Protected Route Shells, and App Header patterns.

## Decisions made

- Auth uses InsForge OAuth through the current `@insforge/sdk/ssr` helpers.
- OAuth starts in Server Actions, exchanges the callback code in `app/api/auth/callback`, refreshes through `app/api/auth/refresh`, and protects app routes through Next.js 16 `proxy.ts`.
- Protected pages use temporary route shells plus `AppHeader` so auth redirects land on real pages before later feature UI is built.
- Logout is a Server Action-backed form in `AppHeader`; PostHog reset is deferred until Feature 03 because PostHog is not initialized yet.
- Route protection uses the `updateSession()` access token result instead of checking whether auth cookies merely exist.

## Problems solved

- OAuth originally failed with "We could not start sign in. Please try again." Root cause was local InsForge environment configuration: the public URL value was incorrect. It was fixed locally, and the anon key was never copied into memory.
- A review found `proxy.ts` did not let InsForge write refreshed cookies into the request store and discarded refreshed or cleared cookies when redirecting. `proxy.ts` now mutates the request cookie store, preserves cookie mutations on redirects, and gates auth from the refreshed session result.
- Login now redirects authenticated users to `/dashboard`, protected routes redirect unauthenticated users to `/login?next=...`, and authenticated routes include a visible Log out button.

## Current state

- Feature 01 Homepage is complete.
- Feature 02 Auth is complete.
- `npm run build` passes.
- Scoped lint passes with `npx eslint app components actions lib proxy.ts`.
- Local smoke tests passed: `/login` returns 200 and unauthenticated `/dashboard` redirects to `/login?next=%2Fdashboard`.
- Full `npm run lint` is still known to fail because ESLint scans `.agents/skills/...` CommonJS helper scripts; scoped app lint is the current verified check.
- Worktree still contains earlier project changes and untracked auth files; do not revert unrelated modifications.

## Next session starts with

Run `/remember restore`, then begin Feature 03 PostHog Initialization from `context/build-plan.md`.

Before implementing PostHog:
- Read the required context files in `AGENTS.md`.
- Read `context/library-docs.md` PostHog section.
- Add `posthog-js` and `posthog-node` only if they are not already installed.
- Implement client and server PostHog helpers, initialize in the root layout, call `posthog.identify()` after login, and call `posthog.reset()` on logout.

## Open questions

- Decide whether to adjust ESLint config to ignore `.agents/` so full-project `npm run lint` can pass cleanly.
- Confirm PostHog environment variables are present before wiring Feature 03 behavior.
