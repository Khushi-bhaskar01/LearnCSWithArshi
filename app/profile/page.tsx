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
    <section className="min-h-screen bg-[#FFF4EC] px-4 md:px-16 py-24 md:py-28">
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-10">

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-8 md:mb-10">

          <Image
            src={user.picture || "/default-avatar.png"}
            alt="Profile"
            width={96}
            height={96}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-[#F4A261]/30"
          />

          <div className="text-center sm:text-left">
            <h1 className="text-xl md:text-2xl font-bold">
              {user.name || "User"}
            </h1>

            <p className="text-gray-600 text-sm md:text-base">
              {user.email}
            </p>
          </div>

        </div>

        {/* Info Section */}
        <div className="space-y-3 md:space-y-4">
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