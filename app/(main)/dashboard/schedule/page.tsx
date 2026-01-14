"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Calendar from "@/components/calendar/calendar";
import type { CalendarEvent } from "@/components/calendar/calendar-types";

interface Booking {
  id: string;
  productName: string;
  productLocation: string;
  customerName: string;
  customerPhone: string;
  customerOrganization?: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: "upcoming" | "completed" | "cancelled" | "pending";
  bookingCode: string;
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "failed";
  notes?: string;
}

// Mock data
const mockBookings: Booking[] = [
  {
    id: "1",
    productName: "Aula Serbaguna",
    productLocation: "Lantai 1",
    customerName: "Ahmad Fauzi",
    customerPhone: "081234567890",
    customerOrganization: "PT Maju Bersama",
    startDate: new Date(2026, 0, 5),
    endDate: new Date(2026, 0, 5),
    startTime: "08:00",
    endTime: "17:00",
    duration: 9,
    totalPrice: 2700000,
    status: "upcoming",
    bookingCode: "BKG-2026-001",
    paymentMethod: "Bank BCA",
    paymentStatus: "paid",
    notes: "Acara seminar perusahaan",
  },
  {
    id: "2",
    productName: "Ruang Meeting",
    productLocation: "Lantai 2",
    customerName: "Siti Nurhaliza",
    customerPhone: "081987654321",
    startDate: new Date(2026, 0, 6),
    endDate: new Date(2026, 0, 6),
    startTime: "09:00",
    endTime: "12:00",
    duration: 3,
    totalPrice: 450000,
    status: "pending",
    bookingCode: "BKG-2026-002",
    paymentMethod: "GoPay",
    paymentStatus: "pending",
  },
  {
    id: "3",
    productName: "Lapangan Futsal",
    productLocation: "Area Outdoor",
    customerName: "Budi Santoso",
    customerPhone: "081555666777",
    startDate: new Date(2026, 0, 7),
    endDate: new Date(2026, 0, 7),
    startTime: "16:00",
    endTime: "18:00",
    duration: 2,
    totalPrice: 200000,
    status: "upcoming",
    bookingCode: "BKG-2026-003",
    paymentMethod: "Bank Mandiri",
    paymentStatus: "paid",
  },
  {
    id: "4",
    productName: "Aula Pernikahan",
    productLocation: "Lantai 1",
    customerName: "Rina Wijaya",
    customerPhone: "081444555666",
    customerOrganization: "Keluarga Wijaya",
    startDate: new Date(2026, 0, 10),
    endDate: new Date(2026, 0, 10),
    startTime: "14:00",
    endTime: "22:00",
    duration: 8,
    totalPrice: 5000000,
    status: "upcoming",
    bookingCode: "BKG-2026-004",
    paymentMethod: "Bank BCA",
    paymentStatus: "paid",
    notes: "Resepsi pernikahan",
  },
  {
    id: "5",
    productName: "Ruang Seminar",
    productLocation: "Lantai 3",
    customerName: "Dewi Kusuma",
    customerPhone: "081222333444",
    startDate: new Date(2026, 0, 12),
    endDate: new Date(2026, 0, 12),
    startTime: "13:00",
    endTime: "17:00",
    duration: 4,
    totalPrice: 1000000,
    status: "upcoming",
    bookingCode: "BKG-2026-005",
    paymentMethod: "Bank BCA",
    paymentStatus: "paid",
  },
];

const statusConfig = {
  upcoming: {
    label: "Akan Datang",
    icon: Clock,
    variant: "default" as const,
    color: "bg-blue-500",
  },
  completed: {
    label: "Selesai",
    icon: CheckCircle2,
    variant: "secondary" as const,
    color: "bg-green-500",
  },
  cancelled: {
    label: "Dibatalkan",
    icon: XCircle,
    variant: "destructive" as const,
    color: "bg-red-500",
  },
  pending: {
    label: "Menunggu",
    icon: AlertCircle,
    variant: "outline" as const,
    color: "bg-orange-500",
  },
};

const paymentStatusConfig = {
  paid: { label: "Lunas", color: "text-green-600" },
  pending: { label: "Menunggu Pembayaran", color: "text-orange-600" },
  failed: { label: "Gagal", color: "text-red-600" },
};

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mode, setMode] = useState<"month" | "week">("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterProduct, setFilterProduct] = useState<string>("all");

  const filteredBookings = useMemo(() => {
    return mockBookings.filter(
      (booking) =>
        filterProduct === "all" || booking.productName === filterProduct
    );
  }, [filterProduct]);

  const bookingById = useMemo(() => {
    return new Map(filteredBookings.map((booking) => [booking.id, booking]));
  }, [filteredBookings]);

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  };

  const products = Array.from(new Set(mockBookings.map((b) => b.productName)));

  const statusColorMap: Record<Booking["status"], CalendarEvent["color"]> = {
    upcoming: "blue",
    completed: "emerald",
    cancelled: "red",
    pending: "orange",
  };

  const toDateTime = (baseDate: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(baseDate);
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date;
  };

  const mappedEvents = useMemo<CalendarEvent[]>(() => {
    return filteredBookings.map((booking) => ({
      id: booking.id,
      title: booking.productName,
      start: toDateTime(booking.startDate, booking.startTime),
      end: toDateTime(booking.endDate, booking.endTime),
      color: statusColorMap[booking.status],
    }));
  }, [filteredBookings]);

  useEffect(() => {
    setEvents(mappedEvents);
  }, [mappedEvents]);

  return (
    <div className="flex flex-col h-full">
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 space-y-6">
          {/* Calendar Controls */}
          <Card className="p-4 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Kalender Booking</p>
                <p className="text-xs text-muted-foreground">
                  Klik event untuk melihat detail booking
                </p>
              </div>
              <Select value={filterProduct} onValueChange={setFilterProduct}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter Produk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Produk</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border rounded-lg overflow-hidden bg-card">
              <Calendar
                events={events}
                setEvents={setEvents}
                mode={mode}
                setMode={setMode}
                date={currentDate}
                setDate={setCurrentDate}
                readOnly
                onEventClick={(event) => {
                  const booking = bookingById.get(event.id);
                  if (booking) {
                    handleViewDetail(booking);
                  }
                }}
              />
            </div>
          </Card>

      {/* Booking Detail Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
        <DrawerContent className="h-screen w-full! lg:w-1/2! ml-auto !rounded-none">
          {selectedBooking && (
            <>
              <DrawerHeader className="border-b">
                <DrawerTitle>Detail Booking</DrawerTitle>
              </DrawerHeader>

              <div className="overflow-y-auto p-6 flex-1">
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={statusConfig[selectedBooking.status].variant}
                      className="text-sm px-3 py-1"
                    >
                      {statusConfig[selectedBooking.status].label}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.bookingCode}
                    </p>
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {selectedBooking.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedBooking.productLocation}
                    </p>
                  </div>

                  <Separator />

                  {/* Schedule */}
                  <div>
                    <h3 className="font-semibold mb-3">Detail Jadwal</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Tanggal
                        </p>
                        <p className="font-medium flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          {format(selectedBooking.startDate, "dd MMMM yyyy", {
                            locale: id,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Waktu
                        </p>
                        <p className="font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {selectedBooking.startTime} - {selectedBooking.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-accent/50 rounded-lg">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Durasi: </span>
                        <span className="font-semibold">
                          {selectedBooking.duration} jam
                        </span>
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold mb-3">Informasi Customer</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">Nama</p>
                        <p className="text-sm font-medium">
                          {selectedBooking.customerName}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">Telepon</p>
                        <p className="text-sm font-medium">
                          {selectedBooking.customerPhone}
                        </p>
                      </div>
                      {selectedBooking.customerOrganization && (
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">
                            Organisasi
                          </p>
                          <p className="text-sm font-medium">
                            {selectedBooking.customerOrganization}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Payment */}
                  <div>
                    <h3 className="font-semibold mb-3">Pembayaran</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Metode Pembayaran
                          </p>
                          <p className="text-sm font-medium">
                            {selectedBooking.paymentMethod}
                          </p>
                        </div>
                        <Badge
                          variant={
                            selectedBooking.paymentStatus === "paid"
                              ? "default"
                              : selectedBooking.paymentStatus === "pending"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {
                            paymentStatusConfig[selectedBooking.paymentStatus]
                              .label
                          }
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <p className="font-semibold">Total Pembayaran</p>
                        <p className="text-2xl font-bold text-primary">
                          Rp {selectedBooking.totalPrice.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedBooking.notes && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-2">Catatan</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedBooking.notes}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <DrawerFooter className="border-t flex-row gap-2">
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Hubungi Customer
                </Button>
                <DrawerClose asChild>
                  <Button variant="secondary" className="flex-1">
                    Tutup
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
        </div>
      </div>
    </div>
  );
}
