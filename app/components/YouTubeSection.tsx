
"use client";

import { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Video = {
  id: string;
  title: string;
  views: string;
};

export default function YouTubeSection(): JSX.Element {
  const featuredVideos: Video[] = [
    { id: "QrocYDGm4HE", title: "Introduction to TOC", views: "87K views" },
    { id: "gUO8e4zIImo", title: "TOC CFG || CFL", views: "58K views" },
    { id: "ZnxYVZXsoBc", title: "Regular Expressions in Automata Theory", views: "59K views" },
    { id: "csLUbPXj7Bg", title: "Push Down Automata", views: "51K views" },
  ];

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  return (
    <section className="py-20 md:py-28 px-4 md:px-16 bg-gradient-to-b from-[#FFF4EC] to-[#FFE9D9]">
      <div className="max-w-7xl mx-auto text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[#3A3A3A]"
        >
          Most Watched Lectures
        </motion.h2>

        <p className="mt-2 md:mt-4 text-[#5C5C5C] text-base md:text-lg">
          Curated high-impact sessions loved by thousands of students.
        </p>

        {/* Auto Loop Carousel */}
        <div
          className="mt-12 md:mt-16 overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex gap-6 md:gap-10 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 40,
              ease: "linear",
            }}
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {[...featuredVideos, ...featuredVideos].map(
              (video: Video, index: number) => (
                <div
                  key={index}
                  className="min-w-[280px] md:min-w-[340px] cursor-pointer"
                  onClick={() => setSelectedVideo(video.id)}
                >
                  <div
                    className="relative rounded-3xl overflow-hidden 
                    shadow-2xl group bg-white/30 backdrop-blur-xl 
                    border border-white/40"
                  >
                    {/* Thumbnail */}
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-[180px] md:h-[220px] object-cover 
                      transition-transform duration-700 
                      group-hover:scale-110"
                    />

                    {/* Shine Hover Overlay */}
                    <div
                      className="absolute inset-0 bg-white/20 
                      opacity-0 group-hover:opacity-100 
                      transition duration-500 flex items-center justify-center"
                    >
                      <div
                        className="bg-white/40 backdrop-blur-xl 
                        px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg 
                        text-white font-semibold text-sm md:text-base"
                      >
                         Watch Lecture
                      </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="p-3 md:p-5 text-left">
                      <h3 className="text-[#3A3A3A] font-semibold text-base md:text-lg">
                        {video.title}
                      </h3>
                      <p className="text-xs md:text-sm text-[#888] mt-1">
                        {video.views}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>

        {/* Modal Player */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md 
              flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-4xl rounded-3xl 
                overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  allow="autoplay"
                  allowFullScreen
                  className="rounded-3xl"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
