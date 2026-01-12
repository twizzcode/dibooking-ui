"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock } from "lucide-react";
import { ProductDetail } from "@/types/product-detail";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  product: ProductDetail;
  onBookingDataChange?: (data: BookingData) => void;
}

export interface BookingData {
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  customerName: string;
  customerPhone: string;
  customerOrg?: string;
  duration: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

// Generate time options (00:00 - 23:00)
const generateTimeOptions = () => {
  const times = [];
  for (let i = 0; i < 24; i++) {
    times.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return times;
};

export function BookingCard({ product, onBookingDataChange }: BookingCardProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");

  const calculateDuration = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 1;
  };

  const duration = calculateDuration();
  const subtotal = product.price * duration;
  const serviceFee = 50000;
  const total = subtotal + serviceFee;

  // Notify parent of booking data changes
  useEffect(() => {
    if (onBookingDataChange) {
      onBookingDataChange({
        startDate,
        endDate,
        startTime,
        endTime,
        customerName: name,
        customerPhone: phone,
        customerOrg: organization,
        duration,
        subtotal,
        serviceFee,
        total,
      });
    }
  }, [startDate, endDate, startTime, endTime, name, phone, organization, duration, subtotal, total, onBookingDataChange]);

  const timeOptions = generateTimeOptions();

  return (
    <div className="space-y-6">
      {/* Product Info Header */}
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-accent rounded-lg flex-shrink-0 overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              Rp {product.price.toLocaleString("id-ID")}
            </span>
            <span className="text-sm text-muted-foreground">/{product.priceUnit}</span>
          </div>
          <p className="text-xs text-green-600 mt-1">Tersedia untuk disewa</p>
        </div>
      </div>

      <Separator />

      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm">Informasi Pemesan</h4>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-medium">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-medium">
              Nomor Telepon <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Contoh: 08123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization" className="text-xs font-medium">
              Nama Organisasi
            </Label>
            <Input
              id="organization"
              type="text"
              placeholder="Masukkan nama organisasi (opsional)"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="h-10"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Date and Time Selection */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm">Jadwal Booking</h4>
        
        <div className="space-y-3">
          <Label className="text-xs font-medium">
            Tanggal & Waktu <span className="text-red-500">*</span>
          </Label>
          
          {/* Single Row: Start - End */}
          <div className="flex items-center gap-2">
            {/* Start Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-10 flex-1 justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd MMM", { locale: id }) : "Mulai"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Start Time */}
            {product.type === "tempat" && (
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="h-10 w-24">
                  <SelectValue placeholder="Jam" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Separator */}
            <span className="text-muted-foreground">-</span>

            {/* End Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-10 flex-1 justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd MMM", { locale: id }) : "Selesai"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => startDate ? date < startDate : false}
                />
              </PopoverContent>
            </Popover>

            {/* End Time */}
            {product.type === "tempat" && (
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="h-10 w-24">
                  <SelectValue placeholder="Jam" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
      {/* Price Breakdown */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Rincian Biaya</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Rp {product.price.toLocaleString("id-ID")} x {duration} hari
            </span>
            <span className="font-medium">Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Biaya layanan</span>
            <span className="font-medium">Rp {serviceFee.toLocaleString("id-ID")}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-primary">Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
