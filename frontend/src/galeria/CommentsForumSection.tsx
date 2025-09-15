import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Heart, Edit, Trash2, X, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useComments, type Comment } from '@/hooks/useComments';
import { Toast, ToastProvider, ToastTitle, ToastDescription, ToastViewport } from '@/components/ui/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// --------------------- Toast Notification ---------------------
const FeedbackToast = ({ type, message }: { type: 'success' | 'error'; message: string }) => (
  <Toast>
    <div className="flex items-center gap-3">
      {type === 'success' ? (
        <CheckCircle2 className="text-green-500 w-6 h-6" />
      ) : (
        <AlertTriangle className="text-red-500 w-6 h-6" />
      )}
      <div>
        <ToastTitle className="font-semibold">
          {type === 'success' ? '¡Éxito!' : 'Ups, algo salió mal'}
        </ToastTitle>
        <ToastDescription>{message}</ToastDescription>
      </div>
    </div>
  </Toast>
);

// --------------------- LikeButton ---------------------
const LikeButton = ({
  likeCount,
  onClick,
  isLiked,
  isLoading,
  isDisabled
}: { 
  likeCount: number; 
  onClick?: () => void; 
  isLiked?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
}) => {
  const [justClicked, setJustClicked] = useState(false);
  
  const handleClick = () => {
    if (isLoading || isDisabled || justClicked) return;
    
    setJustClicked(true);
    onClick?.();
    
    // Prevenir clicks dobles por 1 segundo
    setTimeout(() => setJustClicked(false), 1000);
  };
  
  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={isLoading || isDisabled || justClicked}
      whileTap={{ scale: 0.9 }}
      className={`flex items-center gap-2 text-base font-medium transition-colors duration-300 ${
        isLiked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
      } ${isLoading || justClicked ? 'opacity-50 cursor-not-allowed' : ''} ${
        isDisabled ? 'cursor-not-allowed opacity-60' : ''
      }`}
    >
      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
      {likeCount}
    </motion.button>
  );
};

// --------------------- Confirm Modal ---------------------
const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  message
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}) => (
  <Dialog open={isOpen} onOpenChange={onCancel}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>¿Estás seguro?</DialogTitle>
        <DialogDescription>{message}</DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>
          Eliminar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// --------------------- Comments Forum Section ---------------------
const CommentsForumSection = ({ placeId }: { placeId?: string } = {}) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string } | null>(null);

  const { user, loading: authLoading } = useAuth();
  const { 
    comments, 
    loading, 
    submitting, 
    reactingComments, 
    createComment, 
    updateComment, 
    deleteComment, 
    reactToComment, 
    canEditComment 
  } = useComments(placeId);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    const success = await createComment(newComment);
    setToast({
      type: success ? 'success' : 'error',
      message: success ? 'Tu comentario fue publicado con éxito 🎉' : 'No se pudo publicar el comentario, inténtalo de nuevo.'
    });
    if (success) setNewComment('');
  };

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editingContent.trim()) return;
    const success = await updateComment(editingCommentId, editingContent);
    setToast({
      type: success ? 'success' : 'error',
      message: success ? 'Comentario actualizado correctamente ✨' : 'Error al actualizar el comentario.'
    });
    if (success) {
      setEditingCommentId(null);
      setEditingContent('');
    }
  };

  const handleDelete = async (commentId: string) => {
    setConfirmDelete({ id: commentId });
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    const success = await deleteComment(confirmDelete.id);
    setToast({
      type: success ? 'success' : 'error',
      message: success ? 'Comentario eliminado 🗑️' : 'Error al eliminar el comentario.'
    });
    setConfirmDelete(null);
  };

  if (authLoading || loading) {
    return (
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-yellow-50 via-rose-50 to-green-50">
        <div className="w-full max-w-7xl mx-auto px-6 relative text-center">
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  return (
    <ToastProvider>
      <section className="py-24 bg-gradient-to-br from-yellow-50 via-rose-50 to-green-50 relative overflow-hidden">
        {/* Fondos decorativos */}
        <motion.div
          className="absolute top-10 left-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl animate-float"
          animate={{ opacity: [0.3, 0.7, 0.3], y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl animate-float"
          animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Encabezado */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Foro de <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-green-500 bg-clip-text text-transparent">Comentarios</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Comparte tus experiencias y opiniones sobre San Juan Tahitic. {user ? '' : 'Inicia sesión para comentar.'}
            </p>
          </motion.div>

          {/* Formulario */}
          {user && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="mb-14 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl border border-gray-200 transition-all duration-500">
                <CardContent className="p-8">
                  <Textarea
                    placeholder="Escribe un comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="focus:ring-2 focus:ring-rose-400 transition-all duration-300"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || submitting}
                    className="mt-6 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white px-10 py-4 rounded-full font-semibold shadow-xl transition-all duration-300 flex items-center gap-3"
                  >
                    <Send className="w-6 h-6" /> {submitting ? 'Publicando...' : 'Publicar'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Lista de comentarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {comments.length > 0 ? (
              comments.map((comment: Comment, index: number) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group relative border-0 overflow-hidden bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-gray-900 font-semibold">{comment.username}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 text-lg">
                      {editingCommentId === comment.id ? (
                        <div className="space-y-4">
                          <Textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            rows={3}
                            className="focus:ring-2 focus:ring-rose-400 transition-all duration-300"
                          />
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} disabled={!editingContent.trim()} className="bg-green-600 hover:bg-green-700 text-white">
                              <Save className="w-4 h-4 mr-2" /> Guardar
                            </Button>
                            <Button variant="outline" onClick={() => setEditingCommentId(null)}>
                              <X className="w-4 h-4 mr-2" /> Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 mb-5 leading-relaxed">{comment.content}</p>
                          
                          <LikeButton
                            likeCount={comment.reaction_count || 0}
                            isLiked={comment.user_has_reacted || false} // Asegúrate de que no sea undefined
                            isLoading={reactingComments[comment.id]}
                            isDisabled={!user}
                            onClick={() => reactToComment(comment.id)}
                          />
                          {user && canEditComment(comment) && (
                            <div className="flex gap-2 mt-3">
                              <Button variant="outline" onClick={() => { setEditingCommentId(comment.id); setEditingContent(comment.content); }}>
                                <Edit className="w-4 h-4 mr-2" /> Editar
                              </Button>
                              <Button variant="destructive" onClick={() => handleDelete(comment.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 text-gray-500">
                No hay comentarios todavía. {user ? '¡Sé el primero en comentar!' : 'Inicia sesión para ser el primero en comentar.'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && <FeedbackToast type={toast.type} message={toast.message} />}
      <ToastViewport />

      {/* Confirm Modal */}
      {confirmDelete && (
        <ConfirmDialog
          isOpen={!!confirmDelete}
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
          message="Esta acción eliminará tu comentario de forma permanente."
        />
      )}
    </ToastProvider>
  );
};

export default CommentsForumSection;