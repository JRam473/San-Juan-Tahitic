// src/pages/OAuthCallback.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const userParam = searchParams.get('user');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (token && userParam) {
        try {
          // Guardar el token en localStorage
          localStorage.setItem('token', token);
          
          // Parsear los datos del usuario
          const userData = JSON.parse(decodeURIComponent(userParam));
          
          // Guardar usuario en contexto/estado global (si es necesario)
          console.log('✅ Usuario autenticado:', userData);
          
          // Redirigir al home después de 1 segundo (opcional)
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1000);
          
        } catch (error) {
          console.error('❌ Error procesando OAuth callback:', error);
          navigate('/login', { 
            replace: true,
            state: { error: 'Error en autenticación' }
          });
        }
      } else {
        // Si faltan parámetros, redirigir al login
        navigate('/login', { 
          replace: true,
          state: { error: 'Datos de autenticación incompletos' }
        });
      }
    };

    handleOAuthCallback();
  }, [token, userParam, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Completando autenticación</h2>
        <p className="text-gray-600 mt-2">Serás redirigido automáticamente...</p>
      </div>
    </div>
  );
};