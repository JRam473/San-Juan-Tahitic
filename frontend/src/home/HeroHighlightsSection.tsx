import { motion } from "framer-motion";
import { Mountain, Utensils, Users, Sun } from "lucide-react";
import { type FC, type JSX } from "react";
//import BirdsAnimation from "@/animations/BirdsAnimation";
import FishAnimation from "../animations/FishAnimation";
/* ============================
  1. Tipos y datos
=========================== */
interface HighlightSectionProps {
  title: string;
  text: string;
  image: string;
  icon: JSX.Element;
  gradient?: string;
  align?: "left" | "right" | "center";
  stats?: {value: string; label: string}[];
}

interface StatsBlockProps {
  stats: { value: string; label: string }[];
  align: "left" | "right" | "center";
}

const sections: HighlightSectionProps[] = [
  {
    title: "Naturaleza",
    text: "Paisajes montañosos, ríos y cascadas que invitan a la aventura y el descanso. Explora senderos únicos y conecta con la biodiversidad de nuestra región en experiencias inolvidables.",
    image: "/images/home/Monte_virgen.jpg",
    icon: (
            <Mountain
              className="h-10 w-10 text-white"
              role="img"
              aria-label="Icono de montaña representando naturaleza"
            />
          ),
    gradient: "from-blue-900/30 to-black/60",
    align: "center",
    stats:[
      {value: "150+",
        label: "Lugares turísticos"
      },
    ]
  },
  {
    title: "Gastronomía",
    text: "Delicias locales que mezclan tradición y sabor auténtico en cada platillo. Descubre sabores ancestrales en mercados locales y restaurantes con cocina tradicional innovadora.",
    image: "/images/home/gastronomia.jpg",
    icon:( 
            <Utensils 
            className="h-10 w-10 text-white"
            role="img"
            aria-label="Icono de comida representando gastronomía"
          />
        ),
    gradient: "from-amber-900/80 to-black/60",
    align: "left",
    stats:[
      {value: "20+", label:"Platillos típicos"},
    ]
  },
  {
    title: "Comunidad",
    text: "Personas cálidas y hospitalarias que te hacen sentir como en casa. Participa en actividades comunitarias y conoce historias de vida que enriquecerán tu experiencia cultural.",
    image: "/images/home/Comunidad.jpg",
    icon: (<Users 
              className="h-10 w-10 text-white"
              role="img"
              aria-label="Icono de personas representando la comunidad" 
              />
            ),
    gradient: "from-cyan-900/80 to-black/60",
    align: "right",
    stats:[
      {value: "2500+",
        label: "Habitantes"
      },
    ]
  },
  {
    title: "Tradiciones",
    text: "Fiestas, danzas y artesanías que preservan la riqueza cultural de la región. Vive festivales únicos y aprende técnicas artesanales transmitidas por generaciones.",
    image: "/images/home/Tradiciones.jpg",
    icon: (<Sun 
              className="h-10 w-10 text-white"
              role="img"
              aria-label="Icono de voladores representando tradiciones"
              />
            ),
    gradient: "from-pink-900/80 to-black/60",
    align: "center",
    stats:[
      {value: "400+",
        label: "Años de historia"
      },
    ]
  },
];

const StatsBlock: FC<StatsBlockProps> = ({ stats, align }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className={`mt-8 flex flex-wrap gap-x-12 gap-y-6 ${
        align === "left"
          ? "justify-start"
          : align === "right"
          ? "justify-end"
          : "justify-center"
      }`}
    >
      {stats.map((s, i) => (
        <div key={i} className="flex flex-col items-center" role="group" aria-label={`${s.label}: ${s.value}`}>
          {/* Valor grande */}
          <span className="text-5xl md:text-6xl font-extrabold text-white leading-none">
            {s.value}
          </span>
          {/* Etiqueta descriptiva */}
          <span className="text-sm md:text-base text-gray-200 mt-2 text-center max-w-[120px]">
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
};

/* ===========================
   2. Componente de sección individual
=========================== */
const HighlightSection: FC<HighlightSectionProps> = ({
  title,
  text,
  image,
  icon,
  gradient = "from-black/80 to-black/40",
  align = "center",
  stats,
}) => {
  const alignment = align === "left" ? "items-start text-left" : align === "right" ? "items-end text-right" : "items-center text-center";

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      {/* Imagen de fondo optimizada */}
        <motion.img
          src={image}
          alt={`Imagen representando ${title.toLowerCase()} en San Juan Tahitic`}
          className="absolute inset-0 w-full h-full object-cover z-0"
          loading="lazy"
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      {/* Overlay degradado */}
      <div className={`absolute inset-0 bg-gradient-to-t ${gradient} z-0`} />
      <FishAnimation count={15} />
      {/* Contenido */}
      <div className={`relative z-10 max-w-4xl mx-auto px-6 md:px-10 flex flex-col gap-6 ${alignment}`}>
        {/* Ícono con animación */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-center mb-4 bg-white/20 rounded-full p-4 backdrop-blur-lg shadow-lg"
        >
          {icon}
        </motion.div>

        {/* Título */}
        <motion.h2
          role="heading"
          aria-level={2}
          className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          {title}
        </motion.h2>
        {/* Texto descriptivo */}
        <motion.p
          className="text-lg md:text-xl text-white max-w-2xl drop-shadow-md"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {text}
        </motion.p>
        
        {stats?.length ? <StatsBlock stats={stats} align={align} /> : null}

        {/* ¡NUEVO COMPONENTE DE ANIMACIÓN! */}
        
      </div> 
    </section>
  );
};

/* ===========================
   3. Componente principal
=========================== */
export function HeroHighlightsSection() {
  return (
    <div className="w-full">
      {sections.map((section, index) => (
        <HighlightSection
          key={index}
          title={section.title}
          text={section.text}
          image={section.image}
          icon={section.icon}
          gradient={section.gradient}
          align={section.align}
          stats={section.stats}
        />
      ))}
    </div>
  );
}
