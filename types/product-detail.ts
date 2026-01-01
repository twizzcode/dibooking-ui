export interface ProductDetail {
  id: string;
  name: string;
  type: "barang" | "tempat";
  brand: string;
  brandSlug: string;
  brandLogo: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  priceUnit: string;
  images: string[];
  description: string;
  facilities: Facility[];
  owner: Owner;
  reviews: Review[];
  relatedProducts: RelatedProduct[];
  specifications?: Specification[];
}

export interface Facility {
  icon: string;
  label: string;
  value: string;
}

export interface Owner {
  name: string;
  avatar: string;
  location: string;
  memberSince: string;
  verified: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  priceUnit: string;
  location: string;
}

export interface Specification {
  label: string;
  value: string;
}
