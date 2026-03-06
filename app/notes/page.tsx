"use client";

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

import { auth, db } from "@/lib/firebaseClient";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

interface Note {
  id: string;
  name: string;
  description: string;
  price: number;
  pdfUrl: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function NotesPage() {

  const [notes, setNotes] = useState<Note[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [purchasedNotes, setPurchasedNotes] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  /* LOAD RAZORPAY */
  useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

  }, []);

  /* AUTH STATE */
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (firebaseUser) {

        setUser(firebaseUser);

        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {

          await setDoc(userRef, {
            purchasedSubjects: []
          });

        }

        fetchPurchases(firebaseUser.uid);

      }

    });

    return () => unsubscribe();

  }, []);

  /* FETCH SUBJECTS */
  useEffect(() => {

    const fetchNotes = async () => {

      const snapshot = await getDocs(collection(db, "subjects"));

      const data: Note[] = snapshot.docs.map((docItem) => {

        const d = docItem.data();

        return {
          id: docItem.id,
          name: d.name,
          description: d.description,
          price: d.price,
          pdfUrl: d.pdfUrl
        };

      });

      setNotes(data);

    };

    fetchNotes();

  }, []);

  /* FETCH USER PURCHASES */

  const fetchPurchases = async (uid: string) => {

    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists()) {

      const data = userDoc.data();
      setPurchasedNotes(data.purchasedSubjects || []);

    }

  };

  /* PAYMENT */

  const handlePayment = async (note: Note) => {

    if (!user) {
      alert("Please login first");
      return;
    }

    const orderRes = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: note.price,
      }),
    });

    const order = await orderRes.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Learn CS With Arshi",
      description: note.name,
      order_id: order.id,

      handler: async function (response: any) {

        await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...response,
            uid: user.uid,
            subjectId: note.id
          }),
        });

        alert("Payment Successful 🎉");

        fetchPurchases(user.uid);

      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  };

  /* PREVIEW */

  const handlePreview = async (fileUrl: string, noteId: string) => {

    setLoadingId(noteId);

    if (!user) {

      alert("Please login first");
      setLoadingId(null);
      return;

    }

    const isUnlocked = purchasedNotes.includes(noteId);

    if (!isUnlocked) {

      alert("Please purchase this note first");
      setLoadingId(null);
      return;

    }

    setPdfUrl(fileUrl);
    setLoadingId(null);

  };

  /* UI */

  return (

    <div className="max-w-7xl mx-auto mt-30 px-6">

      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">

        {notes.map((note) => {

          const isUnlocked = purchasedNotes.includes(note.id);

          return (

            <div
              key={note.id}
              className="bg-white p-6 rounded-2xl shadow-lg relative"
            >

              {!isUnlocked && (
                <div className="absolute top-4 right-4 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                  Locked
                </div>
              )}

              <h2 className="text-xl font-semibold mb-2">
                {note.name}
              </h2>

              <p className="text-sm text-gray-600 mb-4">
                {note.description}
              </p>

              <p className="font-bold mb-4">
                ₹{note.price}
              </p>

              <button
                onClick={() =>
                  isUnlocked
                    ? handlePreview(note.pdfUrl, note.id)
                    : handlePayment(note)
                }
                className={`w-full px-4 py-2 rounded-xl text-white ${
                  isUnlocked
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gradient-to-r from-[#F4A261] to-[#E76F51]"
                }`}
              >

                {loadingId === note.id
                  ? "Loading..."
                  : isUnlocked
                  ? "Preview Notes"
                  : "Buy Now"}

              </button>

            </div>

          );

        })}

      </div>

      {pdfUrl && (

        <div className="mt-16">

          <iframe
            src={pdfUrl + "#toolbar=0"}
            width="100%"
            height="700px"
            className="rounded-xl shadow-xl"
          />

        </div>

      )}

    </div>

  );

}