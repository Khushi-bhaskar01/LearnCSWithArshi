import { NextResponse } from "next/server";
import crypto from "crypto";

import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {

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

}