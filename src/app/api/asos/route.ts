import { NextRequest, NextResponse } from 'next/server';
import { ASOSAPI } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { searchQuery, store } = await request.json();

    const asosAPI = new ASOSAPI();

    // Get products from ASOS
    const products = await asosAPI.searchProducts(
      searchQuery || 'clothing',
      12,
      store || 'US'
    );

    return NextResponse.json({
      success: true,
      products,
      totalProducts: products.length
    });
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}