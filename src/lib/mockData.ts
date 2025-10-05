import { StyleImage, Product } from '@/lib/types';

// Mock gallery images
export const mockGalleryImages: StyleImage[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1511742667815-af572199b23a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3RyZWV0d2VhciUyMG91dGZpdHxlbnwxfHx8fDE3NTk1NjcxMjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Urban Streetwear Look',
    tags: ['streetwear', 'urban', 'casual'],
    likes: 324,
    isLiked: false,
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1736555142217-916540c7f1b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2FzdWFsJTIwc3R5bGV8ZW58MXx8fHwxNzU5NjI5NTM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Minimalist Casual',
    tags: ['minimalist', 'casual', 'clean'],
    likes: 189,
    isLiked: false,
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1755519024831-6833a37098ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXNoaW9uJTIwbG9va3xlbnwxfHx8fDE3NTk2Mjk1MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Modern Fashion',
    tags: ['modern', 'stylish', 'contemporary'],
    likes: 512,
    isLiked: true,
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1613338761484-f982b6362b9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0eWxlJTIwb3V0Zml0fGVufDF8fHx8MTc1OTYyOTUzNnww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Urban Style',
    tags: ['urban', 'street', 'edgy'],
    likes: 267,
    isLiked: false,
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1752950823536-2db75f37980d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZmFzaGlvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTYyOTUzNnww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Elegant Portrait',
    tags: ['elegant', 'formal', 'chic'],
    likes: 431,
    isLiked: false,
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1758513227171-9d83f43131bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBkZW5pbSUyMHN0eWxlfGVufDF8fHx8MTc1OTYyOTUzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Casual Denim',
    tags: ['casual', 'denim', 'relaxed'],
    likes: 298,
    isLiked: true,
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1727515546577-f7d82a47b51d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGphY2tldCUyMG91dGZpdHxlbnwxfHx8fDE3NTk2Mjk1Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Black Jacket Style',
    tags: ['jacket', 'black', 'classic'],
    likes: 376,
    isLiked: false,
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1661181475147-bbd20ef65781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoaXJ0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk1NjkzMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'White Shirt Fashion',
    tags: ['white', 'shirt', 'classic'],
    likes: 145,
    isLiked: false,
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1639602182178-2dc689354103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjBjYXN1YWx8ZW58MXx8fHwxNzU5NjI5NTM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Blue Jeans Casual',
    tags: ['jeans', 'blue', 'casual'],
    likes: 234,
    isLiked: false,
  },
  {
    id: '10',
    imageUrl: 'https://images.unsplash.com/photo-1598808696311-66be744a23c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGZhc2hpb24lMjBzdHlsZXxlbnwxfHx8fDE3NTk2Mjk1Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Sneakers Style',
    tags: ['sneakers', 'shoes', 'athletic'],
    likes: 412,
    isLiked: true,
  },
];

// Mock products for virtual try-on
export const mockProducts: Product[] = [
  {
    id: 'p1',
    garmentType: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1661181475147-bbd20ef65781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoaXJ0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk1NjkzMTJ8MA&ixlib=rb-4.1.0&q=80&w=400',
    brand: 'ZARA',
    name: 'Classic White Cotton Shirt',
    price: 29.99,
    retailerLink: '#',
  },
  {
    id: 'p2',
    garmentType: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1661181475147-bbd20ef65781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNoaXJ0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk1NjkzMTJ8MA&ixlib=rb-4.1.0&q=80&w=400',
    brand: 'H&M',
    name: 'Premium Linen Shirt',
    price: 34.99,
    retailerLink: '#',
  },
  {
    id: 'p3',
    garmentType: 'bottom',
    imageUrl: 'https://images.unsplash.com/photo-1639602182178-2dc689354103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjBjYXN1YWx8ZW58MXx8fHwxNzU5NjI5NTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
    brand: "LEVI'S",
    name: 'Slim Fit Blue Jeans',
    price: 79.99,
    retailerLink: '#',
  },
  {
    id: 'p4',
    garmentType: 'bottom',
    imageUrl: 'https://images.unsplash.com/photo-1639602182178-2dc689354103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjBjYXN1YWx8ZW58MXx8fHwxNzU5NjI5NTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
    brand: 'DIESEL',
    name: 'Straight Leg Denim',
    price: 149.99,
    retailerLink: '#',
  },
  {
    id: 'p5',
    garmentType: 'outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1727515546577-f7d82a47b51d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGphY2tldCUyMG91dGZpdHxlbnwxfHx8fDE3NTk2Mjk1Mzd8MA&ixlib=rb-4.1.0&q=80&w=400',
    brand: 'ZARA',
    name: 'Faux Leather Jacket',
    price: 99.99,
    retailerLink: '#',
  },
  {
    id: 'p6',
    garmentType: 'outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1727515546577-f7d82a47b51d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGphY2tldCUyMG91dGZpdHxlbnwxfHx8fDE3NTk2Mjk1Mzd8MA&ixlib=rb-4.1.0&q=80&w=400',
    brand: 'ALLSAINTS',
    name: 'Biker Leather Jacket',
    price: 349.99,
    retailerLink: '#',
  },
  {
    id: 'p7',
    garmentType: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1598808696311-66be744a23c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGZhc2hpb24lMjBzdHlsZXxlbnwxfHx8fDE3NTk2Mjk1Mzh8MA&ixlib=rb-4.1.0&q=80&w=400',
    brand: 'NIKE',
    name: 'Air Max Sneakers',
    price: 129.99,
    retailerLink: '#',
  },
  {
    id: 'p8',
    garmentType: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1598808696311-66be744a23c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGZhc2hpb24lMjBzdHlsZXxlbnwxfHx8fDE3NTk2Mjk1Mzh8MA&ixlib=rb-4.1.0&q=80&w=400',
    brand: 'ADIDAS',
    name: 'Stan Smith Classic',
    price: 89.99,
    retailerLink: '#',
  },
];

// Mock API function to simulate Gemini garment detection
export const detectGarments = async (imageId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    { id: 'g1', type: 'top' as const, color: 'white', fit: 'slim', style: 'casual' },
    { id: 'g2', type: 'bottom' as const, color: 'blue', fit: 'regular', style: 'denim' },
    { id: 'g3', type: 'outerwear' as const, color: 'black', fit: 'fitted', style: 'leather' },
    { id: 'g4', type: 'shoes' as const, color: 'white', fit: 'athletic', style: 'sneakers' },
  ];
};

// Mock API function to simulate retail product search
export const searchProducts = async (garmentType: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockProducts.filter(p => p.garmentType === garmentType);
};

// Mock API function to simulate virtual try-on
export const performTryOn = async (userImageUrl: string, garmentImageUrl: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return the same user image as a placeholder
  // In a real app, this would return the merged image
  return userImageUrl;
};

// New API function: Get garment suggestions from image URL
export async function getGarmentSuggestionsFromImage(imageUrl: string): Promise<{
  garment_keywords: Record<string, string>;
  garment_results: Record<string, any[]>;
}> {
  // Step 1: Get keywords from Gemini
  const keywordsResponse = await fetch('/api/gemini_keywords_from_image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imgURL: imageUrl }),
  });

  if (!keywordsResponse.ok) {
    const errorData = await keywordsResponse.json();
    throw new Error(`Failed to get keywords: ${errorData.error}`);
  }

  const garment_keywords = await keywordsResponse.json();

  // Step 2: Search for each keyword (up to 10)
  const garment_results: Record<string, any[]> = {};
  const keywordEntries = Object.entries(garment_keywords).slice(0, 10);

  // Search for 4 garments per keyword
  await Promise.all(
    keywordEntries.map(async ([key, keyword]) => {
      const searchResponse = await fetch(`/api/garment_image_search?keyword=${encodeURIComponent(keyword as string)}&num=4`);
      if (searchResponse.ok) {
        const data = await searchResponse.json();
        garment_results[key] = data.images || [];
      } else {
        garment_results[key] = [];
      }
    })
  );

  return {
    garment_keywords,
    garment_results,
  };
}

// Legacy API function: Get garment suggestions from style reference (still uses old garment_search)
export async function getGarmentSuggestionsFromStyle(styleReference: string): Promise<{
  score: string;
  feedback: any;
  ai_script: string;
  garment_suggestion: Record<string, string>;
  garment_results: Record<string, any[]>;
}> {
  const params = new URLSearchParams({
    styleReference: styleReference,
    num: '10',
  });

  const url = `/api/garment_search?${params.toString()}`;
  console.log('Fetching:', url, 'with styleReference:', styleReference);

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    console.error('API Error:', errorData);
    throw new Error(`Failed to fetch garment suggestions: ${errorData.error} - ${errorData.details}`);
  }

  return response.json();
}

// Convert garment results to Product format
export function convertGarmentResultsToProducts(garmentResults: Record<string, any[]>): Product[] {
  const products: Product[] = [];
  let productId = 1;

  for (const [key, images] of Object.entries(garmentResults)) {
    for (const image of images) {
      products.push({
        id: `${key}-${productId++}`,
        garmentType: key.replace('garment_', '') as 'top' | 'bottom' | 'outerwear' | 'shoes',
        imageUrl: image.url,
        brand: 'Online Store',
        name: image.title || 'Garment',
        price: Math.floor(Math.random() * 150) + 29.99, // Random price for now
        retailerLink: image.pageUrl || '#',
      });
    }
  }

  return products;
}
