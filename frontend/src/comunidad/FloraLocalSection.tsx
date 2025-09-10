// src/components/FloraLocalSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const floraData = [
  {
    name: "Copal",
    image: "/images/flora/copal.jpg",
    usos: {
      medicinal: "Resina usada en limpias y rituales de sanación.",
      tintes: "Se emplea en mezclas para dar color en artesanías.",
      gastronomia: "En algunos lugares se usa para sazonar bebidas tradicionales.",
      artesania: "La madera puede tallarse para máscaras o figuras."
    }
  },
  {
    name: "Cempasúchil",
    image: "/images/flora/cempasuchil.jpg",
    usos: {
      medicinal: "Infusiones para problemas digestivos y respiratorios.",
      tintes: "Los pétalos se utilizan como pigmento natural amarillo.",
      gastronomia: "Flores usadas en atoles y bebidas regionales.",
      artesania: "Decoración en festividades como Día de Muertos."
    }
  },
  {
    name: "Hierba Santa",
    image: "/images/flora/hierba-santa.jpg",
    usos: {
      medicinal: "Alivia malestares estomacales y reumatismo.",
      tintes: "Puede usarse para dar tonos verdes suaves.",
      gastronomia: "Hojas aromáticas para tamales, pescados y salsas.",
      artesania: "Secada y prensada para decoraciones naturales."
    }
  }
];

export default function FloraLocalSection() {

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-nature-100 via-nature-50 to-nature-200">
      
      {/* Fondos decorativos */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-nature-300 rounded-full mix-blend-multiply filter blur-xl animate-float opacity-30 transition-opacity duration-700"/>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-nature-400 rounded-full mix-blend-multiply filter blur-2xl animate-float delay-700 opacity-30 transition-opacity duration-700"/>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-nature-200 rounded-full mix-blend-multiply filter blur-xl animate-float delay-1000 opacity-20 transition-opacity duration-700"/>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }} // <- repetición al entrar
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-nature-700 tracking-tight drop-shadow-md">
            🌿 Flora Local
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mt-4 max-w-2xl mx-auto">
            Biodiversidad y usos tradicionales que forman parte de nuestra identidad cultural
          </p>
        </motion.div>

        {/* Galería */}
        <div className="grid md:grid-cols-3 gap-10">
          {floraData.map((planta, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <Card className="shadow-nature rounded-2xl overflow-hidden hover:scale-105 hover:shadow-xl transition-transform duration-300 bg-white/90 backdrop-blur-md border border-nature-200 flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={planta.image}
                    alt={planta.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="bg-nature-100/60">
                  <CardTitle className="text-nature-700 text-xl font-semibold">
                    {planta.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <Accordion type="single" collapsible className="w-full mt-2">
                    {Object.entries(planta.usos).map(([uso, desc], i) => (
                      <AccordionItem key={i} value={uso}>
                        <AccordionTrigger className={`capitalize font-medium px-2 py-1 rounded-md transition-colors ${uso === "medicinal" ? "bg-green-100 hover:bg-green-200" : uso === "tintes" ? "bg-yellow-100 hover:bg-yellow-200" : uso === "gastronomia" ? "bg-orange-100 hover:bg-orange-200" : "bg-purple-100 hover:bg-purple-200"}`}>
                          {uso}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-sm leading-relaxed">
                          {desc}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
