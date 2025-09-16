import { motion } from "framer-motion";
import { type FC, useMemo } from "react";

interface FishAnimationProps {
  count?: number; // Cantidad de peces
}

const FishAnimation: FC<FishAnimationProps> = ({ count = 7 }) => {
  // Generamos peces con posiciones y tiempos aleatorios
  const fishes = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      size: Math.random() * 50 + 60, // Tamaño entre 20px y 50px
      top: Math.random() * 90, // Posición vertical (0% a 90%)
      delay: Math.random() * 4, // Retardo inicial
      duration: Math.random() * 12 + 8, // Velocidad de nado
      direction: Math.random() > 0.5 ? 1 : -1, // Dirección: izquierda o derecha
      swimHeight: Math.random() * 40 + 20, // Ondulación vertical
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {fishes.map((fish, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${fish.top}%`,
            width: `${fish.size}px`,
            height: `${fish.size / 2}px`,
            transform: fish.direction === -1 ? "scaleX(-1)" : "scaleX(1)",
          }}
          initial={{
            x: fish.direction === 1 ? "-15vw" : "115vw",
            y: 0,
          }}
          animate={{
            x: fish.direction === 1 ? "115vw" : "-15vw",
            y: [0, -fish.swimHeight / 4, 0, fish.swimHeight / 4, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            duration: fish.duration,
            delay: fish.delay,
          }}
        >
          {/* Pez transparente con efecto vidrio */}
          <div
            className="w-full h-full backdrop-blur-md bg-white/30"
            style={{
              WebkitMaskImage: "url('/images/fish-shape.svg')",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
              WebkitMaskPosition: "center",
              maskImage: "url('/images/home/fish-shape.svg')",
              maskRepeat: "no-repeat",
              maskSize: "contain",
              maskPosition: "center",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FishAnimation;
