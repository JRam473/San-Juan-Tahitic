import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Coffee, Wine, Droplet, Leaf, FlaskConical, Store } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

export function ServiciosSection() {
  const servicios = [
    {
      icon: Coffee,
      title: "Café Yektanesik",
      description: "Café artesanal producido en San Juan Tahitic, cultivado de forma sostenible con tradición y calidad.",
      image: "/images/comunidad/cafe-coperariva.jpeg",
      gradient: "from-amber-500 to-yellow-600",
    },
    {
      icon: Wine,
      title: "Licores Chiwanjmej",
      description: "Licores artesanales de sabores locales como café, caña y frutas, elaborados por productores de la comunidad.",
      image: "/images/comunidad/licores.jpeg",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: Droplet,
      title: "Punche Ancestral",
      description: "Bebida tradicional de la comunidad, hecha con técnicas transmitidas de generación en generación.",
      image: "/images/comunidad/punche.jpeg",
      gradient: "from-red-500 to-orange-600",
    },
    {
      icon: Leaf,
      title: "Jabones Artesanales",
      description: "Elaborados con plantas locales y sello Sembrando Vida, productos naturales para el cuidado personal.",
      image: "/images/comunidad/jabones.jpeg",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: FlaskConical,
      title: "Jugos Naturales",
      description: "Jugos frescos y saludables de frutas locales Yektanesik, hechos con ingredientes 100% naturales.",
      image: "/images/comunidad/jugo-fruta.jpeg",
      gradient: "from-pink-400 to-rose-500",
    },
    {
      icon: Store,
      title: "Productos de la Cooperativa",
      description: "Todos los productos con identidad local, hechos por habitantes de San Juan Tahitic para fortalecer la economía comunitaria.",
      image: "/images/comunidad/productos-coperativa.jpeg",
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  const [openTooltip, setOpenTooltip] = useState<number | null>(null);

  return (
    <section id="servicios" className="py-24 bg-gradient-to-br from-yellow-50 via-rose-50 to-green-50 relative overflow-hidden">
      {/* Fondos decorativos */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl animate-float"
        animate={{ opacity: [0.3, 0.7, 0.3], y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl animate-float"
        animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Nuestros{" "}
            <span className="bg-gradient-to-r from-amber-600 via-green-500 to-rose-500 bg-clip-text text-transparent">
              Servicios
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            La cooperativa ofrece productos y servicios auténticos que representan la riqueza cultural, gastronómica y artesanal de San Juan Tahitic.
          </p>
        </motion.div>

        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {servicios.map((servicio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Tooltip
                  open={openTooltip === index}
                  onOpenChange={(isOpen) => setOpenTooltip(isOpen ? index : null)}
                >
                  <TooltipTrigger asChild>
                    <Card
                      className="group relative border-0 overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer"
                      onClick={() => setOpenTooltip(index)}
                    >
                      <div className="relative w-full h-64 sm:h-72 lg:h-64 xl:h-72 2xl:h-80 overflow-hidden">
                        <ImageWithFallback
                          src={servicio.image}
                          alt={servicio.title}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                          <CardTitle className="text-white text-xl font-bold drop-shadow-lg px-2 py-1 bg-black/30 rounded-md">
                            {servicio.title}
                          </CardTitle>
                        </div>
                      </div>
                    </Card>
                  </TooltipTrigger>

                  <TooltipContent
                    side="top"
                    align="center"
                    sideOffset={12} 
                    className={`relative max-w-xs text-gray-900 bg-slate-200/80 backdrop-blur-sm border border-slate-300 rounded-xl shadow-2xl p-4 font-medium text-base leading-relaxed tracking-wide
                      animate-in fade-in-0 zoom-in-95
                      data-[state=closed]:animate-out
                      data-[state=closed]:fade-out-0
                      data-[state=closed]:zoom-out-95
                    `}
                  >
                    <div className="flex items-start">
                      <div className="mr-2 mt-1 text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="animate-bounce">
                          <path d="M8 0L6.59 1.41 12.17 7H0v2h12.17l-5.58 5.59L8 16l8-8-8-8z" />
                        </svg>
                      </div>
                      <p className="relative z-10">{servicio.description}</p>
                    </div>
                    <div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0
                                 border-l-10 border-r-10 border-t-10 border-l-transparent border-r-transparent
                                 border-t-slate-300 shadow-lg"
                    />
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
}
