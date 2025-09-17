// hooks/useUserPhotos.ts
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

// Interfaces para las respuestas de la API
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
}

interface ReactionsResponse {
  reactions: PhotoReaction[];
}

interface ReactionCountResponse {
  counts: ReactionCount[];
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
  // Fetch all photos with reactions
  // =============================
  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<PhotosResponse>('/api/photos');
      const photosData: Photo[] = response.data.photos || [];
      
      const photosWithReactions = await Promise.all(
        photosData.map(async (photo) => {
          try {
            const reactionsResponse = await api.get<ReactionsResponse>(`/api/photos/${photo.id}/reactions`);
            const reactionCountResponse = await api.get<ReactionCountResponse>(`/api/photos/${photo.id}/reaction-count`);
            
            const counts = reactionCountResponse.data.counts || [];
            const reactionCount = counts.reduce(
              (total: number, item: ReactionCount) => total + item.count, 0
            );
            
            return {
              ...photo,
              reactions: reactionsResponse.data.reactions || [],
              reaction_count: reactionCount
            };
          } catch (error) {
            console.error(`Error fetching reactions for photo ${photo.id}:`, error);
            return { ...photo, reactions: [], reaction_count: 0 };
          }
        })
      );
      
      setPhotos(photosWithReactions);
    } catch (err: unknown) {
      const errorMessage = (err as ErrorResponse)?.response?.data?.message || 'Error al cargar las fotos';
      setError(errorMessage);
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
        position: "top-right",
        duration: 5000,
        showIcon: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // =============================
  // Optimized update for reactions (avoid full refetch)
  // =============================
// En tu updatePhotoReactions, asegúrate de procesar correctamente los counts
const updatePhotoReactions = async (photoId: string) => {
  try {
    const reactionsResponse = await api.get<ReactionsResponse>(`/api/photos/${photoId}/reactions`);
    const reactionCountResponse = await api.get<ReactionCountResponse>(`/api/photos/${photoId}/reaction-count`);
    
    const counts = reactionCountResponse.data.counts || [];
    console.log('📊 Respuesta de counts:', reactionCountResponse.data);
    const reactionCount = counts.reduce(
      (total: number, item: ReactionCount) => total + item.count, 0
    );
    
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { 
            ...photo, 
            reactions: reactionsResponse.data.reactions || [],
            reaction_count: reactionCount, // Esto actualiza el contador
            reaction_counts: counts // Guarda también los counts por tipo si los necesitas
          } 
        : photo
    ));
  } catch (error) {
    console.error(`Error updating reactions for photo ${photoId}:`, error);
  }
};

  // =============================
  // Upload photo
  // =============================
  const uploadPhoto = async (file: File, caption: string, place_id?: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "🔒 Autenticación requerida",
        description: "Debes iniciar sesión para subir fotos",
        variant: "destructive",
        position: "bottom-right",
        duration: 4000,
        showIcon: true,
      });
      return false;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "📁 Archivo inválido",
        description: "Solo se permiten archivos de imagen",
        variant: "warning",
        position: "top-right",
        duration: 4000,
        showIcon: true,
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "📏 Archivo muy grande",
        description: "La imagen debe ser menor a 5MB",
        variant: "warning",
        position: "top-right",
        duration: 4000,
        showIcon: true,
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

      await api.post('/api/photos', formData);

      toast({
        title: "📸 ¡Foto subida!",
        description: "Tu foto se ha subido exitosamente",
        variant: "photo",
        position: "bottom-right",
        duration: 3000,
        showIcon: true,
      });

      await fetchPhotos();
      return true;
    } catch (err: unknown) {
      const errorMessage = (err as ErrorResponse)?.response?.data?.message || 'Error al subir la foto';
      toast({
        title: "❌ Error al subir",
        description: errorMessage,
        variant: "destructive",
        position: "top-right",
        duration: 5000,
        showIcon: true,
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  // =============================
  // Update photo (caption/description)
  // =============================
  const updatePhoto = async (photoId: string, caption: string, place_id?: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "🔒 Autenticación requerida",
        description: "Debes iniciar sesión para editar fotos",
        variant: "destructive",
        position: "bottom-right",
        duration: 4000,
        showIcon: true,
      });
      return false;
    }

    try {
      await api.put(`/api/photos/${photoId}`, { caption, place_id });
      
      toast({
        title: "✏️ Foto actualizada",
        description: "La descripción de tu foto se ha actualizado exitosamente",
        variant: "success",
        position: "bottom-right",
        duration: 3000,
        showIcon: true,
      });
      
      await fetchPhotos();
      return true;
    } catch (err: unknown) {
      const errorMessage = (err as ErrorResponse)?.response?.data?.message || 'Error al actualizar la foto';
      toast({
        title: "❌ Error al actualizar",
        description: errorMessage,
        variant: "destructive",
        position: "top-right",
        duration: 5000,
        showIcon: true,
      });
      return false;
    }
  };

  // =============================
  // Delete photo
  // =============================
  const deletePhoto = async (photoId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "🔒 Autenticación requerida",
        description: "Debes iniciar sesión para eliminar fotos",
        variant: "destructive",
        position: "bottom-right",
        duration: 4000,
        showIcon: true,
      });
      return false;
    }

    try {
      await api.delete(`/api/photos/${photoId}`);
      
      toast({
        title: "🗑️ Foto eliminada",
        description: "Tu foto se ha borrado exitosamente",
        variant: "info",
        position: "bottom-right",
        duration: 3000,
        showIcon: true,
      });
      
      await fetchPhotos();
      return true;
    } catch (err: unknown) {
      const errorMessage = (err as ErrorResponse)?.response?.data?.message || 'Error al eliminar la foto';
      toast({
        title: "❌ Error al eliminar",
        description: errorMessage,
        variant: "destructive",
        position: "top-right",
        duration: 5000,
        showIcon: true,
      });
      return false;
    }
  };

  // =============================
  // React to photo (like/unlike)
  // =============================
  const reactToPhoto = async (photoId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "🔒 Autenticación requerida",
        description: "Debes iniciar sesión para reaccionar",
        variant: "destructive",
        position: "bottom-right",
        duration: 4000,
        showIcon: true,
      });
      return false;
    }

    try {
      setReacting(photoId);
const response = await api.post(`/api/photos/${photoId}/reactions`, { 
      reaction_type: 'like' 
    });
    
    // El backend decide si agregar o quitar
    if (response.data.action === 'added') {
      toast({
        title: "❤️ ¡Te gusta!",
        description: "Has dado like a esta foto",
        variant: "like",
        position: "bottom-right",
        duration: 2000,
        showIcon: true,
      });
    } else {
      toast({
        title: "💔 Like removido",
        description: "Ya no te gusta esta foto",
        variant: "like",
        position: "bottom-right",
        duration: 2000,
        showIcon: true,
      });
    }

    await updatePhotoReactions(photoId);
    return true;
  } catch (err: unknown) {
      const errorMessage = (err as ErrorResponse)?.response?.data?.message || 'Error al procesar la reacción';
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
        position: "top-right",
        duration: 4000,
        showIcon: true,
      });
      return false;
    } finally {
      setReacting(null);
    }
  };

  // =============================
  // Helpers
  // =============================
  const hasUserReacted = (photo?: Photo): boolean => {
    if (!isAuthenticated || !user || !photo || !photo.reactions) return false;
    return photo.reactions.some(reaction => reaction.user_id === user.id);
  };

  const getReactionCount = (photo?: Photo): number => {
    if (!photo) return 0;
    return photo.reaction_count !== undefined 
      ? photo.reaction_count 
      : (photo.reactions?.length || 0);
  };

  const getUserReaction = (photo?: Photo): PhotoReaction | null => {
    if (!isAuthenticated || !user || !photo || !photo.reactions) return null;
    return photo.reactions.find(reaction => reaction.user_id === user.id) || null;
  };

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
    refetch: fetchPhotos,
  };
};