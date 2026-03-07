"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Navbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

export default function AboutMam() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement[]>([]);
  const gsapContextRef = useRef<gsap.Context | null>(null);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted || !containerRef.current) return;

    // kill old
    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (gsapContextRef.current) gsapContextRef.current.revert();

    gsapContextRef.current = gsap.context(() => {
      stackRef.current.forEach((card) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { scale: 1, y: 0 },
          {
            scale: 0.9,
            y: -120,
            scrollTrigger: {
              trigger: card,
              start: "top top",
              end: "+=120%",
              scrub: true,
              pin: true,
              pinSpacing: false,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, containerRef);

    ScrollTrigger.refresh();

    return () => {
      if (gsapContextRef.current) gsapContextRef.current.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [mounted]);

  if (!mounted) return null;

  const sections = [
    {
      title: "Academic Foundation",
      content:
        "Dr. Arshi Husain built a strong foundation in Computer Science through years of structured academic excellence and dedication.",
      image: "/mam.jpeg",
    },
    {
      title: "Higher Studies",
      content:
        "Her advanced studies include postgraduate and doctoral research focused on modern computing methodologies and system design.",
      image: "/about1.jpeg",
    },
    {
      title: "Teaching Experience",
      content:
        "With over a decade of experience, she has mentored thousands of students in Data Structures, DBMS, OS, and core CS subjects.",
      image: "/about2.jpeg",
    },
    {
      title: "Research & Publications",
      content:
        "Her research contributions include academic papers, conferences, and innovative approaches to simplifying technical education.",
      image: "/mam.jpeg",
    },
    {
      title: "Vision & Mentorship",
      content:
        "Her mission is to remove fear from technical subjects and empower every learner with confidence and clarity.",
      image: "/about4.jpeg",
    },
  ];

  return (
    <section ref={containerRef} className="bg-[#F9FBFC]">
      <Navbar />

      {/* HERO */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <Image src="/about1.jpeg" alt="Mam" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative text-white text-3xl md:text-4xl lg:text-6xl font-black text-center px-4">
          Dr. Arshi Husain
        </h1>
      </div>

      {/* STACKED CARDS */}
      {sections.map((section, idx) => (
        <div
          key={section.title}
          ref={(el) => {
            if (el) stackRef.current[idx] = el;
          }}
          className="min-h-screen flex items-center justify-center px-4 py-8"
        >
          <div className="relative w-full max-w-6xl bg-white rounded-2xl md:rounded-[3rem] shadow-2xl p-6 md:p-10 lg:p-16 flex flex-col md:flex-row items-center gap-6 md:gap-12">

            {/* IMAGE */}
            <div className="relative w-full md:w-1/2 h-64 md:h-80 lg:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {section.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}