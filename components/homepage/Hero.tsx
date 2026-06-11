import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="px-6 pt-14 md:px-16">
      <div className="overflow-hidden border border-border">
        <div className="landing-gradient px-6 py-16 text-center md:py-20">
          <h1 className="mx-auto max-w-[720px] text-[40px] font-bold leading-[46px] text-text-black md:text-[56px] md:leading-[62px]">
            Job hunting is hard. Your tools shouldn&apos;t be.
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] text-sm font-medium leading-5 text-text-secondary md:text-base md:leading-6">
            Stop applying blind. JobPilot finds the jobs, researches the companies, and
            gives you everything you need to stand out.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="rounded-md bg-overlay px-6 py-3 text-sm font-medium leading-5 text-accent-foreground transition hover:bg-overlay-dark"
            >
              Get Started &gt;
            </Link>
            <Link
              href="/find-jobs"
              className="rounded-md border border-border bg-surface px-6 py-3 text-sm font-medium leading-5 text-text-primary shadow-sm transition hover:bg-surface-secondary"
            >
              Find Your First Match
            </Link>
          </div>
        </div>
        <div className="border-t border-border bg-surface-muted px-6 py-12 md:px-16 md:py-14">
          <Image
            src="/images/dashboard-demo.png"
            alt="JobPilot dashboard preview"
            width={2048}
            height={1229}
            priority
            className="mx-auto w-full max-w-[1010px] rounded-xl shadow-[0_24px_54px_color-mix(in_srgb,var(--color-info-muted)_30%,transparent)]"
          />
        </div>
      </div>
    </section>
  );
}
