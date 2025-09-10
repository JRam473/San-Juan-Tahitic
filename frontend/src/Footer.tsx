import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { AuthButton } from './AuthButton'; // Asegúrate de importar correctamente

export function Footer() {
  const quickLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#turismo', label: 'Atractivos Turísticos' },
    { href: '#cultura', label: 'Cultura' },
    { href: '#comunidad', label: 'Comunidad' }
  ];

  const services = [
    'Tours Guiados',
    'Hospedaje Local',
    'Gastronomía Regional',
    'Artesanías',
    'Transporte',
    'Eventos Culturales'
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-8 w-8 text-blue-400" />
              <span className="text-2xl">San Juan Tahitic</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Un destino único que combina belleza natural, riqueza cultural y calidez humana. 
              Descubre todo lo que nuestra comunidad tiene para ofrecer.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">San Juan Tahitic, Región Central</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">info@sanjuantahitic.com</span>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => scrollToSection('#galeria')}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Galería
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#contacto')}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-lg mb-4">Servicios</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Redes Sociales, AuthButton y Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <button className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Facebook className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Instagram className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Twitter className="h-6 w-6" />
              </button>
            </div>

            {/* Botón de Autenticación */}
            <div className="mb-4 md:mb-0">
              <AuthButton />
            </div>

            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>&copy; 2025 San Juan Tahitic. Todos los derechos reservados.</p>
              <p className="mt-1">Desarrollado con ❤️ para nuestra comunidad</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
