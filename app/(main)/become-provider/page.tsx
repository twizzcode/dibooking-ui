"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { onboardingSchema } from "@/lib/validation/brand";

interface FormData {
  // Personal Info
  fullName: string;
  email: string;
  phone: string;
  
  // Business Info
  businessName: string;
  businessSlug: string;
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
];

export default function BecomeProviderPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [slugTouched, setSlugTouched] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    businessSlug: "",
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
        const res = await fetch(
          `/api/brands/check-slug?slug=${encodeURIComponent(formData.businessSlug)}`
        );
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

  const normalizeSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "businessName" && !slugTouched) {
        return {
          ...prev,
          businessName: value,
          businessSlug: normalizeSlug(value),
        };
      }
      return { ...prev, [name]: value };
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow lowercase letters, numbers, and hyphens
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData((prev) => ({ ...prev, businessSlug: value }));
    if (!slugTouched) {
      setSlugTouched(true);
    }
    if (errors.businessSlug) {
      setErrors((prev) => ({ ...prev, businessSlug: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      const result = onboardingSchema
        .pick({ fullName: true, email: true, phone: true })
        .safeParse(formData);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const key = issue.path[0];
          if (typeof key === "string") {
            newErrors[key] = issue.message;
          }
        }
      }
    }

    if (step === 2) {
      const result = onboardingSchema
        .pick({ businessName: true, businessSlug: true })
        .safeParse(formData);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const key = issue.path[0];
          if (typeof key === "string") {
            newErrors[key] = issue.message;
          }
        }
      }
      if (slugAvailable === false) {
        newErrors.businessSlug = "Slug sudah digunakan";
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
      const parsed = onboardingSchema.safeParse(formData);
      if (!parsed.success) {
        const newErrors: FormErrors = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0];
          if (typeof key === "string") {
            newErrors[key] = issue.message;
          }
        }
        if (slugAvailable === false) {
          newErrors.businessSlug = "Slug sudah digunakan";
        }
        setErrors(newErrors);
        return;
      }

      const response = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.businessName,
          slug: parsed.data.businessSlug,
          phone: parsed.data.phone,
          email: parsed.data.email,
          ownerName: parsed.data.fullName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal mendaftarkan brand");
      }

      router.push("/dashboard?onboard=1");
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
      <CardContent className="space-y-5">
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
            className={`h-11 text-base px-3 ${errors.fullName ? "border-destructive" : ""}`}
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
            className={`h-11 text-base px-3 ${errors.email ? "border-destructive" : ""}`}
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
            className={`h-11 text-base px-3 ${errors.phone ? "border-destructive" : ""}`}
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
      <Card>
        <CardHeader>
          <CardTitle>Informasi Bisnis</CardTitle>
          <CardDescription>
            Detail brand yang akan Anda daftarkan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
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
              className={`h-11 text-base px-3 ${errors.businessName ? "border-destructive" : ""}`}
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
                  className={`h-11 text-base px-3 pr-10 ${errors.businessSlug ? "border-destructive" : ""}`}
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderBusinessInfoStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container max-w-3xl w-full mx-auto py-10 px-4">
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
        {currentStep <= steps.length && (
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
                  <ArrowRight className="w-4 h-4" />
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
