"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Upload, X, Building2, Clock, Phone, Mail, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface FormData {
  brandName: string;
  slug: string;
  description: string;
  district: string;
  city: string;
  province: string;
  addressDetail: string;
  phone: string;
  email: string;
  mondayEnabled: boolean;
  mondayOpen: string;
  mondayClose: string;
  tuesdayEnabled: boolean;
  tuesdayOpen: string;
  tuesdayClose: string;
  wednesdayEnabled: boolean;
  wednesdayOpen: string;
  wednesdayClose: string;
  thursdayEnabled: boolean;
  thursdayOpen: string;
  thursdayClose: string;
  fridayEnabled: boolean;
  fridayOpen: string;
  fridayClose: string;
  saturdayEnabled: boolean;
  saturdayOpen: string;
  saturdayClose: string;
  sundayEnabled: boolean;
  sundayOpen: string;
  sundayClose: string;
}

interface ProfileSettingsProps {
  section: "branding" | "basic" | "contact" | "address" | "hours";
  formData: FormData;
  previewUrl: string;
  bannerPreviewUrl: string;
  isUploading: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveBanner: () => void;
}

export function ProfileSettings({
  section,
  formData,
  previewUrl,
  bannerPreviewUrl,
  isUploading,
  onInputChange,
  onImageChange,
  onRemoveImage,
  onBannerChange,
  onRemoveBanner,
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

  const renderBranding = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Logo Brand</h2>
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
            <p className="text-sm font-medium mb-2">Upload Logo</p>
            <p className="text-xs text-muted-foreground mb-4">
              Format: JPG, PNG, atau WebP. Maksimal ukuran 2MB.
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
                    Pilih Logo
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </div>

      <Separator />
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Banner Brand</h2>
        <div className="space-y-4">
          <div className="relative w-full overflow-hidden rounded-lg border border-dashed bg-accent/40 aspect-[4/1]">
            {bannerPreviewUrl ? (
              <>
                <Image
                  src={bannerPreviewUrl}
                  alt="Banner Preview"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={onRemoveBanner}
                  className="absolute top-2 right-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">Rasio 1600 x 400</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-medium">Upload Banner</p>
              <p className="text-xs text-muted-foreground">
                Rekomendasi 1600x400, ukuran maksimal 2MB.
              </p>
            </div>
            <div>
              <Input
                type="file"
                id="banner-image"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onBannerChange}
              />
              <label htmlFor="banner-image">
                <Button asChild variant="outline" disabled={isUploading}>
                  <span className="cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Pilih Banner
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Informasi Dasar</h2>
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
              onChange={(e) =>
                onInputChange("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }
              className="h-10 mt-1"
              placeholder="nama-brand"
            />
            <p className="text-xs text-muted-foreground mt-1">
              dibooking.id/{formData.slug || "nama-brand"}
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            className="mt-1 min-h-24"
            placeholder="Ceritakan tentang tempat Anda..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.description.length}/500 karakter
          </p>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Kontak Brand</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">Nomor Telepon *</Label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
              className="h-10 pl-10"
              placeholder="021-12345678"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              className="h-10 pl-10"
              placeholder="email@example.com"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddress = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Alamat Brand</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="district">Kecamatan *</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => onInputChange("district", e.target.value)}
            className="h-10 mt-1"
            placeholder="Kec. Tanah Abang"
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="city">Kabupaten/Kota *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onInputChange("city", e.target.value)}
              className="h-10 mt-1"
              placeholder="Kota Jakarta Pusat"
              required
            />
          </div>
          <div>
            <Label htmlFor="province">Provinsi *</Label>
            <Input
              id="province"
              value={formData.province}
              onChange={(e) => onInputChange("province", e.target.value)}
              className="h-10 mt-1"
              placeholder="DKI Jakarta"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="addressDetail">Detail Alamat *</Label>
          <Textarea
            id="addressDetail"
            value={formData.addressDetail}
            onChange={(e) => onInputChange("addressDetail", e.target.value)}
            className="mt-1 min-h-24"
            placeholder="Nama jalan, nomor, RT/RW, patokan"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderHours = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Jam Operasional</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Centang hari yang buka, lalu atur jam buka dan tutupnya.
      </p>
      <div className="space-y-3">
        {days.map((day) => (
          <div
            key={day.key}
            className="grid grid-cols-[140px_1fr_1fr] gap-4 items-center"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData[`${day.key}Enabled` as keyof FormData] as boolean}
                onCheckedChange={(checked) =>
                  onInputChange(`${day.key}Enabled`, checked === true)
                }
              />
              <Label className="font-medium">{day.label}</Label>
            </div>
            <div>
              <Input
                type="time"
                value={formData[`${day.key}Open` as keyof FormData]}
                onChange={(e) =>
                  onInputChange(`${day.key}Open`, e.target.value)
                }
                className="h-10"
                disabled={!formData[`${day.key}Enabled` as keyof FormData]}
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
                disabled={!formData[`${day.key}Enabled` as keyof FormData]}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        💡 Tip: Anda bisa atur jam berbeda untuk setiap hari, atau nonaktifkan
        hari libur dengan checkbox.
      </p>
    </div>
  );

  const renderSection = () => {
    switch (section) {
      case "branding":
        return renderBranding();
      case "basic":
        return renderBasicInfo();
      case "contact":
        return renderContact();
      case "address":
        return renderAddress();
      case "hours":
        return renderHours();
      default:
        return null;
    }
  };

  return <div className="space-y-6">{renderSection()}</div>;
}
