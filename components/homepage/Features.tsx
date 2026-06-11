import Image from "next/image";

const features = [
  {
    title: "Understand your match score",
    description:
      "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what's missing.",
  },
  {
    title: "AI-Powered Job Matching",
    description:
      "Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.",
  },
  {
    title: "Focus on the right roles",
    description:
      "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.",
  },
];

export function Features() {
  return (
    <section>
      <div className="landing-stripes h-16 border-y border-border" />
      <div className="grid md:grid-cols-[1fr_1fr]">
        <div className="flex items-center justify-center bg-surface-muted px-6 py-16 md:px-12">
          <Image
            src="/images/agnet-log.png"
            alt="JobPilot agent log preview"
            width={1781}
            height={1373}
            className="w-full max-w-[480px] rounded-xl shadow-sm"
          />
        </div>
        <div>
          <div className="flex min-h-[230px] items-center border-b border-border px-8 py-12 md:px-16">
            <h2 className="max-w-[480px] text-[34px] font-bold leading-[39px] text-text-slate md:text-[42px] md:leading-[46px]">
              Apply With More Confidence, Every Time
            </h2>
          </div>
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`border-b border-border px-8 py-8 md:px-16 ${
                index === 1 ? "border-l-4 border-l-success" : ""
              }`}
            >
              <h3 className="text-base font-semibold leading-6 text-text-slate">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm font-medium leading-6 text-text-secondary">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
      <div className="landing-stripes h-16 border-b border-border" />
    </section>
  );
}
