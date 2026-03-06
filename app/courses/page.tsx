"use client";
import Navbar from "../components/Navbar";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

export default function CoursesPage() {
  const sectionRef = useRef(null);

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

  const subjects = [
    {
      name: "Data Structures",
      price: 499,
      syllabus: [
        "Arrays & Linked Lists",
        "Stacks & Queues",
        "Trees",
        "Graphs",
        "Sorting & Searching",
      ],
    },
    {
      name: "Operating Systems",
      price: 399,
      syllabus: [
        "Process Management",
        "CPU Scheduling",
        "Deadlocks",
        "Memory Management",
      ],
    },
    {
      name: "Database Management",
      price: 449,
      syllabus: [
        "ER Model",
        "Normalization",
        "SQL",
        "Transactions",
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen pt-32 pb-20 px-6 md:px-16 bg-gradient-to-br from-[#FFF4EC] to-[#FFE8D6]"
    >
      <Navbar />
      <h1 className="text-4xl font-bold text-center mb-12">
        Available Courses
      </h1>

      <div className="grid md:grid-cols-3 gap-10">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="course-card bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-8"
          >
            <h2 className="text-xl font-semibold mb-4 text-[#F4A261]">
              {subject.name}
            </h2>

            <ul className="text-sm text-gray-700 space-y-2 mb-6">
              {subject.syllabus.map((topic, i) => (
                <li key={i}>• {topic}</li>
              ))}
            </ul>

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                ₹{subject.price}
              </span>

              <Link
                href="/login"
                className="bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white px-5 py-2 rounded-full text-sm shadow-md hover:scale-105 transition"
              >
                Unlock Notes
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}