// Importar la biblioteca Axios
import axios from 'axios';

// Configurar la URL base según el entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Crear una instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Para enviar cookies si usas JWT en cookies
});

// Interceptor para agregar el token automáticamente
// Agregar logs a los interceptores
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔐 AXIOS - Token en request:', token ? 'Presente' : 'Ausente');
    
    if (token) {
      config.headers = config.headers || {}; // aseguramos que exista
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ AXIOS - Header Authorization agregado');
    }
    return config;
  },
  (error) => {
    console.error('❌ AXIOS - Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ AXIOS - Respuesta exitosa:', {
      url: response.config.url,
      status: response.status
    });
    return response;
  },
  (error) => {
    console.error('❌ AXIOS - Error en respuesta:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.log('🚨 AXIOS - Token inválido, redirigiendo a login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Exportar la instancia de Axios
export default api;
