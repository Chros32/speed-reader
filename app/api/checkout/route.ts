import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const PRICE_IDS: Record<string, string> = {
  weekly: 'price_1T45NsJtxoCx68Pgfz0kVxgf',
  annual: 'price_1T45ObJtxoCx68Pg9oKxy7WR',
  lifetime: 'price_1T45OvJtxoCx68PgGNdeNTXm',
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

    const isLifetime = planId === 'lifetime';

    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[planId],
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/reader?success=true&session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
      cancel_url: `${baseUrl}/reader?canceled=true`,
      // Add 3-day free trial for weekly plan only
      ...(planId === 'weekly' && !isLifetime
        ? { subscription_data: { trial_period_days: 3 } }
        : {}),
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
