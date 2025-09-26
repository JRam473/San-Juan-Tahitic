// hooks/useAdminPlaces.ts - VERSIÓN CORREGIDA
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
      console.log('📦 Respuesta completa del servidor:', response.data);
      
      const placesData = response.data.places || [];
      console.log('📦 Lugares obtenidos:', placesData);
      
      const parsedPlaces = placesData.map(parsePlaceData);
      setPlaces(parsedPlaces);
      
      return parsedPlaces;
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

      console.log('📤 Creando lugar con datos:', placeData);
      
      // Validar datos requeridos
      if (!placeData.name?.trim()) {
        throw new Error('El nombre del lugar es requerido');
      }
      
      if (!placeData.description?.trim()) {
        throw new Error('La descripción del lugar es requerida');
      }
      
      const response = await api.post<{ message: string; place: Place }>('/api/places', placeData);
      
      console.log('✅ Respuesta del servidor al crear:', response.data);
      
      if (!response.data.place) {
        throw new Error('No se recibió el lugar creado del servidor');
      }
      
      const newPlace = parsePlaceData(response.data.place);
      
      // Actualizar la lista de lugares
      setPlaces(prevPlaces => [...prevPlaces, newPlace]);
      
      toast({
        title: '✅ Lugar creado',
        description: 'El lugar se ha creado exitosamente',
      });
      
      return newPlace;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al crear el lugar';
      setError(errorMessage);
      
      console.error('❌ Error creando lugar:', {
        error: err,
        requestData: placeData,
        response: err?.response?.data
      });
      
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
      
      if (!response.data.place) {
        throw new Error('No se recibió el lugar actualizado del servidor');
      }
      
      const updatedPlace = parsePlaceData(response.data.place);
      
      // Actualizar la lista de lugares
      setPlaces(prevPlaces => 
        prevPlaces.map(place => 
          place.id === placeId ? updatedPlace : place
        )
      );
      
      toast({
        title: '✅ Lugar actualizado',
        description: 'El lugar se ha actualizado exitosamente',
      });
      
      return updatedPlace;
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
      
      // Actualizar la lista de lugares
      setPlaces(prevPlaces => prevPlaces.filter(place => place.id !== placeId));
      
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




/**
 * Subir imagen de un lugar
 */
const uploadPlaceImage = useCallback(async (placeId: string, imageFile: File) => {
  try {
    console.log('🚀 Iniciando upload de imagen:', {
      placeId,
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    });

    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await api.post<{ 
      message: string; 
      imageUrl: string; 
      place: Place 
    }>(`/api/places/${placeId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('📨 Respuesta del servidor (imagen):', response.data);
    return response.data;
  } catch (err: any) {
    console.error('💥 Error en uploadPlaceImage:', {
      error: err,
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message
    });
    
    const errorMessage = err?.response?.data?.message || err?.message || 'Error al subir la imagen';
    throw new Error(errorMessage);
  }
}, []);

/**
 * Subir PDF de un lugar
 */
const uploadPlacePDF = useCallback(async (placeId: string, pdfFile: File) => {
  try {
    console.log('🚀 Iniciando upload de PDF:', {
      placeId,
      fileName: pdfFile.name,
      fileSize: pdfFile.size,
      fileType: pdfFile.type
    });

    const formData = new FormData();
    formData.append('file', pdfFile);

    const response = await api.post<{ 
      message: string; 
      pdfUrl: string; 
      place: Place 
    }>(`/api/places/${placeId}/upload-pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('📨 Respuesta del servidor (PDF):', response.data);
    return response.data;
  } catch (err: any) {
    console.error('💥 Error en uploadPlacePDF:', {
      error: err,
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message
    });
    
    const errorMessage = err?.response?.data?.message || err?.message || 'Error al subir el PDF';
    throw new Error(errorMessage);
  }
}, []);

// Agrega estas funciones al return del hook
return {
  places,
  loading,
  error,
  createPlace,
  updatePlace,
  deletePlace,
  uploadPlaceImage, // ← Agregar esta línea
  uploadPlacePDF,   // ← Agregar esta línea
  refetch: fetchPlaces,
  clearError,
};
};