import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminSessionToken } from "@/lib/adminSession";

const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_PANEL_EMAIL;
    const adminPassword = process.env.ADMIN_PANEL_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ success: false, message: "Admin credentials not configured on server" }, { status: 500 });
    }

    if (email === adminEmail && password === adminPassword) {
      const cookieStore = await cookies();
      cookieStore.set("adminToken", createAdminSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: ADMIN_SESSION_MAX_AGE_SECONDS
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
