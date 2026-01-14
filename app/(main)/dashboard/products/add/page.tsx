"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [productType, setProductType] = useState<"VENUE" | "EQUIPMENT" | null>(null);
  const [rentalMode, setRentalMode] = useState<"RENT" | "BORROW">("RENT");
  const [brandInfo, setBrandInfo] = useState<{
    id: string;
    slug: string;
    plan: "FREE" | "BASIC" | "PRO";
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "VENUE" as "VENUE" | "EQUIPMENT" | "PACKAGE",
    price: "",
    priceUnit: "hour" as "hour" | "day" | "package",
    stock: "",
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

  const adjustStock = (delta: number) => {
    setFormData((prev) => {
      const current = Number.parseInt(prev.stock || "0", 10);
      const next = Number.isNaN(current) ? 0 : Math.max(0, current + delta);
      return { ...prev, stock: String(next) };
    });
  };

  const handleSelectProductType = (type: "VENUE" | "EQUIPMENT") => {
    setProductType(type);
    setFormData((prev) => ({
      ...prev,
      type,
    }));
    setRentalMode("RENT");
  };

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (!session?.user) return;
        const res = await fetch(`/api/brands?ownerId=${session.user.id}`);
        const data = await res.json();
        if (res.ok && data.brands && data.brands.length > 0) {
          setBrandInfo({
            id: data.brands[0].id,
            slug: data.brands[0].slug,
            plan: data.brands[0].plan || "FREE",
          });
        }
      } catch (err) {
        console.error("Brand load error:", err);
      }
    };
    fetchBrand();
  }, []);

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

  const uploadImages = async (folder: string): Promise<string[]> => {
    if (images.length === 0) return [];

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("folder", folder);

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
    if (!productType) {
      setError("Pilih tipe produk terlebih dahulu");
      return;
    }
    if (productType === "EQUIPMENT") {
      if (!formData.stock) {
        setError("Jumlah unit wajib diisi untuk barang");
        return;
      }
    }
    if (rentalMode === "RENT" && !formData.price) {
      setError("Harga sewa wajib diisi");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      // Get session
      const { data: session } = await authClient.getSession();
      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      const brand = brandInfo;
      if (!brand) {
        throw new Error("Brand not found. Please create a brand first.");
      }

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
        price: rentalMode === "RENT" ? parseFloat(formData.price) : 0,
        priceUnit: formData.priceUnit,
        rentalMode,
        loanDocumentUrl: null,
        loanDocumentRequired: false,
        capacity: formData.capacity || null,
        size: formData.size || null,
        stock: formData.stock ? parseInt(formData.stock, 10) : null,
        features: featuresArray,
        images: [],
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

      const createdProduct = data.product;
      if (!createdProduct?.id) {
        throw new Error("Produk dibuat tapi ID tidak ditemukan");
      }

      const baseFolder = `brand/${brand.slug || brand.id}/products/${createdProduct.id}`;
      const imageUrls = await uploadImages(`${baseFolder}/images`);

      if (imageUrls.length > 0) {
        const patchRes = await fetch(`/api/products/${createdProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: imageUrls,
          }),
        });
        const patchData = await patchRes.json();
        if (!patchRes.ok) {
          throw new Error(patchData.error || "Failed to update product assets");
        }
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
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
          <div className="mb-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          {!productType ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-semibold">Pilih Tipe Produk</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Tipe produk menentukan pengaturan dan detail yang akan Anda isi.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleSelectProductType("VENUE")}
                  className="rounded-xl border border-border bg-background p-5 text-left transition hover:border-primary hover:bg-accent/30"
                >
                  <p className="text-sm text-muted-foreground">Tambah</p>
                  <p className="text-lg font-semibold">Tempat / Venue</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Cocok untuk aula, studio, ruang meeting, lapangan, dll.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectProductType("EQUIPMENT")}
                  className="rounded-xl border border-border bg-background p-5 text-left transition hover:border-primary hover:bg-accent/30"
                >
                  <p className="text-sm text-muted-foreground">Tambah</p>
                  <p className="text-lg font-semibold">Barang / Peralatan</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Cocok untuk barang sewa seperti sound system, lighting, dll.
                  </p>
                </button>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => router.back()}>
                  Kembali
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Tipe Produk</p>
                <p className="font-medium">
                  {productType === "VENUE" ? "Tempat / Venue" : "Barang / Peralatan"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setProductType(null)}
              >
                Ubah Tipe
              </Button>
            </div>
            <Separator className="my-2" />

            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
              <div className="space-y-8">
                {/* Images Upload */}
                <section className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">Foto Produk</h2>
                    <p className="text-sm text-muted-foreground">
                      Tampilkan foto terbaik agar produk terlihat jelas.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                </section>

                {/* Basic Information */}
                <section className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">Informasi Dasar</h2>
                    <p className="text-sm text-muted-foreground">
                      Lengkapi detail utama produk yang akan ditampilkan ke pelanggan.
                    </p>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="lg:col-span-2">
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

                    <div className="lg:col-span-2">
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="mt-1 min-h-24"
                        placeholder="Deskripsikan produk Anda secara detail..."
                      />
                    </div>

                    {productType === "VENUE" ? (
                      <>
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
                      </>
                    ) : (
                      <div>
                        <Label htmlFor="stock">Jumlah Unit *</Label>
                        <div className="mt-1 flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => adjustStock(-1)}
                            aria-label="Kurangi jumlah unit"
                          >
                            -
                          </Button>
                          <Input
                            id="stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => handleInputChange("stock", e.target.value)}
                            className="max-w-[140px]"
                            min={0}
                            placeholder="0"
                            required
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => adjustStock(1)}
                            aria-label="Tambah jumlah unit"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Pricing */}
                <section className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">Harga & Transaksi</h2>
                    <p className="text-sm text-muted-foreground">
                      Atur tipe transaksi dan harga sewa jika dibutuhkan.
                    </p>
                  </div>
                  {productType === "EQUIPMENT" && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Pilih salah satu tipe transaksi.
                      </p>
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="rentalModeRent"
                            checked={rentalMode === "RENT"}
                            onCheckedChange={() => setRentalMode("RENT")}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <Label htmlFor="rentalModeRent">Penyewaan</Label>
                            <p className="text-xs text-muted-foreground">
                              Ada harga sewa dan satuan waktu.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="rentalModeBorrow"
                            checked={rentalMode === "BORROW"}
                            onCheckedChange={() => setRentalMode("BORROW")}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <Label htmlFor="rentalModeBorrow">Peminjaman</Label>
                            <p className="text-xs text-muted-foreground">
                              Tanpa harga sewa.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {rentalMode === "RENT" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Harga Sewa *</Label>
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
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Mode peminjaman tidak membutuhkan harga sewa.
                    </p>
                  )}
                </section>

                {/* Features */}
                <section className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">Fitur & Fasilitas</h2>
                    <p className="text-sm text-muted-foreground">
                      Cantumkan nilai tambah produk agar lebih menarik.
                    </p>
                  </div>
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
                </section>
              </div>

              <aside className="space-y-4 text-sm lg:sticky lg:top-6">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Ringkasan
                  </p>
                  <p className="text-base font-semibold">Detail Singkat</p>
                </div>
                <Separator />
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <span className="text-foreground">Tipe:</span>{" "}
                    {productType === "VENUE" ? "Tempat / Venue" : "Barang / Peralatan"}
                  </p>
                  <p>
                    <span className="text-foreground">Transaksi:</span>{" "}
                    {rentalMode === "RENT" ? "Penyewaan" : "Peminjaman"}
                  </p>
                  {rentalMode === "RENT" && (
                    <p>
                      <span className="text-foreground">Harga:</span>{" "}
                      {formData.price ? `Rp ${formData.price}` : "Belum diisi"}
                    </p>
                  )}
                  {productType === "EQUIPMENT" && (
                    <p>
                      <span className="text-foreground">Unit:</span>{" "}
                      {formData.stock || "0"}
                    </p>
                  )}
                  {productType === "VENUE" && (
                    <p>
                      <span className="text-foreground">Kapasitas:</span>{" "}
                      {formData.capacity || "Belum diisi"}
                    </p>
                  )}
                  <p>
                    <span className="text-foreground">Foto:</span>{" "}
                    {images.length} / 5
                  </p>
                </div>
              </aside>
            </div>

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
                disabled={
                  isLoading ||
                  isUploading ||
                  !formData.name ||
                  (rentalMode === "RENT" && !formData.price)
                }
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
          )}
        </div>
      </div>
    </div>
  );
}
