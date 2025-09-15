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
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
    if (token) {
      // Asegurar que headers exista
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`; // Agregar el token al encabezado de autorización
    }
    return config; // Retornar la configuración modificada
  },
  (error) => {
    return Promise.reject(error); // Rechazar la promesa en caso de error
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response, // Retornar la respuesta si es exitosa
  (error) => {
    if (error.response?.status === 401) { // Si el estado es 401 (no autorizado)
      localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
      window.location.href = '/login'; // Redirigir al usuario a la página de inicio de sesión
    }
    return Promise.reject(error); // Rechazar la promesa en caso de error
  }
);

// Exportar la instancia de Axios
export default api;
