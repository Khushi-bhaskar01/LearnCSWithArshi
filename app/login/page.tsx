"use client";

import { auth, db } from "@/lib/firebaseClient";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("User authenticated:", user.uid);

      // 🔹 check if user document exists
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // 🔹 create user if not exists
      if (!userSnap.exists()) {
        console.log("Creating new user document...");
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          purchasedSubjects: [],
          createdAt: new Date().toISOString()
        });
        console.log("User document created successfully");
      } else {
        console.log("User document already exists");
      }

      // 🔹 store token for middleware
      const token = await user.getIdToken();
      document.cookie = `firebaseToken=${token}; path=/; max-age=3600`;

      router.push("/profile");

    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage = error?.message || "Unknown error";
      alert(`Google login failed: ${errorMessage}`);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#FFF4EC]">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
        
        <h2 className="text-2xl font-bold mb-8">
          Continue to Your Account
        </h2>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-black text-white py-3 rounded-full hover:scale-105 transition"
        >
          Continue with Google
        </button>

      </div>
    </section>
  );
}