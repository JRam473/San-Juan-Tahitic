// hooks/usePlaces.ts
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

interface Place {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  location: string;
  average_rating: number;
  total_ratings: number;
}

interface PlaceRating {
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

  // Fetch all places
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/places');
      setPlaces(response.data.places || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los lugares';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Rate a place
  const ratePlace = async (placeId: string, rating: number) => {
    if (!user) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para calificar lugares",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await api.post(`/api/places/${placeId}/rate`, { rating });
      
      toast({
        title: "Calificación enviada",
        description: response.data.message || "Gracias por tu calificación",
      });

      // Refresh places to get updated averages
      await fetchPlaces();
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al calificar el lugar';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  // Get user's rating for a specific place
  const getUserRating = async (placeId: string): Promise<number> => {
    if (!user) return 0;

    try {
      const response = await api.get(`/api/places/${placeId}/user-rating`);
      return response.data.rating || 0;
    } catch (err) {
      console.error('Error fetching user rating:', err);
      return 0;
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return {
    places,
    loading,
    error,
    ratePlace,
    getUserRating,
    refetch: fetchPlaces
  };
};