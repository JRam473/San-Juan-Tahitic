// hooks/useAdminPlaces.ts
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

export interface Place {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  pdf_url: string | null;
  category: string | null;
  location: string | null;
  average_rating: number;
  total_ratings: number;
  created_at: string;
  updated_at: string;
}

interface PlaceFormData {
  name: string;
  description?: string;
  image_url?: string;
  pdf_url?: string;
  location?: string;
  category?: string;
}

export const useAdminPlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

const buildImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${backendUrl}${normalizedPath}`;
};

const parsePlaceData = (place: any): Place => ({
  ...place,
  image_url: place.image_url ? buildImageUrl(place.image_url) : null,
  pdf_url: place.pdf_url ? buildImageUrl(place.pdf_url) : null,
  average_rating: place.average_rating ? Number(place.average_rating) : 0,
  total_ratings: place.total_ratings ? Number(place.total_ratings) : 0
});

  /**
   * Obtener todos los lugares
   */
  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<{ places: Place[] }>('/api/places');
      const parsedPlaces = response.data.places?.map(parsePlaceData) || [];
setPlaces(parsedPlaces);
      console.log('📦 Lugares obtenidos:', response.data.places);
      setPlaces(response.data.places || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al cargar los lugares';
      setError(errorMessage);
      console.error('❌ Error cargando lugares:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear un nuevo lugar
   */
  const createPlace = useCallback(async (placeData: PlaceFormData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('📤 Creando lugar:', placeData);
      
      const response = await api.post<{ message: string; place: Place }>('/api/places', placeData);
      
      console.log('✅ Lugar creado:', response.data);
      
      toast({
        title: '✅ Lugar creado',
        description: 'El lugar se ha creado exitosamente',
      });
      
      return response.data.place;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al crear el lugar';
      setError(errorMessage);
      
      console.error('❌ Error creando lugar:', err);
      
      toast({
        title: '❌ Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Actualizar un lugar existente
   */
  const updatePlace = useCallback(async (placeId: string, placeData: PlaceFormData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Actualizando lugar:', placeId, placeData);
      
      const response = await api.put<{ message: string; place: Place }>(`/api/places/${placeId}`, placeData);
      
      console.log('✅ Lugar actualizado:', response.data);
      
      toast({
        title: '✅ Lugar actualizado',
        description: 'El lugar se ha actualizado exitosamente',
      });
      
      return response.data.place;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al actualizar el lugar';
      setError(errorMessage);
      
      console.error('❌ Error actualizando lugar:', err);
      
      toast({
        title: '❌ Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Eliminar un lugar
   */
  const deletePlace = useCallback(async (placeId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🗑️ Eliminando lugar:', placeId);
      
      const response = await api.delete<{ message: string; deletedPlace: Place }>(`/api/places/${placeId}`);
      
      console.log('✅ Lugar eliminado:', response.data);
      
      toast({
        title: '✅ Lugar eliminado',
        description: 'El lugar se ha eliminado exitosamente',
      });
      
      return true;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al eliminar el lugar';
      setError(errorMessage);
      
      console.error('❌ Error eliminando lugar:', err);
      
      toast({
        title: '❌ Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    places,
    loading,
    error,
    createPlace,
    updatePlace,
    deletePlace,
    refetch: fetchPlaces,
    clearError,
  };
};