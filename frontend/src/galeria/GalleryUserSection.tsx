import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Heart, X, Trash2, UploadCloud, Edit3, User, Calendar, Image, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  type = 'danger'
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  type?: 'danger' | 'warning' | 'info';
}) => {
  const getStyles = () => {
    switch (type) {
      case 'danger':
        return {
          button: 'bg-red-600 hover:bg-red-700 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          title: 'text-red-700'
        };
      case 'warning':
        return {
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
          title: 'text-yellow-700'
        };
      case 'info':
        return {
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: <Info className="w-5 h-5 text-blue-600" />,
          title: 'text-blue-700'
        };
      default:
        return {
          button: 'bg-red-600 hover:bg-red-700 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          title: 'text-red-700'
        };
    }
  };

  const styles = getStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md bg-white/30 backdrop-blur-sm border border-white/20 p-2 text-gray-900 dark:text-gray-100 dark:bg-black/30 dark:border-gray-700 shadow-lg rounded-md">
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className={styles.title}>
            {styles.icon}
          </div>
          <div>
            <DialogTitle className={styles.title}>¿Estás seguro?</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button className={styles.button} onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GalleryUserSection = () => {
  const { 
    photos, 
    loading, 
    uploading, 
    reacting,
    uploadPhoto, 
    updatePhoto, 
    reactToPhoto, 
    hasUserReacted, 
    getReactionCount,
    deletePhoto 
  } = useUserPhotos();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadCaption, setUploadCaption] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(null);

  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUploadForm = () => {
    setUploadCaption('');
    setUploadFile(null);
    setPreviewUrl(null);
    setIsUploadOpen(false);
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadCaption.trim()) {
      toast({
        title: "📁 Información requerida",
        description: "Por favor, selecciona una imagen y escribe una descripción.",
        variant: "warning",
        position: "top-right",
        duration: 4000,
      });
      return;
    }
    
    const success = await uploadPhoto(uploadFile, uploadCaption);
    if (success) {
      resetUploadForm();
    }
  };

  const handleFileChange = (file?: File) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "📁 Tipo de archivo inválido",
        description: "Por favor, selecciona solo archivos de imagen.",
        variant: "warning",
        position: "top-right",
        duration: 4000,
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "📏 Archivo muy grande",
        description: "La imagen no debe superar los 5MB.",
        variant: "warning",
        position: "top-right",
        duration: 4000,
      });
      return;
    }
    
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
    if (!isAuthenticated) {
      toast({
        title: "🔒 Autenticación requerida",
        description: "Debes iniciar sesión para reaccionar a las fotos.",
        variant: "destructive",
        position: "bottom-right",
        duration: 4000,
      });
      return;
    }
    await reactToPhoto(photoId);
  };

  const handleDelete = async (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete({ id: photoId });
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    const success = await deletePhoto(confirmDelete.id);
    if (success && selectedPhoto && selectedPhoto.id === confirmDelete.id) {
      setSelectedPhoto(null);
    }
    setConfirmDelete(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedPhoto) return;
    
    if (!editCaption.trim()) {
      toast({
        title: "✏️ Descripción requerida",
        description: "La descripción no puede estar vacía.",
        variant: "warning",
        position: "top-right",
        duration: 4000,
      });
      return;
    }
    
    const success = await updatePhoto(selectedPhoto.id, editCaption);
    if (success) {
      setSelectedPhoto({ ...selectedPhoto, caption: editCaption });
      setIsEditMode(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
          </div>
          <p className="mt-4 text-gray-600">Cargando galería...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center sm:text-left">
            Galería de{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Usuarios
            </span>
          </h2>
          {isAuthenticated && (
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" /> Subir Foto
            </Button>
          )}
        </div>

        {/* Grid tipo collage */}
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Image className="w-16 h-16 text-gray-400" />
            </div>
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
                  className="mb-4 relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl break-inside-avoid group"
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setEditCaption(photo.caption);
                    setIsEditMode(false);
                  }}
                >
                  {/* Imagen con efecto hover */}
                  <img
                    src={photo.photo_url}
                    alt={photo.caption}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Info y botones */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm text-white rounded-b-xl"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-semibold truncate">{photo.caption}</h3>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {photo.username}
                      </span>
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(photo.id);
                          }}
                          whileTap={{ scale: 0.9 }}
                          className={`flex items-center gap-1 transition-colors duration-300 ${
                            hasUserReacted(photo) ? 'text-red-500' : 'text-white hover:text-red-400'
                          }`}
                          disabled={!isAuthenticated || reacting === photo.id}
                        >
                          {reacting === photo.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                            />
                          ) : (
                            <Heart className={`w-4 h-4 ${hasUserReacted(photo) ? 'fill-current' : ''}`} />
                          )}
                          {getReactionCount(photo)}
                        </motion.button>
                        {user && photo.user_id === user.id && (
                          <motion.button
                            onClick={(e) => handleDelete(photo.id, e)}
                            whileTap={{ scale: 0.9 }}
                            className="text-white hover:text-red-400 transition-colors duration-300"
                            title="Eliminar foto"
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

      {/* Modal de subida */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Subir foto</DialogTitle>
            <DialogDescription className="sr-only">Formulario para subir una nueva foto</DialogDescription>
          </DialogHeader>
          <div className="p-6 bg-gradient-to-tr from-purple-100 via-indigo-50 to-pink-50 rounded-xl">
            <div
              ref={dropRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-purple-400 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-purple-600 transition-colors relative"
            >
              <UploadCloud className="w-10 h-10 mb-2 text-purple-500" />
              <p className="text-purple-700 text-center">Arrastra y suelta la foto aquí, o haz clic</p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || undefined)}
                className="hidden"
              />
              {previewUrl && (
                <div className="relative mt-4 w-full">
                  <img src={previewUrl} alt="Vista previa" className="w-full h-40 object-cover rounded-md shadow-lg" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl(null);
                      setUploadFile(null);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Textarea
                placeholder="Escribe una descripción para tu foto..."
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                rows={3}
                className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-md text-black placeholder:text-black/50"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={resetUploadForm}>Cancelar</Button>
              <Button
                onClick={handleUpload}
                disabled={!uploadFile || !uploadCaption.trim() || uploading}
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white"
              >
                {uploading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Subiendo...
                  </>
                ) : (
                  'Subir'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de foto seleccionada con efecto de pantalla completa */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full h-full max-w-screen max-h-screen flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white z-20 hover:bg-black/80 transition"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Imagen con dimensiones máximas */}
              <img
                src={selectedPhoto.photo_url}
                alt={selectedPhoto.caption}
                className="max-w-screen max-h-screen object-contain rounded-lg shadow-lg"
              />

              {/* Panel de controles en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="max-w-4xl mx-auto">
                  {/* Información de la foto */}
                  <div className="mb-4 text-white">
                    {isEditMode ? (
                      <div className="flex flex-col gap-3">
                        <input
                          type="text"
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-md p-3 text-white placeholder:text-white/70"
                          placeholder="Escribe una descripción..."
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            onClick={handleSaveEdit} 
                            className="bg-purple-600 text-white hover:bg-purple-700"
                          >
                            Guardar
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditMode(false)}
                            className="text-white border-white/30 hover:bg-white/10"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold mb-2">{selectedPhoto.caption}</h3>
                        <div className="flex items-center gap-4 text-sm text-white/80">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {selectedPhoto.username}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(selectedPhoto.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className={`text-white hover:bg-white/10 flex items-center gap-2 ${
                          hasUserReacted(selectedPhoto) ? 'text-red-500' : ''
                        }`}
                        onClick={() => handleLike(selectedPhoto.id)}
                        disabled={!isAuthenticated || reacting === selectedPhoto.id}
                      >
                        {reacting === selectedPhoto.id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                          />
                        ) : (
                          <Heart
                            className={`w-5 h-5 ${hasUserReacted(selectedPhoto) ? 'fill-current' : ''}`}
                          />
                        )}
                        <span>{getReactionCount(selectedPhoto)}</span>
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {user && selectedPhoto.user_id === user.id && !isEditMode && (
                        <Button
                          variant="ghost"
                          className="text-white hover:bg-white/10 flex items-center gap-2"
                          onClick={() => setIsEditMode(true)}
                        >
                          <Edit3 className="w-4 h-4" />
                          Editar
                        </Button>
                      )}

                      {user && selectedPhoto.user_id === user.id && (
                        <Button
                          variant="ghost"
                          className="text-red-400 hover:bg-red-400/10 flex items-center gap-2"
                          onClick={(e) => handleDelete(selectedPhoto.id, e)}
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal con tipo específico */}
      {confirmDelete && (
        <ConfirmDialog
          isOpen={!!confirmDelete}
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
          message="Esta acción eliminará tu foto de forma permanente."
          type="danger"
        />
      )}
    </section>
  );
};

export default GalleryUserSection;