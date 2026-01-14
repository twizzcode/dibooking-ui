"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ProfileSettings } from "./components/profile-settings";
import { SocialMediaSettings } from "./components/social-media-settings";
import { WhatsAppSettings } from "./components/whatsapp-settings";

interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  location: string | null;
  address: string | null;
  district: string | null;
  city: string | null;
  province: string | null;
  phone: string | null;
  email: string | null;
  type: string;
  logoImage: string | null;
  coverImage: string | null;
  operatingHours: OperatingHours | null;
  socialMedia: SocialMediaJson | null;
}

interface OperatingHours {
  [key: string]: { open: string; close: string };
}

interface SocialMediaJson {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  website?: string;
}

export default function BrandSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string>("");
  const [bannerRemoved, setBannerRemoved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("branding");

  const [formData, setFormData] = useState({
    brandName: "",
    slug: "",
    description: "",
    district: "",
    city: "",
    province: "",
    addressDetail: "",
    phone: "",
    email: "",
    mondayEnabled: true,
    mondayOpen: "08:00",
    mondayClose: "17:00",
    tuesdayEnabled: true,
    tuesdayOpen: "08:00",
    tuesdayClose: "17:00",
    wednesdayEnabled: true,
    wednesdayOpen: "08:00",
    wednesdayClose: "17:00",
    thursdayEnabled: true,
    thursdayOpen: "08:00",
    thursdayClose: "17:00",
    fridayEnabled: true,
    fridayOpen: "08:00",
    fridayClose: "17:00",
    saturdayEnabled: true,
    saturdayOpen: "08:00",
    saturdayClose: "17:00",
    sundayEnabled: true,
    sundayOpen: "08:00",
    sundayClose: "17:00",
  });

  const [socialMedia, setSocialMedia] = useState({
    instagram: "",
    facebook: "",
    youtube: "",
    website: "",
  });

  // Fetch user's brand
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (!session?.user) {
          router.push("/sign-in");
          return;
        }

        const res = await fetch(`/api/brands?ownerId=${session.user.id}`);
        const data = await res.json();

        if (data.brands && data.brands.length > 0) {
          const brandData = data.brands[0] as Brand;
          setBrand(brandData);
          setPreviewUrl(brandData.logoImage || "");
          setBannerPreviewUrl(brandData.coverImage || "");
          setBannerRemoved(false);

          const hours = brandData.operatingHours as OperatingHours | null;
          const defaultEnabled = (day: keyof OperatingHours) =>
            hours ? !!hours?.[day] : true;
          setFormData({
            brandName: brandData.name || "",
            slug: brandData.slug || "",
            description: brandData.description || "",
            district: brandData.district || "",
            city: brandData.city || "",
            province: brandData.province || "",
            addressDetail: brandData.address || "",
            phone: brandData.phone || "",
            email: brandData.email || "",
            mondayEnabled: defaultEnabled("monday"),
            mondayOpen: hours?.monday?.open || "08:00",
            mondayClose: hours?.monday?.close || "17:00",
            tuesdayEnabled: defaultEnabled("tuesday"),
            tuesdayOpen: hours?.tuesday?.open || "08:00",
            tuesdayClose: hours?.tuesday?.close || "17:00",
            wednesdayEnabled: defaultEnabled("wednesday"),
            wednesdayOpen: hours?.wednesday?.open || "08:00",
            wednesdayClose: hours?.wednesday?.close || "17:00",
            thursdayEnabled: defaultEnabled("thursday"),
            thursdayOpen: hours?.thursday?.open || "08:00",
            thursdayClose: hours?.thursday?.close || "17:00",
            fridayEnabled: defaultEnabled("friday"),
            fridayOpen: hours?.friday?.open || "08:00",
            fridayClose: hours?.friday?.close || "17:00",
            saturdayEnabled: defaultEnabled("saturday"),
            saturdayOpen: hours?.saturday?.open || "08:00",
            saturdayClose: hours?.saturday?.close || "17:00",
            sundayEnabled: defaultEnabled("sunday"),
            sundayOpen: hours?.sunday?.open || "08:00",
            sundayClose: hours?.sunday?.close || "17:00",
          });

          const social = brandData.socialMedia as SocialMediaJson | null;
          setSocialMedia({
            instagram: social?.instagram || "",
            facebook: social?.facebook || "",
            youtube: social?.youtube || "",
            website: social?.website || "",
          });
        }
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError("Gagal memuat data brand");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialMediaChange = (field: keyof typeof socialMedia, value: string) => {
    setSocialMedia((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB");
      return;
    }

    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB");
      return;
    }

    setBannerImage(file);
    setBannerPreviewUrl(URL.createObjectURL(file));
    setBannerRemoved(false);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewUrl(brand?.logoImage || "");
  };

  const handleRemoveBanner = () => {
    setBannerImage(null);
    setBannerPreviewUrl("");
    setBannerRemoved(true);
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      return data.url;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      // Upload image first if new one selected
      let logoUrl = brand?.logoImage || null;
      if (profileImage) {
        logoUrl = await uploadFile(profileImage, `brand/${formData.slug}/logo`);
      }

      let coverImageUrl = brand?.coverImage || null;
      if (bannerRemoved) {
        coverImageUrl = null;
      } else if (bannerImage) {
        coverImageUrl = await uploadFile(bannerImage, `brand/${formData.slug}/banner`);
      }

      // Build operating hours object
      const operatingHours = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].reduce(
        (acc, day) => {
          const isEnabled = formData[`${day}Enabled` as keyof typeof formData];
          if (isEnabled) {
            acc[day] = {
              open: formData[`${day}Open` as keyof typeof formData] as string,
              close: formData[`${day}Close` as keyof typeof formData] as string,
            };
          }
          return acc;
        },
        {} as Record<string, { open: string; close: string }>
      );

      const location = [formData.district, formData.city]
        .filter(Boolean)
        .join(", ");

      const payload = {
        name: formData.brandName,
        slug: formData.slug,
        description: formData.description,
        location: location || null,
        district: formData.district,
        city: formData.city,
        province: formData.province,
        address: formData.addressDetail,
        phone: formData.phone,
        email: formData.email,
        logoImage: logoUrl,
        coverImage: coverImageUrl,
        operatingHours: Object.keys(operatingHours).length ? operatingHours : null,
        socialMedia,
      };

      let res;
      if (brand) {
        // Update existing brand
        res = await fetch(`/api/brands/${brand.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new brand
        res = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal menyimpan");
        }

        setBrand(data.brand);
        setProfileImage(null);
        setBannerImage(null);
        setBannerRemoved(false);
        setPreviewUrl(data.brand?.logoImage || "");
        setBannerPreviewUrl(data.brand?.coverImage || "");
        setSuccess("Perubahan berhasil disimpan!");
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const sections = [
    { id: "branding", label: "Branding" },
    { id: "basic", label: "Informasi Dasar" },
    { id: "contact", label: "Kontak Brand" },
    { id: "address", label: "Alamat Brand" },
    { id: "hours", label: "Jam Operasional" },
    { id: "social", label: "Media Sosial" },
    { id: "whatsapp", label: "WhatsApp" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 text-green-600 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <aside className="h-fit">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Pengaturan Brand
              </p>
              <div className="space-y-1 border-l border-border/60 pl-3">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </aside>

            <div className="space-y-6">
              {["branding", "basic", "contact", "address", "hours"].includes(activeSection) && (
                <ProfileSettings
                  section={activeSection as "branding" | "basic" | "contact" | "address" | "hours"}
                  formData={formData}
                  previewUrl={previewUrl}
                  bannerPreviewUrl={bannerPreviewUrl}
                  isUploading={isUploading}
                  onInputChange={handleInputChange}
                  onImageChange={handleImageChange}
                  onRemoveImage={handleRemoveImage}
                  onBannerChange={handleBannerChange}
                  onRemoveBanner={handleRemoveBanner}
                />
              )}

              {activeSection === "social" && (
                <SocialMediaSettings
                  socialMedia={socialMedia}
                  onSocialMediaChange={handleSocialMediaChange}
                />
              )}

              {activeSection === "whatsapp" && <WhatsAppSettings />}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button - Fixed at bottom */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-background">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Kembali
        </Button>
        <Button onClick={handleSave} disabled={isSaving || isUploading}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
}
