"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { Review } from "@/types/product-detail";

interface ReviewSectionProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ReviewSection({
  reviews,
  rating,
  reviewCount,
}: ReviewSectionProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
          <div>
            <h2 className="text-xl font-semibold">
              {rating} · {reviewCount} Ulasan
            </h2>
          </div>
        </div>
        <Button variant="link">Lihat Semua</Button>
      </div>

      <Separator />

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id}>
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                  {review.userAvatar}
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{review.userName}</h4>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    · {review.date}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
            {review.id !== reviews[reviews.length - 1].id && (
              <Separator className="mt-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
