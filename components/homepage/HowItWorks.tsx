import Image from "next/image";

const steps = [
  {
    title: "Find jobs that actually fit",
    description:
      "Search by title and location or paste a job link. Get matched roles you can quickly scan.",
  },
  {
    title: "Know the Company Before You Apply",
    description:
      "Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.",
  },
  {
    title: "Keep track of every application",
    description:
      "Keep a clear view of every job you've found, tailored. Your activity and progress all stay in one simple place.",
  },
];

export function HowItWorks() {
  return (
    <section className="grid border-t border-border md:grid-cols-[1fr_1fr]">
      <div>
        <div className="flex min-h-[200px] items-center border-b border-border px-8 py-12 md:px-16">
          <h2 className="max-w-[380px] text-[34px] font-bold leading-[39px] text-text-slate md:text-[42px] md:leading-[46px]">
            Manage Your Job Search With Ease
          </h2>
        </div>
        <div>
          {steps.map((step, index) => (
            <article
              key={step.title}
              className={`border-b border-border px-8 py-8 md:px-16 ${
                index === 0 ? "border-l-4 border-l-accent" : ""
              }`}
            >
              <h3 className="text-base font-semibold leading-6 text-text-slate">
                {step.title}
              </h3>
              <p className="mt-3 text-sm font-medium leading-6 text-text-secondary">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center bg-surface-muted px-6 py-16 md:px-8">
        <Image
          src="/images/jobs-lists.png"
          alt="Job match list preview"
          width={1829}
          height={1370}
          className="w-full max-w-[520px] rounded-xl shadow-sm"
        />
      </div>
    </section>
  );
}
