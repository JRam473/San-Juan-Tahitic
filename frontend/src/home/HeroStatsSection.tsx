import { Users, Map, UtensilsCrossed, Sparkles, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Hook para animar los números
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const stats = [
  { icon: Users, label: "Habitantes", value: 2500, color: "from-emerald-400 to-emerald-600" },
  { icon: Map, label: "Lugares Turísticos", value: 15, color: "from-blue-400 to-blue-600" },
  { icon: UtensilsCrossed, label: "Platillos Típicos", value: 20, color: "from-yellow-400 to-yellow-600" },
  { icon: Sparkles, label: "Tradiciones Vivas", value: 10, color: "from-pink-400 to-pink-600" },
  { icon: Landmark, label: "Años de Historia", value: 400, color: "from-purple-400 to-purple-600" },
];

export function HeroStatsSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-gray-50 to-gray-100 py-24 px-6 sm:px-10 lg:px-20 overflow-hidden">
      {/* Efectos decorativos */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Título */}
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-16 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="relative">
            <Sparkles className="absolute -top-6 -left-6 h-6 w-6 text-yellow-400 animate-spin-slow" />
            Estadísticas de <span className="text-emerald-600">San Juan Tahitic</span>
          </span>
        </motion.h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {stats.map((item, i) => {
            const Icon = item.icon;
            const count = useCounter(item.value);

            return (
              <motion.div
                key={i}
                className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl transition relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Degradado animado */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20`}></div>

                <div className="relative z-10 p-10 flex flex-col items-center">
                  <Icon className="h-12 w-12 text-gray-700 mb-4" />
                  <p className="text-5xl font-extrabold text-gray-900">{count}+</p>
                  <p className="text-gray-600 mt-2">{item.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
