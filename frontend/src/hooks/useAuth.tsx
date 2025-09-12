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

// 🔥 CORRECCIÓN: Estructura REAL de respuesta del backend
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface LoginData {
  token: string;
  user: User;
}

interface RegisterData {
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
  signUp: (email: string, password: string, username?: string) => Promise<{ success: boolean; message: string }>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 CORRECCIÓN: Usar useCallback para evitar warning de useEffect
const loadUserFromToken = useCallback(async (token: string) => {
  try {
    const userResponse = await api.get<ApiResponse<{ user: User }>>('/api/auth/profile', { // 👈 Agregar /api
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setUser(userResponse.data.data.user);
    
    try {
      const profileResponse = await api.get<ApiResponse<ProfileResponse>>('/api/profiles/me', { // 👈 Agregar /api
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(profileResponse.data.data.profile);
    } catch {
      console.log('Perfil no encontrado');
    }
  } catch (error) {
    console.error('Error cargando usuario:', error);
    localStorage.removeItem('token');
  }
}, []);

  // 🔥 CORRECCIÓN: Usar useCallback
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await loadUserFromToken(token);
    }
    setLoading(false);
  }, [loadUserFromToken]);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // 🔥 AGREGAR checkAuth como dependencia

const signIn = async (email: string, password: string) => {
  try {
    console.log('🔄 Intentando login con:', { email });
    
    const response = await api.post<ApiResponse<LoginData>>('/api/auth/login', { // 👈 Agregar /api
      email, 
      password 
    });
    
    console.log('✅ Respuesta del backend:', response.data);
    
    const { token, user: userData } = response.data.data;
    
    localStorage.setItem('token', token);
    setUser(userData);
    
    try {
      const profileResponse = await api.get<ApiResponse<ProfileResponse>>('/api/profiles/me', { // 👈 Agregar /api
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(profileResponse.data.data.profile);
    } catch {
      console.log('Perfil no encontrado');
    }
  } catch (error: any) {
    console.error('❌ Error completo en login:', error);
    console.error('❌ Respuesta de error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

// En useAuth.ts
const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const response = await api.get<ApiResponse<{ exists: boolean; available: boolean }>>(
      `/api/auth/check-email/${encodeURIComponent(email)}`
    );
    return response.data.data.available;
  } catch (error) {
    console.error('Error verificando email:', error);
    return false;
  }
};

const signUp = async (email: string, password: string, username?: string) => {
  try {
    console.log('📤 Enviando registro:', { email, username });
    
    const response = await api.post<ApiResponse<RegisterData>>('/api/auth/register', { 
      email, 
      password, 
      username 
    });
    
    console.log('✅ Respuesta de registro:', response.data);
    
    const { token, user: userData } = response.data.data;
    
    localStorage.setItem('token', token);
    setUser(userData);
    
    return { success: true, message: 'Registro exitoso' };
    
  } catch (error: any) {
    console.error('❌ Error completo en registro:', error);
    
    // 🔥 MANEJO ESPECÍFICO DE ERRORES
    if (error.response?.data?.message) {
      // Error específico del backend
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 400) {
      // Error de validación
      throw new Error('Datos de registro inválidos');
    } else if (error.response?.status === 409) {
      // Conflicto (usuario ya existe)
      throw new Error('El usuario ya existe');
    } else {
      // Error genérico
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  }
};

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };
  // En useAuth.ts


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