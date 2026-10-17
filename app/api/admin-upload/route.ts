import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidAdminSessionToken } from "@/lib/adminSession";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;

  if (!isValidAdminSessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server Supabase credentials are not configured" },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const category = formData.get("category");

    if (!(file instanceof File) || !(category === "syllabus" || category === "paid")) {
      return NextResponse.json({ error: "A PDF file and valid category are required" }, { status: 400 });
    }

    if (file.type !== "application/pdf" || file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Choose a non-empty PDF smaller than 25 MB" },
        { status: 400 },
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "document.pdf";
    const path = `${category}/${randomUUID()}-${safeName}`;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.storage.from("pdf").upload(path, file, {
      contentType: "application/pdf",
      upsert: false,
    });

    if (error) {
      console.error("Admin PDF upload failed:", error.message);
      return NextResponse.json({ error: "Supabase rejected the PDF upload" }, { status: 502 });
    }

    const { data } = supabase.storage.from("pdf").getPublicUrl(path);
    return NextResponse.json({ publicUrl: data.publicUrl, path });
  } catch (error) {
    console.error("Admin PDF upload request failed:", error);
    return NextResponse.json({ error: "Unable to process PDF upload" }, { status: 500 });
  }
}