import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Heart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --------------------- LikeButton con animación ---------------------
const LikeButton = ({
  likeCount,
  onClick,
  isLiked,
}: { likeCount: number; onClick?: () => void; isLiked?: boolean }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileTap={{ scale: 0.9 }}
    className={`flex items-center gap-2 text-base font-medium transition-colors duration-300 ${
      isLiked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
    }`}
  >
    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
    {likeCount}
  </motion.button>
);

// --------------------- Datos simulados ---------------------
const mockComments = [
  { id: '1', user: 'Juan', content: '¡Me encanta esta galería!', date: '2025-09-10T12:00:00Z', likes: 3 },
  { id: '2', user: 'Ana', content: 'Muy útil y visual.', date: '2025-09-09T14:00:00Z', likes: 1 },
];

// --------------------- Formato de fecha ---------------------
const formatDate = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diff < 60) return 'hace unos segundos';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
};

// --------------------- Sección principal ---------------------
const CommentsForumSection = () => {
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    const newEntry = {
      id: (comments.length + 1).toString(),
      user: 'Usuario Demo',
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
    };

    setComments([newEntry, ...comments]);
    setNewComment('');
  };

  const toggleLike = (id: string) => {
    setLikedComments((prev) => ({ ...prev, [id]: !prev[id] }));
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, likes: likedComments[id] ? c.likes - 1 : c.likes + 1 } : c
      )
    );
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-yellow-50 via-rose-50 to-green-50">
      {/* Fondos decorativos */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-rose-200/40 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-52 h-52 bg-green-200/40 rounded-full blur-3xl animate-float"
        style={{ animationDelay: '1s' }}
      ></div>

      <div className="w-full max-w-7xl mx-auto px-6 relative">
        {/* Encabezado compacto con ícono */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-100 to-rose-100 px-6 py-3 rounded-full shadow-md">
            <MessageCircle className="h-10 w-10 text-rose-600" />
            <span className="text-rose-800 font-bold text-2xl">Foro de Comentarios</span>
          </div>
          <p className="mt-6 text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Comparte tus experiencias, ideas y opiniones sobre San Juan Tahitic.
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-14 bg-white shadow-lg hover:shadow-2xl border border-gray-200 transition-all duration-500">
            <CardContent className="p-8">
              <Textarea
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="focus:ring-2 focus:ring-rose-400 transition-all duration-300 bg-white text-lg"
              />
              <Button
                onClick={handleSubmit}
                className="mt-6 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white px-10 py-4 rounded-full font-semibold shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
              >
                <Send className="w-6 h-6" /> Publicar
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de comentarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group border bg-white shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                  <div className="h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-green-500"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center text-lg text-gray-900">
                      <span className="font-semibold">{comment.user}</span>
                      <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 text-lg">
                    <p className="text-gray-700 mb-5 leading-relaxed">{comment.content}</p>
                    <LikeButton
                      likeCount={comment.likes}
                      isLiked={!!likedComments[comment.id]}
                      onClick={() => toggleLike(comment.id)}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Call to action */}
        <div className="flex justify-center mt-20">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-5 rounded-full font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 text-2xl flex items-center gap-4">
            <MessageCircle className="w-8 h-8" /> Únete a la Conversación
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommentsForumSection;
