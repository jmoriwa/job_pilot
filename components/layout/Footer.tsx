import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Condition", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-surface">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 border-x border-border px-8 py-14 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={122}
            height={38}
            className="h-8 w-auto"
          />
        </Link>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium leading-5 text-text-dark transition hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
