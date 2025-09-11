import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Datos simulados
const mockPhotos = [
  { id: '1', url: '/placeholder.svg', caption: 'Vista del centro', author: 'Juan', date: '2025-09-10', likes: 3 },
  { id: '2', url: '/placeholder.svg', caption: 'Parque principal', author: 'Ana', date: '2025-09-09', likes: 5 },
];

const GalleryUserSection = () => {
  const [photos, setPhotos] = useState(mockPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCaption, setUploadCaption] = useState('');
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});

  const handleUpload = () => {
    if (!uploadCaption.trim()) return;
    const newPhoto = {
      id: (photos.length + 1).toString(),
      url: '/placeholder.svg',
      caption: uploadCaption,
      author: 'Usuario Demo',
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };
    setPhotos([newPhoto, ...photos]);
    setUploadCaption('');
    setIsUploadOpen(false);
  };

  const toggleLike = (photoId: string) => {
    setLikedPhotos(prev => ({ ...prev, [photoId]: !prev[photoId] }));
    setPhotos(prev =>
      prev.map(p =>
        p.id === photoId
          ? { ...p, likes: likedPhotos[photoId] ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-rose-50 to-green-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Galería de{" "}
            <span className="bg-gradient-to-r from-amber-600 via-green-500 to-rose-500 bg-clip-text text-transparent">
              Usuarios
            </span>
          </h2>
          <Button
            onClick={() => setIsUploadOpen(true)}
            className="bg-gradient-to-r from-amber-500 via-green-500 to-rose-500 
                       text-white font-semibold flex items-center gap-2 px-5 py-2.5 
                       rounded-xl shadow-lg hover:shadow-xl hover:scale-105 
                       transition-all duration-300"
          >
            <Plus className="w-5 h-5" /> Subir Foto
          </Button>
        </div>

        {/* Grid de fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {photos.map(photo => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-64 object-cover transition-transform duration-700 hover:scale-105"
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm text-white"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-semibold">{photo.caption}</h3>
                  <div className="flex justify-between items-center mt-1 text-sm">
                    <span>{photo.author}</span>
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); toggleLike(photo.id); }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex items-center gap-1 transition-colors duration-300 ${
                        likedPhotos[photo.id]
                          ? 'text-red-500'
                          : 'text-white hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedPhotos[photo.id] ? 'fill-current' : ''}`} />
                      {photo.likes}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de subir foto */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Subir Foto</h3>
            <Textarea
              placeholder="Descripción de la foto..."
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              rows={3}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleUpload}
                className="bg-gradient-to-r from-amber-500 via-green-500 to-rose-500 
                           text-white font-semibold px-4 py-2 rounded-lg shadow-md 
                           hover:scale-105 hover:shadow-lg transition-all"
              >
                Subir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de foto seleccionada */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <AnimatePresence>
            {selectedPhoto && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative bg-background rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white z-10 hover:bg-black/70 transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="w-full h-auto object-contain" />
                <div className="p-6 bg-background">
                  <h3 className="text-xl font-semibold mb-2">{selectedPhoto.caption}</h3>
                  <span className="text-muted-foreground">{selectedPhoto.author} • {selectedPhoto.date}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GalleryUserSection;
