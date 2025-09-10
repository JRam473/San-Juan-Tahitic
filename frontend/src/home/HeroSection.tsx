import { Button } from '../components/ui/button';
import { ArrowDown, MapPin, Sparkles, Sun, Languages, Coins, Calendar } from 'lucide-react';
import { type FC, useEffect, useMemo, useState } from 'react';
import { AnimatedLetterTitle } from '../animations/AnimatedTitle';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HeroSection: Sección principal de bienvenida
 */
export const HeroSection: FC = () => {
  const [visible, setVisible] = useState(true); // controla fade-out/fade-in

  const scrollTo = (id: string): void => {
    const element = document.querySelector<HTMLElement>(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Ciclo de fade
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false); // fade-out
      setTimeout(() => setVisible(true), 4000); // fade-in tras 3s
    }, 10000); // repetir cada 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden"
      aria-label="Sección de bienvenida San Juan Tahitic"
    >
      {/* Fondo */}
      <BackgroundLayer />

      {/* Contenido animado */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="heroContent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center w-full h-full z-10"
          >
            <MainContent 
              scrollToTourism={() => scrollTo('#turismo')} 
              scrollToContact={() => scrollTo('#contacto')} 
            />
            <ScrollIndicator />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/**
 * Capa de fondo con video y partículas
 */
const BackgroundLayer: FC = () => {
  const particles = useMemo(
    () =>
      [...Array(20)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 55}s`,
      })),
    []
  );

  return (
    <div className="absolute inset-0 z-0">
      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/san_juan-poster.jpg"
        className="
          absolute inset-0 w-full h-full min-h-screen object-cover bg-black
          object-[60%_center]       /* 👉 centra un poco más a la derecha */
          xl:object-[55%_bottom]    /* 👉 en pantallas ultra-wide: baja y ligeramente derecha */
        "
        aria-label="Paisajes de San Juan Tahitic"
      >
        <source src="/videos/san_juan-optimized.webm" type="video/webm" />
        <source src="/videos/san_juan-optimized.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-blue-900/20"></div>

      {/* Partículas */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float-particles"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};


/**
 * Contenido principal
 */
interface MainContentProps {
  scrollToTourism: () => void;
  scrollToContact: () => void;
}

const MainContent: FC<MainContentProps> = ({ scrollToTourism, scrollToContact }) => (
  <div className="relative z-10 text-center max-w-6xl mx-auto px-4 py-20 flex flex-col items-center">
    
    {/* Badge superior */}
    <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-10 border border-white/30 shadow-xl animate-fade-in-down">
      <MapPin className="h-5 w-5 text-green-300" />
      <span className="text-white font-medium">Región Central</span>
      <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
    </div>

    {/* Título animado */}
    <div className="relative mb-12 animate-fade-in-up w-full flex justify-center">
      <AnimatedLetterTitle />
    </div>

    {/* Datos rápidos */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl w-full mx-auto mb-14 animate-fade-in-up">
      {[
        { label: "Clima", value: "Templado húmedo", icon: <Sun className="h-5 w-5 text-yellow-300" /> },
        { label: "Idioma", value: "Español", icon: <Languages className="h-5 w-5 text-blue-300" /> },
        { label: "Moneda", value: "Peso mexicano (MXN)", icon: <Coins className="h-5 w-5 text-emerald-300" /> },
        { label: "Mejor época", value: "Marzo - Octubre", icon: <Calendar className="h-5 w-5 text-pink-300" /> }
      ].map((info, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-lg p-2 sm:p-4 rounded-xl border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 flex flex-col items-center"
        >
          {info.icon}
          <div className="text-green-400 text-[10px] sm:text-xs uppercase mt-1 sm:mt-2">{info.label}</div>
          <div className="text-white text-sm sm:text-base font-medium">{info.value}</div>
        </div>
      ))}
    </div>

    {/* Botones */}
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up w-full">
      <Button 
        size="lg" 
        onClick={scrollToTourism}
        className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 sm:px-10 py-3 sm:py-4 text-lg font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 overflow-hidden w-full sm:w-auto"
      >
        <span className="relative z-10 flex items-center justify-center">
          Descubre San Juan Tahitic
          <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
        </span>
      </Button>

      <Button 
        variant="outline" 
        size="lg"
        onClick={scrollToContact}
        className="group relative border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 sm:px-10 py-3 sm:py-4 text-lg font-semibold backdrop-blur-md bg-white/10 shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto"
      >
        <span className="relative z-10 flex items-center justify-center">
          Empieza tu aventura
          <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
        </span>
      </Button>
    </div>
  </div>
);


/**
 * Indicador de scroll
 */
const ScrollIndicator: FC = () => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in">
    <div className="flex flex-col items-center space-y-2">
      <div className="text-white/60 text-sm font-medium animate-pulse">Descubre más</div>
      <div className="relative">
        <div className="mt-3 relative bg-white/30 backdrop-blur-sm p-3 rounded-full border border-white/40 shadow-xl animate-bounce">
          <ArrowDown className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  </div>
);
