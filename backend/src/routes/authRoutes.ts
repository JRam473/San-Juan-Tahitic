import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { generateToken } from '../utils/jwt';
import { pool } from '../utils/db'; // <-- importa tu conexión a PostgreSQL

const router = express.Router();

// Rutas básicas
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

// Rutas de Google OAuth
router.get(
  '/google',
  (req: Request, res: Response, next: NextFunction) => {
    console.log('🔐 Iniciando autenticación Google...');
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false, // No usar sesiones si usas JWT
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req: Request, res: Response) => {
    try {
      console.log('✅ Google OAuth exitoso para usuario:', req.user);

      // Generar token JWT
      const user = req.user as any;
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      // Redirigir al frontend con el token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(
        `${frontendUrl}/oauth-callback?token=${token}&user=${encodeURIComponent(
          JSON.stringify(user)
        )}`
      );
    } catch (error) {
      console.error('❌ Error en Google callback:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
  }
);

// Verificar si un email ya está registrado
router.get('/check-email/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    res.json({
      success: true,
      data: {
        exists: result.rows.length > 0,
        available: result.rows.length === 0,
      },
    });
  } catch (error) {
    console.error('Error verificando email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar email',
    });
  }
});

export default router;
