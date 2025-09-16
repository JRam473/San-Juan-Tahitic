import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Mountain, Trees, Camera, Waves, Leaf, Sun, Star } from 'lucide-react';

export function AdventureActivities () {
  const attractions = [
    {
      icon: Mountain,
      title: "Senderos de Montaña",
      description: "Explora rutas de trekking con vistas panorámicas espectaculares y paisajes únicos que te conectarán con la naturaleza.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-emerald-400 to-green-600",
      shadow: "shadow-nature"
    },
    {
      icon: Trees,
      title: "Reserva Natural",
      description: "Descubre la biodiversidad local en nuestros bosques preservados y ecosistemas únicos llenos de vida.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-green-400 to-emerald-600",
      shadow: "shadow-nature"
    },
    {
      icon: Waves,
      title: "Ríos y Cascadas",
      description: "Disfruta de aguas cristalinas, cascadas naturales perfectas para el ecoturismo y la relajación.",
      image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-cyan-400 to-blue-600",
      shadow: "shadow-nature"
    },
    {
      icon: Camera,
      title: "Miradores Panorámicos",
      description: "Captura las mejores vistas desde nuestros miradores estratégicamente ubicados para momentos únicos.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-amber-400 to-orange-600",
      shadow: "shadow-nature"
    }
  ];

  const stats = [
    { icon: Leaf, number: "15+", label: "Senderos Ecológicos", color: "text-green-600" },
    { icon: Trees, number: "300+", label: "Especies de Flora", color: "text-emerald-600" },
    { icon: Sun, number: "250", label: "Días de Sol al Año", color: "text-yellow-500" },
    { icon: Star, number: "4.8★", label: "Calificación Visitantes", color: "text-amber-500" }
  ];

  return (
    <section id="turismo" className="py-24 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full mb-6">
            <Leaf className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Ecoturismo Sostenible</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Atractivos{' '}
            <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Turísticos
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            San Juan Tahitic ofrece experiencias únicas para los amantes de la naturaleza y el turismo de aventura. 
            Descubre paisajes que te conectarán con la esencia de nuestra tierra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
          {attractions.map((attraction, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-0 bg-white/80 backdrop-blur-sm ${attraction.shadow} overflow-hidden`}
            >
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={attraction.image}
                  alt={attraction.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Gradiente dinámico en hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${attraction.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                {/* Icono flotante */}
                <div className="absolute top-4 right-4 transform group-hover:scale-110 transition-transform duration-300">
                  <div className={`bg-gradient-to-br ${attraction.gradient} p-3 rounded-full shadow-lg`}>
                    <attraction.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                {/* Efectos de brillo */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12 animate-pulse"></div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                  {attraction.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {attraction.description}
                </CardDescription>
                
                {/* Indicador de progreso decorativo */}
                <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${attraction.gradient} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700`}></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sección de estadísticas mejorada */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-elegant border border-green-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-6">
                <Star className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Compromiso Verde</span>
              </div>
              
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Turismo{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Sostenible
                </span>
              </h3>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                Nuestro compromiso con el turismo responsable garantiza la preservación de nuestros recursos naturales 
                para las futuras generaciones. Cada visita contribuye al desarrollo económico local y la conservación ambiental.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-2xl blur-2xl transform rotate-3"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Ecoturismo en San Juan Tahitic"
                className="relative w-full h-80 object-cover rounded-2xl shadow-2xl transform hover:rotate-1 transition-transform duration-500"
              />
              
              {/* Overlay decorativo */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent rounded-2xl"></div>
              
              {/* Badge flotante */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-green-700 font-semibold text-sm">💚 Eco-Certificado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action mejorado */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4">
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 animate-glow">
              Explora Nuestros Senderos
            </button>
            <button className="border-2 border-green-500 text-green-700 hover:bg-green-50 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Guía de Turismo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}