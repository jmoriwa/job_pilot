import { redirect } from "next/navigation";
import { signInWithGithub, signInWithGoogle } from "@/actions/auth";
import { hasInsforgeConfig } from "@/lib/insforge-config";
import { createInsforgeServer } from "@/lib/insforge-server";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  exchange_failed: "We could not finish sign in. Please try again.",
  missing_verifier: "Your sign in session expired. Please start again.",
  missing_config: "InsForge environment variables are not configured yet.",
  oauth_failed: "The provider could not complete sign in.",
  oauth_start_failed: "We could not start sign in. Please try again.",
  unsupported_provider: "That sign in provider is not available.",
  unexpected: "Something went wrong. Please try again.",
};

export default async function LoginPage({ searchParams }: Props) {
  const isConfigured = hasInsforgeConfig();

  if (isConfigured) {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
    } = await insforge.auth.getCurrentUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  const params = await searchParams;
  const errorMessage = params.error ? errorMessages[params.error] : null;

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[1280px] items-center justify-center">
        <div className="w-full max-w-[420px] rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-medium leading-5 text-accent">JobPilot</p>
            <h1 className="text-2xl font-semibold leading-8 text-text-primary">
              Sign in to continue
            </h1>
            <p className="text-sm font-medium leading-5 text-text-secondary">
              Use your Google or GitHub account to start finding stronger job matches.
            </p>
          </div>

          {!isConfigured ? (
            <p className="mt-6 rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm font-medium leading-5 text-error">
              Add `NEXT_PUBLIC_INSFORGE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`, and
              `NEXT_PUBLIC_APP_URL` to `.env.local` before signing in.
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-6 rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm font-medium leading-5 text-error">
              {errorMessage}
            </p>
          ) : null}

          <div className="mt-8 space-y-3">
            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium leading-5 text-text-primary transition hover:bg-surface-secondary"
              >
                Continue with Google
              </button>
            </form>
            <form action={signInWithGithub}>
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-medium leading-5 text-accent-foreground transition hover:bg-accent-dark"
              >
                Continue with GitHub
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
