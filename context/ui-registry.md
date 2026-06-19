# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Database Schema

File: `migrations/20260612012756_create-jobpilot-schema.sql`, `migrations/20260612013245_create-resumes-storage-policies.sql`
Last updated: 2026-06-12

| Property         | Class |
| ---------------- | ----- |
| Background       | none  |
| Border           | none  |
| Border radius    | none  |
| Text - primary   | none  |
| Text - secondary | none  |
| Spacing          | none  |
| Hover state      | none  |
| Shadow           | none  |
| Accent usage     | none  |

**Pattern notes:**
Feature 04 introduced backend schema only. No UI components or visual patterns were added.

### Navbar

File: `components/layout/Navbar.tsx`
Last updated: 2026-06-11

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`                                                          |
| Border           | `border-b border-border`                                              |
| Border radius    | none                                                                  |
| Text - primary   | `text-text-dark`                                                      |
| Text - secondary | none                                                                  |
| Spacing          | `h-16 px-6 gap-10`                                                    |
| Hover state      | `hover:text-accent`, `hover:bg-overlay-dark`                          |
| Shadow           | none                                                                  |
| Accent usage     | `text-accent`, `bg-overlay text-accent-foreground` for primary action |

**Pattern notes:**
Top navigation is full width, white, 64px tall, and centered inside a `max-w-[1280px]` container. Primary nav links are 14px medium text with color-only hover states.

### Footer

File: `components/layout/Footer.tsx`
Last updated: 2026-06-11

| Property         | Class                                          |
| ---------------- | ---------------------------------------------- |
| Background       | `bg-surface`                                   |
| Border           | `border-x border-border`                       |
| Border radius    | none                                           |
| Text - primary   | `text-text-dark`                               |
| Text - secondary | none                                           |
| Spacing          | `px-8 py-14 gap-6 gap-8`                       |
| Hover state      | `hover:text-accent`                            |
| Shadow           | none                                           |
| Accent usage     | Logo image only; links use `hover:text-accent` |

**Pattern notes:**
Footer mirrors the navbar brand treatment and keeps links compact, token-colored, and aligned within the same 1280px page frame.

### Hero

File: `components/homepage/Hero.tsx`
Last updated: 2026-06-11

| Property         | Class                                                                             |
| ---------------- | --------------------------------------------------------------------------------- |
| Background       | `landing-gradient`, `bg-surface-muted`                                            |
| Border           | `border border-border`, `border-t border-border`                                  |
| Border radius    | image uses `rounded-xl`                                                           |
| Text - primary   | `text-text-black`                                                                 |
| Text - secondary | `text-text-secondary`                                                             |
| Spacing          | `px-6 pt-14`, `px-6 py-16`, `mt-6`, `mt-8 gap-3`                                  |
| Hover state      | `hover:bg-overlay-dark`, `hover:bg-surface-secondary`                             |
| Shadow           | `shadow-[0_24px_54px_color-mix(in_srgb,var(--color-info-muted)_30%,transparent)]` |
| Accent usage     | `bg-overlay text-accent-foreground`, `border-border bg-surface` secondary action  |

**Pattern notes:**
Hero sections use the shared `landing-gradient` CSS helper built from theme tokens. CTA pairs use the dark primary button plus bordered white secondary button.

### Homepage Split Sections

File: `components/homepage/HowItWorks.tsx`, `components/homepage/Features.tsx`
Last updated: 2026-06-11

| Property         | Class                                                        |
| ---------------- | ------------------------------------------------------------ |
| Background       | `bg-surface`, `bg-surface-muted`, `landing-stripes`          |
| Border           | `border-t border-border`, `border-b border-border`           |
| Border radius    | images use `rounded-xl`                                      |
| Text - primary   | `text-text-slate`                                            |
| Text - secondary | `text-text-secondary`                                        |
| Spacing          | `px-8 py-8`, `px-8 py-12`, `px-6 py-16`, `h-16`              |
| Hover state      | none                                                         |
| Shadow           | `shadow-sm`                                                  |
| Accent usage     | `border-l-4 border-l-accent`, `border-l-4 border-l-success` |

**Pattern notes:**
Homepage content sections use two-column framed layouts with token-muted media panels and white text panels. The active content row is signaled by a 4px token-colored left border.

### Testimonial

File: `components/homepage/Testimonial.tsx`
Last updated: 2026-06-11

| Property         | Class                                  |
| ---------------- | -------------------------------------- |
| Background       | inherited `bg-surface`                 |
| Border           | none                                   |
| Border radius    | avatar uses `rounded-md`               |
| Text - primary   | `text-text-slate`, `text-text-primary` |
| Text - secondary | `text-text-secondary`                  |
| Spacing          | `px-6 py-24`, `mt-6`, `mt-8 gap-3`     |
| Hover state      | none                                   |
| Shadow           | none                                   |
| Accent usage     | `text-accent` label                    |

**Pattern notes:**
Testimonials use centered copy, token accent eyebrow text, and compact author metadata. No letter-spacing utility is used.

### Final CTA

File: `components/homepage/FinalCta.tsx`
Last updated: 2026-06-11

| Property         | Class                                                 |
| ---------------- | ----------------------------------------------------- |
| Background       | `landing-gradient`, `landing-stripes`                 |
| Border           | `border-y border-border`                              |
| Border radius    | buttons use `rounded-md`                              |
| Text - primary   | `text-text-black`                                     |
| Text - secondary | `text-text-secondary`                                 |
| Spacing          | `px-6 py-20`, `mt-6`, `mt-8 gap-3`, `h-16`            |
| Hover state      | `hover:bg-overlay-dark`, `hover:bg-surface-secondary` |
| Shadow           | secondary button uses `shadow-sm`                     |
| Accent usage     | same CTA pair as Hero                                 |

**Pattern notes:**
Final CTA reuses the hero gradient and button pair so landing page entry and exit actions feel like the same system.

### Login Page

File: `app/(auth)/login/page.tsx`
Last updated: 2026-06-12

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-background`, card uses `bg-surface`                               |
| Border           | `border border-border`                                                |
| Border radius    | `rounded-xl`, buttons use `rounded-md`                                |
| Text - primary   | `text-text-primary`                                                   |
| Text - secondary | `text-text-secondary`                                                 |
| Spacing          | `px-6 py-12`, card `p-6`, `space-y-2`, `mt-8 space-y-3`               |
| Hover state      | `hover:bg-surface-secondary`, `hover:bg-accent-dark`                  |
| Shadow           | `shadow-sm`                                                           |
| Accent usage     | `text-accent` eyebrow, `bg-accent text-accent-foreground` primary CTA |

**Pattern notes:**
Auth pages use a centered single card on the tokenized page background. OAuth actions are full-width 44px buttons, with secondary white and primary accent variants matching existing button tokens. Inline auth errors and setup warnings use `rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm font-medium leading-5 text-error`.

### Protected Route Shells

File: `app/dashboard/page.tsx`, `app/profile/page.tsx`, `app/find-jobs/page.tsx`, `app/find-jobs/[id]/page.tsx`
Last updated: 2026-06-11

| Property         | Class                                           |
| ---------------- | ----------------------------------------------- |
| Background       | `bg-background`, content card uses `bg-surface` |
| Border           | `border border-border`                          |
| Border radius    | `rounded-xl`                                    |
| Text - primary   | `text-text-primary`                             |
| Text - secondary | `text-text-secondary`                           |
| Spacing          | `px-8 py-8`, card `p-6`, heading `mt-2`         |
| Hover state      | none                                            |
| Shadow           | `shadow-sm`                                     |
| Accent usage     | none                                            |

**Pattern notes:**
Temporary protected page shells use the standard white card on `bg-background` pattern and should be replaced by each feature's full UI without changing the route-level auth check.

### App Header

File: `components/layout/AppHeader.tsx`
Last updated: 2026-06-12

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`, logout button uses `bg-surface`                         |
| Border           | `border-b border-border`, active nav uses `border-b-4 border-accent` |
| Border radius    | logout button uses `rounded-md`                                       |
| Text - primary   | `text-text-dark`, active `text-accent`, logout `text-text-primary`    |
| Text - secondary | inactive icons use `text-text-muted`                                  |
| Spacing          | `h-16 px-10 gap-16`, logout button `px-4 py-2`                        |
| Hover state      | `hover:text-accent`, logout button `hover:bg-surface-secondary`       |
| Shadow           | none                                                                  |
| Accent usage     | active route uses `border-accent text-accent`; nav hover uses accent  |

**Pattern notes:**
Authenticated app routes use the same 64px white top-nav frame as the public navbar. The header accepts `activeHref` for icon + text active states and `showSignOut` for screenshot-specific mockups. The logout action is rendered by `SignOutButton`, uses the same secondary bordered button classes, resets PostHog on click, and submits the Server Action form.

### PostHog Identity

File: `components/analytics/PostHogIdentity.tsx`
Last updated: 2026-06-12

| Property         | Class |
| ---------------- | ----- |
| Background       | none  |
| Border           | none  |
| Border radius    | none  |
| Text - primary   | none  |
| Text - secondary | none  |
| Spacing          | none  |
| Hover state      | none  |
| Shadow           | none  |
| Accent usage     | none  |

**Pattern notes:**
Invisible client component mounted inside authenticated headers. It calls PostHog identify with the authenticated user ID and renders no UI.

### Sign Out Button

File: `components/analytics/SignOutButton.tsx`
Last updated: 2026-06-12

| Property         | Class                                                           |
| ---------------- | --------------------------------------------------------------- |
| Background       | `bg-surface`                                                    |
| Border           | `border border-border`                                          |
| Border radius    | `rounded-md`                                                    |
| Text - primary   | `text-text-primary`                                             |
| Text - secondary | none                                                            |
| Spacing          | `px-4 py-2`                                                     |
| Hover state      | `hover:bg-surface-secondary`                                    |
| Shadow           | none                                                            |
| Accent usage     | none                                                            |

**Pattern notes:**
Client wrapper around the logout Server Action. It preserves the authenticated header's secondary button style and calls PostHog reset before submit.

### Profile Attention Banner

File: `components/profile/ProfileAttentionBanner.tsx`
Last updated: 2026-06-16

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`                                                          |
| Border           | `border border-error/20`                                              |
| Border radius    | `rounded-xl`, ring uses `rounded-full`, tags use `rounded-md`         |
| Text - primary   | `text-text-primary`                                                   |
| Text - secondary | `text-text-dark`                                                      |
| Spacing          | `p-14`, `gap-10`, `mt-7`, `mt-8`, tag `px-4 py-2`                    |
| Hover state      | none                                                                  |
| Shadow           | `shadow-sm`                                                           |
| Accent usage     | `text-error`, `bg-error/5`, SVG ring uses `var(--color-error)`        |

**Pattern notes:**
Incomplete profile warnings use a white card with a subtle token-error border, token-error tags, and an SVG completion ring driven by saved completion percentage. The banner now renders real missing fields from the profile record and should be omitted when `is_complete` is true.

### Resume Upload Card

File: `components/profile/ResumeSection.tsx`
Last updated: 2026-06-18

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`, upload area uses `bg-surface-secondary`                 |
| Border           | `border border-border`, upload area uses `border-2 border-dashed`     |
| Border radius    | `rounded-xl`, upload icon uses `rounded-full`                         |
| Text - primary   | `text-text-primary`, buttons use `text-text-dark` / `text-accent-foreground` |
| Text - secondary | `text-text-secondary`                                                 |
| Spacing          | `p-14`, `mt-12`, `px-6 py-16`, buttons `px-9 py-5`, action group `gap-4` |
| Hover state      | `hover:bg-surface-secondary`, `hover:bg-accent-dark`                  |
| Shadow           | `shadow-sm`                                                           |
| Accent usage     | `text-accent`, `bg-accent text-accent-foreground`, extraction/generation status uses success/error tokens |

**Pattern notes:**
Resume upload keeps the page-card surface white and puts the drag/drop affordance inside a dashed secondary-surface panel. The upload control is a visually hidden `input[type="file"]` paired with a token-styled label matching the previous Select Resume button. On file selection, the component auto-submits the parent profile form, shows an uploading state with the selected file name, then shows `Uploaded {filename}` when the Server Action succeeds. When a resume URL exists, a bordered token-accent `View Current Resume` link appears inside the upload panel and opens `/api/resume/current` in a new tab so private storage is read through an authenticated app route, not by exposing the raw InsForge object URL. Feature 07 adds a secondary bordered `Extract from Resume` action in the footer action group when a current resume exists; it calls `/api/resume/extract`, shows `Extracting...` while pending, displays compact success/error status messages using the same token classes as profile form statuses, and fills the profile draft without saving. Feature 08 wires the accent `Generate Resume from Profile` action to `/api/resume/generate`; it shows `Generating...`, disables while a profile save/extract/generate operation is pending, displays compact success/error status messages, and reveals `View Current Resume` immediately after the generated PDF is saved.

### Profile Information Form

File: `components/profile/ProfileInformationForm.tsx`
Last updated: 2026-06-16

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`, nested work role panel uses `bg-surface-secondary`      |
| Border           | `border border-border`, section dividers use `border-t border-border` |
| Border radius    | `rounded-xl`                                                          |
| Text - primary   | `text-text-primary`, labels use `text-text-dark`                      |
| Text - secondary | `text-text-secondary`, placeholders use `placeholder:text-text-muted` |
| Spacing          | `p-14`, sections `mt-24 pt-24`, fields `mt-3`, grid `gap-x-9 gap-y-8` |
| Hover state      | `hover:bg-surface-tertiary`, `hover:bg-accent-dark`, `hover:text-accent-dark` |
| Shadow           | `shadow-sm`                                                           |
| Accent usage     | `focus:border-accent focus:ring-accent`, `bg-accent`, `text-accent`   |

**Pattern notes:**
Large form screens use two-column responsive grids, uppercase labels, 72px-tall controls, token focus rings, and full-width accent save buttons. Feature 06 keeps the visual layout but renders named inputs/selects from saved profile data, uses comma-separated list fields for array columns, and saves via the shared profile Server Action.

### Profile Form Shell

File: `components/profile/ProfileFormShell.tsx`
Last updated: 2026-06-17

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | none, status messages use `bg-success-lightest` or `bg-error/5`       |
| Border           | status messages use `border-success-light` or `border-error/20`       |
| Border radius    | status messages use `rounded-xl`                                      |
| Text - primary   | `text-success-foreground`, `text-error`                               |
| Text - secondary | none                                                                  |
| Spacing          | `space-y-14`, status `px-6 py-4`                                      |
| Hover state      | none                                                                  |
| Shadow           | none                                                                  |
| Accent usage     | none                                                                  |

**Pattern notes:**
Client wrapper around the profile Server Action. It preserves section spacing, shows one compact token-colored status message above the resume card after save attempts, and exposes the latest action result to nested profile controls through context. Feature 07 makes this shell the profile draft coordinator: it renders `ResumeSection` and `ProfileInformationForm`, stores extracted profile data in client state, and remounts `ProfileInformationForm` with a version key after extraction so uncontrolled input defaults visibly update before the user manually saves. After any save action returns a status message, the shell smooth-scrolls to the top of the page so the user sees the updated banner/status area.

### Resume Extraction API

File: `app/api/resume/extract/route.ts`, `agent/resume.ts`
Last updated: 2026-06-16

| Property         | Class |
| ---------------- | ----- |
| Background       | none  |
| Border           | none  |
| Border radius    | none  |
| Text - primary   | none  |
| Text - secondary | none  |
| Spacing          | none  |
| Hover state      | none  |
| Shadow           | none  |
| Accent usage     | none  |

**Pattern notes:**
Feature 07 introduced backend extraction only. The API route authenticates the user, downloads the saved private resume via `resume_pdf_key`, calls the resume extraction agent, and returns normalized draft profile data. It does not persist extracted fields; the existing profile save flow remains the only persistence path.

### Resume Generation API

File: `app/api/resume/generate/route.ts`, `agent/resumeGenerator.tsx`
Last updated: 2026-06-18

| Property         | Class |
| ---------------- | ----- |
| Background       | none  |
| Border           | none  |
| Border radius    | none  |
| Text - primary   | none  |
| Text - secondary | none  |
| Spacing          | none  |
| Hover state      | none  |
| Shadow           | none  |
| Accent usage     | none  |

**Pattern notes:**
Feature 08 introduced backend PDF generation only. The API route authenticates the user, reads the saved profile, calls the resume generation agent, uploads the generated PDF to the active private resume path, updates `resume_pdf_url` and `resume_pdf_key`, and revalidates `/profile`. The generation agent uses GPT-4o for structured resume content and `@react-pdf/renderer` for server-side PDF rendering.

### Profile Submit Button

File: `components/profile/ProfileSubmitButton.tsx`
Last updated: 2026-06-16

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-accent`                                                           |
| Border           | none                                                                  |
| Border radius    | `rounded-xl`                                                          |
| Text - primary   | `text-accent-foreground`                                              |
| Text - secondary | none                                                                  |
| Spacing          | `h-20 w-full`                                                         |
| Hover state      | `hover:bg-accent-dark`                                                |
| Shadow           | `shadow-sm`                                                           |
| Accent usage     | full-width primary action uses accent tokens                          |

**Pattern notes:**
Client submit button uses `useFormStatus()` to show `Saving Profile...` and apply `disabled:cursor-not-allowed disabled:opacity-70` while the profile Server Action is pending.

### Authenticated Header Active State

File: `components/layout/AppHeader.tsx`
Last updated: 2026-06-12

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`                                                          |
| Border           | `border-b border-border`, active nav uses `border-b-4 border-accent` |
| Border radius    | none                                                                  |
| Text - primary   | inactive `text-text-dark`, active `text-accent`                       |
| Text - secondary | inactive icons use `text-text-muted`                                  |
| Spacing          | `h-16 px-10 gap-16`, nav item `gap-3`                                 |
| Hover state      | `hover:text-accent`                                                   |
| Shadow           | none                                                                  |
| Accent usage     | `border-accent text-accent` for active route                          |

**Pattern notes:**
Authenticated headers can receive `activeHref` to render icon + text nav items with an accent underline. Profile hides logout only to match the provided mockup; other protected routes keep the existing sign-out action.

### Find Jobs Search Controls

File: `components/find-jobs/SearchControls.tsx`
Last updated: 2026-06-19

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`, success banner uses `bg-success-lightest`, error banner uses `bg-error/5` |
| Border           | `border border-border`, success banner uses `border-success-light`, error banner uses `border-error/20` |
| Border radius    | `rounded-xl`, success banner uses `rounded-md`                        |
| Text - primary   | `text-text-primary`, button uses `text-accent-foreground`, error uses `text-error` |
| Text - secondary | `text-text-dark`, placeholders use `placeholder:text-text-muted`      |
| Spacing          | `p-8`, inputs `h-14 px-4`, button `h-14 px-8`, banner `mt-5 px-5`     |
| Hover state      | `hover:bg-accent-dark`, disabled uses `disabled:cursor-not-allowed disabled:opacity-70` |
| Shadow           | `shadow-sm`                                                           |
| Accent usage     | `bg-accent text-accent-foreground`, success status uses success tokens |

**Pattern notes:**
Find Jobs search controls use a wide white card matching the screenshot, with uppercase field labels, large rounded inputs, an accent search button, and a compact status banner below the controls. Feature 10 made this a client form that posts to `/api/agent/find`, shows `Finding...` while pending, renders success or user-safe error messages with token-colored status styles, and navigates to `/find-jobs?runId={id}` after a successful search so the server-rendered jobs table shows that search's saved results.

### Find Jobs Filter Toolbar

File: `components/find-jobs/JobFilters.tsx`
Last updated: 2026-06-19

| Property         | Class                                                            |
| ---------------- | ---------------------------------------------------------------- |
| Background       | `bg-surface`                                                     |
| Border           | `border border-border`, divider uses `bg-border`                 |
| Border radius    | `rounded-xl`, dropdown buttons use `rounded-md`                  |
| Text - primary   | `text-text-primary`                                              |
| Text - secondary | `text-text-muted`, dropdown icons use `text-text-secondary`      |
| Spacing          | `px-6 py-3`, search `h-12 gap-3`, selects `h-12 px-4 pr-11`, actions `h-12 px-5` |
| Hover state      | `hover:bg-surface-secondary`, primary action uses `hover:bg-accent-dark` |
| Shadow           | `shadow-sm`                                                      |
| Accent usage     | `bg-accent text-accent-foreground`, `focus:border-accent focus:ring-accent` |

**Pattern notes:**
Filter bars use one compact white toolbar with a left search field, a token border divider, and secondary select-style controls on the right. Feature 11 makes the toolbar a GET form targeting `/find-jobs`: text search writes `q`, match filter writes `filter`, sort writes `sort`, and the form preserves `runId` after a completed search. The Apply action uses the accent button pattern and Clear returns to the unfiltered view while preserving the active run scope.

### Find Jobs Table

File: `components/find-jobs/JobsTable.tsx`, `components/find-jobs/JobsPagination.tsx`
Last updated: 2026-06-19

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`, header uses `bg-surface-secondary`                      |
| Border           | `border border-border`, rows use `border-t border-border`             |
| Border radius    | outer card uses `rounded-xl`, logo placeholders and buttons use `rounded-md` |
| Text - primary   | `text-text-primary`, row body uses `text-text-dark`                   |
| Text - secondary | `text-text-secondary`, disabled pagination uses `text-text-muted`     |
| Spacing          | header/rows `px-10 py-6`, pagination `px-8 py-5`, row icon `h-11 w-11` |
| Hover state      | `hover:bg-surface-secondary`                                         |
| Shadow           | outer card uses `shadow-sm`, pagination buttons use `shadow-sm`       |
| Accent usage     | score bars use `bg-success`, `bg-info-medium`, `bg-warning`; active page uses `bg-accent-muted text-accent` |

**Pattern notes:**
Feature 09 job rows follow the screenshot rather than the build-plan table text: columns are Company, Role, Match Score, Salary Est., and Date Found, with no Source column. Feature 10 renders the signed-in user's saved search jobs from InsForge instead of mock data, scopes the table to the active `runId` query param after each completed search, shows an empty state before saved matches exist, and links each row to `/find-jobs/{id}`. Feature 11 wires the footer pagination to query params, preserves `runId`, `q`, `filter`, and `sort` across page links, shows accurate `Showing X to Y of Z` counts for 20-row pages, and displays a compact `Jobs by Adzuna` credit below the count. Match bars use token colors with bucketed static Tailwind width classes so dynamic scores can render without raw CSS values.

### Job Details Page

File: `app/find-jobs/[id]/page.tsx`, `components/job-details/*.tsx`
Last updated: 2026-06-19

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-background`, cards use `bg-surface`, secondary icon wells and preview notice use `bg-surface-secondary` |
| Border           | `border border-border`, company research header uses `border-b border-border` |
| Border radius    | cards and primary buttons use `rounded-xl`, skill badges use `rounded-full` |
| Text - primary   | headings and body use `text-text-primary`, actions use `text-accent-foreground`, errors use `text-error` |
| Text - secondary | labels and muted copy use `text-text-secondary`, `text-text-muted`    |
| Spacing          | page `px-8 py-12`, stack `space-y-7`, cards `p-7`, dossier body `space-y-8 p-7`, preview notice `mt-6 p-4`, badges `px-4 py-1` |
| Hover state      | `hover:text-accent`, `hover:bg-surface-secondary`, `hover:bg-accent-dark`, disabled action uses `disabled:cursor-not-allowed disabled:opacity-70` |
| Shadow           | cards and buttons use `shadow-sm`                                     |
| Accent usage     | match badge uses `bg-success-lightest text-success-foreground`; gap skills, dossier tags, bullets, and research icon use `bg-accent-muted text-accent` / `bg-accent`; primary actions use `bg-accent text-accent-foreground` |

**Pattern notes:**
Feature 12 uses a centered `max-w-[880px]` detail column on the app background. The header card pairs a square company placeholder with the job title, company name, match score pill, and a secondary external-post button. Info cards are compact white cards with token-tinted icon wells for salary, location, job type, and date found. Content sections are stacked white cards with 28px padding, bold compact section labels, and real DB text. Feature 13 keeps the Company Research header/action treatment, adds an inline pending/error client action, and renders the generated dossier as compact uppercase sections with token accent tags, bullets, and source links. The job description card now shows a secondary-surface preview notice with a compact accent action when the saved source text appears truncated; successful loads refresh the server-rendered page.

### Job Description Source Link

File: `components/job-details/LoadFullDescriptionButton.tsx`
Last updated: 2026-06-19

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | notice uses `bg-surface-secondary`, action uses `bg-accent`, errors use `bg-error/5` |
| Border           | `border border-border`, errors use `border-error/20`                  |
| Border radius    | `rounded-xl`, errors use `rounded-md`                                 |
| Text - primary   | action uses `text-accent-foreground`, errors use `text-error`         |
| Text - secondary | preview note uses `text-text-secondary`                               |
| Spacing          | notice `mt-6 p-4`, action `h-11 px-5`, error `mt-3 px-3 py-2`         |
| Hover state      | `hover:bg-accent-dark`, disabled uses `disabled:cursor-not-allowed disabled:opacity-70` |
| Shadow           | action uses `shadow-sm`                                               |
| Accent usage     | compact primary action uses `bg-accent text-accent-foreground`        |

**Pattern notes:**
The source link is a recovery path for Adzuna preview snippets, not a generic card. It appears only when the saved/displayed description looks truncated and opens the saved source/apply URL in a new tab. Browserbase extraction was removed for this flow because Adzuna can return an Access Denied page to automated requests; the user should read the full original post at the source.

### Company Research API

File: `app/api/agent/research/route.ts`, `agent/research.ts`, `lib/browserbase.ts`
Last updated: 2026-06-19

| Property         | Class |
| ---------------- | ----- |
| Background       | none  |
| Border           | none  |
| Border radius    | none  |
| Text - primary   | none  |
| Text - secondary | none  |
| Spacing          | none  |
| Hover state      | none  |
| Shadow           | none  |
| Accent usage     | none  |

**Pattern notes:**
Feature 13 introduced backend research only for these files. The API route authenticates the user, loads owner-scoped job/profile data, saves the completed dossier to `jobs.company_research`, fires `company_researched`, and returns `{ success, data: { dossier } }`. The research agent owns Browserbase/Stagehand browsing and GPT-4o synthesis, always closes Stagehand in `finally`, and still synthesizes from job/profile data when browser research is thin or unavailable.

### Dashboard Page

File: `app/dashboard/page.tsx`
Last updated: 2026-06-19

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-background`                                                       |
| Border           | none at route level                                                   |
| Border radius    | none at route level                                                   |
| Text - primary   | inherited from dashboard components                                   |
| Text - secondary | inherited from dashboard components                                   |
| Spacing          | page `px-8 py-12`, content `max-w-[2360px] space-y-10`, chart grid `gap-10 xl:grid-cols-12` |
| Hover state      | none                                                                  |
| Shadow           | none at route level                                                   |
| Accent usage     | `AppHeader` uses `activeHref="/dashboard"`                            |

**Pattern notes:**
Feature 14 replaces the protected placeholder with the full mock dashboard from `context/designs/dashboard.png`. The route remains a Server Component and intentionally does not render the profile attention banner on `/dashboard`, because the uploaded dashboard design starts directly with the stat cards. Real stat, activity, and PostHog chart data remain deferred to Features 15-17.

### Dashboard Stats Bar

File: `components/dashboard/StatsBar.tsx`
Last updated: 2026-06-19

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | cards use `bg-surface`                                                |
| Border           | `border border-border`                                                |
| Border radius    | `rounded-xl`, trend badges use `rounded-sm`                           |
| Text - primary   | stat value uses `text-text-primary`                                   |
| Text - secondary | labels use `text-text-secondary`, helper text uses `text-text-muted`  |
| Spacing          | grid `gap-6`, card `p-8`, value `mt-2`, footer `mt-4 gap-3`           |
| Hover state      | none                                                                  |
| Shadow           | `shadow-sm`                                                           |
| Accent usage     | trend badges use `bg-success-lightest text-success-darker`            |

**Pattern notes:**
Dashboard stat cards are mock-only for Feature 14 and use the screenshot values: Total Jobs Found, Avg. Match Rate, Companies Researched, and Jobs This Week. The first two cards show compact square trend badges; the latter two show muted helper text only.

### Dashboard Recent Activity

File: `components/dashboard/RecentActivity.tsx`
Last updated: 2026-06-19

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`                                                          |
| Border           | `border border-border`, header uses `border-b border-border`         |
| Border radius    | `rounded-xl`, activity dots use `rounded-full`                        |
| Text - primary   | activity labels use `text-text-primary`                               |
| Text - secondary | timestamps use `text-text-muted`                                      |
| Spacing          | header `px-8 py-7`, body `px-8 py-8`, list `space-y-8`, rows `gap-6` |
| Hover state      | none                                                                  |
| Shadow           | `shadow-sm`                                                           |
| Accent usage     | dots use `bg-accent-light/bg-accent`, `bg-info-light/bg-info`, and `bg-success-light/bg-success-alt` |

**Pattern notes:**
The activity list uses a simple vertical timeline with token-colored dots and a subtle connector line. Feature 14 activity entries are mock strings and timestamps only; real activity merging is deferred to Feature 16.

### Dashboard Analytics Charts

File: `components/dashboard/AnalyticsCharts.tsx`
Last updated: 2026-06-19

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | chart cards use `bg-surface`                                          |
| Border           | `border border-border`, grid lines use `border-t border-dashed border-border` |
| Border radius    | cards use `rounded-xl`, bars use `rounded-md`                         |
| Text - primary   | chart titles use `text-text-primary`                                  |
| Text - secondary | axis labels use `text-text-muted`                                     |
| Spacing          | cards `p-8`, charts `mt-14`, plot area `h-72`, bar wells `left-14 right-0 gap-5`, labels `ml-14 mt-4` |
| Hover state      | none                                                                  |
| Shadow           | `shadow-sm`                                                           |
| Accent usage     | company bars use `bg-info`, match bars use `bg-success`, jobs line uses `text-accent` and token SVG stops |

**Pattern notes:**
Feature 14 charts are static mock visuals built with CSS and SVG instead of a charting dependency. The parent dashboard grid gives Company Research Activity `xl:col-span-6`, Jobs Found Over Time `xl:col-span-8`, and Match Score Distribution `xl:col-span-4` to match the screenshot's top-half and bottom two-thirds/one-third layout. Axis labels are normal-flow content below the plot area, not negatively positioned, so they stay inside their cards and score bucket labels use `whitespace-nowrap`.
