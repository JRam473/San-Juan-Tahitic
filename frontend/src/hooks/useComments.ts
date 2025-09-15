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

export const useComments = (placeId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reactingComments, setReactingComments] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch comments
  // Fetch comments - ahora con useCallback
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = '/api/comments';
      if (placeId) {
        endpoint = `/api/comments/place/${placeId}`;
      }

      const response = await api.get<ApiResponse>(endpoint);

      console.log('Respuesta del backend:', response.data); // ← Debug
      
      if (response.status !== 200) {
        throw new Error('Error al cargar comentarios');
      }

      const commentsData = response.data.comments || [];
      
      // Obtener respuestas para comentarios principales
      const commentsWithReplies = await Promise.all(
        commentsData.map(async (comment: Comment) => {
          console.log(`Comentario ${comment.id}: user_has_reacted =`, comment.user_has_reacted);
          if (!comment.parent_comment_id) {
            try {
              const repliesResponse = await api.get<ApiResponse>(`/api/comments?parent_id=${comment.id}`);
              return {
                ...comment,
                replies: repliesResponse.data.comments || []
              };
            } catch (err) {
              console.error('Error obteniendo respuestas:', err);
              return {
                ...comment,
                replies: []
              };
            }
          }
          return comment;
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
  }, [placeId, toast]); // Dependencias

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
      // Guardar estado anterior para rollback
      await fetchComments(); // Recargar desde el servidor
      
      // Actualización optimista
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                content: content.trim(),
                updated_at: new Date().toISOString()
              }
            : comment
        )
      );

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

      return true;
    } catch (err) {
      // Rollback en caso de error - recargamos los comentarios
      await fetchComments();
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

  // React to comment
// React to comment - Versión mejorada con mejor manejo de errores
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
    
    const commentToUpdate = comments.find(c => c.id === commentId);
    if (!commentToUpdate) return false;

    const isCurrentlyLiked = commentToUpdate.user_has_reacted;

    // Actualización optimista
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              reaction_count: isCurrentlyLiked 
                ? Math.max(0, (comment.reaction_count || 1) - 1)
                : (comment.reaction_count || 0) + 1,
              user_has_reacted: !isCurrentlyLiked
            }
          : comment
      )
    );

    // Operación en la base de datos
    let response;
    if (isCurrentlyLiked) {
      // Usar el nuevo endpoint por commentId
      response = await api.delete(`/api/reactions/comments/${commentId}`);
    } else {
      response = await api.post(`/api/reactions/comments/${commentId}`, { 
        reaction_type: 'like' 
      });
    }

    // Verificar respuesta
    if (response.status >= 200 && response.status < 300) {
      // Recargar comentarios para sincronizar con la base de datos
      await fetchComments();
      return true;
    } else {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
  } catch (err) {
    // Rollback en caso de error
    await fetchComments();
    const errorMessage = err instanceof Error ? err.message : 'Error al procesar la reacción';
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

  // Helper functions
  const canEditComment = (comment: Comment): boolean => {
    return user?.id === comment.user_id;
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // Ahora fetchComments es estable}, [fetchComments]); // Ahora fetchComments es estable

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