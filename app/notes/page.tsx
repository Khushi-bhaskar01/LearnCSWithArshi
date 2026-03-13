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
  syllabus: string;
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
  const [pdfLoading, setPdfLoading] = useState(false);

  // detect mobile devices to choose embedding strategy
  const [isMobile, setIsMobile] = useState(false);

  const [purchasedNotes, setPurchasedNotes] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

  }, []);

  /* detect mobile user agent */
  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
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
        console.log("Firestore data:",d);

        return {
          id: docItem.id,
          name: d.name || "No name",
          description: (d.description  || "").trim(),
          price: d.price || 0,
          pdfUrl: d.pdfUrl || "",
          syllabus: d.syllabus || ""
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
    setPdfLoading(true);

    if (!user) {

      alert("Please login first");
      setLoadingId(null);
      setPdfLoading(false);
      return;

    }

    const isUnlocked = purchasedNotes.includes(noteId);

    if (!isUnlocked) {

      alert("Please purchase this note first");
      setLoadingId(null);
      setPdfLoading(false);
      return;

    }

    setPdfUrl(fileUrl);
    setLoadingId(null);
    setPdfLoading(false);

  };

  /* UI */

  return (

    <div className="max-w-7xl mx-auto mt-24 md:mt-30 px-4 md:px-6">

      <Navbar />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-10">

        {notes.map((note) => {

          const isUnlocked = purchasedNotes.includes(note.id);

          return (

            <div
              key={note.id}
              className="bg-white p-4 md:p-6 rounded-2xl shadow-lg relative"
            >

              {!isUnlocked && (
                <div className="absolute top-3 right-3 md:top-4 md:right-4 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                  Locked
                </div>
              )}

              <h2 className="text-lg md:text-xl font-semibold mb-2">
                {note.name}
              </h2>

              <p className="text-sm text-gray-800 mb-3 md:mb-4 min-h-[3rem]">
                {note.description}
              </p>
              <button
                onClick={() => {
                  setPdfUrl(note.syllabus);
                  setPdfLoading(true);
                }}
                className="w-full mt-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                View Syllabus
              </button>
               <span className="text-gray-400 line-through text-lg">
      ₹199
    </span>
              <p className="font-bold mb-3 md:mb-4 text-base md:text-lg">
                ₹{note.price}
              </p>

              <button
                onClick={() =>
                  isUnlocked
                    ? handlePreview(note.pdfUrl, note.id)
                    : handlePayment(note)
                }
                className={`w-full px-4 py-2 md:py-3 rounded-xl text-white text-sm md:text-base ${
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

        <div className="mt-12 md:mt-16">

      {pdfUrl && (

        <div className="mt-12 md:mt-16">

          {/* PDF Title */}
          <div className="mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-[#F4A261]">
              PDF Preview
            </h3>
          </div>

          {/* PDF Viewer Container */}
          <div className="relative bg-white rounded-xl shadow-xl overflow-hidden pdf-viewer-container">
            {pdfLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                </div>
              </div>
            )}
            {/* choose embed for mobile so it stays in-page instead of opening a new tab */}
            {isMobile ? (
              <embed
                src={pdfUrl + "#zoom=100&toolbar=0&navpanes=0"}
                type="application/pdf"
                className="pdf-iframe w-full border-0"
                style={{
                  height: 'calc(100vh - 350px)',
                  minHeight: '500px',
                  maxHeight: '900px'
                }}
              />
            ) : (
              <iframe
                src={pdfUrl + "#zoom=100&toolbar=0&navpanes=0"}
                className="pdf-iframe w-full border-0"
                style={{
                  height: 'calc(100vh - 350px)',
                  minHeight: '500px',
                  maxHeight: '900px'
                }}
                allowFullScreen
                onLoad={() => setPdfLoading(false)}
              />
            )}
          </div>

          {/* Mobile Instructions */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 md:hidden">
            <p className="text-sm text-blue-800">
              💡 <strong>Mobile Tips:</strong> Use zoom buttons above for better viewing. Pinch gestures may also work depending on your browser.
            </p>
          </div>

          {/* Desktop Instructions */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 hidden md:block">
            <p className="text-sm text-green-800">
              💡 <strong>Desktop Tips:</strong> Use zoom controls above or Ctrl+Scroll in the PDF.
            </p>
          </div>

        </div>

      )}

        </div>

      )}

    </div>

  );

}