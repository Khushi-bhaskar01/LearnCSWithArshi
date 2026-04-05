"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


gsap.registerPlugin(ScrollTrigger);

export default function AboutMam() {
  const scrollbarStyle = `
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #F4A261; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #E76F51; }
  `;

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
      stackRef.current.forEach((card, idx) => {
        if (!card) return;

        const isLastOne = idx === stackRef.current.length - 1;

        if (isLastOne) {
          // Last card doesn't need to pin, just reveal
          gsap.fromTo(card,
            { scale: 0.95, opacity: 0.5 },
            { 
              scale: 1, 
              opacity: 1,
              scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                end: "top top",
                scrub: true
              }
            }
          );
        } else {
          // Early cards pin and scale down
          gsap.fromTo(
            card,
            { scale: 1, y: 0 },
            {
              scale: 0.9,
              y: -80,
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
        }
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
          <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid gap-2">
              {[
                { y: '2024', t: "A Revolutionary Approach to COVID 19 Detection Using Transformer", j: "Journal of Propulsion Technology", l: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=lNuMr-wAAAAJ&citation_for_view=lNuMr-wAAAAJ:UeHWp8X0CEIC" },
                { y: '2023', t: "RES-KELM fusion model for COVID-19 X-ray classification", j: "Journal of Intelligent Systems", l: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=lNuMr-wAAAAJ&citation_for_view=lNuMr-wAAAAJ:9yKSN-GCB0IC" },
                { y: '2023', t: "Optimized deterministic multikernel extreme learning machine", j: "ICIICV", l: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=lNuMr-wAAAAJ&citation_for_view=lNuMr-wAAAAJ:d1gkVwhDpl0C" },
                { y: '2022', t: "Face recognition based on residual convolution neural network", j: "IOP Conference Series", l: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=lNuMr-wAAAAJ&citation_for_view=lNuMr-wAAAAJ:u5HHmVD_uO8C" },
                { y: '2022', t: "COVID-19 Detection Using Non-iterative Learning", j: "Pattern Recognition", l: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=lNuMr-wAAAAJ&citation_for_view=lNuMr-wAAAAJ:u-x6o8ySG0sC" },
                { y: '2021', t: "DeepCoNet: LSTM Based Detection of Covid19", j: "ICICC", l: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=lNuMr-wAAAAJ&citation_for_view=lNuMr-wAAAAJ:2osOgNQ5qMEC" },
                { y: '2015', t: "Palmprint Recognition using Local Binary Pattern", j: "IJCA", l: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=lNuMr-wAAAAJ&citation_for_view=lNuMr-wAAAAJ:qjMakFHDy7sC" },
              ].map((pub, i) => (
                <a key={i} href={pub.l} target="_blank" className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-orange-50/50 transition-colors group">
                  <span className="text-[10px] font-black text-orange-400 w-8">{pub.y}</span>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-800 group-hover:text-orange-600 line-clamp-1">{pub.t}</h4>
                    <p className="text-[9px] text-gray-400 truncate">{pub.j}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <a href="https://scholar.google.com/citations?user=lNuMr-wAAAAJ" target="_blank" className="block text-center py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-orange-500 border-t border-gray-50 pt-4 mt-2">
            View All Publications on Google Scholar →
          </a>
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
    <>
      <style>{scrollbarStyle}</style>
      <section ref={containerRef} className="bg-[#F9FBFC] pb-[30vh]">
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
    </>
  );
}
