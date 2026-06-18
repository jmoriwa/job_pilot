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
Last updated: 2026-06-16

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
| Accent usage     | `text-accent`, `bg-accent text-accent-foreground`, extraction status uses success/error tokens |

**Pattern notes:**
Resume upload keeps the page-card surface white and puts the drag/drop affordance inside a dashed secondary-surface panel. The upload control is a visually hidden `input[type="file"]` paired with a token-styled label matching the previous Select Resume button. On file selection, the component auto-submits the parent profile form, shows an uploading state with the selected file name, then shows `Uploaded {filename}` when the Server Action succeeds. When a resume URL exists, a bordered token-accent `View Current Resume` link appears inside the upload panel and opens `/api/resume/current` in a new tab so private storage is read through an authenticated app route, not by exposing the raw InsForge object URL. Feature 07 adds a secondary bordered `Extract from Resume` action in the footer action group when a current resume exists; it calls `/api/resume/extract`, shows `Extracting...` while pending, displays compact success/error status messages using the same token classes as profile form statuses, and fills the profile draft without saving. The generate action remains presentational until Feature 08.

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
