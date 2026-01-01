"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "../ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "../ui/animated-gradient-text";

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect langsung ke /{slug}
      router.push(`/${searchQuery.trim()}`);
    } else {
      // Jika kosong, ke search page
      router.push("/explore");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      <div className="max-w-(--breakpoint-xl) w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12 lg:py-0">
        <div className="my-auto space-y-4">
          <div className="mb-10">
            {/* <div className="group relative flex items-center mr-auto justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
              <span
                className={cn(
                  "animate-gradient absolute inset-0 block h-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                )}
                style={{
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box",
                }}
              />
              🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
              <AnimatedGradientText className="text-sm font-medium">
                Dibooking.id
              </AnimatedGradientText>
              <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </div> */}

            <Badge
              variant="secondary"
              className="rounded-full py-2 border-border"
              asChild
            >
              <Link href="#">
                Dibooking.id v1.0.0 <ArrowUpRight className="ml-1 size-4" />
              </Link>
            </Badge>
            <h1 className="mt-6 max-w-[17ch] text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-semibold leading-[1.2]! tracking-[-0.035em]">
              Booking Tempat atau Barang Favoritmu
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg text-foreground/80">
              Dibooking.id adalah platform manajemen booking yang
              memudahkan bisnis Anda dalam mengelola jadwal dan pelanggan dengan
              efisien.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 items-center justify-center">
            <InputGroup className="py-6 px-2 rounded-full">
              <InputGroupAddon>
                <InputGroupButton variant="secondary" className="rounded-full" size="icon-sm">
                  <Search className="h-6 w-6" />
                </InputGroupButton>
              </InputGroupAddon>
              <InputGroupInput
                placeholder="nama-brand"
                className="pl-1 placeholder:text-base placeholder:text-muted-foreground/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon>
                <InputGroupText className="text-foreground text-base">dibooking.id /</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Button className="text-base rounded-full bg-foreground py-6 px-8 border" type="submit">
              Search
            </Button>
          </form>

          {/* Popular Searches */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Try:</span>
            {[
              { label: "Cafe", slug: "cozy-coffee-shop" },
              { label: "Co-working", slug: "urban-workspace" },
              { label: "Gym", slug: "fitness-hub" },
              { label: "Salon", slug: "beauty-salon" },
            ].map((item) => (
              <Button
                key={item.slug}
                variant="outline"
                size="sm"
                className="rounded-full h-7 text-xs"
                onClick={() => {
                  router.push(`/${item.slug}`);
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="w-full aspect-video lg:aspect-auto lg:w-[1000px] lg:h-[calc(100vh-16rem)] bg-accent rounded-xl" />
      </div>
    </div>
  );
}
