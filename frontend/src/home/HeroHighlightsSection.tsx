import { Card, CardContent } from "@/components/ui/card";
import { Mountain, Utensils, Users, Sun, Sparkles, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

// Definir tipo para los elementos del highlight
interface HighlightItem {
  icon: LucideIcon;
  title: string;
  text: string;
  image: string;
  gradient: string;
  color: string;
}

// Imágenes de ejemplo (deberías reemplazarlas con tus propias imágenes)
const natureImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
const gastronomyImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1107&q=80";
const communityImage = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1156&q=80";
const traditionsImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w-1174&q=80";

const highlights: HighlightItem[] = [
  {
    icon: Mountain,
    title: "Naturaleza",
    text: "Paisajes montañosos, ríos y cascadas que invitan a la aventura y el descanso. Explora senderos únicos y conecta con la biodiversidad de nuestra región en experiencias inolvidables.",
    image: natureImage,
    gradient: "from-emerald-400 to-green-600",
    color: "text-emerald-600",
  },
  {
    icon: Utensils,
    title: "Gastronomía",
    text: "Delicias locales que mezclan tradición y sabor auténtico en cada platillo. Descubre sabores ancestrales en mercados locales y restaurantes con cocina tradicional innovadora.",
    image: gastronomyImage,
    gradient: "from-amber-400 to-orange-600", 
    color: "text-yellow-600",
  },
  {
    icon: Users,
    title: "Comunidad",
    text: "Personas cálidas y hospitalarias que te hacen sentir como en casa. Participa en actividades comunitarias y conoce historias de vida que enriquecerán tu experiencia cultural.",
    image: communityImage,
    gradient: "from-cyan-400 to-blue-600", // <-- Agregar esta línea
    color: "text-blue-600",
  },
  {
    icon: Sun,
    title: "Tradiciones",
    text: "Fiestas, danzas y artesanías que preservan la riqueza cultural de la región. Vive festivales únicos y aprende técnicas artesanales transmitidas por generaciones.",
    image: traditionsImage,
    gradient: "from-pink-400 to-purple-600", // <-- Agregar esta línea
    color: "text-pink-600",
  },
];

export function HeroHighlightsSection() {
  return (
    <section className="relative bg-gradient-to-b from-emerald-50 via-white to-emerald-10 py-24 px-6 sm:px-10 lg:px-20 overflow-hidden">
      {/* Decoración de fondo animada */}
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Título con estrella animada */}
        <motion.div
          className="flex justify-center items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Sparkles className="h-8 w-8 text-emerald-600 animate-pulse" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 relative">
            Descubre lo que hace único a{" "}
            <span className="text-emerald-600">San Juan Tahitic</span>
          </h2>
          <Sparkles className="h-8 w-8 text-emerald-600 animate-pulse" />
        </motion.div>

        {/* Subtítulo */}
        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          Vive una experiencia inolvidable en un pueblo lleno de cultura, paisajes naturales,
          tradiciones y hospitalidad. Aquí algunos aspectos que no puedes perderte.
        </motion.p>

        {/* Grid de tarjetas mejoradas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <Hover3DCard 
                key={i}
                item={item}
                index={i}
                Icon={Icon}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Props para el componente Hover3DCard
interface Hover3DCardProps {
  item: HighlightItem;
  index: number;
  Icon: LucideIcon;
}

// Componente de tarjeta 3D mejorada
const Hover3DCard = ({ item, index, Icon }: Hover3DCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Manejar el efecto 3D al mover el mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = (x - centerX) / 25;
    const rotateX = (centerY - y) / 25;
    
    card.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
      scale3d(1.02, 1.02, 1.02)
    `;
  };
  
  // Restablecer la transformación al salir del hover
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateX(0deg) 
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="h-full"
    >
      <div
        ref={cardRef}
        className="h-[500px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease, box-shadow 0.5s ease'
        }}
      >
        <Card className="h-full border-0 rounded-3xl overflow-hidden relative group">
          {/* Imagen de fondo con superposición para mejor legibilidad */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 group-hover:scale-110 transition-transform duration-700"
            style={{ backgroundImage: `url(${item.image})` }}
          />
          
          {/* Superposición gradiente para mejor contraste y legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-1 group-hover:from-black/70 group-hover:via-black/20 transition-all duration-500" />
          
          <CardContent className="flex flex-col items-center text-center p-8 relative z-2 h-full justify-end">
            {/* Icono con efecto de flotación */}
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              {/* Nuevo div para el fondo del ícono */}
            <div className={`bg-gradient-to-br ${item.gradient} p-4 rounded-full shadow-lg`}>
                {/* Ícono ahora con color blanco */}
            <Icon className={`h-10 w-10 text-white`} />
            </div>
            </motion.div>
            
            {/* Título con mejor contraste */}
            <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg px-2 bg-black/20 rounded-lg py-1">
              {item.title}
            </h3>
            
            {/* Descripción extendida con mejor legibilidad */}
            <p className="text-white text-md leading-relaxed drop-shadow-lg mb-4 bg-black/10 p-3 rounded-lg backdrop-blur-sm">
              {item.text}
            </p>
            
            {/* Indicador de hover */}
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:translate-y-0 translate-y-4">
              <span className="text-white text-sm font-medium italic bg-emerald-600/80 px-3 py-1 rounded-full">
                Explora más →
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};