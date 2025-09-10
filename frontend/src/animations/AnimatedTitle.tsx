// src/components/figma/AnimatedLetterTitle.tsx

import { type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const phrases = [
  {
    welcome: "Bienvenido a",
    location: "San Juan Tahitic",
  },
  {
    welcome: "Xiixmati",
    location: "San Juan Tahitic",
  },
];

export const AnimatedLetterTitle: FC = () => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4000); // cada 4s cambia la frase
    return () => clearInterval(interval);
  }, []);

  const current = phrases[index];

  return (
    <div className="flex flex-col items-center justify-center text-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.h1
  key={current.welcome}
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -40 }}
  transition={{ duration: 0.8, ease: "easeInOut" }}
  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]"
>
  {current.welcome}
  <br />
  <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-green-600">
    {current.location}
  </span>
</motion.h1>

      </AnimatePresence>
    </div>
  );
};
