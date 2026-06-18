"use client";

import { resetPostHog } from "@/lib/posthog-client";

type Props = {
  action: () => Promise<void>;
};

export function SignOutButton({ action }: Props) {
  return (
    <form action={action}>
      <button
        type="submit"
        onClick={resetPostHog}
        className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium leading-5 text-text-primary transition hover:bg-surface-secondary"
      >
        Log out
      </button>
    </form>
  );
}
