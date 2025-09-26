// components/admin/AdminPlaces.tsx - VERSIÓN CORREGIDA
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminPlaces, type Place } from '@/hooks/useAdminPlaces';
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical, 
  MapPin, 
  Search, 
  FileText,
  RefreshCw,
  Star,
  Filter,
  BarChart3,
  Upload,
  X
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MapLocationSelector } from '@/components/admin/MapLocationSelector';

// Función para construir la URL completa de la imagen
const buildImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '/placeholder.svg';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  
  return `${backendUrl}${normalizedPath}`;
};

// Función helper para manejar números de forma segura
const safeToFixed = (value: unknown, decimals: number): string => {
  if (value === null || value === undefined) {
    return '0.0';
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    return '0.0';
  }
  
  return num.toFixed(decimals);
};

// Componente de Rating Estilizado (similar al de Places)
const AdminRating = ({ rating, totalRatings }: { rating: number | null; totalRatings?: number }) => {
  const numericRating = rating || 0;
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-3 h-3"
          fill={star <= numericRating ? "#f59e0b" : "none"}
          color={star <= numericRating ? "#f59e0b" : "#d1d5db"}
        />
      ))}
      <span className="text-sm font-medium ml-1">{safeToFixed(rating, 1)}</span>
      {totalRatings && totalRatings > 0 && (
        <span className="text-xs text-muted-foreground">({totalRatings})</span>
      )}
    </div>
  );
};

// Componente de Card Mejorada para Lugares
const PlaceCard = ({ 
  place, 
  onEdit, 
  onDelete 
}: { 
  place: Place;
  onEdit: (place: Place) => void;
  onDelete: (place: Place) => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getCategoryColor = (category: string | null) => {
    if (!category) return 'bg-gray-500';

    const categoryLower = category.toLowerCase();

    if (categoryLower.includes('naturaleza') || categoryLower.includes('nature')) 
      return 'bg-green-600';
    if (categoryLower.includes('cultura') || categoryLower.includes('culture')) 
      return 'bg-yellow-500';
    if (categoryLower.includes('cascada') || categoryLower.includes('waterfall')) 
      return 'bg-sky-500';
    if (categoryLower.includes('historia') || categoryLower.includes('history')) 
      return 'bg-purple-600';
    if (categoryLower.includes('puente') || categoryLower.includes('bridge')) 
      return 'bg-red-600';
    if (categoryLower.includes('mirador') || categoryLower.includes('viewpoint')) 
      return 'bg-rose-500';
    if (categoryLower.includes('ruta') || categoryLower.includes('trail') || categoryLower.includes('path')) 
      return 'bg-emerald-500';
    if (categoryLower.includes('montaña') || categoryLower.includes('mountain')) 
      return 'bg-indigo-700';
    if (categoryLower.includes('rio') || categoryLower.includes('río') || categoryLower.includes('river')) 
      return 'bg-cyan-600';
    return 'bg-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
        <div className="relative h-48 overflow-hidden">
          {place.image_url ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
              )}
              <img
                src={buildImageUrl(place.image_url)}
                alt={place.name || 'Lugar turístico'}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-blue-400" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
          <div className="absolute top-3 left-3">
            <Badge className={cn(getCategoryColor(place.category), "text-white border-0 shadow-md")}>
              {place.category || 'Turismo'}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {safeToFixed(place.average_rating, 1)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-gray-900">
                {place.name}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(place)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(place)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">{place.location || 'Ubicación no especificada'}</span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {place.description || 'Sin descripción disponible'}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  {place.total_ratings || 0} calificaciones
                </div>
                {place.pdf_url && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    PDF
                  </div>
                )}
              </div>
              
              <AdminRating 
                rating={place.average_rating} 
                totalRatings={place.total_ratings} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface PlaceFormData {
  name: string;
  description?: string;
  image_url?: string;
  pdf_url?: string;
  location?: string;
  category?: string;
}

interface FileState {
  image: File | null;
  pdf: File | null;
}

const CATEGORIES = [
  'Naturaleza',
  'Cultura',
  'Cascada',
  'Mirador',
  'Puente',
  'Playa',
  'Historia',
  'Gastronomía',
  'Aventura',
  'Religioso',
  'Arquitectura'
];

export const AdminPlaces = () => {
  const {
    places,
    loading,
    error,
    createPlace,
    updatePlace,
    deletePlace,
    refetch,
    clearError
  } = useAdminPlaces();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [formData, setFormData] = useState<PlaceFormData>({
    name: '',
    description: '',
    category: undefined,
    location: '',
    image_url: '',
    pdf_url: ''
  });
  const [files, setFiles] = useState<FileState>({
    image: null,
    pdf: null
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Filtrar lugares
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      location: '',
      image_url: '',
      pdf_url: ''
    });
    setFiles({
      image: null,
      pdf: null
    });
    setFormErrors({});
    setEditingPlace(null);
  };

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      location: location.address
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'El nombre es requerido';
    }

    if (!formData.description?.trim()) {
      errors.description = 'La descripción es requerida';
    }

    if (!formData.category) {
      errors.category = 'La categoría es requerida';
    }

    if (!formData.location?.trim()) {
      errors.location = 'La ubicación es requerida';
    }

    // Para crear nuevo lugar, la imagen es requerida
    if (!editingPlace && !files.image) {
      errors.image = 'La imagen es requerida para crear un nuevo lugar';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Preparar datos del lugar
      const placeData: PlaceFormData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        location: formData.location,
      };

      // Para una implementación real, aquí subirías los archivos
      // Por ahora, usamos nombres temporales para la demo
      if (files.image) {
        placeData.image_url = `/uploads/${files.image.name}`;
      } else if (editingPlace?.image_url) {
        placeData.image_url = editingPlace.image_url;
      }

      if (files.pdf) {
        placeData.pdf_url = `/uploads/${files.pdf.name}`;
      } else if (editingPlace?.pdf_url) {
        placeData.pdf_url = editingPlace.pdf_url;
      }

      console.log('📤 Enviando datos del lugar:', placeData);

      if (editingPlace) {
        await updatePlace(editingPlace.id, placeData);
      } else {
        await createPlace(placeData);
      }

      setIsDialogOpen(false);
      resetForm();
      await refetch();
    } catch (err) {
      console.error('Error al guardar el lugar:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (place: Place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name || '',
      description: place.description || '',
      category: place.category || '',
      location: place.location || '',
      image_url: place.image_url || '',
      pdf_url: place.pdf_url || ''
    });
    setFiles({
      image: null,
      pdf: null
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!editingPlace) return;

    try {
      await deletePlace(editingPlace.id);
      setIsDeleteDialogOpen(false);
      resetForm();
      await refetch();
    } catch (err) {
      console.error('Error al eliminar el lugar:', err);
    }
  };

  const openDeleteDialog = (place: Place) => {
    setEditingPlace(place);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
      clearError();
    }
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleFileChange = (type: 'image' | 'pdf', file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [type]: file
    }));
    
    // Limpiar error del archivo cuando se selecciona uno
    if (file) {
      setFormErrors(prev => ({
        ...prev,
        [type]: ''
      }));
    }
  };

  const removeFile = (type: 'image' | 'pdf') => {
    setFiles(prev => ({
      ...prev,
      [type]: null
    }));
  };

  // Esqueletos de carga
  if (loading && places.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Administrar Lugares
          </h1>
          <p className="text-lg text-blue-700/80">
            Gestiona los lugares turísticos de San Juan Tahitic
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{places.length} lugares registrados</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>Promedio: {safeToFixed(places.reduce((acc, p) => acc + (p.average_rating || 0), 0) / (places.length || 1), 1)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={loading}
            className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg">
                <Plus className="h-4 w-4" />
                Nuevo Lugar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-900/95 backdrop-blur-sm border border-slate-700 shadow-xl text-white">
              <DialogHeader className="pb-0">
                <DialogTitle>
                  {editingPlace ? 'Editar Lugar' : 'Crear Nuevo Lugar'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del lugar *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Mirador de la Sierra"
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                       <SelectContent className='max-h-60 overflow-y-auto bg-white/30 backdrop-blur-sm border border-white/20 p-2 text-gray-900 dark:text-gray-100 dark:bg-black/30 dark:border-gray-700 shadow-lg rounded-md'>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    {formErrors.category && (
                      <p className="text-sm text-red-600">{formErrors.category}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ej: Centro de San Juan Tahitic"
                      className="flex-1"
                    />
                    <MapLocationSelector
                      onLocationSelect={handleLocationSelect}
                      currentLocation={formData.location}
                      buttonText="Mapa"
                      className="w-auto px-4"
                    />
                  </div>
                  {formErrors.location && (
                    <p className="text-sm text-red-600">{formErrors.location}</p>
                  )}
                </div>

                {/*SECCIÓN DE ARCHIVOS CORREGIDA - Reemplaza esta parte en tu código */}
                                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Input de Imagen CON useRef */}
                  <div className="space-y-2">
                    <Label htmlFor="image_file">
                      Imagen {!editingPlace && '*'}
                    </Label>
                    <div className="space-y-2">
                      {files.image ? (
                        <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                          <div className="flex items-center gap-2">
                            <img 
                              src={URL.createObjectURL(files.image)} 
                              alt="Vista previa" 
                              className="w-10 h-10 object-cover rounded"
                            />
                            <span className="text-sm truncate">{files.image.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('image')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : editingPlace?.image_url ? (
                        <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                          <div className="flex items-center gap-2">
                            <img 
                              src={buildImageUrl(editingPlace.image_url)} 
                              alt="Imagen actual" 
                              className="w-10 h-10 object-cover rounded"
                            />
                            <span className="text-sm text-muted-foreground">Imagen actual</span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => imageInputRef.current?.click()}
                            >
                              Cambiar
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile('image')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => imageInputRef.current?.click()}
                        >
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Haz clic para seleccionar una imagen
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            Seleccionar Imagen
                          </Button>
                        </div>
                      )}
                      
                      <Input
                        ref={imageInputRef}
                        id="image_file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('image', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      
                      {formErrors.image && (
                        <p className="text-sm text-red-600">{formErrors.image}</p>
                      )}
                    </div>
                  </div>

                  {/* Input de PDF CON useRef */}
                  <div className="space-y-2">
                    <Label htmlFor="pdf_file">Documento PDF</Label>
                    <div className="space-y-2">
                      {files.pdf ? (
                        <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                          <div className="flex items-center gap-2">
                            <FileText className="h-10 w-10 text-blue-500" />
                            <span className="text-sm truncate">{files.pdf.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('pdf')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : editingPlace?.pdf_url ? (
                        <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                          <div className="flex items-center gap-2">
                            <FileText className="h-10 w-10 text-green-500" />
                            <span className="text-sm text-muted-foreground">PDF actual</span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => pdfInputRef.current?.click()}
                            >
                              Cambiar
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile('pdf')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => pdfInputRef.current?.click()}
                        >
                          <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Haz clic para seleccionar un PDF
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            Seleccionar PDF
                          </Button>
                        </div>
                      )}
                      
                      <Input
                        ref={pdfInputRef}
                        id="pdf_file"
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange('pdf', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el lugar, sus características y atractivos..."
                    rows={4}
                  />
                  {formErrors.description && (
                    <p className="text-sm text-red-600">{formErrors.description}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    className='border border-red/20 bg-red-800 text-white/80 hover:bg-white/10'
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg'
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {editingPlace ? 'Actualizar Lugar' : 'Crear Lugar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Filtros y Controles Mejorados */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
              <Input
                placeholder="Buscar lugares por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-blue-200 focus:border-blue-500"
              />
            </div>
            
            {/* Filtro por categoría */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-blue-200 focus:border-blue-500">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-500" />
                  <SelectValue placeholder="Todas las categorías" />
                </div>
              </SelectTrigger>
              <SelectContent 
                position="popper"
                sideOffset={5}
                avoidCollisions={false}
                className="z-[100] max-h-60 overflow-y-auto bg-white/30 backdrop-blur-sm border border-white/20 p-2 text-gray-900 dark:text-gray-100 dark:bg-black/30 dark:border-gray-700 shadow-lg rounded-md"
              >
                <SelectItem value="all">Todas las categorías</SelectItem>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Toggle de vista */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="flex-1 gap-2 border-blue-200"
              >
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                onClick={() => setViewMode('table')}
                className="flex-1 gap-2 border-blue-200"
              >
                <div className="flex flex-col gap-1 w-4 h-4">
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                </div>
                Tabla
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensaje de error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert variant="destructive" className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="flex justify-between items-center">
              <span className="text-red-800">{error}</span>
              <Button variant="ghost" size="sm" onClick={clearError} className="text-red-800 hover:bg-red-100">
                ×
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Contenido Principal */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onEdit={handleEdit}
                onDelete={openDeleteDialog}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-blue-900">Lugares ({filteredPlaces.length})</CardTitle>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-blue-50/50">
                    <TableRow>
                      <TableHead className="text-blue-900 font-semibold">Lugar</TableHead>
                      <TableHead className="text-blue-900 font-semibold">Categoría</TableHead>
                      <TableHead className="text-blue-900 font-semibold">Ubicación</TableHead>
                      <TableHead className="text-blue-900 font-semibold">Calificación</TableHead>
                      <TableHead className="text-blue-900 font-semibold text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlaces.map((place) => (
                      <TableRow key={place.id} className="hover:bg-blue-50/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                              {place.image_url ? (
                                <img
                                  src={buildImageUrl(place.image_url)}
                                  alt={place.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <MapPin className="h-5 w-5 text-blue-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{place.name}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {place.description || 'Sin descripción'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                            {place.category || 'Sin categoría'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3 w-3 text-blue-500" />
                            {place.location || 'No especificada'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <AdminRating 
                            rating={place.average_rating} 
                            totalRatings={place.total_ratings} 
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(place)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(place)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredPlaces.length === 0 && !loading && (
                  <div className="text-center py-12 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No se encontraron lugares</p>
                    <p className="text-sm">
                      {places.length === 0 
                        ? 'Comienza agregando tu primer lugar turístico' 
                        : 'Intenta ajustar los filtros de búsqueda'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">¿Eliminar lugar?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Esta acción no se puede deshacer. El lugar "{editingPlace?.name}" será eliminado permanentemente 
              junto con todas sus calificaciones y datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};