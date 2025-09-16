import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Utensils } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

type Dance = {
  name: string;
  description: string;
  image: string;
};

const dances: Dance[] = [
  {
    name: "Danza del Tigre",
    description: "Un ritual tradicional que se realiza en festivales patronales, simbolizando la fuerza de la naturaleza.",
    image: "https://images.unsplash.com/photo-1601161189836-f2fcf8672a52?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Danza de la Pluma",
    description: "Inspirada en la historia prehispánica, esta danza deslumbra con su vestimenta ceremonial y movimientos elegantes.",
    image: "https://images.unsplash.com/photo-1601161195502-c82c8a1d1b69?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Danza del Venado",
    description: "Representa el ritual de caza, honrando la conexión espiritual con la naturaleza y los animales.",
    image: "https://images.unsplash.com/photo-1601161189290-56a4c83998d2?auto=format&fit=crop&w=800&q=80",
  },
];

export function CultureDance() {
  const [current, setCurrent] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % dances.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + dances.length) % dances.length);
  
  useEffect(() => {
    // Para asegurar que las imágenes se precarguen o la lógica de lazy loading funcione
    slideRefs.current.forEach((el, index) => {
      if (el) {
        el.style.transform = `translateX(-${current * 100}%)`;
      }
    });
  }, [current]);

  return (
    <section id="danzas" className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-5 w-5 text-orange-600" />
            <span className="text-orange-800 font-medium">Tradiciones en Movimiento</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Danzas{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
              Ancestrales
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Nuestra rica herencia cultural se expresa en cada paso. Descubre el significado detrás de las danzas que han definido nuestra identidad por siglos.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center">
          <Card className="w-full max-w-4xl relative rounded-3xl overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-sm group/card">
            <CardContent className="p-0 flex transition-transform ease-in-out duration-500"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {dances.map((dance, idx) => (
                <div key={idx} className="min-w-full relative">
                  <ImageWithFallback
                    src={dance.image}
                    alt={dance.name}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-8 text-white">
                      <h3 className="text-3xl font-bold mb-2">{dance.name}</h3>
                      <p className="mt-2 text-base max-w-lg">{dance.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-4 lg:left-0 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 lg:right-0 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-110 shadow-lg"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-8 space-x-3">
          {dances.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-150 cursor-pointer ${
                idx === current ? "bg-orange-600 scale-125" : "bg-gray-300"
              }`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}