"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      tl.from(imageRef.current, {
        x: -80,
        opacity: 0,
        duration: 1,
      }).from(
        textRef.current,
        {
          x: 80,
          opacity: 0,
          duration: 1,
        },
        "-=0.8"
      );

    }, sectionRef);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ctx.revert();
    };

  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 px-4 md:px-16 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FFF4EC 0%, #FFE8D6 100%)",
      }}
    >
      {/* Background Glow */}
      <div className="absolute -top-10 md:-top-20 -left-10 md:-left-20 w-64 h-60 md:w-96 md:h-90 bg-[#F4A261] opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[#E76F51] opacity-20 rounded-full blur-3xl"></div>

      {/* Glass Card */}
      <div className="relative max-w-[95%] md:max-w-[90%] mx-auto backdrop-blur-2xl bg-white/0 border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.1)] rounded-3xl p-4 md:p-6 lg:p-8">

        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D2D2D] mb-6 md:mb-8">
          My <span className="text-[#F4A261]">Journey</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">

          {/* IMAGE SIDE */}
          <div
            ref={imageRef}
            className="relative w-full max-w-[250px] md:max-w-[300px] lg:max-w-[340px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl mx-auto"
          >
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              autoplay={{ delay: 3000 }}
              loop={true}
              className="h-full"
            >
              {[
                "about1.jpeg",
                "about2.jpeg",
                "about3.jpeg",
                "about4.jpeg",
                "about5.jpeg",
              ].map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-full">
                    <Image
                      src={`/${img}`}
                      alt="Dr Arshi Husain"
                      fill
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* TEXT SIDE */}
          <div
            ref={textRef}
            className="text-[#4A4A4A] leading-relaxed text-sm md:text-base space-y-3 md:space-y-4"
          >
            <p className="text-base md:text-lg lg:text-xl font-semibold text-[#d1894e]">
              Education has always been at the heart of who I am.
            </p>

            <p>
              Over the years, I have dedicated myself to simplifying complex
              concepts and making learning a comfortable,
              confidence-building experience. I believe clarity removes fear,
              and when fear is removed, true understanding begins.
            </p>

            <p>
              My journey has been shaped by countless interactions with
              students guiding them patiently and helping them grow into
              confident individuals who trust their own abilities.
            </p>

            <p>
              This platform reflects that commitment structured notes,
              thoughtfully curated lectures, and a supportive learning
              environment built on trust and growth.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 md:gap-8 pt-4 md:pt-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#F4A261]">10+</h3>
                <p className="text-xs md:text-sm text-gray-600">Years Teaching</p>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#F4A261]">1000+</h3>
                <p className="text-xs md:text-sm text-gray-600">Students Guided</p>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#F4A261]">100%</h3>
                <p className="text-xs md:text-sm text-gray-600">Dedication</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
