import { useAuth } from './hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export const AuthButton = () => {
  const { user, profile, signOut, signInWithGoogle, loading } = useAuth();

  if (loading) {
    return (
      <div className="ml-4 px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg animate-pulse">
        Cargando...
      </div>
    );
  }

  if (user && profile) {
    const displayName =
      profile.full_name || profile.username || user.email.split('@')[0];
    const avatarUrl = profile.avatar_url;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="ml-4 flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Avatar className="h-6 w-6 border border-white/30">
              <AvatarImage src={avatarUrl || undefined} alt={displayName} />
              <AvatarFallback>
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{displayName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mt-2">
          <DropdownMenuItem onClick={signOut}>
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
