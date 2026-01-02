# GlowUp - Skincare SaaS Landing Page

A beautiful, modern landing page for a skincare SaaS product built with Next.js, Tailwind CSS, and integrated with Stripe Checkout for payments.

## Features

- 🎨 Beautiful, modern UI with gradient backgrounds and smooth animations
- 💳 Stripe Checkout integration for secure payments
- 📱 Fully responsive design
- ⚡ Built with Next.js 14 and TypeScript
- 🎯 SEO optimized with proper metadata

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd stripe-demo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Stripe keys to `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Stripe Setup

### 1. Get Your API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** and **Secret key** (test mode)
3. Add them to your `.env` file

### 2. Set Up Webhooks (Optional, for production)

For local development, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

This will give you a webhook secret. Add it to your `.env` file.

For production, configure webhooks in your Stripe Dashboard:
- Endpoint URL: `https://yourdomain.com/api/webhook`
- Events to listen: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

### 3. Create a Price (Optional)

If you want to use an existing Stripe Price ID:
1. Go to Stripe Dashboard > Products
2. Create a product and price
3. Copy the Price ID
4. Add `NEXT_PUBLIC_STRIPE_PRICE_ID=price_...` to your `.env`

If no Price ID is provided, the app will create a checkout session with inline pricing ($79.00).

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── create-checkout-session/  # Creates Stripe checkout session
│   │   ├── verify-session/            # Verifies payment session
│   │   └── webhook/                   # Handles Stripe webhooks
│   ├── success/                       # Success page after payment
│   ├── cancel/                        # Cancellation page
│   ├── globals.css                    # Global styles
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Landing page
├── package.json
├── tailwind.config.ts                 # Tailwind configuration
└── tsconfig.json                      # TypeScript configuration
```

## API Routes

### POST `/api/create-checkout-session`

Creates a Stripe Checkout session and returns the checkout URL.

**Request Body:**
```json
{
  "priceId": "price_1234567890" // Optional
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### GET `/api/verify-session?session_id={session_id}`

Verifies a checkout session and returns payment details.

### POST `/api/webhook`

Handles Stripe webhook events (requires webhook secret).

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:
- `primary`: Main brand color
- `skincare`: Custom skincare-themed colors

### Content

Edit `app/page.tsx` to customize:
- Hero section text
- Features
- Pricing plans
- Testimonials

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to:
- Set all environment variables
- Configure webhook endpoints in Stripe Dashboard
- Update `NEXT_PUBLIC_DOMAIN` with your production URL

## License

MIT

