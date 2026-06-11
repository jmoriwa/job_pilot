import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { FinalCta } from "@/components/homepage/FinalCta";
import { Features } from "@/components/homepage/Features";
import { Hero } from "@/components/homepage/Hero";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Testimonial } from "@/components/homepage/Testimonial";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-[1280px] border-x border-border bg-surface">
        <Hero />
        <HowItWorks />
        <Features />
        <Testimonial />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
