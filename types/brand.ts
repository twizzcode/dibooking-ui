export type VenueItem = {
  id: string;
  name: string;
  description: string;
  capacity?: string;
  size?: string;
  features: string[];
  price: number;
  priceUnit: string;
  image: string;
  type: "venue" | "equipment" | "package";
};

export type BrandProfile = {
  slug: string;
  name: string;
  description: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  coverImage: string;
  logoImage?: string;
  logoInitial: string;
  rating: number;
  reviewCount: number;
  establishedYear?: number;
  type: "venue" | "rental" | "service";
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  operatingHours: {
    weekday: string;
    weekend?: string;
  };
  items: VenueItem[];
};
