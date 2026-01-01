"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Clock, Facebook, Instagram } from "lucide-react";
import { BrandProfile } from "@/types/brand";

interface BrandSidebarProps {
  brand: BrandProfile;
}

export function BrandSidebar({ brand }: BrandSidebarProps) {
  return (
    <div className="space-y-4">
      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About {brand.name.split(" ")[0]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {brand.description.substring(0, 150)}...
          </p>
          <Button variant="link" className="p-0 h-auto text-primary">
            View Profile →
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            Community Center
          </Button>
        </CardContent>
      </Card>

      {/* Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="aspect-square bg-accent rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Map</span>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Open Maps
          </Button>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-muted-foreground">{brand.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{brand.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{brand.email}</span>
          </div>
          {brand.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{brand.website}</span>
            </div>
          )}
          <div className="flex items-start gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Mon-Fri: {brand.operatingHours.weekday}</p>
              {brand.operatingHours.weekend && (
                <p className="text-muted-foreground">Weekend: {brand.operatingHours.weekend}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="icon" variant="outline" className="h-9 w-9">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="h-9 w-9">
              <Instagram className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
