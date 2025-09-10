import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Users, Music, Palette, Book, Crown, Sparkles, Heart, Calendar } from 'lucide-react';

export function CultureSection() {
  const culturalAspects = [
    {
      icon: Music,
      title: "Música Tradicional",
      description: "Ritmos ancestrales que narran la historia de nuestro pueblo y mantienen vivas nuestras tradiciones más profundas.",
      details: ["Instrumentos autóctonos", "Festivales musicales", "Grupos folklóricos locales"],
      gradient: "from-orange-400 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50"
    },
    {
      icon: Palette,
      title: "Artesanías Locales",
      description: "Creaciones únicas elaboradas por artesanos locales con técnicas transmitidas de generación en generación.",
      details: ["Textiles tradicionales", "Cerámica artesanal", "Tallado en madera"],
      gradient: "from-amber-400 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50"
    },
    {
      icon: Book,
      title: "Historia y Leyendas",
      description: "Relatos que forman parte del patrimonio oral de nuestra comunidad y definen nuestra identidad cultural.",
      details: ["Leyendas ancestrales", "Sitios históricos", "Tradición oral"],
      gradient: "from-yellow-400 to-amber-600",
      bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50"
    },
    {
      icon: Users,
      title: "Festividades",
      description: "Celebraciones comunitarias que fortalecen los lazos sociales y preservan nuestras costumbres más queridas.",
      details: ["Fiestas patronales", "Celebraciones estacionales", "Encuentros culturales"],
      gradient: "from-rose-400 to-pink-600",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50"
    }
  ];

  const culturalStats = [
    { icon: Crown, number: "500+", label: "Años de Historia", color: "text-amber-600" },
    { icon: Palette, number: "20+", label: "Artesanos Locales", color: "text-orange-600" },
    { icon: Calendar, number: "8", label: "Festivales Anuales", color: "text-rose-600" },
    { icon: Heart, number: "100%", label: "Tradición Viva", color: "text-red-600" }
  ];

  return (
    <section id="cultura" className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-5 w-5 text-orange-600" />
            <span className="text-orange-800 font-medium">Herencia Cultural</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Patrimonio{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
              Cultural
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Nuestra rica herencia cultural es el alma de San Juan Tahitic. Descubre las tradiciones, 
            arte y expresiones que han dado forma a nuestra identidad comunitaria a lo largo de los siglos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {culturalAspects.map((aspect, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-culture transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm overflow-hidden"
            >
              <CardHeader className="flex flex-row items-start space-y-0 pb-4 relative">
                {/* Gradiente de fondo animado */}
                <div className={`absolute inset-0 ${aspect.bgColor} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                
                <div className="relative mr-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-200 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className={`relative bg-gradient-to-br ${aspect.gradient} p-4 rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <aspect.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 relative">
                  <CardTitle className="text-2xl text-gray-900 group-hover:text-orange-700 transition-colors duration-300 mb-3">
                    {aspect.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {aspect.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="relative">
                <div className="space-y-3">
                  {aspect.details.map((detail, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center text-gray-700 group-hover:text-orange-700 transition-colors duration-300"
                    >
                      <div className={`w-3 h-3 bg-gradient-to-r ${aspect.gradient} rounded-full mr-3 shadow-lg group-hover:scale-125 transition-transform duration-300`}></div>
                      <span className="font-medium">{detail}</span>
                    </div>
                  ))}
                </div>
                
                {/* Barra de progreso decorativa */}
                <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${aspect.gradient} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 shadow-lg`}></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sección de preservación cultural */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 lg:p-16 shadow-culture border border-orange-100 relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-600/20 rounded-3xl blur-2xl transform -rotate-3"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1533147670608-2a2f9775d0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Artesanías tradicionales de San Juan Tahitic"
                className="relative w-full h-80 object-cover rounded-3xl shadow-2xl transform hover:rotate-1 transition-all duration-500"
              />
              
              {/* Overlay decorativo */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 to-transparent rounded-3xl"></div>
              
              {/* Badge flotante */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl">
                <span className="text-orange-700 font-semibold text-sm flex items-center">
                  <Crown className="h-4 w-4 mr-1" />
                  Patrimonio UNESCO
                </span>
              </div>
              
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            <div>
              <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-6">
                <Heart className="h-5 w-5 text-orange-600" />
                <span className="text-orange-800 font-medium">Tradición Viva</span>
              </div>
              
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Preservando Nuestras{' '}
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Raíces
                </span>
              </h3>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                Trabajamos activamente en la preservación y promoción de nuestro patrimonio cultural. 
                A través de talleres, festivales y programas educativos, mantenemos vivas las tradiciones 
                que nos definen como comunidad.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {culturalStats.map((stat, index) => (
                  <div 
                    key={index}
                    className="group bg-gradient-to-br from-white to-orange-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Lista de logros */}
              <div className="space-y-4">
                {[
                  "Talleres de artesanía tradicional",
                  "Festival anual de cultura local",
                  "Programa de mentores artesanos",
                  "Archivo digital de tradiciones orales"
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center group">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mr-4 group-hover:scale-150 transition-transform duration-300 shadow-lg"></div>
                    <span className="text-gray-700 group-hover:text-orange-700 font-medium transition-colors duration-300">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to action cultural */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4">
            <button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-4 rounded-full font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-culture">
              Explora Nuestra Cultura
            </button>
            <button className="border-2 border-orange-500 text-orange-700 hover:bg-orange-50 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Calendario Cultural
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}