// components/AuthButton.tsx
import { useAuth } from './hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, User, Shield, MapPin } from 'lucide-react'; // 👈 Agregar MapPin
import { Badge } from '@/components/ui/badge'; // 👈 Asegurar que Badge esté importado


export const AuthButton = () => {
  const { user, profile, signOut, signInWithGoogle, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="ml-4 px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg animate-pulse">
        Cargando...
      </div>
    );
  }

  if (user) {
    const displayName = profile?.full_name || 
                       user.username || 
                       user.email.split('@')[0];
    
    const avatarUrl = profile?.avatar_url || user.avatar_url;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="ml-4 flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Avatar className="h-8 w-8 border-2 border-white/20">
              <AvatarImage src={avatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-white/20">
                {displayName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium hidden md:block">{displayName}</span>
            {isAdmin && (
              <Shield className="h-3 w-3 text-yellow-400" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white/30 backdrop-blur-sm border border-white/20 p-2 text-gray-900 dark:text-gray-100 dark:bg-black/30 dark:border-gray-700 shadow-lg rounded-md"
        >
          <DropdownMenuLabel className="flex items-center gap-2">
            Mi Cuenta
            {isAdmin && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                Admin
              </Badge>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </Link>
          </DropdownMenuItem>

          {/* 👇 ITEM DE ADMINISTRACIÓN - Solo visible para admin */}
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/Places" className="flex items-center gap-2 text-blue-600 font-medium">
                  <MapPin className="h-4 w-4" /> {/* 👈 Cambié Shield por MapPin */}
                  Panel de Lugares
                </Link>
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => {
              signOut();
              navigate('/');
            }}
            className="flex items-center gap-2 text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={() => navigate('/login')}
      className="ml-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
    >
      Iniciar Sesión
    </Button>
  );
};