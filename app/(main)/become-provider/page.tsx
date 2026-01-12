"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  User,
  Building2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface FormData {
  // Personal Info
  fullName: string;
  email: string;
  phone: string;
  
  // Business Info
  businessName: string;
  businessSlug: string;
  businessType: "RENTAL" | "VENUE" | "BOTH";
  businessDescription: string;
  
  // Optional Address
  address: string;
  city: string;
  province: string;
  postalCode: string;
  
  // Bank Info (optional for non-profit)
  isNonProfit: boolean;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

interface FormErrors {
  [key: string]: string;
}

const steps = [
  {
    id: 1,
    title: "Informasi Pribadi",
    description: "Data diri Anda",
    icon: User,
  },
  {
    id: 2,
    title: "Informasi Bisnis",
    description: "Detail brand Anda",
    icon: Building2,
  },
  {
    id: 3,
    title: "Selesai",
    description: "Pendaftaran berhasil",
    icon: CheckCircle2,
  },
];

export default function BecomeProviderPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    businessSlug: "",
    businessType: "RENTAL",
    businessDescription: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    isNonProfit: false,
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
  });

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        setFormData(prev => ({
          ...prev,
          fullName: session.data?.user?.name || "",
          email: session.data?.user?.email || "",
        }));
      }
    };
    loadUserData();
  }, []);

  // Debounced slug check
  useEffect(() => {
    if (!formData.businessSlug || formData.businessSlug.length < 3) {
      setSlugAvailable(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsCheckingSlug(true);
      try {
        const res = await fetch(`/api/brands/check-slug?slug=${formData.businessSlug}`);
        const data = await res.json();
        setSlugAvailable(data.available);
      } catch {
        setSlugAvailable(null);
      } finally {
        setIsCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.businessSlug]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow lowercase letters, numbers, and hyphens
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData((prev) => ({ ...prev, businessSlug: value }));
    if (errors.businessSlug) {
      setErrors((prev) => ({ ...prev, businessSlug: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isNonProfit: checked }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Nama lengkap wajib diisi";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email wajib diisi";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Format email tidak valid";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Nomor telepon wajib diisi";
      }
    }

    if (step === 2) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = "Nama bisnis wajib diisi";
      }
      if (!formData.businessSlug.trim()) {
        newErrors.businessSlug = "Slug wajib diisi";
      } else if (formData.businessSlug.length < 3) {
        newErrors.businessSlug = "Slug minimal 3 karakter";
      } else if (slugAvailable === false) {
        newErrors.businessSlug = "Slug sudah digunakan";
      }
      if (!formData.businessDescription.trim()) {
        newErrors.businessDescription = "Deskripsi bisnis wajib diisi";
      }
      
      // Bank info required if not non-profit
      if (!formData.isNonProfit) {
        if (!formData.bankName.trim()) {
          newErrors.bankName = "Nama bank wajib diisi";
        }
        if (!formData.bankAccountNumber.trim()) {
          newErrors.bankAccountNumber = "Nomor rekening wajib diisi";
        }
        if (!formData.bankAccountName.trim()) {
          newErrors.bankAccountName = "Nama pemilik rekening wajib diisi";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        handleSubmit();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.businessName,
          slug: formData.businessSlug,
          type: formData.businessType,
          description: formData.businessDescription,
          address: formData.address || null,
          city: formData.city || null,
          province: formData.province || null,
          postalCode: formData.postalCode || null,
          isNonProfit: formData.isNonProfit,
          bankInfo: formData.isNonProfit ? null : {
            bankName: formData.bankName,
            accountNumber: formData.bankAccountNumber,
            accountName: formData.bankAccountName,
          },
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal mendaftarkan brand");
      }

      // Move to completion step
      setCurrentStep(3);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                  ${isCompleted ? "bg-primary border-primary text-primary-foreground" : ""}
                  ${isCurrent ? "border-primary text-primary" : ""}
                  ${!isCompleted && !isCurrent ? "border-muted text-muted-foreground" : ""}
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 ${
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderPersonalInfoStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Pribadi</CardTitle>
        <CardDescription>
          Masukkan data diri Anda sebagai pemilik brand
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Nama Lengkap <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Masukkan nama lengkap"
            className={errors.fullName ? "border-destructive" : ""}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="email@example.com"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Nomor Telepon <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="08xxxxxxxxxx"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.phone}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderBusinessInfoStep = () => (
    <div className="space-y-6">
      {/* Business Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Bisnis</CardTitle>
          <CardDescription>
            Detail brand yang akan Anda daftarkan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">
              Nama Bisnis <span className="text-destructive">*</span>
            </Label>
            <Input
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="Contoh: Studio Kreatif Jakarta"
              className={errors.businessName ? "border-destructive" : ""}
            />
            {errors.businessName && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.businessName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessSlug">
              Slug URL <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                dibooking.id/
              </span>
              <div className="relative flex-1">
                <Input
                  id="businessSlug"
                  name="businessSlug"
                  value={formData.businessSlug}
                  onChange={handleSlugChange}
                  placeholder="studio-kreatif"
                  className={`pr-10 ${errors.businessSlug ? "border-destructive" : ""}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isCheckingSlug && (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                  {!isCheckingSlug && slugAvailable === true && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  {!isCheckingSlug && slugAvailable === false && (
                    <X className="w-4 h-4 text-destructive" />
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Hanya huruf kecil, angka, dan tanda hubung (-). Minimal 3 karakter.
            </p>
            {errors.businessSlug && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.businessSlug}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType">
              Jenis Bisnis <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.businessType}
              onValueChange={(value) => handleSelectChange("businessType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis bisnis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RENTAL">Rental (Penyewaan Barang)</SelectItem>
                <SelectItem value="VENUE">Venue (Penyewaan Tempat)</SelectItem>
                <SelectItem value="BOTH">Keduanya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDescription">
              Deskripsi Bisnis <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="businessDescription"
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleInputChange}
              placeholder="Ceritakan tentang bisnis Anda..."
              rows={4}
              className={errors.businessDescription ? "border-destructive" : ""}
            />
            {errors.businessDescription && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.businessDescription}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optional Address Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Alamat Bisnis
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
              Opsional
            </span>
          </CardTitle>
          <CardDescription>
            Alamat ini akan ditampilkan di halaman brand Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Jl. Contoh No. 123"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Kota</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Jakarta"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provinsi</Label>
              <Input
                id="province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                placeholder="DKI Jakarta"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Kode Pos</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="12345"
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Rekening</CardTitle>
          <CardDescription>
            Untuk menerima pembayaran dari pemesanan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isNonProfit"
              checked={formData.isNonProfit}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="isNonProfit" className="text-sm font-normal cursor-pointer">
              Ini adalah organisasi non-profit (tidak memerlukan informasi bank)
            </Label>
          </div>

          {!formData.isNonProfit && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="bankName">
                  Nama Bank <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="Contoh: BCA, Mandiri, BNI"
                  className={errors.bankName ? "border-destructive" : ""}
                />
                {errors.bankName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.bankName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">
                  Nomor Rekening <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bankAccountNumber"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  className={errors.bankAccountNumber ? "border-destructive" : ""}
                />
                {errors.bankAccountNumber && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.bankAccountNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountName">
                  Nama Pemilik Rekening <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bankAccountName"
                  name="bankAccountName"
                  value={formData.bankAccountName}
                  onChange={handleInputChange}
                  placeholder="Sesuai buku tabungan"
                  className={errors.bankAccountName ? "border-destructive" : ""}
                />
                {errors.bankAccountName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.bankAccountName}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {errors.submit && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errors.submit}
          </p>
        </div>
      )}
    </div>
  );

  const renderCompletionStep = () => (
    <Card>
      <CardContent className="pt-8 pb-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Pendaftaran Berhasil!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Selamat! Brand Anda <strong>{formData.businessName}</strong> telah berhasil didaftarkan.
            Anda sekarang dapat mengelola brand Anda melalui dashboard.
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg inline-block">
          <p className="text-sm text-muted-foreground mb-1">URL Brand Anda:</p>
          <p className="font-mono text-primary">
            dibooking.id/{formData.businessSlug}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            onClick={() => router.push("/dashboard")}
            className="gap-2"
          >
            Ke Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/${formData.businessSlug}`)}
          >
            Lihat Halaman Brand
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderBusinessInfoStep();
      case 3:
        return renderCompletionStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Daftar Sebagai Provider</h1>
          <p className="text-muted-foreground">
            Daftarkan brand Anda dan mulai terima pemesanan
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLoading || (currentStep === 2 && isCheckingSlug)}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : currentStep === 2 ? (
                <>
                  Daftar Sekarang
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : (
                <>
                  Selanjutnya
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
