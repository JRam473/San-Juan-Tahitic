// components/Places.tsx
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, ExternalLink, AlertCircle, Star } from 'lucide-react';
import { usePlaces } from '@/hooks/usePlaces';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

// Componente de esqueleto para lugares
const PlaceSkeletonGrid = ({ count }: { count: number }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-card rounded-2xl overflow-hidden shadow-card">
        <Skeleton className="w-full h-64" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    ))}
  </div>
);

// Componente de rating
const Rating = ({ 
  rating, 
  onRatingChange, 
  totalRatings = 0, 
  size = "md", 
  readonly = false 
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  totalRatings?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange?.(star)}
            disabled={readonly}
            className={`transition-colors ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <Star
              className={sizeClasses[size]}
              fill={star <= rating ? "currentColor" : "none"}
              color={star <= rating ? "#f59e0b" : "#d1d5db"}
            />
          </button>
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {rating > 0 ? rating.toFixed(1) : 'Sin calificaciones'}
        </span>
      </div>
      {totalRatings > 0 && (
        <p className="text-xs text-muted-foreground">
          {totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'}
        </p>
      )}
    </div>
  );
};

const Places = () => {
  const { places, loading, error, ratePlace, getUserRating } = usePlaces();
  const { user } = useAuth();
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  // Load user ratings for each place
  useEffect(() => {
    if (user && places.length > 0) {
      const loadUserRatings = async () => {
        const ratings: Record<string, number> = {};
        for (const place of places) {
          const rating = await getUserRating(place.id);
          if (rating > 0) {
            ratings[place.id] = rating;
          }
        }
        setUserRatings(ratings);
      };
      loadUserRatings();
    }
  }, [user, places, getUserRating]);

  const handleRatingChange = async (placeId: string, newRating: number) => {
    const success = await ratePlace(placeId, newRating);
    if (success) {
      setUserRatings(prev => ({ ...prev, [placeId]: newRating }));
    }
  };

  const getCategoryColor = (category: string | null) => {
    if (!category) return 'bg-secondary text-secondary-foreground';
    
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('naturaleza') || categoryLower.includes('nature')) return 'bg-green-500 text-white';
    if (categoryLower.includes('cultura') || categoryLower.includes('culture')) return 'bg-amber-500 text-white';  
    if (categoryLower.includes('playa') || categoryLower.includes('beach')) return 'bg-blue-500 text-white';
    if (categoryLower.includes('historia') || categoryLower.includes('history')) return 'bg-purple-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const getPlaceFeatures = (description: string | null): string[] => {
    if (!description) return [];
    
    const features: string[] = [];
    const descLower = description.toLowerCase();
    
    if (descLower.includes('senderismo') || descLower.includes('hiking')) features.push('Senderismo');
    if (descLower.includes('natación') || descLower.includes('swimming')) features.push('Natación');
    if (descLower.includes('fotografía') || descLower.includes('photo')) features.push('Fotografía');
    if (descLower.includes('gastronomía') || descLower.includes('food')) features.push('Gastronomía');
    if (descLower.includes('artesanías') || descLower.includes('crafts')) features.push('Artesanías');
    if (descLower.includes('música') || descLower.includes('music')) features.push('Música');
    if (descLower.includes('deportes') || descLower.includes('sports')) features.push('Deportes acuáticos');
    if (descLower.includes('atardecer') || descLower.includes('sunset')) features.push('Atardecer');
    if (descLower.includes('relax') || descLower.includes('peaceful')) features.push('Relax');
    
    return features.length > 0 ? features : ['Turismo'];
  };

  if (loading) {
    return (
      <section id="places" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Lugares
              <span className="block text-primary">Destacados</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubre los rincones más fascinantes de San Juan Tahitic, cada uno con su propia magia y experiencias únicas.
            </p>
          </div>
          <PlaceSkeletonGrid count={3} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="places" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Lugares
              <span className="block text-primary">Destacados</span>
            </h2>
          </div>
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (places.length === 0) {
    return (
      <section id="places" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Lugares
              <span className="block text-primary">Destacados</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              No hay lugares disponibles en este momento. ¡Vuelve pronto para descubrir nuevos destinos!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="places" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Lugares
            <span className="block text-primary">Destacados</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre los rincones más fascinantes de San Juan Tahitic, cada uno con su propia magia y experiencias únicas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {places.map((place) => {
            const features = getPlaceFeatures(place.description);
            const displayRating = userRatings[place.id] || place.average_rating || 0;
            
            return (
              <div 
                key={place.id}
                className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-shadow group"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={place.image_url || '/placeholder.svg'}
                    alt={place.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(place.category)}>
                      {place.category || 'Turismo'}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-sm font-medium">
                    Gratuito
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {place.name}
                    </h3>
                    <Button size="icon" variant="ghost" className="shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                    {place.description || 'Un hermoso lugar para visitar en San Juan Tahitic.'}
                  </p>

                  {/* Rating */}
                  <div className="mb-4">
                    <Rating 
                      rating={displayRating}
                      onRatingChange={(rating) => handleRatingChange(place.id, rating)}
                      totalRatings={place.total_ratings || 0}
                      size="sm"
                      readonly={!user}
                    />
                    {!user && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Inicia sesión para calificar
                      </p>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {place.location || 'San Juan Tahitic'}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      2-4 horas
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      Todos los niveles
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {features.map((feature, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Action */}
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-white">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            className="px-8"
          >
            Ver Todos los Lugares
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Places;
