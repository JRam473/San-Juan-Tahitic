import express from 'express';
import passport from 'passport';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { generateToken } from '../utils/jwt';
import { query } from '../utils/db'; // ✅ Importar query
import { Request, Response } from 'express'; // ✅ Importar Request y Response
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Rutas básicas
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

// Rutas de Google OAuth
router.get('/google', (req: Request, res: Response, next: express.NextFunction) => {
  console.log('🔐 Iniciando autenticación Google...');
  next();
}, passport.authenticate('google', { 
  scope: ['profile', 'email'],
  session: false
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }), 
  (req: Request, res: Response) => {
    try {
      console.log('✅ Google OAuth exitoso para usuario:', req.user);
      
      // Generar token JWT
      const user = req.user as any;
      const token = generateToken({ 
        userId: user.id, 
        email: user.email 
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
      
    } catch (error) {
      console.error('❌ Error en Google callback:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
  }
);

// ✅ Ruta para verificar email - CORREGIDA
router.get('/check-email/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    
    const result = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    res.json({
      success: true,
      data: {
        exists: result.rows.length > 0,
        available: result.rows.length === 0
      }
    });
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar email'
    });
  }
});

// ✅ Ruta para verificar token (opcional)
router.get('/verify', authenticateToken, (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Token válido',
    user: req.user // ✅ Ahora req.user está tipado
  });
});

router.get('/verify', authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Token válido',
    user: req.user
  });
});


export default router;