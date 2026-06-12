"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearAuthCookies, createServerClient } from "@insforge/sdk/ssr";
import { hasInsforgeConfig } from "@/lib/insforge-config";

type OAuthProvider = "google" | "github";

const oauthProviders = new Set<OAuthProvider>(["google", "github"]);

function getAppUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export async function initiateOAuth(provider: OAuthProvider): Promise<void> {
  if (!oauthProviders.has(provider)) {
    redirect("/login?error=unsupported_provider");
  }

  if (!hasInsforgeConfig()) {
    redirect("/login?error=missing_config");
  }

  const insforge = createServerClient();
  const { data, error } = await insforge.auth.signInWithOAuth(provider, {
    redirectTo: new URL("/api/auth/callback", getAppUrl()).toString(),
    skipBrowserRedirect: true,
  });

  if (error || !data?.url || !data.codeVerifier) {
    console.error("[actions/auth]", error);
    redirect("/login?error=oauth_start_failed");
  }

  const cookieStore = await cookies();
  cookieStore.set("insforge_code_verifier", data.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  redirect(data.url);
}

export async function signInWithGoogle(): Promise<void> {
  await initiateOAuth("google");
}

export async function signInWithGithub(): Promise<void> {
  await initiateOAuth("github");
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();

  if (hasInsforgeConfig()) {
    const insforge = createServerClient({
      cookies: cookieStore,
    });
    const { error } = await insforge.auth.signOut();

    if (error) {
      console.error("[actions/auth]", error);
    }
  }

  clearAuthCookies(cookieStore);
  cookieStore.delete("insforge_csrf_token");

  redirect("/login");
}
