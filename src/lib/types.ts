// Types for the fashion discovery platform

export interface StyleImage {
  id: string;
  imageUrl: string;
  title: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
}

export interface DetectedGarment {
  id: string;
  type: 'top' | 'bottom' | 'outerwear' | 'shoes';
  color: string;
  fit: string;
  style: string;
}

export interface Product {
  id: string;
  garmentType: 'top' | 'bottom' | 'outerwear' | 'shoes';
  imageUrl: string;
  brand: string;
  name: string;
  price: number;
  retailerLink: string;
}

export interface TryOnHistory {
  id: string;
  timestamp: Date;
  imageUrl: string;
  products: Product[];
  totalPrice: number;
}

export interface OutfitSlot {
  type: 'top' | 'bottom' | 'outerwear' | 'shoes';
  product: Product | null;
}

export interface FilterOptions {
  gender: string[];
  color: string[];
  occasion: string[];
  aesthetic: string[];
}
