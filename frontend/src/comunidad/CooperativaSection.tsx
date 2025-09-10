// src/comunidad/CooperativaSection.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Coffee, Wine, Leaf, Droplet, Users, ShoppingBag, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function CooperativaSection() {
  const productos = [
    {
      icon: Coffee,
      title: "Café Yektanesik",
      description: "Café orgánico de altura, cultivado y producido por familias locales con tradición y pasión.",
      image: "/images/cafe-yektanesik.jpg",
      gradient: "from-amber-400 to-orange-600",
      accent: "text-amber-600"
    },
    {
      icon: Wine,
      title: "Punche & Licores Chiwanjmej",
      description: "Bebida ancestral Punche y licores artesanales de sabores tradicionales, hechos en la comunidad.",
      image: "/images/licores-chiwanjmej.jpg",
      gradient: "from-purple-400 to-pink-600",
      accent: "text-purple-600"
    },
    {
      icon: Leaf,
      title: "Jabones Artesanales",
      description: "Elaborados con plantas medicinales locales dentro del programa Sembrando Vida.",
      image: "/images/jabones-artesanales.jpg",
      gradient: "from-green-400 to-emerald-600",
      accent: "text-green-600"
    },
    {
      icon: Droplet,
      title: "Jugos Yektanesik",
      description: "Jugos frescos de frutas de la región, 100% naturales y nutritivos.",
      image: "/images/jugos-yektanesik.jpg",
      gradient: "from-red-400 to-orange-600",
      accent: "text-red-600"
    }
  ];

  const impacto = [
    { icon: Award, number: "10+", label: "Años de Producción Local", color: "text-amber-600", bg: "from-amber-400 to-orange-600" },
    { icon: Users, number: "50+", label: "Familias Beneficiadas", color: "text-purple-600", bg: "from-purple-400 to-pink-600" },
    { icon: ShoppingBag, number: "20+", label: "Productos Comunitarios", color: "text-green-600", bg: "from-green-400 to-emerald-600" },
    { icon: Sparkles, number: "100%", label: "Producción Artesanal", color: "text-red-600", bg: "from-red-400 to-orange-600" }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="cooperativa" className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Fondos decorativos */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl animate-float"
        animate={{ opacity: [0.3, 0.7, 0.3], y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl animate-float"
        animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-pink-100 px-4 py-2 rounded-full mb-6">
            <Users className="h-5 w-5 text-amber-600" />
            <span className="text-amber-800 font-medium">Producción Comunitaria</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Nuestra{' '}
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-pink-600 bg-clip-text text-transparent">
              Cooperativa
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            La Sociedad Cooperativa CHIWANJMEJ y Café Yektanesik impulsan la economía local a través de productos artesanales,
            sostenibles y con identidad cultural. Cada compra apoya directamente a las familias de San Juan Tahitic.
          </p>
        </motion.div>

        {/* Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {productos.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card 
                className="group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-4 border-0 bg-white/90 backdrop-blur-sm overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-25 transition-opacity duration-500`}></div>
                  
                  {/* Icono flotante */}
                  <div className="absolute bottom-4 left-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <div className={`bg-gradient-to-br ${item.gradient} p-3 rounded-xl shadow-xl`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className={`text-lg text-gray-900 group-hover:${item.accent} transition-colors duration-300`}>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Impacto de la cooperativa */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 lg:p-16 shadow-lg border border-amber-100 relative overflow-hidden mb-20">
          <div className="text-center mb-16 relative">
            <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-6">
              <Award className="h-5 w-5 text-orange-600" />
              <span className="text-orange-800 font-medium">Impacto Local</span>
            </div>
            
            <motion.h3
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-gray-900 mb-6"
            >
              Más que Productos,{' '}
              <span className="bg-gradient-to-r from-amber-600 to-pink-600 bg-clip-text text-transparent">
                Oportunidades
              </span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed"
            >
              Cada servicio o producto de la cooperativa representa un ingreso justo, preserva tradiciones 
              y fortalece el tejido comunitario de San Juan Tahitic.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impacto.map((data, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group text-center bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200/50 to-pink-200/50 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className={`relative bg-gradient-to-br ${data.bg} p-4 rounded-2xl shadow-xl mx-auto w-fit group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <data.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className={`text-4xl md:text-5xl font-bold mb-3 ${data.color} group-hover:scale-110 transition-transform duration-300`}>
                  {data.number}
                </div>
                <div className="text-gray-600 font-medium leading-relaxed">{data.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4">
            <button className="bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-600 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300">
              Comprar Productos
            </button>
            <button className="border-2 border-amber-500 text-amber-700 hover:bg-amber-50 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Conocer la Cooperativa
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
