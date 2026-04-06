import { NextResponse } from "next/server";
import crypto from "crypto";

import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

// Allowed domains for payment verification requests
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
      console.warn('Payment verification blocked: Unauthorized domain', { origin, referer });
      return NextResponse.json(
        { success: false, message: "Payment verification only allowed from authorized domains" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      uid,
      subjectId
    } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    /* ===========================
       PAYMENT VERIFIED
    ============================ */

    await adminDb
      .collection("users")
      .doc(uid)
      .update({
        purchasedSubjects: FieldValue.arrayUnion(subjectId)
      });

    return NextResponse.json({
      success: true
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }

}