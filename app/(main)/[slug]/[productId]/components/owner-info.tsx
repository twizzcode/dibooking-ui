"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle } from "lucide-react";
import { Owner } from "@/types/product-detail";
import { useRouter } from "next/navigation";

interface OwnerInfoProps {
  owner: Owner;
  brandSlug: string;
}

export function OwnerInfo({ owner, brandSlug }: OwnerInfoProps) {
  const router = useRouter();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold">
              {owner.avatar}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{owner.name}</h3>
              {owner.verified && (
                <CheckCircle className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="h-4 w-4" />
              <span>{owner.location}</span>
              <span>·</span>
              <span>Bergabung {owner.memberSince}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => router.push(`/${brandSlug}`)}
              >
                Hubungi Penyedia
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
