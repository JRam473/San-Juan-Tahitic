// hooks/useComments.ts - VERSIÓN COMPLETAMENTE CORREGIDA
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

  // ✅ CORRECCIÓN: Función de fetch optimizada
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = '/api/comments';
      if (placeId) {
        endpoint = `/api/comments/place/${placeId}`;
      }

      const response = await api.get<ApiResponse>(endpoint);
      
      if (!response.data || !Array.isArray(response.data.comments)) {
        setComments([]);
        return;
      }

      const commentsData = response.data.comments;
      
      // ✅ SIMPLIFICAR: No cargar replies automáticamente para evitar complejidad
      const commentsWithDefaults = commentsData.map(comment => ({
        ...comment,
        reaction_count: comment.reaction_count || 0,
        user_has_reacted: comment.user_has_reacted || false,
        replies: comment.replies || []
      }));
      
      setComments(commentsWithDefaults);
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

  // ✅ CORRECCIÓN: createComment optimizado - NO usar fetchComments()
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

      const newComment = response.data.comment;
      
      // ✅ CORRECCIÓN: Actualizar estado LOCALMENTE en lugar de recargar todo
      setComments(prev => {
        const newCommentWithDefaults = {
          ...newComment,
          reaction_count: 0,
          user_has_reacted: false,
          replies: []
        };
        
        // Si es una respuesta, agregarla al comentario padre
        if (parentCommentId) {
          return prev.map(comment => 
            comment.id === parentCommentId 
              ? { 
                  ...comment, 
                  replies: [...(comment.replies || []), newCommentWithDefaults] 
                }
              : comment
          );
        }
        
        // Si es un comentario principal, agregarlo al inicio
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
  };

  // ✅ updateComment optimizado - consistente con createComment
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

      // ✅ CORRECCIÓN: Actualizar estado LOCALMENTE
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: content.trim(), updated_at: new Date().toISOString() }
          : comment
      ));

      toast({
        title: "Comentario actualizado correctamente ✨",
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
  };

  // ✅ deleteComment optimizado - ya está bien pero lo dejamos consistente
  const deleteComment = async (commentId: string) => {
    if (!user) return false;

    try {
      const response = await api.delete(`/api/comments/${commentId}`);

      if (response.status !== 200) {
        throw new Error('Error al eliminar comentario');
      }
      
      // ✅ Ya está bien - actualización local
      setComments(prev => prev.filter(comment => comment.id !== commentId));

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
  };

  // ✅ reactToComment - ya está bien
  const reactToComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: "🔒 Autenticación requerida",
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
      
      // ✅ Actualización local consistente
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            reaction_count: newState 
              ? (comment.reaction_count || 0) + 1 
              : Math.max(0, (comment.reaction_count || 1) - 1),
            user_has_reacted: newState
          };
        }
        return comment;
      }));

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
    } catch (err: unknown) {
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
  };

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
    refetch: fetchComments // ✅ Para recargas manuales cuando sea necesario
  };
};