"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Facebook, Youtube, Globe } from "lucide-react";

interface SocialMediaData {
  instagram: string;
  facebook: string;
  youtube: string;
  website: string;
}

interface SocialMediaSettingsProps {
  socialMedia: SocialMediaData;
  onSocialMediaChange: (field: keyof SocialMediaData, value: string) => void;
}

export function SocialMediaSettings({
  socialMedia,
  onSocialMediaChange,
}: SocialMediaSettingsProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Media Sosial</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Tambahkan link media sosial Anda untuk memudahkan pelanggan menghubungi Anda
        </p>
        <div className="space-y-4">
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <div className="relative mt-1">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="instagram"
                value={socialMedia.instagram}
                onChange={(e) => onSocialMediaChange("instagram", e.target.value)}
                className="h-10 pl-10"
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <div className="relative mt-1">
              <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="facebook"
                value={socialMedia.facebook}
                onChange={(e) => onSocialMediaChange("facebook", e.target.value)}
                className="h-10 pl-10"
                placeholder="https://facebook.com/page"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="youtube">YouTube</Label>
            <div className="relative mt-1">
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="youtube"
                value={socialMedia.youtube}
                onChange={(e) => onSocialMediaChange("youtube", e.target.value)}
                className="h-10 pl-10"
                placeholder="https://youtube.com/@channel"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <div className="relative mt-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                value={socialMedia.website}
                onChange={(e) => onSocialMediaChange("website", e.target.value)}
                className="h-10 pl-10"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
