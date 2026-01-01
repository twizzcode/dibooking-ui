"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock } from "lucide-react";
import { ProductDetail } from "@/types/product-detail";

interface BookingCardProps {
  product: ProductDetail;
}

export function BookingCard({ product }: BookingCardProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(1);

  const subtotal = product.price * duration;
  const serviceFee = 50000;
  const total = subtotal + serviceFee;

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          <span className="text-muted-foreground">/{product.priceUnit}</span>
        </div>
        <p className="text-sm text-green-600">Tersedia untuk disewa sekarang</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-xs">
              MULAI
            </Label>
            <div className="relative">
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-xs">
              SELESAI
            </Label>
            <div className="relative">
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-xs">
            DURASI SEWA
            </Label>
          <div className="relative">
            <Input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="pl-9"
            />
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <Button className="w-full" size="lg">
          Ajukan Sewa
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Anda belum akan dikenakan biaya
        </p>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="underline">
              Rp {product.price.toLocaleString("id-ID")} x {duration} hari
            </span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Biaya layanan</span>
            <span>Rp {serviceFee.toLocaleString("id-ID")}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
