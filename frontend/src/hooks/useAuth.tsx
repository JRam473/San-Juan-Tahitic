import { createContext, useContext, useEffect, useState } from 'react';
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

// Respuesta REAL de tu backend (según lo que vimos con curl)
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
  profile: Profile;
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

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  // En tu useAuth.ts, agrega esta función para cargar el usuario desde el token
const loadUserFromToken = async (token: string) => {
  try {
    const userResponse = await api.get<{ user: User }>('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(userResponse.data.user);
    
    // Intentar obtener el perfil
    try {
      const profileResponse = await api.get<ProfileResponse>('/api/profiles/me', {
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
};

// Y modifica checkAuth para usar esta función
const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    await loadUserFromToken(token);
  }
  setLoading(false);
};

  const signIn = async (email: string, password: string) => {
    try {

      console.log('🔄 Intentando login con:', { email });
    
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    console.log('✅ Respuesta del backend:', response.data);
    
    const { token, user: userData } = response.data;
    console.log('📦 Token recibido:', token ? '✅' : '❌');
    console.log('📦 User data:', userData);
    
    localStorage.setItem('token', token);
    setUser(userData);
      // Obtener perfil después de login
      try {
        const profileResponse = await api.get<ProfileResponse>('/profiles/me');
        setProfile(profileResponse.data.profile);
      } catch {
        console.log('Perfil no encontrado');
      }
    } catch (error: any) {
      console.error('Error completo en login:', error);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      // 🔥 CORRECCIÓN: El backend devuelve { message, token, user } directamente
      const response = await api.post<RegisterResponse>('/auth/register', { 
        email, 
        password, 
        username 
      });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
    } catch (error: any) {
      console.error('Error completo en registro:', error);
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  const signInWithGoogle = () => {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};