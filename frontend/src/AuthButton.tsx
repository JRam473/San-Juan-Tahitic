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
import { Link } from 'react-router-dom';

export const AuthButton = () => {
  const { user, profile, signOut, signInWithGoogle, loading } = useAuth();

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
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile">Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">Configuración</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={signOut}
            className="text-red-600 focus:text-red-600"
          >
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={signInWithGoogle}
      className="ml-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
    >
      Iniciar Sesión
    </Button>
  );
};