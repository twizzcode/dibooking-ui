import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react"; // Pastikan install lucide-react

export default function CtaSection() {
  return (
    <div className="min-h-screen max-w-(--breakpoint-xl) w-full mx-auto px-6 flex items-center justify-center">
      <div className="bg-primary w-full overflow-hidden rounded-xl pt-16 lg:pl-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          
          {/* Kolom Kiri: Teks */}
          <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-between gap-4 px-6 text-center lg:max-w-full lg:items-start lg:gap-8 lg:px-0 lg:pb-16 lg:text-left">
            <div className="section-title-gap-lg flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="text-primary-foreground/80 flex w-fit items-center justify-center gap-1 bg-transparent text-sm font-medium capitalize [&_svg]:size-3.5 [&_svg]:shrink-0">
                CTA Section
              </div>
              <h2 id="cta-heading" className="heading-lg text-primary-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                Action-driving headline that creates urgency
              </h2>
            </div>
            
            <div className="flex flex-col items-center gap-6 lg:items-start">
              <p className="text-primary-foreground/80 text-lg/8 text-pretty">
                Add one or two compelling sentences that reinforce your main value proposition and overcome final objections.
              </p>
              
              {/* Tombol menggunakan komponen UI */}
              <Button 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-9 px-4 py-2"
                aria-label="Get started with our service"
              >
                Get started <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>

          {/* Kolom Kanan: Gambar */}
          <div className="w-full flex-1 pl-6 lg:pl-0">
            {/* Wrapper Aspect Ratio */}
            <div className="relative w-full pb-[75%]"> 
              <div className="absolute inset-0">
                <img
                  alt="CTA section image"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full rounded-tl-lg object-cover"
                  src="https://ui.shadcn.com/placeholder.svg"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}