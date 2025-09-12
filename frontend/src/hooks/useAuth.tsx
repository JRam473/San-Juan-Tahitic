import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '../lib/axios';

// Interfaces basadas en lo que realmente devuelve tu backend
interface User {
  id: string;
  email: string;
  username?: string;
  is_verified: boolean;
  avatar_url?: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

// Interfaces REALES basadas en lo que tu backend devuelve
interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

interface ProfileResponse {
  user: User;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => void;
  signInWithGoogle: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ CORREGIDO: Función para cargar usuario desde token
  const loadUserFromToken = useCallback(async (token: string): Promise<void> => {
    try {
      const userResponse = await api.get<ProfileResponse>('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // ✅ CORRECCIÓN: Acceder directamente según la interfaz ProfileResponse
      setUser(userResponse.data.user);
      
      try {
        const profileResponse = await api.get<{ profile: Profile }>('/api/profiles/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileResponse.data.profile);
      } catch {
        console.log('Perfil no encontrado');
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
      localStorage.removeItem('token');
    }
  }, []);

  // ✅ CORRECCIÓN: Función para verificar autenticación
  const checkAuth = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (token) {
      await loadUserFromToken(token);
    }
    setLoading(false);
  }, [loadUserFromToken]);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ CORRECCIÓN: Función signIn con estructura consistente
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log('🔄 Intentando login con:', { email });
      
      const response = await api.post<LoginResponse>('/api/auth/login', { 
        email, 
        password 
      });
      
      console.log('✅ Respuesta del backend:', response.data);
      
      // ✅ CORRECCIÓN: Acceder directamente según LoginResponse
      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        throw new Error('Estructura de respuesta inválida del servidor');
      }
      
      localStorage.setItem('token', token);
      setUser(userData);
      
      try {
        const profileResponse = await api.get<{ profile: Profile }>('/api/profiles/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileResponse.data.profile);
      } catch {
        console.log('Perfil no encontrado');
      }
    } catch (error: unknown) {
      console.error('❌ Error completo en login:', error);
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        throw new Error(axiosError.response?.data?.message || 'Error al iniciar sesión');
      }
      throw new Error('Error al iniciar sesión');
    }
  };

  // ✅ CORRECCIÓN: Función signUp con estructura consistente
  const signUp = async (email: string, password: string, username?: string): Promise<void> => {
    try {
      console.log('📤 Enviando registro:', { email, username });
      
      const response = await api.post<RegisterResponse>('/api/auth/register', { 
        email, 
        password, 
        username 
      });
      
      console.log('✅ Respuesta de registro:', response.data);
      
      // ✅ CORRECCIÓN: Acceder directamente según RegisterResponse
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      
    } catch (error: unknown) {
      console.error('❌ Error completo en registro:', error);
      
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            data?: { message?: string }; 
            status?: number 
          } 
        };
        
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        } else if (axiosError.response?.status === 400) {
          throw new Error('Datos de registro inválidos');
        } else if (axiosError.response?.status === 409) {
          throw new Error('El usuario ya existe');
        }
      }
      
      throw new Error('Error al registrarse');
    }
  };

  const signOut = (): void => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  const signInWithGoogle = (): void => {
    const googleAuthUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/google`;
    console.log('Redirecting to Google OAuth:', googleAuthUrl);
    window.location.href = googleAuthUrl;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signOut, 
      signInWithGoogle,
      signIn,
      signUp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};