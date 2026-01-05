import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, amount, reason } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session to get payment_intent
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (!session.payment_intent) {
      return NextResponse.json(
        { error: "No payment intent found for this session" },
        { status: 400 }
      );
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent.id;

    // Get charges for this payment intent
    const charges = await stripe.charges.list({
      payment_intent: paymentIntentId,
      limit: 1,
    });

    if (charges.data.length === 0) {
      return NextResponse.json(
        { error: "No charges found for this payment" },
        { status: 400 }
      );
    }

    const chargeId = charges.data[0].id;

    // Create refund
    const refundParams: Stripe.RefundCreateParams = {
      charge: chargeId,
      reason: reason || undefined,
    };

    // If partial refund amount is specified
    if (amount && amount > 0) {
      refundParams.amount = Math.round(amount * 100); // Convert to cents
    }

    const refund = await stripe.refunds.create(refundParams);

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason,
        created: refund.created,
      },
    });
  } catch (error: any) {
    console.error("Error creating refund:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 400 }
    );
  }
}

// GET endpoint to check refund status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (!session.payment_intent) {
      return NextResponse.json(
        { error: "No payment intent found for this session" },
        { status: 400 }
      );
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent.id;

    // Get charges for this payment intent
    const charges = await stripe.charges.list({
      payment_intent: paymentIntentId,
    });

    // Get refunds for all charges
    const refunds: any[] = [];

    for (const charge of charges.data) {
      // Get refunds for this charge
      const chargeRefunds = await stripe.refunds.list({
        charge: charge.id,
      });
      refunds.push(...chargeRefunds.data);
    }

    return NextResponse.json({
      sessionId,
      paymentStatus: session.payment_status,
      refunds: refunds.map((refund) => ({
        id: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason,
        created: refund.created,
      })),
    });
  } catch (error: any) {
    console.error("Error retrieving refunds:", error);
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 400 }
    );
  }
}
