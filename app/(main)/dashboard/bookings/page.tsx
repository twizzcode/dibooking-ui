"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Building2,
  DollarSign,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Booking {
  id: string;
  bookingCode: string;
  productName: string;
  productType: "venue" | "equipment";
  productLocation: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerOrganization?: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "rejected" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  createdAt: Date;
  brandId?: string;
}

// Map database status to UI status
const mapBookingStatus = (dbStatus: string): Booking['status'] => {
  if (dbStatus === 'PENDING') return 'pending';
  if (dbStatus === 'CONFIRMED') return 'confirmed';
  if (dbStatus === 'CANCELLED') return 'cancelled';
  if (dbStatus === 'COMPLETED') return 'completed';
  return 'pending';
};

const mapPaymentStatus = (dbStatus: string): Booking['paymentStatus'] => {
  if (dbStatus === 'PAID') return 'paid';
  if (dbStatus === 'UNPAID') return 'pending';
  if (dbStatus === 'REFUNDED') return 'refunded';
  return 'pending';
};

const statusConfig = {
  pending: {
    label: "Menunggu Konfirmasi",
    variant: "outline" as const,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  confirmed: {
    label: "Dikonfirmasi",
    variant: "default" as const,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  rejected: {
    label: "Ditolak",
    variant: "destructive" as const,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  completed: {
    label: "Selesai",
    variant: "secondary" as const,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  cancelled: {
    label: "Dibatalkan",
    variant: "secondary" as const,
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
};

const paymentStatusConfig = {
  pending: { label: "Belum Dibayar", color: "text-orange-600" },
  paid: { label: "Sudah Dibayar", color: "text-green-600" },
  refunded: { label: "Dikembalikan", color: "text-blue-600" },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | Booking["status"]>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Fetch brand and bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get user's brand first
        const brandRes = await fetch('/api/brands/my-brand');
        if (!brandRes.ok) {
          throw new Error('Failed to fetch brand');
        }
        const brandData = await brandRes.json();
        const userBrandId = brandData.brand?.id;
        setBrandId(userBrandId);
        
        if (!userBrandId) {
          setBookings([]);
          return;
        }
        
        // Fetch bookings for this brand
        const bookingsRes = await fetch(`/api/bookings?brandId=${userBrandId}`);
        if (!bookingsRes.ok) {
          throw new Error('Failed to fetch bookings');
        }
        
        const bookingsData = await bookingsRes.json();
        
        // Transform API data to UI format
        const transformedBookings: Booking[] = bookingsData.bookings?.map((booking: any) => {
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
            bookingCode: booking.bookingCode,
            productName: booking.product?.name || 'Unknown Product',
            productType: booking.product?.type?.toLowerCase() === 'venue' ? 'venue' : 'equipment',
            productLocation: booking.brand?.location || 'Unknown Location',
            customerName: booking.customerName,
            customerEmail: booking.customerEmail || '',
            customerPhone: booking.customerPhone,
            customerOrganization: booking.customerOrg || undefined,
            startDate,
            endDate,
            startTime,
            endTime,
            duration,
            totalPrice: booking.totalPrice,
            status: mapBookingStatus(booking.status),
            paymentStatus: mapPaymentStatus(booking.paymentStatus),
            notes: booking.notes || undefined,
            createdAt: new Date(booking.createdAt),
            brandId: booking.brandId,
          };
        }) || [];
        
        setBookings(transformedBookings);
      } catch (error) {
        console.error('Error fetching data:', error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch =
      booking.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const handleConfirm = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowConfirmDialog(true);
  };

  const handleReject = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowRejectDialog(true);
  };

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailDialog(true);
  };

  const confirmBooking = async () => {
    if (!selectedBooking) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to confirm booking');
      }
      
      // Update local state
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { ...b, status: 'confirmed' as const }
          : b
      ));
      
      alert('Booking berhasil dikonfirmasi!');
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Gagal mengkonfirmasi booking. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
      setSelectedBooking(null);
    }
  };

  const rejectBooking = async () => {
    if (!selectedBooking || !rejectReason.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'CANCELLED',
          notes: `Ditolak: ${rejectReason}`,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject booking');
      }
      
      // Update local state
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { ...b, status: 'cancelled' as const, notes: `Ditolak: ${rejectReason}` }
          : b
      ));
      
      alert('Booking berhasil ditolak.');
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Gagal menolak booking. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
      setShowRejectDialog(false);
      setSelectedBooking(null);
      setRejectReason("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Menunggu</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dikonfirmasi</p>
                  <p className="text-2xl font-bold">{confirmedCount}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Booking</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendapatan</p>
                  <p className="text-2xl font-bold">
                    Rp {(totalRevenue / 1000000).toFixed(1)}jt
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari kode booking, nama customer, atau produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}>
                <TabsList>
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="pending">Menunggu</TabsTrigger>
                  <TabsTrigger value="confirmed">Dikonfirmasi</TabsTrigger>
                  <TabsTrigger value="rejected">Ditolak</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Card>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Section - Main Info */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{booking.productName}</h3>
                          <Badge variant={statusConfig[booking.status].variant}>
                            {statusConfig[booking.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booking.productLocation}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {booking.bookingCode}
                      </Badge>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{booking.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{booking.customerPhone}</span>
                      </div>
                      {booking.customerOrganization && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{booking.customerOrganization}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{booking.customerEmail}</span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(booking.startDate, "dd MMM yyyy", { locale: id })}
                          {booking.startDate.getTime() !== booking.endDate.getTime() &&
                            ` - ${format(booking.endDate, "dd MMM yyyy", { locale: id })}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {booking.startTime} - {booking.endTime} ({booking.duration} jam)
                        </span>
                      </div>
                      <div className={`font-semibold ${paymentStatusConfig[booking.paymentStatus].color}`}>
                        {paymentStatusConfig[booking.paymentStatus].label}
                      </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Catatan:</p>
                        <p className="text-sm">{booking.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Price & Actions */}
                  <div className="lg:w-64 flex flex-col gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Total Harga</p>
                      <p className="text-2xl font-bold text-primary">
                        Rp {booking.totalPrice.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleViewDetail(booking)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </Button>

                      {booking.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleConfirm(booking)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Terima Booking
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => handleReject(booking)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Tolak Booking
                          </Button>
                        </>
                      )}

                      {booking.status === "confirmed" && (
                        <Button variant="outline" size="sm" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Hubungi Customer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredBookings.length === 0 && (
            <Card className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Tidak ada booking ditemukan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                }}
              >
                Reset Filter
              </Button>
            </Card>
          )}
          
          {/* No Brand State */}
          {!brandId && bookings.length === 0 && (
            <Card className="p-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Belum Ada Brand</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Anda perlu membuat brand terlebih dahulu untuk menerima booking
              </p>
            </Card>
          )}
            </>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Booking</DialogTitle>
            <DialogDescription>Informasi lengkap booking pelanggan</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Kode Booking</p>
                  <p className="font-medium">{selectedBooking.bookingCode}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant={statusConfig[selectedBooking.status].variant}>
                    {statusConfig[selectedBooking.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Nama Customer</p>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Telepon</p>
                  <p className="font-medium">{selectedBooking.customerPhone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedBooking.customerEmail}</p>
                </div>
                {selectedBooking.customerOrganization && (
                  <div>
                    <p className="text-muted-foreground">Organisasi</p>
                    <p className="font-medium">{selectedBooking.customerOrganization}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Produk</p>
                  <p className="font-medium">{selectedBooking.productName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lokasi</p>
                  <p className="font-medium">{selectedBooking.productLocation}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal</p>
                  <p className="font-medium">
                    {format(selectedBooking.startDate, "dd MMM yyyy", { locale: id })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Waktu</p>
                  <p className="font-medium">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Durasi</p>
                  <p className="font-medium">{selectedBooking.duration} jam</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Harga</p>
                  <p className="font-bold text-primary">
                    Rp {selectedBooking.totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              {selectedBooking.notes && (
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Catatan Customer:</p>
                  <p className="p-3 bg-muted rounded-lg">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Booking</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menerima booking ini?
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Customer:</span> {selectedBooking.customerName}
              </p>
              <p>
                <span className="font-medium">Produk:</span> {selectedBooking.productName}
              </p>
              <p>
                <span className="font-medium">Tanggal:</span>{" "}
                {format(selectedBooking.startDate, "dd MMM yyyy", { locale: id })}
              </p>
              <p>
                <span className="font-medium">Total:</span> Rp{" "}
                {selectedBooking.totalPrice.toLocaleString("id-ID")}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button onClick={confirmBooking} className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Ya, Terima Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Booking</DialogTitle>
            <DialogDescription>
              Berikan alasan mengapa booking ini ditolak
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Customer:</span> {selectedBooking.customerName}
                </p>
                <p>
                  <span className="font-medium">Produk:</span> {selectedBooking.productName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Alasan Penolakan</label>
                <Textarea
                  placeholder="Contoh: Jadwal sudah penuh, produk sedang maintenance, dll."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="min-h-24"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={rejectBooking}
              disabled={!rejectReason.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Tolak Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
