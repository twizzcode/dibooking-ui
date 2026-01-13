"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Building2,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Booking {
  id: string;
  productName: string;
  productImage: string;
  category: string;
  location: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: "upcoming" | "completed" | "cancelled" | "pending";
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerOrganization?: string;
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "failed";
  ownerName: string;
  ownerPhone?: string;
  notes?: string;
  createdAt: Date;
  brandName: string;
  brandSlug: string;
}

// Map database status to UI status
const mapBookingStatus = (dbStatus: string, startDate: Date): Booking['status'] => {
  const now = new Date();
  const start = new Date(startDate);
  
  if (dbStatus === 'CANCELLED') return 'cancelled';
  if (dbStatus === 'PENDING') return 'pending';
  if (dbStatus === 'COMPLETED') return 'completed';
  if (dbStatus === 'CONFIRMED') {
    // Check if booking is upcoming or completed based on date
    if (start > now) return 'upcoming';
    return 'completed';
  }
  return 'pending';
};

// Map database payment status
const mapPaymentStatus = (dbStatus: string): Booking['paymentStatus'] => {
  if (dbStatus === 'PAID') return 'paid';
  if (dbStatus === 'UNPAID') return 'pending';
  if (dbStatus === 'REFUNDED') return 'failed';
  return 'pending';
};

const statusConfig = {
  upcoming: {
    label: "Akan Datang",
    icon: Clock,
    variant: "default" as const,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  completed: {
    label: "Selesai",
    icon: CheckCircle2,
    variant: "secondary" as const,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  cancelled: {
    label: "Dibatalkan",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  pending: {
    label: "Menunggu",
    icon: AlertCircle,
    variant: "outline" as const,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
};

const paymentStatusConfig = {
  paid: {
    label: "Lunas",
    color: "text-green-600",
  },
  pending: {
    label: "Menunggu Pembayaran",
    color: "text-orange-600",
  },
  failed: {
    label: "Gagal",
    color: "text-red-600",
  },
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/bookings');
        
        if (response.ok) {
          const data = await response.json();
          
          // Transform API data to UI format
          const transformedBookings: Booking[] = data.bookings?.map((booking: any) => {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);
            
            // Extract time from DateTime
            const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
            const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
            
            // Calculate duration in hours
            const diffMs = endDate.getTime() - startDate.getTime();
            const duration = Math.ceil(diffMs / (1000 * 60 * 60));
            
            return {
              id: booking.id,
              productName: booking.product?.name || 'Unknown Product',
              productImage: booking.product?.images?.[0] || '/placeholder.jpg',
              category: booking.product?.type || 'Unknown',
              location: booking.brand?.location || 'Unknown Location',
              startDate,
              endDate,
              startTime,
              endTime,
              duration,
              totalPrice: booking.totalPrice,
              status: mapBookingStatus(booking.status, startDate),
              bookingCode: booking.bookingCode,
              customerName: booking.customerName,
              customerPhone: booking.customerPhone,
              customerOrganization: booking.customerOrg || undefined,
              paymentMethod: booking.paymentMethod || 'Belum ditentukan',
              paymentStatus: mapPaymentStatus(booking.paymentStatus),
              ownerName: booking.brand?.name || 'Unknown',
              ownerPhone: booking.brand?.phone,
              notes: booking.notes || undefined,
              createdAt: new Date(booking.createdAt),
              brandName: booking.brand?.name || 'Unknown',
              brandSlug: booking.brand?.slug || '',
            };
          }) || [];
          
          setBookings(transformedBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  };

  const getBookingsByStatus = (status: string) => {
    if (status === "all") return bookings;
    return bookings.filter((booking) => booking.status === status);
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const StatusIcon = statusConfig[booking.status].icon;

    return (
      <Card
        className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => handleViewDetail(booking)}
      >
        <div className="flex gap-4">
          {/* Image */}
          <div className="w-24 h-24 rounded-lg bg-accent shrink-0 overflow-hidden">
            {booking.productImage && booking.productImage !== '/placeholder.jpg' ? (
              <img 
                src={booking.productImage} 
                alt={booking.productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                Foto
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate capitalize">
                  {booking.productName}
                </h3>
                {/* <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{booking.location}</span>
                </p> */}
              </div>
              <Badge variant={statusConfig[booking.status].variant}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[booking.status].label}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(booking.startDate, "dd MMM yyyy", { locale: id })}
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {booking.startTime} - {booking.endTime}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs text-muted-foreground">Total Pembayaran</p>
                <p className="font-bold text-lg">
                  Rp {booking.totalPrice.toLocaleString("id-ID")}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                Lihat Detail
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Booking Saya</h1>
        <p className="text-muted-foreground">
          Kelola dan lihat semua booking Anda di sini
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="all">
                Semua ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Akan Datang ({getBookingsByStatus("upcoming").length})
              </TabsTrigger>
          <TabsTrigger value="pending">
            Menunggu ({getBookingsByStatus("pending").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Selesai ({getBookingsByStatus("completed").length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Dibatalkan ({getBookingsByStatus("cancelled").length})
          </TabsTrigger>
        </TabsList>

        {["all", "upcoming", "pending", "completed", "cancelled"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {getBookingsByStatus(status).length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  Tidak ada booking dengan status ini
                </p>
              </Card>
            ) : (
              getBookingsByStatus(status).map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
        </>
      )}

      {/* Detail Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
        <DrawerContent className="h-screen w-full! lg:w-1/2! ml-auto !rounded-none">
          {selectedBooking && (
            <>
              <DrawerHeader className="border-b">
                <DrawerTitle>Detail Booking</DrawerTitle>
              </DrawerHeader>

              <div className="overflow-y-auto p-6 flex-1">
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={statusConfig[selectedBooking.status].variant}
                      className="text-sm px-3 py-1"
                    >
                      {statusConfig[selectedBooking.status].label}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Kode: {selectedBooking.bookingCode}
                    </p>
                  </div>

                  {/* Product Info */}
                  <div>
                    <div className="flex gap-4">
                      <div className="w-32 h-32 rounded-lg bg-accent shrink-0 overflow-hidden">
                        {selectedBooking.productImage && selectedBooking.productImage !== '/placeholder.jpg' ? (
                          <img 
                            src={selectedBooking.productImage} 
                            alt={selectedBooking.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                            Foto Produk
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {selectedBooking.category}
                        </Badge>
                        <h2 className="text-xl font-bold mb-2">
                          {selectedBooking.productName}
                        </h2>
                        <p className="text-sm text-muted-foreground flex items-start gap-1">
                          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          {selectedBooking.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Booking Details */}
                  <div>
                    <h3 className="font-semibold mb-3">Detail Jadwal</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Tanggal Mulai
                          </p>
                          <p className="font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(selectedBooking.startDate, "dd MMMM yyyy", {
                              locale: id,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Waktu Mulai
                          </p>
                          <p className="font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {selectedBooking.startTime}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Tanggal Selesai
                          </p>
                          <p className="font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(selectedBooking.endDate, "dd MMMM yyyy", {
                              locale: id,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Waktu Selesai
                          </p>
                          <p className="font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {selectedBooking.endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-accent/50 rounded-lg">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Durasi: </span>
                        <span className="font-semibold">
                          {selectedBooking.duration} {selectedBooking.startTime !== '00:00' ? 'jam' : 'hari'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold mb-3">Informasi Pemesan</h3>
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

                  {/* Payment Info */}
                  <div>
                    <h3 className="font-semibold mb-3">Informasi Pembayaran</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Metode Pembayaran
                            </p>
                            <p className="text-sm font-medium">
                              {selectedBooking.paymentMethod}
                            </p>
                          </div>
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

                  <Separator />

                  {/* Owner Contact */}
                  <div>
                    <h3 className="font-semibold mb-3">Kontak Penyedia</h3>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedBooking.ownerName}</p>
                          {selectedBooking.ownerPhone && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {selectedBooking.ownerPhone}
                            </p>
                          )}
                        </div>
                      </div>
                      {selectedBooking.ownerPhone && (
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Hubungi
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
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

                  {/* Created At */}
                  <div className="text-xs text-muted-foreground text-center pt-4">
                    Dibuat pada{" "}
                    {format(selectedBooking.createdAt, "dd MMMM yyyy, HH:mm", {
                      locale: id,
                    })}
                  </div>
                </div>
              </div>

              <DrawerFooter className="border-t">
                <DrawerClose asChild>
                  <Button variant="outline">Tutup</Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}