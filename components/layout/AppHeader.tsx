import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/actions/auth";
import { PostHogIdentity } from "@/components/analytics/PostHogIdentity";
import { SignOutButton } from "@/components/analytics/SignOutButton";

type Props = {
  userId: string;
  activeHref?: string;
  showSignOut?: boolean;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path
          d="M5 5h5v5H5V5Zm9 0h5v5h-5V5ZM5 14h5v5H5v-5Zm9 0h5v5h-5v-5Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: "Find Jobs",
    href: "/find-jobs",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path
          d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/profile",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path
          d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

export function AppHeader({ userId, activeHref, showSignOut = true }: Props) {
  return (
    <header className="h-16 border-b border-border bg-surface">
      <PostHogIdentity userId={userId} />
      <div className="mx-auto flex h-full max-w-[2560px] items-center justify-between px-10">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={122}
            height={38}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <nav aria-label="Main navigation" className="hidden h-full items-center gap-16 md:flex">
          {navItems.map((item) => {
            const isActive = item.href === activeHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-full items-center gap-3 border-b-4 text-base font-semibold leading-6 transition hover:text-accent ${
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-text-dark"
                }`}
              >
                <span className={isActive ? "text-accent" : "text-text-muted"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        {showSignOut ? <SignOutButton action={signOut} /> : null}
      </div>
    </header>
  );
}
