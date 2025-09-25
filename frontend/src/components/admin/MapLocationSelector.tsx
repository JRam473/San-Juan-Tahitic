// components/admin/MapLocationSelector.tsx
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Navigation, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cargar Google Maps API
  useEffect(() => {
    if (!window.google && isOpen) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else if (isOpen) {
      initializeMap();
    }

    return () => {
      // Cleanup
      if (map) {
        window.google.maps.event.clearInstanceListeners(map);
      }
    };
  }, [isOpen]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Coordenadas por defecto (San Juan Tahitic)
    const defaultCenter = { lat: 19.939088388469845, lng: -97.55492145455479 };

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 15,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#616161' }]
        },
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Configurar autocompletado
    if (searchInputRef.current) {
      const newAutocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current);
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
      title: 'Ubicación seleccionada'
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

    setMap(newMap);
    setMarker(newMarker);

    // Si hay una ubicación actual, intentar geocodificarla
    if (currentLocation) {
      geocodeAddress(currentLocation, newMap, newMarker);
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
      },
      () => {
        alert('Error al obtener la ubicación actual');
      }
    );
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedLocation(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className={cn("justify-start gap-2", className)}
        >
          <MapPin className="h-4 w-4" />
          {currentLocation || buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col   bg-white/30 backdrop-blur-sm border border-white/20 p-2 text-gray-900 dark:text-gray-100 dark:bg-black/30 dark:border-gray-700 shadow-lg rounded-md">
        <DialogHeader>
          <DialogTitle>Seleccionar Ubicación en el Mapa</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4">
          {/* Barra de búsqueda */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Buscar dirección o lugar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleUseCurrentLocation}
              className="gap-2"
            >
              <Navigation className="h-4 w-4" />
              Mi ubicación
            </Button>
          </div>

          {/* Mapa */}
          <div className="flex-1 relative rounded-lg overflow-hidden border">
            <div ref={mapRef} className="w-full h-full" />
            
            {/* Instrucciones overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm">
              <p className="text-sm font-medium">💡 Haz clic en el mapa o busca una dirección</p>
              <p className="text-xs text-muted-foreground">Puedes arrastrar el marcador para ajustar la posición</p>
            </div>
          </div>

          {/* Información de ubicación seleccionada */}
          {selectedLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <Label className="text-green-800 font-medium">Ubicación seleccionada:</Label>
              </div>
              <p className="text-sm text-green-700">{selectedLocation.address}</p>
              <p className="text-xs text-green-600 mt-1">
                Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            Confirmar Ubicación
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};