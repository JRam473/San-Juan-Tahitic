// src/components/AgriculturaSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Leaf, Calendar, Sprout, Coffee, Wheat } from "lucide-react"

// Productos cultivados
const productosCultivados = [
  { name: "Maíz", image: "/images/comunidad/agricultura/elote.jpeg", icon: Wheat },
  { name: "Café YEKTANESIK", image: "/images/comunidad/agricultura/cafe-capulin.jpeg", icon: Coffee },
  { name: "Frutas", image: "/images/agricultura/frutas.jpg", icon: Leaf },
  { name: "Hortalizas", image: "/images/comunidad/agricultura/planta-cafe.jpeg", icon: Sprout },
  { name: "Hierbas", image: "/images/agricultura/hierbas.jpg", icon: Leaf }
]

// Calendario agrícola
const calendarioAgricola = [
  { temporada: "🌱 Primavera", actividades: "Siembra de maíz y café, preparación de huertos de hortalizas." },
  { temporada: "☀️ Verano", actividades: "Riego intensivo, control de plagas, cuidado de frutales." },
  { temporada: "🍂 Otoño", actividades: "Cosecha de maíz y frutas, preparación de tierra para cultivos de invierno." },
  { temporada: "❄️ Invierno", actividades: "Siembra de hortalizas de temporada, mantenimiento de huertos y árboles frutales." }
]

// Historias de productores
const historiasProductores = [
  {
    name: "Don José",
    image: "/images/agricultura/productor1.jpg",
    story: "Cultiva café desde hace 20 años y ha implementado prácticas agroecológicas para mejorar la calidad y sostenibilidad de su parcela."
  },
  {
    name: "Doña María",
    image: "/images/agricultura/productor2.jpg",
    story: "Se dedica al cultivo de hortalizas y frutas, participando activamente en programas de comercio justo y producción orgánica."
  }
]

export default function AgriculturaSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const productosRef = useRef<HTMLDivElement>(null)
  const calendarioRef = useRef<HTMLDivElement>(null)
  const historiasRef = useRef<HTMLDivElement>(null)

  const isTitleInView = useInView(titleRef, { amount: 0.3, once: false })
  const isProductosInView = useInView(productosRef, { amount: 0.3, once: false })
  const isCalendarioInView = useInView(calendarioRef, { amount: 0.3, once: false })
  const isHistoriasInView = useInView(historiasRef, { amount: 0.3, once: false })

  return (
    <section className="relative py-20 bg-gradient-to-b from-yellow-50 via-white to-green-50 overflow-hidden">
      {/* Fondos animados */}
      <motion.div 
        className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="w-full max-w-[1200px] mx-auto px-6">

        {/* Título */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: -30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 to-yellow-600 bg-clip-text text-transparent drop-shadow-md">
            🌾 Agricultura y Producción
          </h2>
          <p className="text-lg text-gray-700 mt-3">
            Conoce los <span className="font-semibold text-green-700">productos cultivados</span>, 
            prácticas sostenibles y las <span className="font-semibold text-green-700">historias</span> de nuestros productores.
          </p>
        </motion.div>

        {/* Productos cultivados */}
        <div ref={productosRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {productosCultivados.map((producto, idx) => {
            const Icon = producto.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={isProductosInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="w-full group relative border-0 overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer">
                  <div className="relative w-full h-64 overflow-hidden rounded-lg">
                    <img
                      src={producto.image}
                      alt={producto.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                      <CardTitle className="flex items-center gap-2 text-white text-xl font-bold drop-shadow-lg px-2 py-1 bg-black/30 rounded-md">
                        <Icon className="h-6 w-6" /> {producto.name}
                      </CardTitle>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Calendario agrícola */}
        <div ref={calendarioRef} className="mb-20">
          <h3 className="text-2xl font-bold text-green-800 mb-10 flex items-center gap-2 justify-center">
            <Calendar className="h-6 w-6 text-green-600" /> Calendario Agrícola
          </h3>
          <div className="relative border-l-4 border-green-300 pl-6 space-y-10 max-w-[1100px] mx-auto">
            {calendarioAgricola.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -40 }}
                animate={isCalendarioInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <div className="absolute -left-9 top-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                
                <Card className="bg-gradient-to-r from-green-50 to-yellow-50 shadow-md rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
                  <CardHeader>
                    <CardTitle className="text-green-700 text-lg">{item.temporada}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600">{item.actividades}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Historias de productores */}
        <div ref={historiasRef} className="mb-10">
          <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">👩‍🌾 Historias de nuestros productores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {historiasProductores.map((prod, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={isHistoriasInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                whileHover={{ scale: 1.02, rotate: [0, -1, 1, 0] }}
              >
                <Card className="w-full shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition group border border-green-100 hover:border-green-300">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <CardHeader>
                    <CardTitle className="text-green-700">{prod.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600 text-sm">{prod.story}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
