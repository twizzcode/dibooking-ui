export type ProductType = "barang" | "tempat";

export type Product = {
  id: string;
  name: string;
  slug?: string;
  brand: string;
  brandSlug?: string;
  brandLogo?: string;
  category: string;
  type: ProductType;
  location: string;
  price: number;
  priceUnit: string;
  image: string;
  rating: number;
  reviewCount: number;
  rentCount: number;
  availability: "available" | "sold" | "rented";
  tags: string[];
};

export type FilterOptions = {
  brands: string[];
  categories: string[];
  locations: string[];
  priceRange: {
    min: number;
    max: number;
  };
  type: ProductType | "all";
};
