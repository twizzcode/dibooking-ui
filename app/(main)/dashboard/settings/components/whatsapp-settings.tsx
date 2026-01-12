"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsAppSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              WhatsApp Business Integration
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Integrasikan WhatsApp Business untuk komunikasi langsung dengan pelanggan
            </p>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Premium Feature
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="bg-accent/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Fitur WhatsApp Business</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Auto-reply untuk pertanyaan umum</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Tombol WhatsApp di halaman produk</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Template pesan booking otomatis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Notifikasi booking via WhatsApp</span>
              </li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Cara Setup</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Daftar WhatsApp Business API</li>
              <li>Verifikasi nomor WhatsApp bisnis Anda</li>
              <li>Masukkan API credentials di bawah</li>
              <li>Aktifkan integrasi</li>
            </ol>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              Upgrade ke Premium
            </Button>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 opacity-50">
        <h3 className="font-semibold mb-4 text-muted-foreground">API Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Fitur ini tersedia untuk akun Premium. Upgrade akun Anda untuk mengakses integrasi WhatsApp Business.
        </p>
      </Card>
    </div>
  );
}
