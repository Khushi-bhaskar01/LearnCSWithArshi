"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    image: "/1.jpeg", // Screenshot of YouTube comment
    alt: "Student testimonial 1",
  },
  {
    image: "/2.jpeg", // Screenshot of YouTube comment
    alt: "Student testimonial 2",
  },
  {
    image: "/3.jpeg", // Screenshot of YouTube comment
    alt: "Student testimonial 3",
  },
  {
    image: "/4.jpeg", // Screenshot of YouTube comment
    alt: "Student testimonial 4",
  },
  {
    image: "/5.jpeg", // Screenshot of YouTube comment
    alt: "Student testimonial 5",
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          });
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-16 bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D3748] mb-4">
            What Our YouTube Viewers Say
          </h2>
          <p className="text-lg text-[#5C5C5C] max-w-2xl mx-auto">
            Real comments from students learning Computer Science on our YouTube channel
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
          >
            <span className="text-2xl text-[#F4A261] font-bold">‹</span>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
          >
            <span className="text-2xl text-[#F4A261] font-bold">›</span>
          </button>

          {/* Main Testimonial Display */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/50 overflow-hidden">
            <div
              ref={(el) => {
                if (cardsRef.current) cardsRef.current[0] = el;
              }}
              className="relative"
            >
              <Image
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].alt}
                width={800}
                height={600}
                className="w-full h-auto rounded-xl object-contain max-h-[500px]"
              />
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#F4A261] scale-125"
                    : "bg-[#5C5C5C]/30 hover:bg-[#5C5C5C]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}