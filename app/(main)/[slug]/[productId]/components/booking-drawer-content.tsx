"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { AvailabilityCalendar } from "./availability-calendar";
import { BookingCard, BookingData } from "./booking-card";
import { CheckCircle2, Calendar, FileText, MessageSquare, Copy, Check, Loader2 } from "lucide-react";
import type { ProductDetail } from "@/types/product-detail";
import { useRouter } from "next/navigation";

interface BookingDrawerContentProps {
  product: ProductDetail;
}

export function BookingDrawerContent({ product }: BookingDrawerContentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDates, setSelectedDates] = useState<{start?: Date; end?: Date}>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const router = useRouter();

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingData || !bookingData.startDate || !bookingData.endDate || !bookingData.customerName || !bookingData.customerPhone) {
      alert('Mohon lengkapi semua data yang diperlukan');
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine date with time
      const startDateTime = new Date(bookingData.startDate);
      const endDateTime = new Date(bookingData.endDate);
      
      if (bookingData.startTime) {
        const [startHour, startMinute] = bookingData.startTime.split(':').map(Number);
        startDateTime.setHours(startHour, startMinute, 0, 0);
      }
      
      if (bookingData.endTime) {
        const [endHour, endMinute] = bookingData.endTime.split(':').map(Number);
        endDateTime.setHours(endHour, endMinute, 0, 0);
      }
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          customerName: bookingData.customerName,
          customerPhone: bookingData.customerPhone,
          customerEmail: '',
          customerOrg: bookingData.customerOrg,
          notes: '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat booking');
      }

      setBookingCode(data.booking.bookingCode);
      setCurrentStep(3);
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(error.message || 'Terjadi kesalahan saat membuat booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-full">
      <DrawerHeader>
        <DrawerTitle>
            {product.type === "tempat" ? "Booking " + product.name : "Ajukan Sewa " + product.name}
        </DrawerTitle>
        {/* <DrawerDescription>
          Ikuti langkah-langkah berikut untuk menyelesaikan booking Anda
        </DrawerDescription> */}
      </DrawerHeader>

      {/* Stepper */}
      <div className="px-4 py-4 border-b">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep >= 0 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
            }`}>
              {currentStep > 0 ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-semibold">1</span>}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">Cek Ketersediaan</p>
              <p className="text-xs text-muted-foreground">Lihat jadwal yang tersedia</p>
            </div>
          </div>

          <div className="h-px flex-1 bg-border mx-2" />

          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
            }`}>
              {currentStep > 1 ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-semibold">2</span>}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">Isi Detail</p>
              <p className="text-xs text-muted-foreground">Masukkan informasi booking</p>
            </div>
          </div>

          <div className="h-px flex-1 bg-border mx-2" />

          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
            }`}>
              {currentStep > 2 ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-semibold">3</span>}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">Konfirmasi</p>
              <p className="text-xs text-muted-foreground">Review detail booking</p>
            </div>
          </div>

          <div className="h-px flex-1 bg-border mx-2" />

          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep >= 3 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
            }`}>
              {currentStep > 3 ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-semibold">4</span>}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">Selesai</p>
              <p className="text-xs text-muted-foreground">Hubungi penyewa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on step */}
      <div className="overflow-y-auto flex-1 px-4">
        <div className="space-y-6 py-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              {product.type === "tempat" && <AvailabilityCalendar productId={product.id} />}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Detail Booking</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Lengkapi informasi berikut untuk melanjutkan booking Anda.
                </p>
              </div>
              <BookingCard product={product} onBookingDataChange={setBookingData} />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Konfirmasi & Pembayaran</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pastikan semua detail sudah benar dan lakukan pembayaran.
                </p>
              </div>
              
              {/* Booking Summary */}
              <div className="bg-accent p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-sm">Detail Booking</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Produk:</span>
                    <span className="font-semibold">{product.name}</span>
                  </div>
                  {bookingData?.startDate && bookingData?.endDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal:</span>
                      <span className="font-semibold">
                        {bookingData.startDate.toLocaleDateString('id-ID')} - {bookingData.endDate.toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga:</span>
                    <span className="font-semibold">Rp {product.price.toLocaleString("id-ID")} / {product.priceUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durasi:</span>
                    <span className="font-semibold">{bookingData?.duration || 1} hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-bold text-primary">Rp {bookingData?.total.toLocaleString("id-ID") || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga:</span>
                    <span className="font-semibold">Rp {product.price.toLocaleString("id-ID")} / {product.priceUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lokasi:</span>
                    <span className="font-semibold">{product.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Penyedia:</span>
                    <span className="font-semibold">{product.owner.name}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Metode Pembayaran</h4>
                
                {/* Bank Transfer */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">BANK</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Bank BCA</p>
                      <p className="font-mono font-bold text-base">1234 5678 90</p>
                      <p className="text-xs text-muted-foreground">a.n. {product.owner.name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy("1234567890", "bca")}
                      className="h-8"
                    >
                      {copiedField === "bca" ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Salin
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Mandiri */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">BANK</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">Bank Mandiri</p>
                      <p className="font-mono font-bold text-base">0987 6543 21</p>
                      <p className="text-xs text-muted-foreground">a.n. {product.owner.name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy("0987654321", "mandiri")}
                      className="h-8"
                    >
                      {copiedField === "mandiri" ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Salin
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* GoPay */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">GOPAY</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">GoPay</p>
                      <p className="font-mono font-bold text-base">0812 3456 7890</p>
                      <p className="text-xs text-muted-foreground">a.n. {product.owner.name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy("081234567890", "gopay")}
                      className="h-8"
                    >
                      {copiedField === "gopay" ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Salin
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* QRIS */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">QRIS</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">QRIS</p>
                      <p className="text-xs text-muted-foreground">Scan untuk bayar</p>
                    </div>
                  </div>
                  <div className="bg-accent/50 p-3 rounded flex items-center justify-center">
                    <div className="w-48 h-48 bg-background border-2 border-dashed rounded flex items-center justify-center">
                      <p className="text-xs text-muted-foreground text-center">QR Code<br/>akan ditampilkan<br/>di sini</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 Setelah melakukan pembayaran, kirimkan bukti transfer kepada penyedia untuk konfirmasi booking Anda.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 text-center py-8">
              <div className="flex justify-center">
                <div className="bg-green-100 dark:bg-green-950/20 p-4 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-xl mb-2">Permintaan Booking Terkirim!</h3>
                {bookingCode && (
                  <div className="bg-accent p-3 rounded-lg mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Kode Booking</p>
                    <p className="font-mono font-bold text-lg">{bookingCode}</p>
                  </div>
                )}
                <p className="text-muted-foreground mb-6">
                  Silakan hubungi penyedia untuk konfirmasi dan detail pembayaran.
                </p>
              </div>

              <div className="bg-accent p-6 rounded-lg text-left space-y-3">
                <h4 className="font-semibold">Informasi Kontak Brand:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Brand:</span>
                    <span className="font-semibold">{product.brand}</span>
                  </div>
                  {product.brandContact?.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Telepon:</span>
                      <span>{product.brandContact.phone}</span>
                    </div>
                  )}
                  {product.brandContact?.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{product.brandContact.email}</span>
                    </div>
                  )}
                  {product.brandContact?.address && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Alamat:</span>
                      <span>{product.brandContact.address}</span>
                    </div>
                  )}
                </div>
                
                <Button className="w-full mt-4" size="lg">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Hubungi Brand
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with navigation */}
      <DrawerFooter className="border-t">
        <div className="flex gap-2 w-full">
          {currentStep > 0 && currentStep < 3 && (
            <Button variant="outline" onClick={handlePrevStep} className="flex-1">
              Kembali
            </Button>
          )}
          
          {currentStep < 2 && (
            <Button onClick={handleNextStep} className="flex-1">
              Lanjutkan
            </Button>
          )}
          
          {currentStep === 2 && (
            <Button onClick={handleConfirmBooking} className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Konfirmasi Booking'
              )}
            </Button>
          )}
          
          {currentStep === 3 && (
            <>
                <Button className="flex-1">
                    My Books
                </Button>
                <DrawerClose asChild>
                <Button variant="outline" className="flex-1">
                    Tutup
                </Button>
                </DrawerClose>
            </>
          )}
        </div>
      </DrawerFooter>
    </div>
  );
}
