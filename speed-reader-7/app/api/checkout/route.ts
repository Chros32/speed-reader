import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const PRICE_IDS: Record<string, string> = {
  weekly: 'price_1SwGJEJtxoCx68Pg71vm5xEc',
  annual: 'price_1SwGKFJtxoCx68PgRqMfLcJR',
};

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { planId } = await req.json();

    if (!planId || !PRICE_IDS[planId]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[planId],
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/reader?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/reader?canceled=true`,
      // Add 3-day free trial for weekly plan
      subscription_data: planId === 'weekly'
        ? { trial_period_days: 3 }
        : undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
