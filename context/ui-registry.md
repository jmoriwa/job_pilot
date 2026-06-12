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

| Property         | Class                                                           |
| ---------------- | --------------------------------------------------------------- |
| Background       | `bg-surface`, logout button uses `bg-surface`                   |
| Border           | `border-b border-border`, logout button uses `border border-border` |
| Border radius    | logout button uses `rounded-md`                                 |
| Text - primary   | `text-text-dark`, logout button uses `text-text-primary`        |
| Text - secondary | none                                                            |
| Spacing          | `h-16 px-6 gap-10`, logout button `px-4 py-2`                   |
| Hover state      | `hover:text-accent`, logout button `hover:bg-surface-secondary` |
| Shadow           | none                                                            |
| Accent usage     | nav links use `hover:text-accent`                               |

**Pattern notes:**
Authenticated app routes use the same 64px white top-nav frame as the public navbar. The logout action is a secondary bordered button backed by a Server Action form.
