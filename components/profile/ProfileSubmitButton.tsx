"use client";

import { useFormStatus } from "react-dom";

export function ProfileSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-20 w-full rounded-xl bg-accent text-2xl font-bold leading-8 text-accent-foreground shadow-sm transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Saving Profile..." : "Save Profile"}
    </button>
  );
}
