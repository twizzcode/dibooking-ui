"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
  thumbnailPosition?: "bottom" | "right" | "left";
}

export function ProductGallery({
  images,
  name,
  thumbnailPosition = "bottom",
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // LOGIKA UTAMA:
  // Kita gunakan Grid.
  // Jika 'right'/'left' (Desktop): Kita pakai 5 kolom.
  // - Main Image: ambil 4 kolom.
  // - Thumbnails: ambil 1 kolom.
  // Ini otomatis membuat tingginya sejajar (karena 4 tumpukan kotak kecil = 1 kotak besar 4x4).

  const isSide = thumbnailPosition === "right" || thumbnailPosition === "left";

  return (
    // 1. CONTAINER UTAMA
    // 'max-w-5xl' dan 'mx-auto' saya tambahkan agar di layar besar dia TIDAK RAKSASA.
    <div className={cn(
      "w-full max-w-5xl mx-auto", // <-- INI SOLUSI AGAR TIDAK KEBESARAN
      thumbnailPosition === "bottom" && "flex flex-col gap-2",
      // Grid 5 Kolom untuk Desktop Side Mode
      isSide && "grid grid-cols-1 md:grid-cols-5 gap-2" 
    )}>
      
      {/* 2. MAIN IMAGE */}
      <div className={cn(
        "relative overflow-hidden rounded-lg bg-accent group",
        // Main image selalu kotak
        "aspect-square w-full",
        // Desktop: Ambil 4 dari 5 kolom
        isSide && "md:col-span-4",
        // Jika posisi Left, kita ubah urutannya (order) menggunakan class order
        thumbnailPosition === "left" && "md:order-2" 
      )}>
        <img
          src={images[selectedImage]}
          alt={`${name} - View ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 gap-2 opacity-90 hover:opacity-100 shadow-sm z-10"
        >
          <Grid3x3 className="h-4 w-4" />
          <span className="hidden sm:inline">Lihat Semua</span>
        </Button>
      </div>

      {/* 3. THUMBNAIL LIST */}
      <div className={cn(
        "grid gap-2",
        // Mobile / Bottom: 4 kolom mendatar
        thumbnailPosition === "bottom" && "grid-cols-4",
        
        // Desktop / Side:
        // - Ambil 1 dari 5 kolom (md:col-span-1)
        // - Karena lebarnya 1/4 dari main image, dan main image tingginya 4x unit,
        //   maka 4 thumbnail kotak ini akan pas tingginya dari atas ke bawah.
        isSide && "md:col-span-1 grid-cols-4 md:grid-cols-1 content-start",
        
        thumbnailPosition === "left" && "md:order-1"
      )}>
        {images.slice(0, 4).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              // Aspect Square WAJIB ada biar thumbnail tetap kotak
              "relative aspect-square w-full overflow-hidden rounded-md border-2 transition-all",
              selectedImage === index
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-muted-foreground/30 opacity-70 hover:opacity-100"
            )}
          >
            <img
              src={image}
              alt={`${name} - Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
        
        {/* Placeholder (Opsional) untuk menjaga struktur grid jika gambar < 4 */}
        {images.length < 4 && isSide &&
             Array.from({ length: 4 - images.length }).map((_, i) => (
               <div key={`placeholder-${i}`} className="bg-muted/5 rounded-md aspect-square" />
        ))}
      </div>
    </div>
  );
}