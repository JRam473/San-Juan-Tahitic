// hooks/usePlaces.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

export interface Place {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  location: string;
  average_rating: number;
  total_ratings: number;
}

export interface UserRatingData {
  id: string;
  rating: number;
}

export interface RatingStats {
  average_rating: number;
  total_ratings: number;
  rating_distribution: Array<{
    rating: number;
    count: number;
  }>;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  places?: T[];
  ratings?: any[];
  stats?: RatingStats;
  average_rating?: number;
  total_ratings?: number;
}

interface RatingItem {
  id: string;
  place_id: string;
  rating: number;
  [key: string]: any;
}

export const usePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRatings, setUserRatings] = useState<Record<string, UserRatingData>>({});
  const [ratingStats, setRatingStats] = useState<Record<string, RatingStats>>({});
  const [isRating, setIsRating] = useState<Record<string, boolean>>({});

  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Obtener todos los lugares
   */
  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<{ places: Place[] }>('/api/places');
      setPlaces(response.data.places || []);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Error al cargar los lugares';

      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        position: 'top-right', // 👈 Nueva propiedad
        duration: 5000, // 👈 Nueva propiedad
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Obtener calificación del usuario para un lugar
   */
  const getUserRating = useCallback(
    async (placeId: string): Promise<UserRatingData | null> => {
      if (!user) return null;

      try {
        const response = await api.get<{ ratings: RatingItem[] }>(`/api/ratings/user/${user.id}`);
        const userRatings = response.data.ratings || [];
        
        const ratingForPlace = userRatings.find((r: RatingItem) => r.place_id === placeId);
        
        if (ratingForPlace && typeof ratingForPlace.rating === 'number') {
          return { 
            id: ratingForPlace.id, 
            rating: Number(ratingForPlace.rating) 
          };
        }
        
        return null;
      } catch (err) {
        console.error('Error fetching user rating:', err);
        return null;
      }
    },
    [user]
  );

  /**
   * Calificar un lugar - FUNCIÓN MEJORADA con nuevos toasts
   */
  const ratePlace = useCallback(
    async (placeId: string, rating: number, placeName?: string) => {
      if (!user) {
        toast({
          title: 'Inicia sesión para calificar',
          description: 'Debes iniciar sesión para poder calificar lugares',
          variant: 'destructive',
          position: 'bottom-right', // 👈 Mejor posición para acciones de usuario
          duration: 4000,
        });
        return false;
      }

      try {
        setIsRating(prev => ({ ...prev, [placeId]: true }));
        
        const userRating = await getUserRating(placeId);
        
        let response;
        if (userRating && userRating.id) {
          // Actualizar calificación existente
          response = await api.put<ApiResponse<any>>(`/api/ratings/${userRating.id}`, { rating });
          toast({
            title: '⭐ Calificación actualizada',
            description: `Tu calificación para ${placeName || 'este lugar'} ha sido actualizada a ${rating} estrellas`,
            variant: 'rating', // 👈 Variante específica para calificaciones
            position: 'bottom-right',
            duration: 3000,
            showIcon: true, // 👈 Mostrar icono
          });
        } else {
          // Crear nueva calificación
          response = await api.post<ApiResponse<any>>('/api/ratings', { 
            place_id: placeId, 
            rating 
          });
          toast({
            title: '🎉 ¡Gracias por tu calificación!',
            description: `Has calificado ${placeName || 'este lugar'} con ${rating} estrellas`,
            variant: 'rating', // 👈 Variante específica para calificaciones
            position: 'bottom-right',
            duration: 4000,
            showIcon: true,
          });
        }

        // Actualizar la lista de lugares con los nuevos promedios
        await fetchPlaces();

        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Error al calificar el lugar';

        toast({
          title: '❌ Error al calificar',
          description: errorMessage,
          variant: 'destructive',
          position: 'top-right',
          duration: 5000,
          showIcon: true,
        });
        return false;
      } finally {
        setIsRating(prev => ({ ...prev, [placeId]: false }));
      }
    },
    [user, toast, fetchPlaces, getUserRating]
  );

  /**
   * Obtener estadísticas de calificaciones de un lugar
   */
  const getRatingStats = useCallback(
    async (placeId: string): Promise<RatingStats | null> => {
      try {
        const response = await api.get<{ stats: RatingStats }>(`/api/ratings/stats/place/${placeId}`);
        return response.data.stats || null;
      } catch (err) {
        console.error('Error fetching rating stats:', err);
        // Opcional: mostrar toast de error
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las estadísticas',
          variant: 'warning',
          position: 'top-right',
          duration: 3000,
        });
        return null;
      }
    },
    [toast] // 👈 Añadir toast como dependencia
  );

  // Limpiar datos cuando el usuario cierre sesión
  useEffect(() => {
    if (!user) {
      setUserRatings({});
      setRatingStats({});
      setIsRating({});
    }
  }, [user]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return {
    places,
    loading,
    error,
    ratePlace,
    getUserRating,
    getRatingStats,
    isRating,
    refetch: fetchPlaces,
  };
};