export const runtime = "nodejs";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebaseAdmin";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { DecodedIdToken } from "firebase-admin/auth";
import Image from "next/image";

export default async function ProfilePage() {

  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseToken")?.value;

  if (!token) {
    redirect("/login");
  }

  let user: DecodedIdToken | null = null;

  try {
    user = await adminAuth.verifyIdToken(token);
  } catch (error) {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="min-h-screen bg-[#FFF4EC] px-6 md:px-16 py-28">
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-10">

          <Image
            src={user.picture || "/default-avatar.png"}
            alt="Profile"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#F4A261]/30"
          />

          <div>
            <h1 className="text-2xl font-bold">
              {user.name || "User"}
            </h1>

            <p className="text-gray-600">
              {user.email}
            </p>
          </div>

        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <Info label="Firebase UID" value={user.uid} />
          <Info label="Email" value={user.email || ""} />
          <Info label="Provider" value="Google" />
        </div>

      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}