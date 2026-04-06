import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Allowed domains for payment requests
const ALLOWED_DOMAINS = process.env.ALLOWED_DOMAINS
  ? process.env.ALLOWED_DOMAINS.split(',')
  : ['learncswitharshi.com'];

export async function POST(req: Request) {
  try {
    // Security check: Validate request origin
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');

    const isOriginAllowed = origin && ALLOWED_DOMAINS.some(domain =>
      origin.includes(domain)
    );
    const isRefererAllowed = referer && ALLOWED_DOMAINS.some(domain =>
      referer.includes(domain)
    );

    if (!isOriginAllowed && !isRefererAllowed) {
      console.warn('Payment request blocked: Unauthorized domain', { origin, referer });
      return NextResponse.json(
        { error: "Payments are only allowed from authorized domains" },
        { status: 403 }
      );
    }

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt-${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
