// components/admin/MapLocationSelector.tsx - VERSIÓN CORREGIDA
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Navigation, CheckCircle, X, RotateCw, Satellite, Map, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface MapLocationSelectorProps {
  onLocationSelect: (location: Location) => void;
  currentLocation?: string;
  buttonText?: string;
  className?: string;
}

// Declaración global para Google Maps
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

type MapType = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';

export const MapLocationSelector: React.FC<MapLocationSelectorProps> = ({
  onLocationSelect,
  currentLocation,
  buttonText = "Seleccionar Ubicación",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentMapType, setCurrentMapType] = useState<MapType>('hybrid');
  
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout>();

  // Cargar Google Maps API solo cuando el diálogo está abierto
  useEffect(() => {
    if (isOpen) {
      loadMap();
    } else {
      // Programar limpieza cuando se cierra el diálogo
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      cleanupTimeoutRef.current = setTimeout(() => {
        cleanupMap();
      }, 100);
    }

    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      cleanupMap();
    };
  }, [isOpen]);

  // Función de limpieza simplificada y segura
  const cleanupMap = () => {
    try {
      // Limpiar marcador
      if (marker) {
        marker.setMap(null);
        setMarker(null);
      }

      // Limpiar autocompletado
      if (autocomplete) {
        window.google?.maps.event.clearInstanceListeners(autocomplete);
        setAutocomplete(null);
      }

      // Limpiar mapa - NO manipular el DOM directamente
      if (mapInstanceRef.current) {
        // Solo limpiar event listeners, no manipular el DOM
        window.google?.maps.event.clearInstanceListeners(mapInstanceRef.current);
        mapInstanceRef.current = null;
      }

      setMap(null);
    } catch (error) {
      console.warn('Error durante la limpieza del mapa:', error);
    }
  };

  const loadMap = () => {
    // Limpiar cualquier mapa existente primero
    cleanupMap();
    
    setIsLoading(true);
    setMapError(null);

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTimeout(() => initializeMap(), 100);
      };
      script.onerror = () => {
        setMapError('Error al cargar Google Maps. Verifica tu API key.');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      setTimeout(() => initializeMap(), 100);
    }
  };

  const reloadMap = () => {
    loadMap();
  };

  const changeMapType = (mapType: MapType) => {
    if (map) {
      map.setMapTypeId(mapType);
      setCurrentMapType(mapType);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) {
      setMapError('Google Maps no se pudo inicializar correctamente.');
      setIsLoading(false);
      return;
    }

    try {
      // Asegurarse de que el contenedor del mapa esté vacío
      if (mapRef.current) {
        // Solo limpiar el contenido interno, no reemplazar el elemento
        mapRef.current.innerHTML = '';
      }

      // Coordenadas por defecto (San Juan Tahitic)
      const defaultCenter = { lat: 19.939088388469845, lng: -97.55492145455479 };

      const newMap = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 15,
        mapTypeId: 'hybrid',
        streetViewControl: true,
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_TOP
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER
        },
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#f8fafc' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#64748b' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e0f2fe' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#f1f5f9' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#cbd5e1' }]
          }
        ]
      });

      // Guardar referencia de la instancia del mapa
      mapInstanceRef.current = newMap;

      // Configurar autocompletado
      if (searchInputRef.current) {
        const newAutocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
          types: ['geocode', 'establishment']
        });
        newAutocomplete.bindTo('bounds', newMap);
        newAutocomplete.addListener('place_changed', () => {
          const place = newAutocomplete.getPlace();
          if (place.geometry) {
            handlePlaceSelect(place);
          }
        });
        setAutocomplete(newAutocomplete);
      }

      // Crear marcador inicial
      const newMarker = new window.google.maps.Marker({
        map: newMap,
        position: defaultCenter,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        title: 'Ubicación seleccionada',
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C10.48 0 6 4.48 6 10C6 17.08 16 40 16 40C16 40 26 17.08 26 10C26 4.48 21.52 0 16 0Z" fill="#3b82f6"/>
              <circle cx="16" cy="10" r="5" fill="white"/>
              <circle cx="16" cy="10" r="3" fill="#3b82f6"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 40),
          anchor: new window.google.maps.Point(16, 40)
        }
      });

      // Evento al arrastrar el marcador
      newMarker.addListener('dragend', () => {
        const position = newMarker.getPosition();
        updateLocationFromPosition(position, newMap);
      });

      // Evento al hacer clic en el mapa
      newMap.addListener('click', (event: any) => {
        newMarker.setPosition(event.latLng);
        updateLocationFromPosition(event.latLng, newMap);
      });

      // Listener para cambios en el tipo de mapa
      newMap.addListener('maptypeid_changed', () => {
        setCurrentMapType(newMap.getMapTypeId());
      });

      setMap(newMap);
      setMarker(newMarker);
      setIsLoading(false);

      // Si hay una ubicación actual, intentar geocodificarla
      if (currentLocation) {
        setTimeout(() => {
          geocodeAddress(currentLocation, newMap, newMarker);
        }, 500);
      }
    } catch (error) {
      setMapError('Error al inicializar el mapa: ' + error);
      setIsLoading(false);
    }
  };

  const geocodeAddress = (address: string, mapInstance: any, markerInstance: any) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        mapInstance.setCenter(location);
        markerInstance.setPosition(location);
        updateLocationFromPosition(location, mapInstance);
      }
    });
  };

  const updateLocationFromPosition = async (position: any, mapInstance: any) => {
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ location: position }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        const location: Location = {
          address,
          lat: position.lat(),
          lng: position.lng()
        };
        setSelectedLocation(location);
        mapInstance.setCenter(position);
      }
    });
  };

  const handlePlaceSelect = (place: any) => {
    if (!place.geometry || !map || !marker) return;

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    marker.setPosition(place.geometry.location);
    
    const location: Location = {
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    
    setSelectedLocation(location);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no es soportada por este navegador');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (map && marker) {
          map.setCenter(pos);
          marker.setPosition(pos);
          updateLocationFromPosition(pos, map);
        }
        setIsLoading(false);
      },
      () => {
        alert('Error al obtener la ubicación actual');
        setIsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedLocation(null);
    setIsOpen(false);
  };

  const getMapTypeButtonVariant = (mapType: MapType) => {
    return currentMapType === mapType ? "default" : "outline";
  };

  const getMapTypeIcon = (mapType: MapType) => {
    switch (mapType) {
      case 'satellite': return <Satellite className="h-4 w-4" />;
      case 'hybrid': return <Layers className="h-4 w-4" />;
      case 'terrain': return <Map className="h-4 w-4" />;
      default: return <Map className="h-4 w-4" />;
    }
  };

  const getMapTypeLabel = (mapType: MapType) => {
    switch (mapType) {
      case 'roadmap': return 'Mapa';
      case 'satellite': return 'Satélite';
      case 'hybrid': return 'Híbrido';
      case 'terrain': return 'Terreno';
      default: return 'Mapa';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className={cn("justify-start gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800", className)}
        >
          <MapPin className="h-4 w-4" />
          {currentLocation || buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent 
        className="max-w-4xl h-[85vh] flex flex-col bg-gradient-to-br from-blue-50/80 to-indigo-100/80 backdrop-blur-sm border border-blue-200/50 shadow-2xl rounded-2xl"
      >
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-blue-200/30">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🗺️ Seleccionar Ubicación en el Mapa
          </DialogTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={reloadMap}
              className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-100"
              disabled={isLoading}
            >
              <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Recargar
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4">
          {/* Barra de búsqueda */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
              <Input
                ref={searchInputRef}
                placeholder="Buscar dirección, lugar o punto de interés..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-blue-200 focus:border-blue-500 bg-white/80"
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleUseCurrentLocation}
              className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-100"
              disabled={isLoading}
            >
              <Navigation className="h-4 w-4" />
              Mi ubicación
            </Button>
          </div>

          {/* Controles de tipo de mapa */}
          <div className="flex gap-2 flex-wrap">
            {(['roadmap', 'satellite', 'hybrid', 'terrain'] as MapType[]).map((mapType) => (
              <Button
                key={mapType}
                variant={getMapTypeButtonVariant(mapType)}
                size="sm"
                onClick={() => changeMapType(mapType)}
                className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-100 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
              >
                {getMapTypeIcon(mapType)}
                {getMapTypeLabel(mapType)}
              </Button>
            ))}
            <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-800 border-blue-200">
              Vista: {getMapTypeLabel(currentMapType)}
            </Badge>
          </div>

          {/* Mapa */}
          <div className="flex-1 relative rounded-xl overflow-hidden border-2 border-blue-200/50 bg-white">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-50/50 z-10">
                <div className="flex flex-col items-center gap-3">
                  <RotateCw className="h-8 w-8 text-blue-600 animate-spin" />
                  <p className="text-blue-700 font-medium">Cargando mapa...</p>
                </div>
              </div>
            )}
            
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50/80 z-10">
                <div className="text-center p-6">
                  <p className="text-red-600 font-medium mb-2">Error al cargar el mapa</p>
                  <p className="text-red-500 text-sm mb-4">{mapError}</p>
                  <Button 
                    onClick={reloadMap}
                    className="gap-2 bg-red-600 hover:bg-red-700"
                  >
                    <RotateCw className="h-4 w-4" />
                    Reintentar
                  </Button>
                </div>
              </div>
            )}
            
            <div ref={mapRef} className="w-full h-full" />
            
            {/* Instrucciones overlay */}
            {showInstructions && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-200 max-w-xs z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Instrucciones
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInstructions(false)}
                    className="h-6 w-6 p-0 text-blue-400 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• 🖱️ Haz clic en el mapa para colocar un marcador</p>
                  <p>• 🔍 Busca una dirección en la barra superior</p>
                  <p>• 📍 Arrastra el marcador para ajustar la posición</p>
                  <p>• 🛰️ Cambia la vista con los botones de tipo de mapa</p>
                  <p>• 🧭 Usa "Mi ubicación" para centrar en tu posición</p>
                </div>
              </div>
            )}

            {/* Botón para mostrar instrucciones nuevamente */}
            {!showInstructions && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInstructions(true)}
                className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50 z-10"
              >
                <Layers className="h-4 w-4 mr-2" />
                Mostrar instrucciones
              </Button>
            )}
          </div>

          {/* Información de ubicación seleccionada */}
          {selectedLocation && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <Label className="text-green-800 font-semibold">Ubicación seleccionada:</Label>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  ✓ Lista
                </Badge>
              </div>
              <p className="text-sm text-green-700 font-medium">{selectedLocation.address}</p>
              <p className="text-xs text-green-600 mt-1">
                📍 Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex justify-between items-center pt-4 border-t border-blue-200/30">
          <div className="text-sm text-blue-600">
            {selectedLocation ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Ubicación seleccionada correctamente
              </span>
            ) : (
              <span>👆 Selecciona una ubicación en el mapa</span>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedLocation || isLoading}
              className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
            >
              <MapPin className="h-4 w-4" />
              Confirmar Ubicación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};