// src/components/VisualCardsSection.tsx
import { motion, useScroll, useTransform, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

/* =============================
   Tipos
============================= */
interface CardData {
  title: string;
  description: string;
  image: string;
  link: string;
}

interface VisualCardProps {
  card: CardData;
  index: number;
}

/* =============================
   Datos
============================= */
const cardsData: CardData[] = [
  {
    title: "Comedor de Doña Adela",
    description: "Disfruta de la gastronomía local con platillos tradicionales y auténticos sabores de la región.",
    image: "/images/home/cards/Comedor.webp",
    link: "#comedor",
  },
  {
    title: "Cascada de los Enamorados",
    description: "Admira una de las cascadas más bellas, rodeada de naturaleza y tranquilidad.",
    image: "/images/home/cards/Cascada-enamorados.webp",
    link: "#cascada",
  },
  {
    title: "Construcción de cabañas al 60%",
    description: "Próximamente nuevas opciones de hospedaje inmersas en la naturaleza.",
    image: "/images/home/cards/Cabanas.webp",
    link: "#cabanas",
  },
  {
    title: "Miradores",
    description: "Vistas panorámicas impresionantes para capturar recuerdos inolvidables.",
    image: "/images/home/cards/mirador.webp",
    link: "#miradores",
  },
  {
    title: "Danzas",
    description: "Vive la riqueza cultural a través de danzas y música tradicional.",
    image: "/images/home/cards/Danza.webp",
    link: "#danzas",
  },
  {
    title: "Ríos",
    description: "Sumérgete en la belleza de nuestros ríos y disfruta de su entorno natural.",
    image: "/images/home/cards/Rios.webp",
    link: "#rios",
  },
];

/* =============================
   Tarjeta individual
   - Añadido: snap-center para scroll snapping
   - Botón visible en móvil (por defecto) y en desktop aparece en hover
============================= */
const VisualCard = ({ card, index }: VisualCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const inView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: index * 0.15 } },
  };

  return (
    <motion.div
      ref={ref}
      className="relative snap-center flex-shrink-0 w-[calc(100vw-48px)] max-w-[350px] mx-auto sm:w-[350px] lg:w-[400px] h-[450px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group bg-gray-900"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ scale: 1.02 }}
      variants={variants}
    >
      {/* Imagen con paralaje */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
        <img
          src={card.image}
          alt={card.title}
          width={400}
          height={450}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/90 group-hover:via-black/50"></div>

      {/* Contenido */}
      <div className="relative z-10 p-8 flex flex-col justify-end h-full text-white">
        <h3 className="text-2xl font-bold mb-2 drop-shadow-lg leading-tight">{card.title}</h3>
        <p className="text-gray-200 text-sm drop-shadow-md">{card.description}</p>

        {/* BOTÓN: visible por defecto en móviles, oculto en pantallas >= sm hasta hover */}
        <a
          href={card.link}
          aria-label={`Explorar ${card.title}`}
          className={
            "mt-6 inline-block w-fit px-6 py-2 text-sm font-medium border border-white/80 rounded-full transition-all duration-300 " +
            // visible on mobile (default), hidden on sm+ until hover
            "opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 " +
            "hover:bg-white hover:text-gray-900 shadow-md"
          }
        >
          Explorar
        </a>
      </div>
    </motion.div>
  );
};

/* =============================
   Sección principal
   - Auto-scroll robusto
   - Centrado inicial en móvil
   - Flechas prev/next
   - Pausa del auto-scroll cuando el usuario interactúa
   - Scroll snapping
============================= */
export function VisualCardsSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.5 });

  // Helper: calcula ancho de una tarjeta + gap
  const getCardStep = () => {
    if (!containerRef.current) return 400;
    const firstCard = containerRef.current.querySelector<HTMLDivElement>(".snap-center");
    const gap = 32; // gap-8
    if (!firstCard) return 400;
    return firstCard.clientWidth + gap;
  };

  // Centra la primera tarjeta en la vista (útil para móviles)
  const centerFirstCard = () => {
    const c = containerRef.current;
    if (!c) return;
    const first = c.querySelector<HTMLElement>(".snap-center");
    if (!first) return;
    const clientWidth = c.clientWidth;
    const offsetLeft = first.offsetLeft;
    const left = Math.max(0, offsetLeft - (clientWidth - first.clientWidth) / 2);
    c.scrollTo({ left, behavior: "smooth" });
  };

  // iniciar / parar auto-scroll
  const startAutoScroll = () => {
    stopAutoScroll(); // limpiar si existe
    intervalRef.current = setInterval(() => {
      const c = containerRef.current;
      if (!c) return;
      const cardStep = getCardStep();
      const scrollWidth = c.scrollWidth;
      const clientWidth = c.clientWidth;
      const maxScrollLeft = scrollWidth - clientWidth;
      const current = Math.round(c.scrollLeft);

      // Si estamos casi al final -> volver al inicio suavemente
      if (current + clientWidth >= scrollWidth - 2) {
        c.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        c.scrollBy({ left: cardStep, behavior: "smooth" });
      }
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Pausar y reanudar (por interacciones del usuario)
  const pauseThenResume = (delayMs = 8000) => {
    stopAutoScroll();
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      if (inView) startAutoScroll();
    }, delayMs);
  };

  // Prev / Next handlers (usables por los botones)
  const scrollNext = () => {
    const c = containerRef.current;
    if (!c) return;
    const step = getCardStep();
    const scrollWidth = c.scrollWidth;
    const clientWidth = c.clientWidth;
    const maxScrollLeft = scrollWidth - clientWidth;
    if (c.scrollLeft + clientWidth >= scrollWidth - 2) {
      c.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      c.scrollBy({ left: step, behavior: "smooth" });
    }
    pauseThenResume();
  };

  const scrollPrev = () => {
    const c = containerRef.current;
    if (!c) return;
    const step = getCardStep();
    if (c.scrollLeft <= 0) {
      // ir al final
      const to = Math.max(0, c.scrollWidth - c.clientWidth);
      c.scrollTo({ left: to, behavior: "smooth" });
    } else {
      c.scrollBy({ left: -step, behavior: "smooth" });
    }
    pauseThenResume();
  };

  useEffect(() => {
    if (inView) {
      // centrado inicial para móviles
      centerFirstCard();
      // iniciar auto-scroll
      startAutoScroll();

      // pausa auto-scroll si el usuario toca o hace hover sobre el carrusel
      const el = containerRef.current;
      if (!el) return;
      const onEnter = () => stopAutoScroll();
      const onLeave = () => {
        // reanuda después de 3s si el componente sigue en vista
        if (inView) {
          if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
          resumeTimeoutRef.current = setTimeout(() => {
            startAutoScroll();
          }, 3000);
        }
      };
      const onTouchStart = () => pauseThenResume(8000);

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      el.addEventListener("touchstart", onTouchStart, { passive: true });

      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.removeEventListener("touchstart", onTouchStart as any);
        stopAutoScroll();
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <section className="relative bg-black py-24 px-0 overflow-hidden">
      {/* Título */}
      <div className="container mx-auto px-6 sm:px-10 lg:px-20 mb-16">
        <motion.h2
          className="text-4xl sm:text-5xl font-extrabold text-white text-center drop-shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Explora San Juan Tahitic
        </motion.h2>
        <motion.p
          className="text-lg text-gray-400 mt-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Descubre las maravillas que te esperan en este paraíso.
        </motion.p>
      </div>

      {/* Flechas (visibles en sm+). Botones accesibles */}
      <button
        aria-label="Anterior"
        onClick={scrollPrev}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
      >
        {/* Icono simple */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        aria-label="Siguiente"
        onClick={scrollNext}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Carrusel: scroll snapping */}
      <div
        ref={containerRef}
        className="flex flex-nowrap gap-8 py-4 px-6 sm:px-10 lg:px-20 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
        // scroll-smooth es útil para que los scrollTo/scrollBy usen smooth (algunos navegadores)
      >
        {cardsData.map((card, index) => (
          <VisualCard key={index} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}
