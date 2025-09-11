import express from 'express';
import passport from 'passport';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { generateToken } from '../utils/jwt';

const router = express.Router();

// Rutas básicas
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

// Rutas de Google OAuth
router.get('/google', (req, res, next) => {
  console.log('🔐 Iniciando autenticación Google...');
  next();
}, passport.authenticate('google', { 
  scope: ['profile', 'email'],
  session: false // No usar sesiones si usas JWT
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }), 
  (req, res) => {
    try {
      console.log('✅ Google OAuth exitoso para usuario:', req.user);
      
      // Generar token JWT
      const user = req.user as any;
      const token = generateToken({ 
        userId: user.id, 
        email: user.email 
      });

      // Redirigir al frontend con el token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
      
    } catch (error) {
      console.error('❌ Error en Google callback:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
  }
);

// Ruta para verificar configuración
router.get('/config', (req, res) => {
  const config = {
    google_configured: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    google_client_id: process.env.GOOGLE_CLIENT_ID ? '✅ Configurado' : '❌ Faltante',
    google_callback: process.env.GOOGLE_CALLBACK_URL,
    frontend_url: process.env.FRONTEND_URL
  };
  
  res.json(config);
});

export default router;