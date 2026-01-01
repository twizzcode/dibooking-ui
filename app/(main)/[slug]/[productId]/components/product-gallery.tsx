"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid3x3 } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-2">
      {/* Main Image */}
      <div className="relative aspect-[4/3] bg-accent rounded-lg overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={`${name} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 gap-2"
        >
          <Grid3x3 className="h-4 w-4" />
          Lihat Semua Foto
        </Button>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-2">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square bg-accent rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? "border-primary"
                : "border-transparent hover:border-muted-foreground/50"
            }`}
          >
            <img
              src={image}
              alt={`${name} - Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
