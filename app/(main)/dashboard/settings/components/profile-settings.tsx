"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, X, Building2, Clock, Phone, Mail, Loader2 } from "lucide-react";
import Image from "next/image";

interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  location: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  type: string;
  logoImage: string | null;
  operatingHours: OperatingHours | null;
}

interface OperatingHours {
  [key: string]: { open: string; close: string };
}

interface FormData {
  brandName: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  phone: string;
  email: string;
  address: string;
  mondayOpen: string;
  mondayClose: string;
  tuesdayOpen: string;
  tuesdayClose: string;
  wednesdayOpen: string;
  wednesdayClose: string;
  thursdayOpen: string;
  thursdayClose: string;
  fridayOpen: string;
  fridayClose: string;
  saturdayOpen: string;
  saturdayClose: string;
  sundayOpen: string;
  sundayClose: string;
}

interface ProfileSettingsProps {
  brand: Brand | null;
  formData: FormData;
  previewUrl: string;
  isUploading: boolean;
  onInputChange: (field: string, value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function ProfileSettings({
  brand,
  formData,
  previewUrl,
  isUploading,
  onInputChange,
  onImageChange,
  onRemoveImage,
}: ProfileSettingsProps) {
  const days = [
    { key: "monday", label: "Senin" },
    { key: "tuesday", label: "Selasa" },
    { key: "wednesday", label: "Rabu" },
    { key: "thursday", label: "Kamis" },
    { key: "friday", label: "Jumat" },
    { key: "saturday", label: "Sabtu" },
    { key: "sunday", label: "Minggu" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Image */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Foto Profil Brand</h2>
        <div className="flex items-start gap-6">
          <div className="relative">
            {previewUrl ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={onRemoveImage}
                  className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-accent/50">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Upload Foto Brand</p>
            <p className="text-xs text-muted-foreground mb-4">
              Format: JPG, PNG, atau WebP. Maksimal ukuran 2MB. Gambar akan
              dioptimalkan secara otomatis.
            </p>
            <div>
              <Input
                type="file"
                id="profile-image"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onImageChange}
              />
              <label htmlFor="profile-image">
                <Button asChild variant="outline" disabled={isUploading}>
                  <span className="cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Pilih Foto
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Informasi Dasar</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brandName">Nama Brand *</Label>
              <Input
                id="brandName"
                value={formData.brandName}
                onChange={(e) => onInputChange("brandName", e.target.value)}
                className="h-10 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => onInputChange("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                className="h-10 mt-1"
                placeholder="nama-brand"
              />
              <p className="text-xs text-muted-foreground mt-1">
                dibooking.id/{formData.slug || "nama-brand"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Kategori *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => onInputChange("category", value)}
              >
                <SelectTrigger className="h-10 mt-1">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VENUE">Venue / Gedung</SelectItem>
                  <SelectItem value="RENTAL">Rental / Penyewaan</SelectItem>
                  <SelectItem value="BOTH">Keduanya</SelectItem>
                  <SelectItem value="SERVICE">Jasa / Layanan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Kota/Lokasi *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => onInputChange("location", e.target.value)}
                className="h-10 mt-1"
                placeholder="Jakarta Timur"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                onInputChange("description", e.target.value)
              }
              className="mt-1 min-h-24"
              placeholder="Ceritakan tentang tempat Anda..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/500 karakter
            </p>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Informasi Kontak</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Nomor Telepon</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
                className="h-10 pl-10"
                placeholder="021-12345678"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange("email", e.target.value)}
                className="h-10 pl-10"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => onInputChange("address", e.target.value)}
              className="mt-1 min-h-20"
              placeholder="Masukkan alamat lengkap (opsional)"
            />
          </div>
        </div>
      </Card>

      {/* Operating Hours */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Jam Operasional</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Atur jam buka dan tutup untuk setiap hari
        </p>
        <div className="space-y-3">
          {days.map((day) => (
            <div
              key={day.key}
              className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center"
            >
              <Label className="font-medium">{day.label}</Label>
              <div>
                <Input
                  type="time"
                  value={formData[`${day.key}Open` as keyof FormData]}
                  onChange={(e) =>
                    onInputChange(`${day.key}Open`, e.target.value)
                  }
                  className="h-10"
                />
              </div>
              <div>
                <Input
                  type="time"
                  value={formData[`${day.key}Close` as keyof FormData]}
                  onChange={(e) =>
                    onInputChange(`${day.key}Close`, e.target.value)
                  }
                  className="h-10"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          💡 Tip: Jika tempat Anda tutup pada hari tertentu, atur waktu buka
          dan tutup yang sama
        </p>
      </Card>
    </div>
  );
}
