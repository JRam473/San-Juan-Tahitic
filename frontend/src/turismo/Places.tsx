// components/Places.tsx
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, ExternalLink, AlertCircle, Star, BarChart3, X, Maximize2, LogIn, ThumbsUp } from 'lucide-react';
import { usePlaces } from '@/hooks/usePlaces';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
// Componente de Rating Mejorado
const Rating = ({ 
  rating, 
  onRatingChange, 
  totalRatings = 0, 
  size = "md", 
  readonly = false,
  showProgress = true // Nueva prop para controlar la visualización del progreso
}: {
  rating: number | null | undefined;
  onRatingChange?: (rating: number) => void;
  totalRatings?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showProgress?: boolean;
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const numericRating = typeof rating === 'number' ? rating : 0;
  const displayRating = isHovering && hoverRating > 0 ? hoverRating : numericRating;

  return (
    <div 
      className="flex flex-col gap-2"
      onMouseEnter={() => !readonly && setIsHovering(true)}
      onMouseLeave={() => !readonly && setIsHovering(false)}
    >
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange?.(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            disabled={readonly}
            className={`relative transition-all duration-200 ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125'
            }`}
          >
            {/* Estrella de fondo (siempre visible) */}
            <Star
              className={sizeClasses[size]}
              fill="none"
              color="#d1d5db"
            />
            
            {/* Estrella de relleno (según rating/hover) */}
            <div 
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: star <= displayRating ? '100%' : '0%' }}
            >
              <Star
                className={sizeClasses[size]}
                fill="currentColor"
                color={star <= displayRating ? "#f59e0b" : "#d1d5db"}
              />
            </div>
            
            {/* Efecto de brillo al hacer hover */}
            {!readonly && star <= hoverRating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-300 rounded-full blur-[3px] opacity-70"></div>
              </div>
            )}
          </button>
        ))}

<span className={cn(
  "text-sm font-medium ml-2",
  numericRating > 0 ? "text-amber-700" : "text-muted-foreground"
)}>
  {numericRating && numericRating > 0 ? numericRating.toFixed(1) : 'Sin calificaciones'}
</span>
      </div>
      
      {/* Barra de progreso mejorada */}
      {showProgress && !readonly && (
        <div className="mt-2 relative">
          {/* Fondo de la barra */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            {/* Barra de progreso animada */}
            <motion.div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(displayRating / 5) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          {/* Indicador de valor numérico */}
          <motion.div
            className="absolute -top-6 text-xs font-bold text-amber-600"
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: isHovering ? 1 : 0,
              x: isHovering ? 0 : -10
            }}
            style={{ left: `${(displayRating / 5) * 100}%` }}
          >
            {displayRating}/5
          </motion.div>
          
          {/* Puntos de referencia */}
          <div className="flex justify-between mt-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`w-1 h-1 rounded-full ${
                  num <= displayRating ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
      
      {totalRatings > 0 && (
        <p className="text-xs text-muted-foreground">
          {totalRatings} {totalRatings === 1 ? 'calificación' : 'calificaciones'}
        </p>
      )}
    </div>
  );
};

// Componente para mostrar estadísticas de calificaciones
const RatingStatsDialog = ({ placeId, placeName, stats, variant = "default", theme = "default" }: { 
  placeId: string; 
  placeName: string;
  stats: any;
  variant?: "default" | "primary" | "secondary";
  theme?: "default" | "nature" | "beach" | "cultural";
}) => {
  if (!stats) return null;

  const themeButtonClasses = {
    default: {
      primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:from-blue-600 hover:to-indigo-700",
      secondary: "bg-secondary text-secondary-foreground"
    },
    nature: {
      primary: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:from-green-600 hover:to-emerald-700",
      secondary: "bg-green-200 text-green-800 hover:bg-green-300"
    },
    beach: {
      primary: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md hover:from-blue-600 hover:to-cyan-700",
      secondary: "bg-blue-200 text-blue-800 hover:bg-blue-300"
    },
    cultural: {
      primary: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md hover:from-amber-600 hover:to-orange-700",
      secondary: "bg-amber-200 text-amber-800 hover:bg-amber-300"
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={variant === "primary" ? "default" : "outline"} 
          size="sm" 
          className={cn("mt-2 transition-all duration-300 transform hover:scale-105", themeButtonClasses[theme][variant])}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Ver estadísticas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white/30 backdrop-blur-sm border border-white/20 p-2 text-gray-900 dark:text-gray-100 dark:bg-black/30 dark:border-gray-700 shadow-lg rounded-md">
        <DialogHeader>
          <DialogTitle className={cn("text-lg font-bold", {
            "text-primary-foreground": variant === "primary",
            "text-secondary-foreground": variant === "secondary"
          })}>
            Estadísticas de calificaciones - {placeName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className={cn("text-center p-4 rounded-lg", {
              "bg-primary/20": variant === "default",
              "bg-primary/30": variant === "primary",
              "bg-secondary/30": variant === "secondary"
            })}>
              <p className="text-2xl font-bold">
  {stats.average_rating !== null && stats.average_rating !== undefined 
    ? Number(stats.average_rating).toFixed(1) 
    : '0.0'
  }
</p>
              <p className="text-sm text-muted-foreground">Promedio</p>
            </div>
            <div className={cn("text-center p-4 rounded-lg", {
              "bg-primary/20": variant === "default",
              "bg-primary/30": variant === "primary",
              "bg-secondary/30": variant === "secondary"
            })}>
              <p className="text-2xl font-bold">{stats.total_ratings}</p>
              <p className="text-sm text-muted-foreground">Total calificaciones</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Distribución de calificaciones:</h4>
            {stats.rating_distribution.map((item: any) => (
              <div key={item.rating} className="flex items-center gap-3">
                <div className="w-16 text-sm text-muted-foreground">
                  {item.rating} estrella{item.rating !== 1 ? 's' : ''}
                </div>
                <div className="flex-1 bg-secondary rounded-full h-3">
                  <div 
                    className={cn("rounded-full h-3", {
                      "bg-primary": variant === "default",
                      "bg-primary-foreground": variant === "primary",
                      "bg-secondary-foreground": variant === "secondary"
                    })} 
                    style={{ 
                      width: `${stats.total_ratings > 0 ? (item.count / stats.total_ratings) * 100 : 0}%` 
                    }}
                  />
                </div>
                <div className="w-12 text-sm font-medium text-right">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Componente para visualización completa de imágenes
const ImageModal = ({ 
  src, 
  alt, 
  isOpen, 
  onClose 
}: { 
  src: string; 
  alt: string; 
  isOpen: boolean; 
  onClose: () => void 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-0 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <img
            src={src}
            alt={alt}
            className="max-w-screen max-h-screen object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-lg">
          {alt}
        </div>
      </div>
    </div>
  );
};

// Componente de invitación para valoraciones
const RatingInvitationBanner = ({ theme, onLoginRedirect }: { 
  theme: 'default' | 'nature' | 'beach' | 'cultural'; 
  onLoginRedirect: () => void;
}) => {
  const themeClasses = {
    default: {
      bg: 'bg-gradient-to-r from-blue-100/80 via-indigo-100/80 to-purple-100/80',
      border: 'border-blue-200/30',
      button: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
    },
    nature: {
      bg: 'bg-gradient-to-r from-green-100/80 via-emerald-100/80 to-teal-100/80',
      border: 'border-green-200/30',
      button: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
    },
    beach: {
      bg: 'bg-gradient-to-r from-blue-100/80 via-cyan-100/80 to-sky-100/80',
      border: 'border-blue-200/30',
      button: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
    },
    cultural: {
      bg: 'bg-gradient-to-r from-amber-100/80 via-orange-100/80 to-red-100/80',
      border: 'border-amber-200/30',
      button: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      <div className={`${themeClasses[theme].bg} backdrop-blur-sm shadow-lg hover:shadow-2xl border ${themeClasses[theme].border} transition-all duration-500 overflow-hidden rounded-2xl p-8`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <ThumbsUp className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">¡Tu opinión cuenta!</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Comparte tu experiencia en los lugares que has visitado en San Juan Tahitic. 
              Ayuda a otros viajeros a descubrir los mejores rincones de nuestro pueblo.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">#Experiencias</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">#Recomendaciones</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">#Comunidad</span>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onLoginRedirect}
              className={`${themeClasses[theme].button} text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <LogIn className="w-5 h-5" /> Iniciar sesión para valorar
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Places = () => {
  const { places, loading, error, ratePlace, getUserRating, getRatingStats, isRating } = usePlaces();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [ratingStats, setRatingStats] = useState<Record<string, any>>({});
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [theme, setTheme] = useState<'default' | 'nature' | 'beach' | 'cultural'>('default');

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Determinar tema basado en las categorías de lugares
  useEffect(() => {
    if (places.length > 0) {
      const categories = places.map(p => p.category?.toLowerCase());
      if (categories.some(cat => cat?.includes('naturaleza') || cat?.includes('nature'))) {
        setTheme('nature');
      } else if (categories.some(cat => cat?.includes('playa') || cat?.includes('beach'))) {
        setTheme('beach');
      } else if (categories.some(cat => cat?.includes('cultura') || cat?.includes('cultural'))) {
        setTheme('cultural');
      } else {
        setTheme('default');
      }
    }
  }, [places]);

  const themeClasses = {
    default: {
      bg: 'bg-background',
      text: 'text-foreground',
      alert: 'bg-blue-50 text-blue-800 border-blue-200',
      button: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
    },
    nature: {
      bg: 'bg-green-50',
      text: 'text-green-900',
      alert: 'bg-green-50 text-green-800 border-green-200',
      button: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
    },
    beach: {
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      alert: 'bg-blue-50 text-blue-800 border-blue-200',
      button: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700'
    },
    cultural: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      alert: 'bg-amber-50 text-amber-800 border-amber-200',
      button: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700'
    }
  };

  // Load user ratings for each place
  useEffect(() => {
    if (user && places.length > 0) {
      const loadUserRatings = async () => {
        const ratings: Record<string, number> = {};
        for (const place of places) {
          const ratingData = await getUserRating(place.id);
          if (ratingData) {
            ratings[place.id] = ratingData.rating;
          }
        }
        setUserRatings(ratings);
      };
      loadUserRatings();
    }
  }, [user, places, getUserRating]);

  // Cargar estadísticas de calificaciones
  useEffect(() => {
    if (places.length > 0) {
      const loadRatingStats = async () => {
        const stats: Record<string, any> = {};
        for (const place of places) {
          try {
            const statsData = await getRatingStats(place.id);
            if (statsData) {
              stats[place.id] = statsData;
            }
          } catch (error) {
            console.error(`Error loading stats for place ${place.id}:`, error);
          }
        }
        setRatingStats(stats);
      };
      loadRatingStats();
    }
  }, [places, getRatingStats]);

  const handleRatingChange = async (placeId: string, placeName: string, newRating: number) => {
    try {
      const success = await ratePlace(placeId, newRating, placeName);
      if (success) {
        setUserRatings(prev => ({ ...prev, [placeId]: newRating }));
        
        try {
          const statsData = await getRatingStats(placeId);
          if (statsData) {
            setRatingStats(prev => ({ ...prev, [placeId]: statsData }));
          }
        } catch (error) {
          console.error('Error reloading stats:', error);
        }
      }
    } catch (error: any) {
      // El error ya se maneja en ratePlace, no es necesario mostrar otro toast aquí
    }
  };

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
    toast({
      title: 'Imagen expandida',
      description: 'Haz clic en cualquier lugar o presiona ESC para cerrar',
      duration: 3000,
    });
  };

  // Toast para cuando hay un error al cargar una imagen
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, placeName: string) => {
    e.currentTarget.src = '/placeholder.svg';
    toast({
      title: 'Error al cargar imagen',
      description: `No se pudo cargar la imagen de ${placeName}`,
      variant: 'destructive',
      duration: 5000,
    });
  };

  const getCategoryColor = (category: string | null) => {
    if (!category) return 'bg-secondary text-secondary-foreground';
    
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('naturaleza') || categoryLower.includes('nature')) 
      return 'bg-green-500 text-white';
    if (categoryLower.includes('cultura') || categoryLower.includes('culture')) 
      return 'bg-amber-500 text-white';  
    if (categoryLower.includes('playa') || categoryLower.includes('beach')) 
      return 'bg-blue-500 text-white';
    if (categoryLower.includes('historia') || categoryLower.includes('history')) 
      return 'bg-purple-500 text-white';
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
      <section id="places" className={`py-24 ${themeClasses[theme].bg} relative overflow-hidden`}>
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-6">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Destinos Únicos</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Lugares{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Destacados
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
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
      <section id="places" className={`py-24 ${themeClasses[theme].bg} relative overflow-hidden`}>
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-6">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Destinos Únicos</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Lugares{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Destacados
              </span>
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
      <section id="places" className={`py-24 ${themeClasses[theme].bg} relative overflow-hidden`}>
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-6">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Destinos Únicos</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Lugares{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Destacados
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              No hay lugares disponibles en este momento. ¡Vuelve pronto para descubrir nuevos destinos!
            </p>
          </div>
        </div>
      </section>
    );
  }

return (
  <>
    <section id="places" className={`py-20 ${themeClasses[theme].bg}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-6">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Destinos Únicos</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Lugares{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Destacados
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Descubre los rincones más fascinantes de San Juan Tahitic, cada uno con su propia magia y experiencias únicas.
          </p>
        </div>

        {/* SECCIÓN DE INVITACIÓN PARA VALORACIONES */}
        {!user && (
          <RatingInvitationBanner 
            theme={theme} 
            onLoginRedirect={handleLoginRedirect} 
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {places.map((place) => {
              const features = getPlaceFeatures(place.description);
              const displayRating = userRatings[place.id] || place.average_rating || 0;
              const isCurrentlyRating = isRating[place.id] || false;
              const imageUrl = `${import.meta.env.VITE_API_URL}${place.image_url}` || '/placeholder.svg';
              
              return (
                <div 
                  key={place.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-shadow group"
                >
                  {/* Image with expand button */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={imageUrl}
                      alt={place.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      loading="lazy"
                      onClick={() => handleImageClick(imageUrl, place.name)}
                      onError={(e) => handleImageError(e, place.name)}
                    />
                    
                    <button
                      onClick={() => handleImageClick(imageUrl, place.name)}
                      className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(place.category)}>
                        {place.category || 'Turismo'}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-12 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-sm font-medium">
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
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Rating 
        rating={displayRating}
        onRatingChange={(rating) => handleRatingChange(place.id, place.name, rating)}
        totalRatings={place.total_ratings || 0}
        size="sm"
        readonly={isCurrentlyRating}
      />
      
      {/* Mostrar el promedio numérico de manera destacada */}
      {place.average_rating !== null && place.average_rating !== undefined && place.average_rating > 0 && (
        <div className="flex items-center ml-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-1 px-3 rounded-full shadow-lg">
          <Star className="w-3 h-3 mr-1 fill-white" />
          <span className="text-sm">{Number(place.average_rating).toFixed(1)}</span>
        </div>
      )}
    </div>
    
    {isCurrentlyRating && (
      <div className="text-sm text-muted-foreground">
        Calificando...
      </div>
    )}
  </div>
  
  {!user && (
    <p className="text-xs text-muted-foreground mt-1">
      Inicia sesión para calificar
    </p>
  )}
  
  {/* Estadísticas de calificaciones */}
  {ratingStats[place.id] && ratingStats[place.id].total_ratings > 0 && (
    <RatingStatsDialog 
      placeId={place.id}
      placeName={place.name}
      stats={ratingStats[place.id]}
      variant={theme === 'default' ? 'default' : 'primary'}
      theme={theme}
    />
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

                    {/* Action - Botón corregido */}
                    <Button 
                      className={cn(
                        "w-full shadow-md hover:shadow-lg transition-all duration-300",
                        theme === 'default' && "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700",
                        theme === 'nature' && "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700",
                        theme === 'beach' && "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700",
                        theme === 'cultural' && "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                      )}
                    >
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

      {/* Modal para imagen completa */}
      <ImageModal
        src={selectedImage?.src || ''}
        alt={selectedImage?.alt || ''}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};

export default Places;