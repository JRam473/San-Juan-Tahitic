import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GalleryGeneralSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Vista panorámica de las montañas", category: "Paisajes" },
    { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Bosque nativo local", category: "Naturaleza" },
    { src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Cascada natural", category: "Naturaleza" },
    { src: "https://images.unsplash.com/photo-1533147670608-2a2f9d775d0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Artesanías tradicionales", category: "Cultura" },
    { src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Comunidad local", category: "Comunidad" },
    { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Sendero ecológico", category: "Turismo" },
    { src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Centro comunitario", category: "Comunidad" },
    { src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Educación local", category: "Comunidad" }
  ];

  return (
    <section id="galeria" className="py-20 bg-gradient-to-br from-yellow-50 via-rose-50 to-green-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Galería Visual
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Explora la belleza de San Juan Tahitic a través de imágenes que capturan 
            la esencia de nuestro territorio, cultura y comunidad.
          </p>
        </div>

        {/* Grid animado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-2xl transform transition-all duration-300"
                onClick={() => setSelectedImage(image.src)}
              >
                <div className="aspect-square">
                  <ImageWithFallback
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-sm font-semibold">{image.category}</div>
                    <div className="text-xs opacity-90">{image.alt}</div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal de imagen */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl w-full h-auto p-0 overflow-hidden">
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative bg-background rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <ImageWithFallback
                    src={selectedImage}
                    alt="Imagen ampliada"
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            ¿Tienes fotos de San Juan Tahitic que te gustaría compartir?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-amber-500 via-green-500 to-rose-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Comparte tus Fotos
          </motion.button>
        </div>
      </div>
    </section>
  );
}
