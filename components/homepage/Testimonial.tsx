import Image from "next/image";

export function Testimonial() {
  return (
    <section className="px-6 py-24 text-center md:px-16">
      <p className="text-xs font-semibold uppercase leading-4 text-accent">
        Success Stories
      </p>
      <blockquote className="mx-auto mt-6 max-w-[780px] text-[26px] font-semibold leading-[36px] text-text-slate md:text-[30px] md:leading-[42px]">
        &ldquo;I used to spend my evenings copy-pasting resumes. Now I open my
        dashboard to see interviews waiting. It feels like cheating. Had 3 offers on
        the table simultaneously.&rdquo;
      </blockquote>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Image
          src="/images/user-icon.png"
          alt="Tom Wilson"
          width={48}
          height={48}
          className="h-10 w-10 rounded-md"
        />
        <div className="text-left">
          <p className="text-sm font-semibold leading-5 text-text-primary">Tom Wilson</p>
          <p className="text-xs font-normal leading-4 text-text-secondary">
            Junior Developer
          </p>
        </div>
      </div>
    </section>
  );
}
