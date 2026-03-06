"use client";

import { motion } from "framer-motion";
import { JSX } from "react";

type NoteCardProps = {
  subject: string;
  description: string;
};

export default function NoteCard({
  subject,
  description,
}: NoteCardProps): JSX.Element {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-3xl shadow-lg p-6 border border-[#F0E4DC]"
    >
      <h3 className="text-lg font-semibold text-[#3A3A3A]">
        {subject}
      </h3>

      <p className="text-sm text-[#777] mt-3">
        {description}
      </p>

      <button
        className="mt-6 px-5 py-2 rounded-full 
        bg-[#E89A67] text-white text-sm 
        hover:scale-105 transition-all"
      >
        Download Notes
      </button>
    </motion.div>
  );
}
