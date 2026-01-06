import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function GET() {
  try {
    // Fetch active products
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    // Fetch all prices for these products
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });

    // Combine products with their prices, only include products with active prices
    const productsWithPrices = products.data
      .map((product) => {
        const productPrices = prices.data.filter(
          (price) => 
            typeof price.product === 'string' 
              ? price.product === product.id 
              : price.product.id === product.id
        );

        // Only include products that have at least one active price
        if (productPrices.length === 0) {
          return null;
        }

        // Get the default price or first price
        const defaultPrice = productPrices.find(
          (p) => p.id === product.default_price
        ) || productPrices[0];

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          metadata: product.metadata,
          prices: productPrices.map((price) => ({
            id: price.id,
            unit_amount: price.unit_amount,
            currency: price.currency,
            recurring: price.recurring,
            type: price.type,
          })),
          defaultPrice: defaultPrice ? {
            id: defaultPrice.id,
            unit_amount: defaultPrice.unit_amount,
            currency: defaultPrice.currency,
            recurring: defaultPrice.recurring,
            type: defaultPrice.type,
          } : null,
        };
      })
      .filter((product) => product !== null) as Array<{
        id: string;
        name: string;
        description: string | null;
        images: string[];
        metadata: Stripe.Metadata;
        prices: Array<{
          id: string;
          unit_amount: number | null;
          currency: string;
          recurring: Stripe.Price.Recurring | null;
          type: string;
        }>;
        defaultPrice: {
          id: string;
          unit_amount: number | null;
          currency: string;
          recurring: Stripe.Price.Recurring | null;
          type: string;
        } | null;
      }>;

    // Sort by metadata.order if available, otherwise by creation date
    productsWithPrices.sort((a, b) => {
      const orderA = a.metadata?.order ? parseInt(a.metadata.order) : 999;
      const orderB = b.metadata?.order ? parseInt(b.metadata.order) : 999;
      return orderA - orderB;
    });

    return NextResponse.json({ products: productsWithPrices });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 400 }
    );
  }
}

