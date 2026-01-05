import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature found" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Helper function to get metadata from payment intent
  const getMetadataFromPaymentIntent = async (
    paymentIntentId: string
  ): Promise<Record<string, string> | null> => {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      return paymentIntent.metadata || null;
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      return null;
    }
  };

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Payment successful for session: ${session.id}`);
      console.log("Session metadata:", session.metadata);
      if (session.metadata) {
        console.log("UserId:", session.metadata.UserId);
        console.log("CreditGranted:", session.metadata.CreditGranted);
      }
      break;

    case "checkout.session.expired":
      const expiredSession = event.data.object as Stripe.Checkout.Session;
      console.log(`Checkout session expired: ${expiredSession.id}`);
      console.log("Session metadata:", expiredSession.metadata);
      if (expiredSession.metadata) {
        console.log("UserId:", expiredSession.metadata.UserId);
        console.log("CreditGranted:", expiredSession.metadata.CreditGranted);
      }
      break;

    case "checkout.session.async_payment_succeeded":
      const asyncSuccessSession = event.data.object as Stripe.Checkout.Session;
      console.log(
        `Async payment succeeded for session: ${asyncSuccessSession.id}`
      );
      console.log("Session metadata:", asyncSuccessSession.metadata);
      if (asyncSuccessSession.metadata) {
        console.log("UserId:", asyncSuccessSession.metadata.UserId);
        console.log(
          "CreditGranted:",
          asyncSuccessSession.metadata.CreditGranted
        );
      }
      break;

    case "checkout.session.async_payment_failed":
      const asyncFailedSession = event.data.object as Stripe.Checkout.Session;
      console.log(`Async payment failed for session: ${asyncFailedSession.id}`);
      console.log("Session metadata:", asyncFailedSession.metadata);
      if (asyncFailedSession.metadata) {
        console.log("UserId:", asyncFailedSession.metadata.UserId);
        console.log(
          "CreditGranted:",
          asyncFailedSession.metadata.CreditGranted
        );
      }
      break;

    case "payment_intent.created":
      const createdPaymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent created: ${createdPaymentIntent.id}`);
      console.log("PaymentIntent metadata:", createdPaymentIntent.metadata);
      if (createdPaymentIntent.metadata) {
        console.log("UserId:", createdPaymentIntent.metadata.UserId);
        console.log(
          "CreditGranted:",
          createdPaymentIntent.metadata.CreditGranted
        );
        // Update charge metadata if charge exists
        if (createdPaymentIntent.metadata) {
          try {
            const charges = await stripe.charges.list({
              payment_intent: createdPaymentIntent.id,
              limit: 1,
            });
            if (charges.data.length > 0 && charges.data[0].id) {
              await stripe.charges.update(charges.data[0].id, {
                metadata: createdPaymentIntent.metadata,
              });
              console.log(
                `Charge metadata updated for charge: ${charges.data[0].id}`
              );
            }
          } catch (error) {
            console.error("Error updating charge metadata:", error);
          }
        }
      }
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
      console.log("PaymentIntent metadata:", paymentIntent.metadata);
      if (paymentIntent.metadata) {
        console.log("UserId:", paymentIntent.metadata.UserId);
        console.log("CreditGranted:", paymentIntent.metadata.CreditGranted);
      }
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent failed: ${failedPayment.id}`);
      console.log("PaymentIntent metadata:", failedPayment.metadata);
      if (failedPayment.metadata) {
        console.log("UserId:", failedPayment.metadata.UserId);
        console.log("CreditGranted:", failedPayment.metadata.CreditGranted);
      }
      break;

    case "charge.succeeded":
      const succeededCharge = event.data.object as Stripe.Charge;
      console.log(`Charge succeeded: ${succeededCharge.id}`);
      // Update charge metadata from payment intent if not already set
      if (
        succeededCharge.payment_intent &&
        typeof succeededCharge.payment_intent === "string"
      ) {
        const chargeMetadata = await getMetadataFromPaymentIntent(
          succeededCharge.payment_intent
        );
        if (chargeMetadata && Object.keys(chargeMetadata).length > 0) {
          // Only update if charge doesn't have metadata already
          if (
            !succeededCharge.metadata ||
            Object.keys(succeededCharge.metadata).length === 0
          ) {
            try {
              await stripe.charges.update(succeededCharge.id, {
                metadata: chargeMetadata,
              });
              console.log(
                `Charge metadata updated for charge: ${succeededCharge.id}`
              );
            } catch (error) {
              console.error("Error updating charge metadata:", error);
            }
          }
        }
        console.log(
          "Charge metadata:",
          chargeMetadata || succeededCharge.metadata
        );
        const finalMetadata = chargeMetadata || succeededCharge.metadata;
        if (finalMetadata) {
          console.log("UserId:", finalMetadata.UserId);
          console.log("CreditGranted:", finalMetadata.CreditGranted);
        }
      }
      break;

    case "charge.refunded":
      const refundedCharge = event.data.object as Stripe.Charge;
      console.log(`Charge refunded: ${refundedCharge.id}`);
      // Check if charge has metadata directly
      if (
        refundedCharge.metadata &&
        Object.keys(refundedCharge.metadata).length > 0
      ) {
        console.log("Charge metadata (direct):", refundedCharge.metadata);
        console.log("UserId:", refundedCharge.metadata.UserId);
        console.log("CreditGranted:", refundedCharge.metadata.CreditGranted);
      } else if (
        refundedCharge.payment_intent &&
        typeof refundedCharge.payment_intent === "string"
      ) {
        // Fallback: Get metadata from payment intent
        const chargeMetadata = await getMetadataFromPaymentIntent(
          refundedCharge.payment_intent
        );
        console.log("PaymentIntent metadata (from charge):", chargeMetadata);
        if (chargeMetadata) {
          console.log("UserId:", chargeMetadata.UserId);
          console.log("CreditGranted:", chargeMetadata.CreditGranted);
        }
      }
      break;

    case "refund.created":
      const refund = event.data.object as Stripe.Refund;
      console.log(`Refund created: ${refund.id}`);
      // Get metadata from payment intent via charge
      if (refund.charge && typeof refund.charge === "string") {
        try {
          const charge = await stripe.charges.retrieve(refund.charge);
          if (
            charge.payment_intent &&
            typeof charge.payment_intent === "string"
          ) {
            const refundMetadata = await getMetadataFromPaymentIntent(
              charge.payment_intent
            );
            console.log(
              "PaymentIntent metadata (from refund):",
              refundMetadata
            );
            if (refundMetadata) {
              console.log("UserId:", refundMetadata.UserId);
              console.log("CreditGranted:", refundMetadata.CreditGranted);
            }
          }
        } catch (error) {
          console.error("Error retrieving charge for refund:", error);
        }
      }
      break;

    case "charge.dispute.created":
      const dispute = event.data.object as Stripe.Dispute;
      console.log(`Dispute created: ${dispute.id}`);
      // Get metadata from payment intent via charge
      if (dispute.charge && typeof dispute.charge === "string") {
        try {
          const disputeCharge = await stripe.charges.retrieve(dispute.charge);
          if (
            disputeCharge.payment_intent &&
            typeof disputeCharge.payment_intent === "string"
          ) {
            const disputeMetadata = await getMetadataFromPaymentIntent(
              disputeCharge.payment_intent
            );
            console.log(
              "PaymentIntent metadata (from dispute):",
              disputeMetadata
            );
            if (disputeMetadata) {
              console.log("UserId:", disputeMetadata.UserId);
              console.log("CreditGranted:", disputeMetadata.CreditGranted);
            }
          }
        } catch (error) {
          console.error("Error retrieving charge for dispute:", error);
        }
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
