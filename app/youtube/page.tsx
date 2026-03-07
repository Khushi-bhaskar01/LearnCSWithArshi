"use client";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function YouTubePage() {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const [activeSubject, setActiveSubject] = useState("Data Structures");

  const playlists: Record<string, { title: string; embedId: string }[]> = {
   
    "Theory Of Computation": [
      {
        title: "TOC Unit 1",
        embedId: "PLm4NqDEJsy5rJFMQMrDM3bZqOcAnOVC6t",
      },
      {
        title: "TOC Unit 2",
        embedId: "PLm4NqDEJsy5q0TxHudNPCW0cqjjK7PjEu",
      },
      {
        title: "TOC Unit 3",
        embedId: "PLm4NqDEJsy5oIzJdTsO9pJQOHz442SU9R",
      },
      {
        title: "TOC Unit 4",
        embedId: "PLm4NqDEJsy5rb2C6O862nYrq2Qbn-Aki1",
      },
      {
        title: "TOC Unit 5",
        embedId: "PLm4NqDEJsy5rwDrr-evysMablkUHTTyz3",
      },
    ],
     "Data Structures": [
      {
        title: "Complete DSA Playlist",
        embedId: "PLm4NqDEJsy5qibfVDl_kpW5Njzmwnozxq",
      },
      {
        title: "Sorting Algorithms",
        embedId: "PLm4NqDEJsy5plZx3GYJBBzVkvAsIFSgcc",
      },
    ],
    "Operating Systems": [
      {
        title: "OS Full Course",
        embedId: "PLm4NqDEJsy5o6cVaUZ4rygFyBlpwKUnA0",
      },
    ],
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".yt-card", {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      });
    }, cardsRef);

    return () => ctx.revert();
  }, [activeSubject]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-16 bg-gradient-to-br from-[#FFF4EC] to-[#FFE8D6]"
    >
        <Navbar />
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
        YouTube Playlists
      </h1>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12">
        {Object.keys(playlists).map((subject) => (
          <button
            key={subject}
            onClick={() => setActiveSubject(subject)}
            className={`px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${
                activeSubject === subject
                  ? "bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white shadow-lg"
                  : "bg-white/60 backdrop-blur-md border border-white/40 hover:bg-white"
              }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* PLAYLIST CARDS */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-6xl mx-auto"
      >
        {playlists[activeSubject].map((item, index) => (
          <div
            key={index}
            className="yt-card bg-white/60 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-xl border border-white/40 p-4 md:p-6"
          >
            <h2 className="text-base md:text-lg font-semibold text-[#F4A261] mb-3 md:mb-4">
              {item.title}
            </h2>

            <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-md">
              <iframe
                width="100%"
                height="250"
                src={`https://www.youtube.com/embed/videoseries?list=${item.embedId}`}
                title={item.title}
                allowFullScreen
                className="w-full"
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}