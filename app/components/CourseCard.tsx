"use client";

import { motion } from "framer-motion";
import { JSX } from "react";

type CourseCardProps = {
  title: string;
  description: string;
  students: string;
};

export default function CourseCard({
  title,
  description,
  students,
}: CourseCardProps): JSX.Element {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white/40 backdrop-blur-xl 
      border border-white/50 rounded-3xl 
      shadow-xl p-6 transition-all duration-300"
    >
      <h3 className="text-xl font-semibold text-[#3A3A3A]">
        {title}
      </h3>

      <p className="text-[#666] mt-3 text-sm">
        {description}
      </p>

      <p className="text-xs text-[#999] mt-4">
        {students} enrolled
      </p>

      <button
        className="mt-6 w-full py-2 rounded-full 
        bg-[#E89A67] text-white font-medium 
        hover:scale-105 transition-all"
      >
        Enroll Now
      </button>
    </motion.div>
  );
}
