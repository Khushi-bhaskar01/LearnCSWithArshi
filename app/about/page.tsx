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
      image: "/academic.jpeg",
    },
    {
      title: "Education",
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#F4A261] rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-[#2D3748]">Qualified UGC NET (CSE)</p>
              <p className="text-sm text-[#5C5C5C]">University Grants Commission National Eligibility Test</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#F4A261] rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-[#2D3748]">Ph.D., Computer Science</p>
              <p className="text-sm text-[#5C5C5C]">Guru Gobind Singh Indraprastha University (GGSIPU)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#F4A261] rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-[#2D3748]">M.Tech, Computer Science</p>
              <p className="text-sm text-[#5C5C5C]">Centre for Development of Advanced Computing (C-DAC), Noida</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#F4A261] rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-[#2D3748]">B.Tech, Information Technology</p>
              <p className="text-sm text-[#5C5C5C]">Jamia Hamdard University</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#F4A261] rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-[#2D3748]">Schooling</p>
              <p className="text-sm text-[#5C5C5C]">Cambridge School</p>
            </div>
          </div>
        </div>
      ),
      image: "/education.jpeg",
    },
    {
      title: "Teaching Experience",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Currently serving in the Computer Science Department at Guru Gobind Singh Indraprastha University (GGSIPU).
          </p>
          <div className="space-y-2">
            <p className="font-medium text-[#2D3748]">Previous Positions:</p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-[#F4A261] mt-1">•</span>
                <span>Former faculty at Greater Noida Institute of Technology (GNIOT)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F4A261] mt-1">•</span>
                <span>Former faculty at IEC College of Engineering and Technology</span>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-[#2D3748]">EdTech Experience:</p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-[#F4A261] mt-1">•</span>
                <span>Formerly associated with Unacademy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F4A261] mt-1">•</span>
                <span>Formerly associated with Knowledge Gate</span>
              </li>
            </ul>
          </div>
        </div>
      ),
      image: "/teaching.jpeg",
    },
    {
      title: "Research & Publications",
      content: (
        <div className="space-y-4">
          <p>
            Research contributions include design patents and publications in international conferences and Scopus-indexed journals.
          </p>
          <p>
            Additionally, she serves as a reviewer for research papers submitted to reputed academic journals and conferences.
          </p>
        </div>
      ),
      image: "/research.jpeg",
    },

    {
      title: "Vision & Mentorship",
      content: (
        <div className="space-y-4">
          <p>
            The mission is to simplify core computer science concepts, inspire students to learn with confidence, guide them in their career paths, and motivate them to achieve their full potential.
          </p>
        </div>
      ),
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
          <br />
          <span className="text-white/90 text-base md:text-lg font-medium italic block mt-2">
            Assistant Professor, GGSIPU
          </span>
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
              <div className="text-gray-600 leading-relaxed text-sm md:text-base">
                {section.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}