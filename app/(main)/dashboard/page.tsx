"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Calendar,
  Eye,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ArrowUpRight,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Mock data
const stats = {
  totalBookings: 156,
  totalRevenue: 45600000,
  totalViews: 3420,
  pendingBookings: 8,
  bookingsGrowth: 12.5,
  revenueGrowth: 18.3,
  viewsGrowth: 8.7,
  pendingGrowth: -15.2,
};

const bookingTrendsData = [
  { month: "Jul", bookings: 45, revenue: 12500000 },
  { month: "Agu", bookings: 52, revenue: 15200000 },
  { month: "Sep", bookings: 48, revenue: 13800000 },
  { month: "Okt", bookings: 61, revenue: 17500000 },
  { month: "Nov", bookings: 55, revenue: 16200000 },
  { month: "Des", bookings: 68, revenue: 19800000 },
  { month: "Jan", bookings: 72, revenue: 21400000 },
];

const recentActivities = [
  {
    id: 1,
    type: "booking",
    user: "Ahmad Fauzi",
    product: "Aula Serbaguna Masjid Al-Ikhlas",
    action: "Booking baru",
    date: new Date(2026, 0, 2, 14, 30),
    status: "pending",
  },
  {
    id: 2,
    type: "payment",
    user: "Siti Nurhaliza",
    product: "Ruang Meeting Lt. 2",
    action: "Pembayaran berhasil",
    date: new Date(2026, 0, 2, 12, 15),
    status: "paid",
  },
  {
    id: 3,
    type: "booking",
    user: "Budi Santoso",
    product: "Lapangan Futsal",
    action: "Booking baru",
    date: new Date(2026, 0, 2, 10, 45),
    status: "confirmed",
  },
  {
    id: 4,
    type: "cancellation",
    user: "Rina Wijaya",
    product: "Aula Pernikahan",
    action: "Booking dibatalkan",
    date: new Date(2026, 0, 1, 16, 20),
    status: "cancelled",
  },
  {
    id: 5,
    type: "booking",
    user: "Dewi Kusuma",
    product: "Ruang Seminar",
    action: "Booking baru",
    date: new Date(2026, 0, 1, 9, 10),
    status: "confirmed",
  },
];

const upcomingBookings = [
  {
    id: 1,
    customer: "Ahmad Fauzi",
    product: "Aula Serbaguna",
    date: new Date(2026, 0, 5),
    time: "08:00 - 17:00",
    price: 2700000,
    status: "confirmed",
  },
  {
    id: 2,
    customer: "Siti Nurhaliza",
    product: "Ruang Meeting",
    date: new Date(2026, 0, 6),
    time: "09:00 - 12:00",
    price: 450000,
    status: "pending",
  },
  {
    id: 3,
    customer: "Budi Santoso",
    product: "Lapangan Futsal",
    date: new Date(2026, 0, 7),
    time: "16:00 - 18:00",
    price: 200000,
    status: "confirmed",
  },
  {
    id: 4,
    customer: "Rina Wijaya",
    product: "Aula Pernikahan",
    date: new Date(2026, 0, 10),
    time: "14:00 - 22:00",
    price: 5000000,
    status: "confirmed",
  },
];

const activityTypeConfig = {
  booking: {
    icon: Calendar,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  payment: {
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  cancellation: {
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

const statusConfig = {
  pending: {
    label: "Menunggu",
    variant: "outline" as const,
  },
  confirmed: {
    label: "Dikonfirmasi",
    variant: "default" as const,
  },
  paid: {
    label: "Lunas",
    variant: "default" as const,
  },
  cancelled: {
    label: "Dibatalkan",
    variant: "destructive" as const,
  },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut ringkasan bisnis Anda hari ini.
        </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Booking
              </p>
              <p className="text-3xl font-bold">{stats.totalBookings}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  +{stats.bookingsGrowth}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs bulan lalu
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Pendapatan
              </p>
              <p className="text-3xl font-bold">
                Rp {(stats.totalRevenue / 1000000).toFixed(1)}jt
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  +{stats.revenueGrowth}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs bulan lalu
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Views</p>
              <p className="text-3xl font-bold">{stats.totalViews}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  +{stats.viewsGrowth}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs bulan lalu
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Menunggu Konfirmasi
              </p>
              <p className="text-3xl font-bold">{stats.pendingBookings}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600 rotate-180" />
                <span className="text-xs text-green-600 font-medium">
                  {stats.pendingGrowth}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs bulan lalu
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Trend Booking</h3>
            <p className="text-sm text-muted-foreground">
              Jumlah booking 7 bulan terakhir
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={bookingTrendsData}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBookings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Trend Pendapatan</h3>
            <p className="text-sm text-muted-foreground">
              Total pendapatan 7 bulan terakhir
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingTrendsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `${value / 1000000}jt`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={(value: number) =>
                  `Rp ${value.toLocaleString("id-ID")}`
                }
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity & Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Aktivitas Terbaru</h3>
              <p className="text-sm text-muted-foreground">
                Update terkini dari bisnis Anda
              </p>
            </div>
            <Button variant="ghost" size="sm">
              Lihat Semua
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const config = activityTypeConfig[activity.type];
              const ActivityIcon = config.icon;

              return (
                <div key={activity.id} className="flex gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}
                  >
                    <ActivityIcon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.user}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.action} - {activity.product}
                        </p>
                      </div>
                      <Badge
                        variant={statusConfig[activity.status].variant}
                        className="text-xs"
                      >
                        {statusConfig[activity.status].label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(activity.date, "dd MMM yyyy, HH:mm", {
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming Bookings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Booking Mendatang</h3>
              <p className="text-sm text-muted-foreground">
                Jadwal booking yang akan datang
              </p>
            </div>
            <Button variant="ghost" size="sm">
              Lihat Semua
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {booking.customer}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {booking.product}
                    </p>
                  </div>
                  <Badge
                    variant={statusConfig[booking.status].variant}
                    className="text-xs"
                  >
                    {statusConfig[booking.status].label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(booking.date, "dd MMM yyyy", { locale: id })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {booking.time}
                    </span>
                  </div>
                  <span className="font-semibold">
                    Rp {booking.price.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
        </div>
      </div>
    </div>
  );
}