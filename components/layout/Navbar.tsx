import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Find Jobs", href: "/find-jobs" },
  { label: "Profile", href: "/profile" },
];

export function Navbar() {
  return (
    <header className="h-16 border-b border-border bg-surface">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={122}
            height={38}
            priority
            className="h-8 w-auto"
          />
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium leading-5 text-text-dark transition hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="rounded-md bg-overlay px-4 py-2 text-sm font-medium leading-5 text-accent-foreground transition hover:bg-overlay-dark"
        >
          Start for free
        </Link>
      </div>
    </header>
  );
}
