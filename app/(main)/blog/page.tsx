import { Footer } from "@/components/home/footer";
import { Construction, FileText } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-amber-50 via-white to-slate-50 p-8 sm:p-12">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-100/60 blur-2xl" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-slate-100/70 blur-2xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 text-sm font-medium text-amber-800 shadow-sm">
                  <Construction className="h-4 w-4" />
                  Sedang kami kerjakan
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    Coming Soon
                  </h1>
                  <p className="text-muted-foreground text-base sm:text-lg max-w-xl">
                    Blog Dibooking sedang dalam tahap pengembangan. Nanti di sini
                    kamu bisa baca tips, inspirasi event, dan update terbaru.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-lg border bg-white/80 px-4 py-3 text-sm">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-semibold">Under development</p>
                  </div>
                  <div className="rounded-lg border bg-white/80 px-4 py-3 text-sm">
                    <p className="text-xs text-muted-foreground">Perkiraan</p>
                    <p className="font-semibold">Update segera</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="mx-auto w-full max-w-sm rounded-2xl border bg-white/80 p-6 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Draft</p>
                      <p className="font-semibold">Artikel pertama</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="h-3 w-4/5 rounded-full bg-slate-200" />
                    <div className="h-3 w-full rounded-full bg-slate-200" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-200" />
                  </div>
                  <div className="mt-6 rounded-xl border border-dashed border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-800">
                    Konten sedang disusun dengan tim editorial.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
