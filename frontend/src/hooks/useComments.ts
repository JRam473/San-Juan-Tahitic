// hooks/useComments.ts (versión corregida)
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

interface ReactionsResponse {
  reactions: any[];
}

interface ReactionCountResponse {
  counts: Array<{ reaction_type: string; count: number }>;
  total: number;
}

export const useComments = (placeId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reactingComments, setReactingComments] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  // Helper function para actualizar comentarios con reacciones
  const updateCommentsWithReaction = useCallback((comments: Comment[], commentId: string, userHasReacted: boolean, reactionCount?: number): Comment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          reaction_count: reactionCount !== undefined ? reactionCount : (comment.reaction_count || 0),
          user_has_reacted: userHasReacted
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentsWithReaction(comment.replies, commentId, userHasReacted, reactionCount)
        };
      }
      return comment;
    });
  }, []);

  // Actualizar reacciones de un comentario específico
// En tu hook useComments, mejora la función updateCommentReactions:
const updateCommentReactions = useCallback(async (commentId: string) => {
  try {
    const [reactionCountResponse, userReactionResponse] = await Promise.all([
      api.get<ReactionCountResponse>(`/api/comments/${commentId}/reaction-count`),
      api.get(`/api/comments/${commentId}/reactions?user=${user?.id}`) // Necesitarías crear este endpoint
    ]);
    
    const counts = reactionCountResponse.data.counts || [];
    const reactionCount = reactionCountResponse.data.total || counts.reduce((total, item) => total + item.count, 0);
    
    // Verificar si el usuario actual ha reaccionado
    const userReactions = userReactionResponse.data?.reactions || [];
    const userHasReacted = userReactions.some((reaction: any) => reaction.user_id === user?.id);
    
    setComments(prev => updateCommentsWithReaction(prev, commentId, userHasReacted, reactionCount));
  } catch (error) {
    console.error(`Error updating reactions for comment ${commentId}:`, error);
  }
}, [updateCommentsWithReaction, user?.id]);

  // Fetch comments con reacciones del usuario
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = '/api/comments';
      if (placeId) {
        endpoint = `/api/comments/place/${placeId}`;
      }

      const response = await api.get<ApiResponse>(endpoint);
      
      if (response.status !== 200) {
        throw new Error('Error al cargar comentarios');
      }

      const commentsData = response.data.comments || [];
      
      // Obtener respuestas para comentarios principales
      const commentsWithReplies = await Promise.all(
        commentsData.map(async (comment: Comment) => {
          const commentWithDefaults = {
            ...comment,
            reaction_count: comment.reaction_count || 0,
            user_has_reacted: comment.user_has_reacted || false,
            replies: []
          };
          
          if (!comment.parent_comment_id) {
            try {
              const repliesResponse = await api.get<ApiResponse>(`/api/comments?parent_id=${comment.id}`);
              
              const repliesWithDefaults = (repliesResponse.data.comments || []).map(reply => ({
                ...reply,
                user_has_reacted: reply.user_has_reacted || false,
                reaction_count: reply.reaction_count || 0
              }));
              
              return {
                ...commentWithDefaults,
                replies: repliesWithDefaults
              };
            } catch (err) {
              console.error('Error obteniendo respuestas:', err);
              return commentWithDefaults;
            }
          }
          return commentWithDefaults;
        })
      );
      
      setComments(commentsWithReplies);
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

  // Create comment
  const createComment = async (content: string, parentCommentId?: string) => {
    if (!user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para comentar",
        variant: "destructive",
      });
      return false;
    }

    if (!content.trim()) {
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
        content: content.trim(),
        place_id: placeId || undefined,
        parent_comment_id: parentCommentId || undefined
      };

      const response = await api.post<{ comment: Comment }>('/api/comments', commentData);
      
      if (response.status !== 201) {
        throw new Error('Error al crear comentario');
      }

      toast({
        title: "Comentario enviado",
        description: "Tu comentario se ha publicado exitosamente",
      });

      await fetchComments();
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
  };

  // Update comment
  const updateComment = async (commentId: string, content: string) => {
    if (!user) return false;

    if (!content.trim()) {
      toast({
        title: "Contenido requerido",
        description: "El comentario no puede estar vacío",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await api.put(`/api/comments/${commentId}`, { 
        content: content.trim()
      });

      if (response.status !== 200) {
        throw new Error('Error al actualizar comentario');
      }

      toast({
        title: "Comentario actualizado",
        description: "Tu comentario se ha actualizado exitosamente",
      });

      await fetchComments();
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
  };

  // Delete comment
  const deleteComment = async (commentId: string) => {
    if (!user) return false;

    try {
      const response = await api.delete(`/api/comments/${commentId}`);

      if (response.status !== 200) {
        throw new Error('Error al eliminar comentario');
      }
      
      toast({
        title: "Comentario eliminado",
        description: "Tu comentario se ha eliminado exitosamente",
      });

      await fetchComments();
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
  };

  // React to comment - Versión simplificada similar a useUserPhotos
const reactToComment = async (commentId: string) => {
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
    
    // Llamada al servidor - enfoque pesimista
    const response = await api.post(`/api/comments/${commentId}/reactions`, { 
      reaction_type: 'like' 
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Error en el servidor');
    }

    // Esperar a que el servidor responda antes de actualizar la UI
    const comment = comments.find(c => c.id === commentId) || 
                   comments.flatMap(c => c.replies || []).find(r => r.id === commentId);
    
    // Actualizar UI basado en la respuesta del servidor
    const newState = response.data.action === 'added';
    
    setComments(prev => updateCommentsWithReaction(
      prev, 
      commentId, 
      newState,
      newState ? (comment?.reaction_count || 0) + 1 : Math.max(0, (comment?.reaction_count || 1) - 1)
    ));

    // Feedback visual
    if (newState) {
      toast({
        title: "❤️ Te gusta",
        description: "Has reaccionado al comentario",
      });
    } else {
      toast({
        title: "💔 Ya no te gusta",
        description: "Has quitado tu reacción",
      });
    }

    return true;
  } catch (err: any) {
    console.error('Error en reactToComment:', err);
    
    const errorMessage = err.response?.data?.message || err.message || 'Error al procesar la reacción';
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    return false;
  } finally {
    setReactingComments(prev => ({ ...prev, [commentId]: false }));
  }
};

  // Helper function para verificar si usuario puede editar
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
    refetch: fetchComments,
    updateCommentReactions
  };
};