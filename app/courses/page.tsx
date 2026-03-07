"use client";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

interface Subject {
  id: string;
  name: string;
  description: string;
  price: number;
  pdfUrl: string;
}

export default function CoursesPage() {
  const sectionRef = useRef(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".course-card", {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "subjects"));
        const data: Subject[] = snapshot.docs.map((docItem) => {
          const d = docItem.data();
          return {
            id: docItem.id,
            name: d.name || "No name",
            description: d.description || "",
            price: d.price || 0,
            pdfUrl: d.pdfUrl || ""
          };
        });
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-16 bg-gradient-to-br from-[#FFF4EC] to-[#FFE8D6]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-16 bg-gradient-to-br from-[#FFF4EC] to-[#FFE8D6]"
    >
      <Navbar />
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
        Available Courses
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="course-card bg-white/60 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-xl border border-white/40 p-6 md:p-8"
          >
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-[#F4A261]">
              {subject.name}
            </h2>

            {subject.description && (
              <p className="text-sm text-gray-800 mb-4 md:mb-6">
                {subject.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-lg font-semibold">
                ₹{subject.price}
              </span>

              <Link
                href="/notes"
                className="bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white px-4 md:px-5 py-2 rounded-full text-sm shadow-md hover:scale-105 transition text-center"
              >
                View Notes
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}