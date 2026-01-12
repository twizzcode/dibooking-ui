"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, User, Share2, MessageSquare } from "lucide-react";
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
  phone: string | null;
  email: string | null;
  type: string;
  logoImage: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    brandName: "",
    slug: "",
    description: "",
    category: "RENTAL",
    location: "",
    phone: "",
    email: "",
    address: "",
    mondayOpen: "08:00",
    mondayClose: "17:00",
    tuesdayOpen: "08:00",
    tuesdayClose: "17:00",
    wednesdayOpen: "08:00",
    wednesdayClose: "17:00",
    thursdayOpen: "08:00",
    thursdayClose: "17:00",
    fridayOpen: "08:00",
    fridayClose: "17:00",
    saturdayOpen: "08:00",
    saturdayClose: "17:00",
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

          const hours = brandData.operatingHours as OperatingHours | null;
          setFormData({
            brandName: brandData.name || "",
            slug: brandData.slug || "",
            description: brandData.description || "",
            category: brandData.type || "RENTAL",
            location: brandData.location || "",
            phone: brandData.phone || "",
            email: brandData.email || "",
            address: brandData.address || "",
            mondayOpen: hours?.monday?.open || "08:00",
            mondayClose: hours?.monday?.close || "17:00",
            tuesdayOpen: hours?.tuesday?.open || "08:00",
            tuesdayClose: hours?.tuesday?.close || "17:00",
            wednesdayOpen: hours?.wednesday?.open || "08:00",
            wednesdayClose: hours?.wednesday?.close || "17:00",
            thursdayOpen: hours?.thursday?.open || "08:00",
            thursdayClose: hours?.thursday?.close || "17:00",
            fridayOpen: hours?.friday?.open || "08:00",
            fridayClose: hours?.friday?.close || "17:00",
            saturdayOpen: hours?.saturday?.open || "08:00",
            saturdayClose: hours?.saturday?.close || "17:00",
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

  const handleInputChange = (field: string, value: string) => {
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

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewUrl(brand?.logoImage || "");
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!profileImage) return brand?.logoImage || null;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", profileImage);
      formData.append("folder", "brands");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      return data.url;
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
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
        logoUrl = await uploadImage();
      }

      // Build operating hours object
      const operatingHours = {
        monday: { open: formData.mondayOpen, close: formData.mondayClose },
        tuesday: { open: formData.tuesdayOpen, close: formData.tuesdayClose },
        wednesday: { open: formData.wednesdayOpen, close: formData.wednesdayClose },
        thursday: { open: formData.thursdayOpen, close: formData.thursdayClose },
        friday: { open: formData.fridayOpen, close: formData.fridayClose },
        saturday: { open: formData.saturdayOpen, close: formData.saturdayClose },
        sunday: { open: formData.sundayOpen, close: formData.sundayClose },
      };

      const payload = {
        name: formData.brandName,
        slug: formData.slug,
        description: formData.description,
        type: formData.category,
        location: formData.location,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        logoImage: logoUrl,
        operatingHours,
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4">
        <h1 className="text-3xl font-bold mb-2">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola informasi profil brand, media sosial, dan integrasi
        </p>
        </div>
      </div>

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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="h-4 w-4" />
            Media Sosial
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSettings
            brand={brand}
            formData={formData}
            previewUrl={previewUrl}
            isUploading={isUploading}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
          />
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <SocialMediaSettings
            socialMedia={socialMedia}
            onSocialMediaChange={handleSocialMediaChange}
          />
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-6">
          <WhatsAppSettings />
        </TabsContent>
          </Tabs>
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
