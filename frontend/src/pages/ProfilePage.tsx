import { useAuth } from '@/hooks/useAuth';

export const ProfilePage = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-20">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Mi Perfil</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
          
          <div className="space-y-3">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Usuario:</strong> {user?.username || 'No especificado'}</p>
            <p><strong>Verificado:</strong> {user?.is_verified ? 'Sí' : 'No'}</p>
            
            {profile && (
              <>
                <p><strong>Nombre completo:</strong> {profile.full_name || 'No especificado'}</p>
                <p><strong>Biografía:</strong> {profile.bio || 'No especificada'}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};