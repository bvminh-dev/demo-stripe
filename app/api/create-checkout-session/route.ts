import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const { priceId: requestPriceId, metadata: userMetadata } =
      await request.json();

    // Use priceId from request, environment variable, or inline pricing
    const priceId = requestPriceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    // If no priceId is provided, create a session with inline pricing
    const lineItems = priceId
      ? [
          {
            price: priceId,
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: "usd",
              unit_amount: 7900, // $79.00 in cents for Premium plan
              product_data: {
                name: "GlowUp Premium Plan",
                description:
                  "Advanced AI-powered skincare analysis and recommendations",
                images: [],
              },
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${
        process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"
      }/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"
      }/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_email: undefined, // Will be collected during checkout
      metadata: {
        product: "GlowUp Premium",
        ...(userMetadata?.userId && { UserId: userMetadata.userId }),
        ...(userMetadata?.creditGranted && {
          CreditGranted: userMetadata.creditGranted.toString(),
        }),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 400 }
    );
  }
}
