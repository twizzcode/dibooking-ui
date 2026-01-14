"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Users, Sparkle } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BrandSummary {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  logoImage: string | null;
  plan: "FREE" | "BASIC" | "PRO";
  reviewCount?: number;
  _count: {
    products: number;
    bookings: number;
  };
}

interface BookingSummary {
  id: string;
  bookingCode: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  customerName: string;
  product?: {
    id: string;
    name: string;
  };
}

interface OwnerSummary {
  name: string;
  email: string;
}

const statusConfig: Record<
  string,
  { label: string; variant: "outline" | "default" | "destructive" }
> = {
  PENDING: { label: "Menunggu", variant: "outline" },
  CONFIRMED: { label: "Dikonfirmasi", variant: "default" },
  COMPLETED: { label: "Selesai", variant: "default" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [brand, setBrand] = useState<BrandSummary | null>(null);
  const [owner, setOwner] = useState<OwnerSummary | null>(null);
  const [bookings, setBookings] = useState<BookingSummary[]>([]);

  useEffect(() => {
    setIsOnboardingOpen(searchParams.get("onboard") === "1");
  }, [searchParams]);

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    router.replace("/dashboard");
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          setOwner({
            name: session.data.user.name,
            email: session.data.user.email,
          });
        }

        const brandRes = await fetch("/api/brands/my-brand");
        const brandData = await brandRes.json();
        if (!brandRes.ok) {
          throw new Error(brandData.error || "Gagal memuat brand");
        }
        if (!brandData.brand) {
          setBrand(null);
          setBookings([]);
          return;
        }
        setBrand(brandData.brand);

        const bookingsRes = await fetch(
          `/api/bookings?brandId=${brandData.brand.id}&limit=200`
        );
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsRes.ok ? bookingsData.bookings || [] : []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setBrand(null);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string; bookings: number; revenue: number }[] = [];
    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: format(d, "MMM", { locale: id }),
        bookings: 0,
        revenue: 0,
      });
    }

    const validStatus = (status: string) => status !== "CANCELLED";
    const paidStatus = (status: string) =>
      status === "CONFIRMED" || status === "COMPLETED";

    for (const booking of bookings) {
      if (!validStatus(booking.status)) continue;
      const date = new Date(booking.startDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const month = months.find((item) => item.key === key);
      if (!month) continue;
      month.bookings += 1;
      if (paidStatus(booking.status)) {
        month.revenue += booking.totalPrice || 0;
      }
    }

    const totalRevenue = months.reduce((sum, item) => sum + item.revenue, 0);
    return { months, totalRevenue };
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    const now = new Date();
    return bookings
      .filter((booking) => new Date(booking.startDate) >= now && booking.status !== "CANCELLED")
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, 5);
  }, [bookings]);

  const followerCount = brand?.reviewCount ?? 0;
  const currency = new Intl.NumberFormat("id-ID");

  return (
    <div className="flex flex-col h-full">
      <Dialog
        open={isOnboardingOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseOnboarding();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lengkapi Pengaturan Brand</DialogTitle>
            <DialogDescription>
              Supaya brand Anda siap menerima booking, lengkapi profil, jam
              operasional, dan kanal komunikasi di halaman Settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseOnboarding}>
              Nanti
            </Button>
            <Button onClick={() => router.push("/dashboard/settings")}>
              Atur Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 space-y-6">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">
              Memuat dashboard...
            </div>
          ) : !brand ? (
            <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed p-6">
              <p className="text-sm text-muted-foreground">
                Belum ada brand. Buat brand pertamamu.
              </p>
              <Button onClick={() => router.push("/become-provider")}>
                Buat Brand
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-muted/50 via-background to-muted/30 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4">
                    {brand.logoImage ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl border bg-background">
                        <Image
                          src={brand.logoImage}
                          alt={brand.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background text-lg font-semibold">
                        {brand.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkle className="h-3.5 w-3.5" />
                        Brand
                      </div>
                      <h2 className="text-2xl font-semibold">{brand.name}</h2>
                      {brand.location && (
                        <p className="text-sm text-muted-foreground">
                          {brand.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{brand.plan}</Badge>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dashboard/settings")}
                    >
                      Edit Brand
                    </Button>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-background/60 p-4">
                    <p className="text-xs text-muted-foreground">Produk</p>
                    <p className="text-lg font-semibold">
                      {brand._count.products}
                    </p>
                  </div>
                  <div className="rounded-xl bg-background/60 p-4">
                    <p className="text-xs text-muted-foreground">Booking</p>
                    <p className="text-lg font-semibold">
                      {brand._count.bookings}
                    </p>
                  </div>
                  <div className="rounded-xl bg-background/60 p-4">
                    <p className="text-xs text-muted-foreground">
                      Total Revenue
                    </p>
                    <p className="text-lg font-semibold">
                      Rp {stats.totalRevenue.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-background/60 p-4">
                    <p className="text-xs text-muted-foreground">Followers</p>
                    <p className="text-lg font-semibold">
                      {followerCount.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                <div className="space-y-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Booking Bulanan
                      </div>
                      <ChartContainer
                        className="h-56 rounded-lg"
                        config={{
                          bookings: {
                            label: "Booking",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                      >
                        <AreaChart data={stats.months}>
                          <defs>
                            <linearGradient id="booking-fill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-bookings)" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="var(--color-bookings)" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/40" />
                          <XAxis dataKey="label" className="text-xs" axisLine={false} tickLine={false} />
                          <YAxis className="text-xs" axisLine={false} tickLine={false} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                indicator="line"
                                formatter={(value) => [
                                  `${value} booking`,
                                  "Booking",
                                ]}
                              />
                            }
                          />
                          <Area
                            type="monotone"
                            dataKey="bookings"
                            stroke="var(--color-bookings)"
                            strokeWidth={2}
                            fill="url(#booking-fill)"
                            activeDot={{ r: 4 }}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Pendapatan Bulanan
                      </div>
                      <ChartContainer
                        className="h-56 rounded-lg"
                        config={{
                          revenue: {
                            label: "Revenue",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                      >
                        <BarChart data={stats.months}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/40" />
                          <XAxis dataKey="label" className="text-xs" axisLine={false} tickLine={false} />
                          <YAxis className="text-xs" axisLine={false} tickLine={false} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                indicator="line"
                                formatter={(value) => [
                                  `Rp ${currency.format(Number(value))}`,
                                  "Revenue",
                                ]}
                              />
                            }
                          />
                          <Bar
                            dataKey="revenue"
                            fill="var(--color-revenue)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={32}
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Tim Admin
                  </div>
                  {owner ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <div>
                          <p className="font-medium">{owner.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {owner.email}
                          </p>
                        </div>
                        <Badge variant="outline">Owner</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tambah admin dari menu Settings.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Data owner belum tersedia.
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Booking Mendatang</h3>
                  <Button
                    variant="link"
                    onClick={() => router.push("/dashboard/bookings")}
                  >
                    Lihat semua
                  </Button>
                </div>
                {upcomingBookings.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                    Belum ada booking mendatang.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => {
                      const status =
                        statusConfig[booking.status] || statusConfig.PENDING;
                      return (
                        <div
                          key={booking.id}
                          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4 last:border-b-0 last:pb-0"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {booking.customerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.product?.name || "Produk"} •{" "}
                              {booking.bookingCode}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(booking.startDate), "dd MMM yyyy", {
                                locale: id,
                              })}{" "}
                              -{" "}
                              {format(new Date(booking.endDate), "dd MMM yyyy", {
                                locale: id,
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={status.variant}>{status.label}</Badge>
                            <span className="text-sm font-semibold">
                              Rp {booking.totalPrice.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
