// hooks/useComments.ts - VERSIÓN OPTIMIZADA
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

export interface Comment {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  place_id: string | null;
  place_name: string | null;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  reaction_count?: number;
  user_has_reacted?: boolean;
  replies?: Comment[];
}

interface CreateCommentInput {
  place_id?: string;
  content: string;
  parent_comment_id?: string;
}

interface ApiResponse {
  comments: Comment[];
  message?: string;
}

interface ReactionResponse {
  action: 'added' | 'removed';
  message?: string;
}

export const useComments = (placeId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reactingComments, setReactingComments] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  // ✅ OPTIMIZACIÓN: useCallback con dependencias correctas
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = placeId ? `/api/comments/place/${placeId}` : '/api/comments';

      const response = await api.get<ApiResponse>(endpoint);
      
      if (!response.data?.comments || !Array.isArray(response.data.comments)) {
        setComments([]);
        return;
      }

      // ✅ MEJORA: Normalización más robusta de comentarios
      const normalizeComment = (comment: Comment): Comment => ({
        ...comment,
        reaction_count: comment.reaction_count ?? 0,
        user_has_reacted: comment.user_has_reacted ?? false,
        replies: Array.isArray(comment.replies) 
          ? comment.replies.map(normalizeComment) 
          : [],
        username: comment.username || 'Usuario',
        avatar_url: comment.avatar_url || '',
        place_name: comment.place_name || null
      });

      const normalizedComments = response.data.comments.map(normalizeComment);
      setComments(normalizedComments);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los comentarios';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [placeId, toast]);

  // ✅ CORRECCIÓN: Eliminar setTimeout y usar actualización inmediata pero segura
  const createComment = useCallback(async (content: string, parentCommentId?: string) => {
    if (!user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para comentar",
        variant: "destructive",
      });
      return false;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast({
        title: "Contenido requerido",
        description: "El comentario no puede estar vacío",
        variant: "destructive",
      });
      return false;
    }

    try {
      setSubmitting(true);

      const commentData: CreateCommentInput = {
        content: trimmedContent,
        place_id: placeId || undefined,
        parent_comment_id: parentCommentId || undefined
      };

      const response = await api.post<{ comment: Comment }>('/api/comments', commentData);
      
      if (response.status !== 201) {
        throw new Error('Error al crear comentario');
      }

      const newComment = response.data.comment;
      
      if (!newComment.id) {
        throw new Error('El comentario creado no tiene un ID válido');
      }

      // ✅ MEJORA: Actualización inmediata pero con validación
      setComments(prev => {
        const newCommentWithDefaults: Comment = {
          ...newComment,
          id: newComment.id,
          reaction_count: 0,
          user_has_reacted: false,
          replies: [],
          username: newComment.username || 'Usuario',
          avatar_url: newComment.avatar_url || '',
          place_name: newComment.place_name || null,
          created_at: newComment.created_at || new Date().toISOString(),
          updated_at: newComment.updated_at || new Date().toISOString()
        };

        if (parentCommentId) {
          // ✅ MEJORA: Búsqueda recursiva para replies anidados
          const updateCommentsWithReply = (commentsList: Comment[]): Comment[] => 
            commentsList.map(comment => {
              if (comment.id === parentCommentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newCommentWithDefaults]
                };
              }
              
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: updateCommentsWithReply(comment.replies)
                };
              }
              
              return comment;
            });

          return updateCommentsWithReply(prev);
        }
        
        return [newCommentWithDefaults, ...prev];
      });

      toast({
        title: "Comentario enviado ✅",
        description: "Tu comentario fue publicado con éxito 🎉",
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el comentario';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [user, placeId, toast]);

  // ✅ MEJORA: updateComment con useCallback y manejo de replies
  const updateComment = useCallback(async (commentId: string, content: string) => {
    if (!user) return false;

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast({
        title: "Contenido requerido",
        description: "El comentario no puede estar vacío",
        variant: "destructive",
      });
      return false;
    }

    if (!commentId) {
      toast({
        title: "Error",
        description: "ID de comentario inválido",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await api.put(`/api/comments/${commentId}`, { 
        content: trimmedContent
      });

      if (response.status !== 200) {
        throw new Error('Error al actualizar comentario');
      }

      // ✅ MEJORA: Actualización recursiva para comentarios en cualquier nivel
      const updateCommentInTree = (commentsList: Comment[]): Comment[] => 
        commentsList.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              content: trimmedContent,
              updated_at: new Date().toISOString()
            };
          }
          
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentInTree(comment.replies)
            };
          }
          
          return comment;
        });

      setComments(prev => updateCommentInTree(prev));

      toast({
        title: "Comentario actualizado ✨",
        description: "Tu comentario se ha actualizado exitosamente",
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el comentario';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // ✅ MEJORA: deleteComment con useCallback y manejo recursivo
  const deleteComment = useCallback(async (commentId: string) => {
    if (!user) return false;

    try {
      const response = await api.delete(`/api/comments/${commentId}`);

      if (response.status !== 200) {
        throw new Error('Error al eliminar comentario');
      }
      
      // ✅ MEJORA: Eliminación recursiva
      const removeCommentFromTree = (commentsList: Comment[]): Comment[] => 
        commentsList.filter(comment => {
          if (comment.id === commentId) {
            return false;
          }
          
          if (comment.replies && comment.replies.length > 0) {
            comment.replies = removeCommentFromTree(comment.replies);
          }
          
          return true;
        });

      setComments(prev => removeCommentFromTree(prev));

      toast({
        title: "Comentario eliminado 🗑️",
        description: "Tu comentario se ha eliminado exitosamente",
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el comentario';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // ✅ MEJORA: reactToComment con useCallback y manejo recursivo
  const reactToComment = useCallback(async (commentId: string) => {
    if (!user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para reaccionar",
        variant: "destructive",
      });
      return false;
    }

    try {
      setReactingComments(prev => ({ ...prev, [commentId]: true }));
      
      const response = await api.post<ReactionResponse>(`/api/comments/${commentId}/reactions`, { 
        reaction_type: 'like' 
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Error en el servidor');
      }

      const newState = response.data.action === 'added';
      
      // ✅ MEJORA: Actualización recursiva de reacciones
      const updateReactionInTree = (commentsList: Comment[]): Comment[] => 
        commentsList.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              reaction_count: newState 
                ? (comment.reaction_count || 0) + 1 
                : Math.max(0, (comment.reaction_count || 1) - 1),
              user_has_reacted: newState
            };
          }
          
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateReactionInTree(comment.replies)
            };
          }
          
          return comment;
        });

      setComments(prev => updateReactionInTree(prev));

      toast({
        title: newState ? "❤️ Te gusta" : "💔 Ya no te gusta",
        description: newState 
          ? "Has reaccionado al comentario" 
          : "Has quitado tu reacción",
      });

      return true;
    } catch (err) {
      console.error('Error en reactToComment:', err);
      
      let errorMessage = 'Error al procesar la reacción';
      if (err && typeof err === 'object' && 'response' in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        errorMessage = errorObj.response?.data?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setReactingComments(prev => ({ ...prev, [commentId]: false }));
    }
  }, [user, toast]);

  const canEditComment = useCallback((comment: Comment): boolean => {
    return user?.id === comment.user_id;
  }, [user]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    submitting,
    error,
    reactingComments,
    createComment,
    updateComment,
    deleteComment,
    reactToComment,
    canEditComment,
    refetch: fetchComments
  };
};