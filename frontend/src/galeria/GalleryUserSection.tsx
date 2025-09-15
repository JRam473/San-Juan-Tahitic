// components/GalleryUserSection.tsx
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Heart, X, Trash2, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';

const GalleryUserSection = () => {
  const { photos, loading, uploading, uploadPhoto, reactToPhoto, hasUserReacted, deletePhoto } = useUserPhotos();
  const { isAuthenticated, user } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const resetUploadForm = () => {
    setUploadCaption('');
    setUploadFile(null);
    setPreviewUrl(null);
    setIsUploadOpen(false);
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadCaption.trim()) return;
    const success = await uploadPhoto(uploadFile, uploadCaption);
    if (success) resetUploadForm();
  };

  const handleFileChange = (file?: File) => {
    if (!file) return;
    setUploadFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleLike = async (photoId: string) => {
    if (!isAuthenticated) return;
    await reactToPhoto(photoId);
  };

  const handleDelete = async (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
      await deletePhoto(photoId);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 text-center">
          <p>Cargando galería...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Galería de{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Usuarios
            </span>
          </h2>
          {isAuthenticated && (
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" /> Subir Foto
            </Button>
          )}
        </div>

        {/* Grid tipo collage */}
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No hay fotos en la galería todavía.</p>
            {isAuthenticated && (
              <Button
                onClick={() => setIsUploadOpen(true)}
                className="mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              >
                Sé el primero en subir una foto
              </Button>
            )}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
            <AnimatePresence>
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mb-4 relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl break-inside-avoid"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.photo_url}
                    alt={photo.caption}
                    className="w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm text-white"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-semibold">{photo.caption}</h3>
                    <div className="flex justify-between items-center mt-1 text-sm">
                      <span>{photo.username}</span>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={(e) => { e.stopPropagation(); handleLike(photo.id); }}
                          whileTap={{ scale: 0.9 }}
                          className={`flex items-center gap-1 transition-colors duration-300 ${
                            hasUserReacted(photo) ? 'text-red-500' : 'text-white hover:text-red-400'
                          }`}
                          disabled={!isAuthenticated}
                        >
                          <Heart className={`w-4 h-4 ${hasUserReacted(photo) ? 'fill-current' : ''}`} />
                          {photo.reactions?.length || 0}
                        </motion.button>
                        {user && photo.user_id === user.id && (
                          <motion.button
                            onClick={(e) => handleDelete(photo.id, e)}
                            whileTap={{ scale: 0.9 }}
                            className="text-white hover:text-red-400 transition-colors duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal de subida con Drag & Drop */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">Subir foto</DialogTitle>
          <DialogDescription className="sr-only">Formulario para subir una nueva foto a la galería</DialogDescription>
          <div className="p-6 bg-gradient-to-tr from-purple-100 via-indigo-50 to-pink-50 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-center">Sube tu foto</h3>
            <div
              ref={dropRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-purple-400 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-purple-600 transition-colors"
            >
              <UploadCloud className="w-10 h-10 mb-2 text-purple-500" />
              <p className="text-purple-700 text-center">
                Arrastra y suelta la foto aquí, o haz clic para seleccionar
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || undefined)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {previewUrl && (
                <img src={previewUrl} alt="Vista previa" className="w-full h-40 object-cover rounded-md mt-4" />
              )}
            </div>
            <Textarea
              placeholder="Descripción de la foto..."
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              rows={3}
              className="mb-4 mt-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetUploadForm}>
                Cancelar
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!uploadFile || !uploadCaption.trim() || uploading}
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all"
              >
                {uploading ? 'Subiendo...' : 'Subir'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de foto seleccionada */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogTitle className="sr-only">Detalles de la foto</DialogTitle>
          <DialogDescription className="sr-only">Vista ampliada de la foto seleccionada con información detallada</DialogDescription>
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
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={selectedPhoto.photo_url}
                  alt={selectedPhoto.caption}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
                <div className="p-6 bg-background">
                  <h3 className="text-xl font-semibold mb-2">{selectedPhoto.caption}</h3>
                  <span className="text-muted-foreground">
                    {selectedPhoto.username} • {new Date(selectedPhoto.created_at).toLocaleDateString()}
                  </span>
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
