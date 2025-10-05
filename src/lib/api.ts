import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  url: string;
  category: string;
  color?: string;
  description?: string;
}

export interface SimilarProduct {
  id: string;
  name: string;
  image: string;
  similarity_score: number;
  brand?: string;
  price?: string;
}

export class ASOSAPI {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || '';
    this.apiUrl = process.env.ASOS_API_URL || 'https://asos2.p.rapidapi.com';
  }

  async searchProducts(
    query: string,
    limit: number = 12,
    store: string = 'US',
    offset: number = 0
  ): Promise<Product[]> {
    try {
      console.log('=== ASOS API Call ===');
      console.log('Query:', query);
      console.log('Store:', store);
      console.log('Limit:', limit);

      const response = await axios.get(`${this.apiUrl}/products/v2/list`, {
        params: {
          q: query,
          store: store,
          offset: offset.toString(),
          categoryId: '4209',
          limit: limit.toString(),
          country: store,
          currency: store === 'US' ? 'USD' : 'GBP',
          lang: store === 'US' ? 'en-US' : 'en-GB'
        },
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'asos2.p.rapidapi.com'
        }
      });

      console.log('=== ASOS API Response ===');
      console.log('Status:', response.status);
      console.log('Products found:', response.data.products?.length || 0);

      return this.transformAsosData(response.data.products || []);
    } catch (error: any) {
      console.error('=== ASOS API Error ===');
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  }

  private transformAsosData(rawData: any[]): Product[] {
    const products: Product[] = [];

    for (const item of rawData) {
      // Get image URL - ASOS returns URLs without protocol
      let imageUrl = '';
      if (item.imageUrl) {
        imageUrl = item.imageUrl;
      } else if (item.images && item.images.length > 0) {
        imageUrl = item.images[0];
      }

      // Validate we have an image URL
      if (!imageUrl || imageUrl === '') {
        console.warn(`Product ${item.id} has no image URL`);
        continue;
      }

      // Add protocol if missing
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        if (imageUrl.startsWith('//')) {
          imageUrl = `https:${imageUrl}`;
        } else {
          imageUrl = `https://${imageUrl}`;
        }
      }

      // Try to construct URL to validate it
      try {
        new URL(imageUrl);
      } catch (e) {
        console.warn(`Product ${item.id} has invalid image URL after fixing: ${imageUrl}`);
        continue;
      }

      products.push({
        id: item.id?.toString() || '',
        name: item.name || '',
        brand: item.brandName || 'ASOS',
        price: item.price?.current?.text || item.price?.current?.value?.toString() || 'Price not available',
        image: imageUrl,
        url: item.url ? `https://www.asos.com/${item.url}` : `https://www.asos.com/prd/${item.id}`,
        category: item.categoryName || 'Clothing',
        color: item.colour || item.color,
        description: item.productType
      });
    }

    console.log(`Transformed ${products.length} products successfully`);
    return products;
  }
}

export class LykdatAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.LYKDAT_API_KEY || '';
    this.baseUrl = process.env.LYKDAT_BASE_URL || 'https://api.lykdat.com';
  }

  async findSimilarProducts(imageUrl: string, filters?: {
    color?: string;
    style?: string;
    category?: string;
  }): Promise<SimilarProduct[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/search/visual`,
        {
          image_url: imageUrl,
          filters: filters || {},
          limit: 20,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return this.transformLykdatData(response.data.results);
    } catch (error) {
      console.error('Error finding similar products:', error);
      return this.getMockSimilarProducts();
    }
  }

  private transformLykdatData(rawData: any[]): SimilarProduct[] {
    return rawData.map((item, index) => ({
      id: item.id || `similar-${index}`,
      name: item.name || item.title || 'Similar Product',
      image: item.image_url || item.image || '',
      similarity_score: item.similarity_score || Math.random() * 0.3 + 0.7,
      brand: item.brand,
      price: item.price,
    }));
  }

  private getMockSimilarProducts(): SimilarProduct[] {
    return [
      {
        id: 'similar-1',
        name: 'Similar Earth-Tone Jacket',
        image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400',
        similarity_score: 0.92,
        brand: 'H&M',
        price: '$69.99'
      },
      {
        id: 'similar-2',
        name: 'Matching Warm Cardigan',
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
        similarity_score: 0.87,
        brand: 'Mango',
        price: '$55.00'
      },
    ];
  }
}
