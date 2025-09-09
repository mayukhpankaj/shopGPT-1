import { NextRequest, NextResponse } from 'next/server';
import { researchProduct } from '@/app/agent/productResearchAgent';

export async function POST(request: NextRequest) {
  try {
    const { product_link, product_name } = await request.json();

    if (!product_link || !product_name) {
      return NextResponse.json(
        { error: 'Missing product_link or product_name' },
        { status: 400 }
      );
    }

    const result = await researchProduct({ product_link, product_name });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      research: result.data,
      product_name
    });

  } catch (error) {
    console.error('Product research API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
