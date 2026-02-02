import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/reader`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
