"use client";

import Typewriter from "typewriter-effect";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";

export default function Hero() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const code1Ref = useRef(null);
  const code2Ref = useRef(null);
  const code3Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      const tl = gsap.timeline();

      tl.from(headingRef.current, { y: 80, opacity: 0, duration: 1 })
        .from(textRef.current, { y: 40, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(buttonRef.current, { y: 30, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(imageRef.current, { x: 120, opacity: 0, duration: 1 }, "-=1");

      gsap.to([code1Ref.current, blob1Ref.current], {
        y: 20,
        repeat: -1,
        yoyo: true,
        duration: 3,
      });

      gsap.to([code2Ref.current, blob2Ref.current], {
        y: -20,
        repeat: -1,
        yoyo: true,
        duration: 4,
      });

      gsap.to(code3Ref.current, {
        y: -10,
        repeat: -1,
        yoyo: true,
        duration: 3.5,
      });

    }, sectionRef);

    return () => ctx.revert();

  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 md:pt-36 px-4 md:px-16 overflow-hidden bg-linear-to-br from-[#FFF4EC] to-[#FFE8D6]">

      {/* Floating Blobs */}
      <div
        ref={blob1Ref}
        className="absolute top-10 left-4 md:left-10 w-48 h-48 md:w-64 md:h-64 bg-[#F4A261] opacity-20 rounded-full blur-3xl"
      />
      <div
        ref={blob2Ref}
        className="absolute bottom-20 right-4 md:right-10 w-56 h-56 md:w-72 md:h-72 bg-[#E76F51] opacity-20 rounded-full blur-3xl"
      />

      <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center w-full max-w-7xl mx-auto relative z-10">

        {/* LEFT SIDE */}
        <div>
          <h1
            ref={headingRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
          >
            Learn CS with{" "}
            <span className="text-[#F4A261]">
              <Typewriter
                options={{
                  strings: ["Dr. Arshi Husain"],
                  autoStart: true,
                  loop: true,
                  delay: 60,
                }}
              />
            </span>
          </h1>

          <p
            ref={textRef}
            className="mt-4 md:mt-6 text-base md:text-lg text-[#5C5C5C] leading-relaxed"
          >
            Structured notes, easy explanations and curated video lectures
            designed to help you understand concepts clearly and succeed with confidence.
          </p>

          <div
            ref={buttonRef}
            className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            <Link href="/about">
              <button className="bg-[#F4A261] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#E76F51] transition duration-300 hover:scale-105 text-sm md:text-base">
                About Me
              </button>
            </Link>

            <Link href="/notes">
              <button className="border border-[#F4A261] text-[#F4A261] px-6 py-3 rounded-full hover:bg-white transition duration-300 hover:scale-105 text-sm md:text-base">
                View Notes
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="relative flex justify-center items-center">

          {/* Soft Glow */}
          <div className="absolute w-80 h-80 md:w-96 md:h-96 bg-[#F4A261] opacity-20 rounded-full blur-3xl -z-10"></div>

          {/* Floating Code Elements */}
          <div
            ref={code1Ref}
            className="absolute -top-4 md:-top-8 left-2 md:left-6 bg-white/70 backdrop-blur-md px-3 md:px-4 py-2 rounded-xl shadow-lg text-xs md:text-sm font-mono"
          >
            {"<code />"}
          </div>

          <div
            ref={code2Ref}
            className="absolute bottom-4 md:bottom-8 -right-2 md:-right-6 bg-white/70 backdrop-blur-md px-3 md:px-4 py-2 rounded-xl shadow-lg text-xs md:text-sm font-mono"
          >
            {"{ logic }"}
          </div>

          {/* Image (Static) */}
          <div ref={imageRef} className="relative z-10">
            <Image
              src="/about2.jpeg"
              alt="Dr Arshi Husain"
              width={350}
              height={450}
              className="rounded-3xl shadow-2xl object-cover w-full max-w-[280px] md:max-w-[400px] h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
