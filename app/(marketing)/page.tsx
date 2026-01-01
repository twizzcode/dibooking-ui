import { ComponentExample } from "@/components/component-example";
import CtaSection from "@/components/home/cta";
import Features from "@/components/home/features";
import { Footer } from "@/components/home/footer";
import Hero from "@/components/home/hero";
import Pricing from "@/components/home/pricing";
import Testimonials from "@/components/home/testimonials";

export default function Page() {
    return (
        <div>
            <Hero />
            <Features />
            <Testimonials />
            <Pricing />
            <CtaSection />
            <Footer />
        </div>
    );
}