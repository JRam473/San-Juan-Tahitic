// components/CommentsForumSection.tsx - VERSIÓN COMPLETAMENTE CORREGIDA
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Heart, Edit3, Trash2, X, Save, User, Calendar, MessageCircle, LogIn, MessageSquare, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useComments, type Comment } from '@/hooks/useComments';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

// --------------------- Confirm Dialog ---------------------
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

// --------------------- Comments Forum Section ---------------------
const CommentsForumSection = ({ placeId }: { placeId?: string } = {}) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
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
  
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    const success = await createComment(newComment);
    if (success) setNewComment('');
  };

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editingContent.trim()) return;
    const success = await updateComment(editingCommentId, editingContent);
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
    await deleteComment(confirmDelete.id);
    setConfirmDelete(null);
  };

  const handleReact = async (commentId: string) => {
    await reactToComment(commentId);
  };

  if (authLoading || loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-rose-50 to-green-50 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full"
            />
          </div>
          <p className="mt-4 text-gray-600">Cargando comentarios...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-rose-50 to-green-50 relative overflow-hidden">
      {/* Fondos decorativos */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col justify-center items-center mb-12 gap-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
            Foro de{' '}
            <span className="bg-gradient-to-r from-amber-600 via-rose-500 to-green-500 bg-clip-text text-transparent">
              Comentarios
            </span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center leading-relaxed">
            Comparte tus experiencias y opiniones sobre San Juan Tahitic. {user ? '' : 'Inicia sesión para comentar.'}
          </p>
        </div>

        {/* SECCIÓN DE INVITACIÓN PARA USUARIOS NO AUTENTICADOS */}
        {!user && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <Card className="bg-gradient-to-r from-amber-100/80 via-rose-100/80 to-green-100/80 backdrop-blur-sm shadow-lg hover:shadow-2xl border border-amber-200/30 transition-all duration-500 overflow-hidden">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                    <MessageSquare className="w-8 h-8 text-amber-600" />
                    <h3 className="text-2xl font-bold text-gray-800">¡Únete a la conversación!</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Comparte tus experiencias, opiniones y preguntas sobre San Juan Tahitic. 
                    Tu voz es importante para nuestra comunidad.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">#Comunidad</span>
                    <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm">#Experiencias</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">#Opiniones</span>
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleLoginRedirect}
                    className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <LogIn className="w-5 h-5" /> Iniciar sesión para comentar
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Formulario (solo para usuarios autenticados) */}
        {user && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-500">
              <CardContent className="p-6">
                <Textarea
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-md text-black placeholder:text-black/50 focus:ring-2 focus:ring-rose-400 transition-all duration-300"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!newComment.trim() || submitting}
                  className="mt-6 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white px-8 py-3 rounded-xl font-semibold shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Publicar
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ✅ CORRECCIÓN: Lista de comentarios - VERSIÓN ESTABILIZADA */}
        <div className="min-h-[200px]">
          {comments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence> {/* ✅ REMOVIDO mode="wait" que causaba conflictos */}
                {comments.map((comment: Comment) => (
                  <motion.div
                    key={`comment-${comment.id}`} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="group relative bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-500 overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-amber-600" />
                            {comment.username}
                          </CardTitle>
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        {editingCommentId === comment.id ? (
                          <div className="space-y-4">
                            <Textarea
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              rows={3}
                              className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-md text-black placeholder:text-black/50 focus:ring-2 focus:ring-rose-400 transition-all duration-300"
                            />
                            <div className="flex gap-2">
                              <Button 
                                onClick={handleSaveEdit} 
                                disabled={!editingContent.trim()}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                              >
                                <Save className="w-4 h-4 mr-2" /> Guardar
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setEditingCommentId(null)}
                                className="border-gray-300"
                              >
                                <X className="w-4 h-4 mr-2" /> Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start gap-3 mb-4">
                              <MessageCircle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <motion.button
                                onClick={() => handleReact(comment.id)}
                                disabled={reactingComments[comment.id]}
                                whileTap={{ scale: 0.9 }}
                                className={`flex items-center gap-2 transition-colors duration-300 ${
                                  comment.user_has_reacted ? 'text-rose-500' : 'text-gray-500 hover:text-rose-400'
                                }`}
                              >
                                {reactingComments[comment.id] ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                                  />
                                ) : (
                                  <Heart className={`w-5 h-5 ${comment.user_has_reacted ? 'fill-current' : ''}`} />
                                )}
                                <span>{Number(comment.reaction_count) || 0}</span>
                              </motion.button>
                              
                              {user && canEditComment(comment) && (
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => { setEditingCommentId(comment.id); setEditingContent(comment.content); }}
                                    className="text-gray-600 hover:text-amber-600"
                                  >
                                    <Edit3 className="w-4 h-4 mr-1" /> Editar
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-gray-600 hover:text-rose-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                                  </Button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* ✅ CORRECCIÓN: Estado vacío separado - sin AnimatePresence conflictivo */
            <motion.div
              key="no-comments-state" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-10 text-gray-500 flex flex-col items-center"
            >
              <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
              <p>No hay comentarios todavía.</p>
              <p className="mt-2">
                {user ? '¡Sé el primero en comentar!' : 'Inicia sesión para ser el primero en comentar.'}
              </p>
              {!user && (
                <Button
                  onClick={handleLoginRedirect}
                  className="mt-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" /> Iniciar sesión
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* ✅ CORRECCIÓN: Confirm Modal con AnimatePresence mejorado */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            key="confirm-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ConfirmDialog
              isOpen={!!confirmDelete}
              onConfirm={confirmDeleteAction}
              onCancel={() => setConfirmDelete(null)}
              message="Esta acción eliminará tu comentario de forma permanente."
              type="danger"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CommentsForumSection;