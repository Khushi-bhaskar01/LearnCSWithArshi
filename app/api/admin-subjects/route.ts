import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { isValidAdminSessionToken } from "@/lib/adminSession";

type SubjectPayload = {
  name?: unknown;
  description?: unknown;
  imageUrl?: unknown;
  price?: unknown;
  syllabus?: unknown;
  pdfUrl?: unknown;
};

async function isAdminRequest() {
  const cookieStore = await cookies();
  return isValidAdminSessionToken(cookieStore.get("adminToken")?.value);
}

function parseSubject(payload: SubjectPayload) {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const price = Number(payload.price);
  const description = Array.isArray(payload.description)
    ? payload.description.filter((line): line is string => typeof line === "string")
    : [];

  if (!name || name.length > 160 || !Number.isFinite(price) || price < 0) return null;

  return {
    name,
    description,
    imageUrl: typeof payload.imageUrl === "string" ? payload.imageUrl : "",
    price,
    syllabus: typeof payload.syllabus === "string" ? payload.syllabus : "",
    pdfUrl: typeof payload.pdfUrl === "string" ? payload.pdfUrl : "",
  };
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subject = parseSubject(await request.json());
    if (!subject) {
      return NextResponse.json({ error: "Valid name and non-negative price are required" }, { status: 400 });
    }

    const reference = await adminDb.collection("subjects").add({
      ...subject,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: reference.id });
  } catch (error) {
    console.error("Admin subject create failed:", error);
    return NextResponse.json({ error: "Unable to create subject" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json() as SubjectPayload & { id?: unknown };
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const subject = parseSubject(body);
    if (!id || !subject) {
      return NextResponse.json({ error: "Subject ID, name, and non-negative price are required" }, { status: 400 });
    }

    await adminDb.collection("subjects").doc(id).update(subject);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin subject update failed:", error);
    return NextResponse.json({ error: "Unable to update subject" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json() as { id?: unknown };
    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!id) return NextResponse.json({ error: "Subject ID is required" }, { status: 400 });

    await adminDb.collection("subjects").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin subject delete failed:", error);
    return NextResponse.json({ error: "Unable to delete subject" }, { status: 500 });
  }
}