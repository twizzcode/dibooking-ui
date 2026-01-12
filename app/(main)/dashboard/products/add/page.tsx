"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Save, Loader2, ArrowLeft, ImagePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "VENUE" as "VENUE" | "EQUIPMENT" | "PACKAGE",
    price: "",
    priceUnit: "hour" as "hour" | "day" | "package",
    capacity: "",
    size: "",
    features: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate total images (max 5)
    if (images.length + files.length > 5) {
      setError("Maksimal 5 gambar");
      return;
    }

    // Validate file size (max 5MB each)
    const invalidFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setError("Ukuran file maksimal 5MB per gambar");
      return;
    }

    // Add images
    setImages((prev) => [...prev, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setError(null);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("folder", "products");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        uploadedUrls.push(data.url);
      }

      return uploadedUrls;
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Get session
      const { data: session } = await authClient.getSession();
      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      // Get user's brand
      const brandRes = await fetch(`/api/brands?ownerId=${session.user.id}`);
      const brandData = await brandRes.json();

      if (!brandData.brands || brandData.brands.length === 0) {
        throw new Error("Brand not found. Please create a brand first.");
      }

      const brand = brandData.brands[0];

      // Upload images first
      const imageUrls = await uploadImages();

      // Parse features
      const featuresArray = formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      // Create product
      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        price: parseFloat(formData.price),
        priceUnit: formData.priceUnit,
        capacity: formData.capacity || null,
        size: formData.size || null,
        features: featuresArray,
        images: imageUrls,
        brandId: brand.id,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      // Redirect to products page
      router.push("/dashboard/products");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "Gagal menyimpan produk");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Tambah Produk Baru</h1>
            <p className="text-muted-foreground">
              Tambahkan produk atau layanan yang ingin Anda sewakan
            </p>
          </div>
        </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Images Upload */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Foto Produk</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors">
                      <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground text-center px-2">
                        Upload Foto
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Maksimal 5 foto. Format: JPG, PNG, WebP. Ukuran maksimal 5MB per foto.
                </p>
              </div>
            </Card>

            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Informasi Dasar</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Produk *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                    placeholder="Contoh: Aula Serbaguna Lantai 1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="mt-1 min-h-24"
                    placeholder="Deskripsikan produk Anda secara detail..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipe Produk *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VENUE">Tempat/Venue</SelectItem>
                        <SelectItem value="EQUIPMENT">Barang/Peralatan</SelectItem>
                        <SelectItem value="PACKAGE">Paket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="capacity">Kapasitas</Label>
                    <Input
                      id="capacity"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange("capacity", e.target.value)}
                      className="mt-1"
                      placeholder="Contoh: 100 orang"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="size">Ukuran/Dimensi</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    className="mt-1"
                    placeholder="Contoh: 10x15 meter atau 50x50 cm"
                  />
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Harga Sewa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Harga *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="mt-1"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="priceUnit">Satuan Harga *</Label>
                  <Select
                    value={formData.priceUnit}
                    onValueChange={(value) => handleInputChange("priceUnit", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hour">Per Jam</SelectItem>
                      <SelectItem value="day">Per Hari</SelectItem>
                      <SelectItem value="package">Paket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Fitur & Fasilitas</h2>
              <div>
                <Label htmlFor="features">Daftar Fitur</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => handleInputChange("features", e.target.value)}
                  className="mt-1 min-h-32"
                  placeholder="Tuliskan satu fitur per baris:&#10;AC&#10;Proyektor&#10;Sound System&#10;Wifi&#10;Kursi 100 pcs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tuliskan satu fitur per baris
                </p>
              </div>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pb-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading || isUploading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isUploading || !formData.name || !formData.price}
              >
                {isLoading || isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isUploading ? "Mengupload..." : "Menyimpan..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Produk
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
