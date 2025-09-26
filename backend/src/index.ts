import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';

// Cargar variables de entorno PRIMERO, desde la raíz del proyecto
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug: Verificar que las variables se cargaron
console.log('🔍 Variables cargadas:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'UNDEFINED ❌');

import { connectDB } from './utils/db';
import errorHandler from './middleware/errorHandler';

// Importar rutas
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';
import placeRoutes from './routes/placeRoutes';
import photoRoutes from './routes/photoRoutes';
import commentRoutes from './routes/commentRoutes';
import ratingRoutes from './routes/ratingRoutes';
import { configureGoogleOAuth, checkGoogleConfig } from './utils/oauth';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir archivos estáticos
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Configurar Passport y OAuth
app.use(passport.initialize());
configureGoogleOAuth();
checkGoogleConfig();

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);

// ✅ CORREGIDO: Manejo de rutas no encontradas (usa '/*' en lugar de '*')
app.use('/', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.originalUrl} no existe`,
    availableEndpoints: [
      '/api/auth/*',
      '/api/users/*',
      '/api/profiles/*',
      '/api/places/*',
      '/api/photos/*',
      '/api/comments/*',
      '/api/ratings/*'
    ]
  });
});

// Manejo de errores (debe ser el último middleware)
app.use(errorHandler);

// Iniciar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    console.log(`Archivos estáticos disponibles en: http://localhost:${PORT}/uploads/`);
  });
}).catch((error) => {
  console.error('Error al conectar con la base de datos:', error);
  process.exit(1);
});

export default app;