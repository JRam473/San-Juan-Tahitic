// hooks/useUserPhotos.ts
import { useState, useEffect } from 'react';
import { useCallback } from 'react';
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
}

interface PhotoReaction {
  id: string;
  user_id: string;
  reaction_type: string;
}

export const useUserPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();



  // Fetch all photos - CORREGIDO: usar la ruta correcta /api/photos
  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/api/photos');
      setPhotos(response.data.photos || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar las fotos';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Upload photo - CORREGIDO: usar la ruta correcta /api/photos
  const uploadPhoto = async (file: File, caption: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para subir fotos",
        variant: "destructive",
      });
      return false;
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Archivo inválido",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: "Archivo muy grande",
        description: "La imagen debe ser menor a 5MB",
        variant: "destructive",
      });
      return false;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('photo', file);
      formData.append('caption', caption);

      // CORREGIDO: usar la ruta correcta /api/photos
      const response = await api.post('/api/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Foto subida",
        description: "Tu foto se ha subido exitosamente",
      });

      // Refresh photos
      await fetchPhotos();
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al subir la foto';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  

  // Delete photo - CORREGIDO: usar la ruta correcta /api/photos
  const deletePhoto = async (photoId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para eliminar fotos",
        variant: "destructive",
      });
      return false;
    }

    try {
      // CORREGIDO: usar la ruta correcta /api/photos
      await api.delete(`/api/photos/${photoId}`);
      
      toast({
        title: "Foto eliminada",
        description: "Tu foto se ha borrado exitosamente",
      });

      // Refresh photos
      await fetchPhotos();
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar la foto';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // React to photo (like/unlike) - CORREGIDO: usar la ruta correcta /api/reactions
  const reactToPhoto = async (photoId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para reaccionar",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Check if user already reacted
      const hasReacted = hasUserReacted(photos.find(p => p.id === photoId));
      
      if (hasReacted) {
        // Remove reaction - CORREGIDO: usar la ruta correcta
        await api.delete(`/api/reactions/photos/${photoId}`);
      } else {
        // Add reaction - CORREGIDO: usar la ruta correcta
        await api.post(`/api/reactions/photos/${photoId}`, {
          reaction_type: 'like'
        });
      }

      // Refresh photos to get updated reactions
      await fetchPhotos();
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al procesar la reacción';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // Check if user has reacted to a photo
  const hasUserReacted = (photo?: Photo): boolean => {
    if (!isAuthenticated || !user || !photo || !photo.reactions) return false;
    return photo.reactions.some(reaction => reaction.user_id === user.id);
  };

  // Get reaction count for a photo
  const getReactionCount = (photo?: Photo): number => {
    if (!photo || !photo.reactions) return 0;
    return photo.reactions.length;
  };

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return {
    photos,
    loading,
    uploading,
    error,
    uploadPhoto,
    reactToPhoto,
    hasUserReacted,
    getReactionCount,
    refetch: fetchPhotos,
    deletePhoto
  };
};