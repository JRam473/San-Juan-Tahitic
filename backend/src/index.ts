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
import reactionRoutes from './routes/reactionRoutes';
import ratingRoutes from './routes/ratingRoutes';
import { configureGoogleOAuth, checkGoogleConfig } from './utils/oauth';

dotenv.config();

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
// Configurar Passport y OAuth
app.use(passport.initialize());
configureGoogleOAuth();

checkGoogleConfig();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/ratings', ratingRoutes);

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  });
}).catch((error) => {
  console.error('Error al conectar con la base de datos:', error);
  process.exit(1);
});

export default app;