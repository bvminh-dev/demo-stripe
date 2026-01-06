import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const {
      priceId: requestPriceId,
      metadata: userMetadata,
      locale,
    } = await request.json();

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

    // Prepare metadata for both session and payment intent
    const sessionMetadata: Record<string, string> = {
      product: "GlowUp Premium",
    };
    const paymentIntentMetadata: Record<string, string> = {
      product: "GlowUp Premium",
    };

    if (userMetadata?.userId) {
      sessionMetadata.UserId = userMetadata.userId;
      paymentIntentMetadata.UserId = userMetadata.userId;
    }
    if (userMetadata?.creditGranted) {
      sessionMetadata.CreditGranted = userMetadata.creditGranted.toString();
      paymentIntentMetadata.CreditGranted =
        userMetadata.creditGranted.toString();
    }

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
      metadata: sessionMetadata,
      payment_intent_data: {
        metadata: paymentIntentMetadata,
      },
      locale: locale || userMetadata?.locale || "en",
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
