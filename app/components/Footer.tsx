"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.from(footerRef.current, {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        },
      });

    }, footerRef);

    return () => {
      ctx.revert();                 
      ScrollTrigger.refresh();     // 🔥 reset triggers
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-br from-[#d7a885] to-[#c2a997] pt-16 md:pt-20 pb-8 md:pb-10 px-4 md:px-16"
    >
      <div className="max-w-6xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-6 md:p-10 lg:p-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">

          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-[#F4A261]">
              Dr Arshi Husain
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Helping students understand Computer Science with clarity,
              structured notes, and carefully curated video lectures.
              Learning made simple and effective.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/about" className="hover:text-[#F4A261] transition">
                About
              </Link>
              <Link href="/courses" className="hover:text-[#F4A261] transition">
                Courses
              </Link>
              <Link href="/notes" className="hover:text-[#F4A261] transition">
                Notes
              </Link>
              <Link href="/youtube" className="hover:text-[#F4A261] transition">
                YouTube
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Contact</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <a href="mailto: arshihusaincs@gmail.com" className="hover:text-[#F4A261] transition">
                arshihusaincs@gmail.com
              </a>
              <p>Location: India</p>
            </div>

            <div className="flex gap-3 md:gap-4 mt-3 md:mt-4">
              <a
                href="https://www.youtube.com/@learncswitharshi"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F4A261] text-white px-3 md:px-4 py-2 rounded-full text-xs hover:bg-[#E76F51] transition"
              >
                YouTube
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="text-center mt-6 md:mt-10 text-xs md:text-sm text-gray-600">
       Made with ❤️ By Arshi Husain | &copy; {new Date().getFullYear()} All rights reserved.
       <br />
       Designed and Developed by <a href="https://www.linkedin.com/in/khushi-bhaskar-b00586324/" target="_blank" className="text-[#5f442e] hover:underline">Khushi Bhaskar [DevSource]</a>
      </div>
    </footer>
  );
}