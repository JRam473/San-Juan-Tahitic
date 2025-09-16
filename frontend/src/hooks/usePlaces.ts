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

export interface PlaceRating {
  id: string;
  place_id: string;
  user_id: string;
  rating: number;
}

export const usePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  /**
   * Obtener todos los lugares
   */
  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/api/places');
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
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Calificar un lugar
   */
  const ratePlace = useCallback(
    async (placeId: string, rating: number) => {
      if (!user) {
        toast({
          title: 'Autenticación requerida',
          description: 'Debes iniciar sesión para calificar lugares',
          variant: 'destructive',
        });
        return false;
      }

      try {
        const response = await api.post(`/api/places/${placeId}/rate`, { rating });

        toast({
          title: 'Calificación enviada',
          description: response.data.message || 'Gracias por tu calificación',
        });

        // Actualizar el lugar calificado sin recargar toda la lista
        setPlaces((prevPlaces) =>
          prevPlaces.map((p) =>
            p.id === placeId
              ? {
                  ...p,
                  average_rating: response.data.average_rating ?? p.average_rating,
                  total_ratings: response.data.total_ratings ?? p.total_ratings,
                }
              : p
          )
        );

        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Error al calificar el lugar';

        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        return false;
      }
    },
    [user, toast]
  );

  /**
   * Obtener calificación del usuario para un lugar
   */
  const getUserRating = useCallback(
    async (placeId: string): Promise<number> => {
      if (!user) return 0;

      try {
        const response = await api.get(`/api/places/${placeId}/user-rating`);
        return response.data.rating || 0;
      } catch (err) {
        console.error('Error fetching user rating:', err);
        return 0;
      }
    },
    [user]
  );

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return {
    places,
    loading,
    error,
    ratePlace,
    getUserRating,
    refetch: fetchPlaces,
  };
};
