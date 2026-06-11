import Link from "next/link";

export function FinalCta() {
  return (
    <section>
      <div className="landing-stripes h-16 border-y border-border" />
      <div className="landing-gradient px-6 py-20 text-center md:py-24">
        <h2 className="mx-auto max-w-[760px] text-[38px] font-bold leading-[44px] text-text-black md:text-[50px] md:leading-[56px]">
          Your next job search can feel a lot less overwhelming
        </h2>
        <p className="mx-auto mt-6 max-w-[620px] text-sm font-medium leading-5 text-text-secondary md:text-base md:leading-6">
          Set up your profile, upload your resume, and start finding matches in
          minutes.
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
      <div className="landing-stripes h-16 border-y border-border" />
    </section>
  );
}
