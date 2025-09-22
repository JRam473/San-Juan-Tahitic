// hooks/useUserPhotos.ts - VERSIÓN COMPLETAMENTE CORREGIDA
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

interface Photo {
  id: string;
  photo_url: string;
  caption: string;
  user_id: string;
  created_at: string;
  username: string;
  place_name?: string;
  reactions?: PhotoReaction[];
  reaction_count?: number;
}

interface PhotoReaction {
  id: string;
  user_id: string;
  reaction_type: string;
  created_at?: string;
}

interface ReactionCount {
  reaction_type: string;
  count: number;
}

interface PhotosResponse {
  photos: Photo[];
}

interface ErrorResponse {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useUserPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [reacting, setReacting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // =============================
  // ✅ CORRECCIÓN: Fetch optimizado
  // =============================
  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<PhotosResponse>('/api/photos');
      
      if (!response.data || !Array.isArray(response.data.photos)) {
        setPhotos([]);
        return;
      }

      const photosData: Photo[] = response.data.photos;
      
      // ✅ SIMPLIFICAR: Cargar reacciones básicas sin complejidad
      const photosWithDefaults = photosData.map(photo => ({
        ...photo,
        reactions: photo.reactions || [],
        reaction_count: photo.reaction_count || 0
      }));
      
      setPhotos(photosWithDefaults);
    } catch (err: unknown) {
      const errorMessage = (err as ErrorResponse)?.response?.data?.message || 'Error al cargar las fotos';
      setError(errorMessage);
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // =============================
  // ✅ CORRECCIÓN: Upload photo - Actualización LOCAL
  // =============================
  const uploadPhoto = async (file: File, caption: string, place_id?: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "🔒 Autenticación requerida",
        description: "Debes iniciar sesión para subir fotos",
        variant: "destructive",
      });
      return false;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "📁 Archivo inválido",
        description: "Solo se permiten archivos de imagen",
        variant: "warning",
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "📏 Archivo muy grande",
        description: "La imagen debe ser menor a 5MB",
        variant: "warning",
      });
      return false;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('caption', caption);
      if (place_id) {
        formData.append('place_id', place_id);
      }

      const response = await api.post<{ photo: Photo }>('/api/photos', formData);

      if (!response.data.photo) {
        throw new Error('No se recibió la foto creada del servidor');
      }

      // ✅ CORRECCIÓN: Agregar foto LOCALMENTE en lugar de recargar todo
      const newPhoto = {
        ...response.data.photo,
        reactions: [],
        reaction_count: 0,
        username: user.username || 'Usuario'
      };

      setPhotos(prev => [newPhoto, ...prev]); // Agregar al inicio

      toast({
        title: "📸 ¡Foto subida!",
        description: "Tu foto se ha subido exitosamente",
      });

      return true;
    } catch (err: unknown) {
      const errorMessage = (err as ErrorResponse)?.response?.data?.message || 'Error al subir la foto';
      toast({
        title: "❌ Error al subir",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  // =============================
  // ✅ CORRECCIÓN: Update photo - Actualización LOCAL
  // =============================
  const updatePhoto = async (photoId: string, caption: string, place_id?: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "🔒 Autenticación requerida",
        description: "Debes iniciar sesión para editar fotos",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await api.put(`/api/photos/${photoId}`, { caption, place_id });

      if (response.status !== 200) {
        throw new Error('Error al actualizar la foto');
      }

      // ✅ CORRECCIÓN: Actualizar LOCALMENTE en lugar de recargar todo
      setPhotos(prev => prev.map(photo => 
        photo.id === photoId 
          ? { ...photo, caption, updated_at: new Date().toISOString() }
          : photo
      ));

      toast({
        title: "✏️ Foto actualizada",
        description: "La descripción de tu foto se ha actualizado exitosamente",
      });
      
      return true;
    } catch (err: unknown) {
      const errorMessage = (err as ErrorResponse)?.response?.data?.message || 'Error al actualizar la foto';
      toast({
        title: "❌ Error al actualizar",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // =============================
  // ✅ CORRECCIÓN: Delete photo - Ya está bien, pero la dejamos consistente
  // =============================
  const deletePhoto = async (photoId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "🔒 Autenticación requerida",
        description: "Debes iniciar sesión para eliminar fotos",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await api.delete(`/api/photos/${photoId}`);

      if (response.status !== 200) {
        throw new Error('Error al eliminar la foto');
      }

      // ✅ Ya está bien - actualización local
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));

      toast({
        title: "🗑️ Foto eliminada",
        description: "Tu foto se ha borrado exitosamente",
      });
      
      return true;
    } catch (err: unknown) {
      const errorMessage = (err as ErrorResponse)?.response?.data?.message || 'Error al eliminar la foto';
      toast({
        title: "❌ Error al eliminar",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // =============================
  // ✅ CORRECCIÓN: React to photo - Optimizado
  // =============================
  const reactToPhoto = async (photoId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "🔒 Autenticación requerida",
        description: "Debes iniciar sesión para reaccionar",
        variant: "destructive",
      });
      return false;
    }

    try {
      setReacting(photoId);
      
      const response = await api.post<{ action: 'added' | 'removed' }>(
        `/api/photos/${photoId}/reactions`, 
        { reaction_type: 'like' }
      );

      const newState = response.data.action === 'added';

      // ✅ CORRECCIÓN: Actualización LOCAL consistente
      setPhotos(prev => prev.map(photo => {
        if (photo.id === photoId) {
          const currentReactions = photo.reactions || [];
          const userReactionIndex = currentReactions.findIndex(r => r.user_id === user.id);
          
          let updatedReactions = [...currentReactions];
          let updatedCount = photo.reaction_count || 0;

          if (newState && userReactionIndex === -1) {
            // Agregar reacción
            updatedReactions.push({
              id: `temp-${Date.now()}`,
              user_id: user.id,
              reaction_type: 'like',
              created_at: new Date().toISOString()
            });
            updatedCount += 1;
          } else if (!newState && userReactionIndex !== -1) {
            // Remover reacción
            updatedReactions.splice(userReactionIndex, 1);
            updatedCount = Math.max(0, updatedCount - 1);
          }

          return {
            ...photo,
            reactions: updatedReactions,
            reaction_count: updatedCount
          };
        }
        return photo;
      }));

      if (newState) {
        toast({
          title: "❤️ ¡Te gusta!",
          description: "Has dado like a esta foto",
        });
      } else {
        toast({
          title: "💔 Like removido",
          description: "Ya no te gusta esta foto",
        });
      }

      return true;
    } catch (err: unknown) {
      const errorMessage = (err as ErrorResponse)?.response?.data?.message || 'Error al procesar la reacción';
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setReacting(null);
    }
  };

  // =============================
  // ✅ CORRECCIÓN: Helpers optimizados
  // =============================
  const hasUserReacted = (photo?: Photo): boolean => {
    if (!isAuthenticated || !user || !photo || !photo.reactions) return false;
    return photo.reactions.some(reaction => reaction.user_id === user.id);
  };

  const getReactionCount = (photo?: Photo): number => {
    if (!photo) return 0;
    return photo.reaction_count || (photo.reactions?.length || 0);
  };

  const getUserReaction = (photo?: Photo): PhotoReaction | null => {
    if (!isAuthenticated || !user || !photo || !photo.reactions) return null;
    return photo.reactions.find(reaction => reaction.user_id === user.id) || null;
  };

  // =============================
  // ✅ CORRECCIÓN: Eliminar updatePhotoReactions (ya no es necesario)
  // =============================

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return {
    photos,
    loading,
    uploading,
    reacting,
    error,
    uploadPhoto,
    updatePhoto,
    deletePhoto,
    reactToPhoto,
    hasUserReacted,
    getReactionCount,
    getUserReaction,
    refetch: fetchPhotos, // ✅ Para recargas manuales cuando sea necesario
  };
};