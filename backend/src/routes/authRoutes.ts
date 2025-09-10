import { Router } from 'express';
import passport from 'passport';
import { loginLocal, getMe } from '../controllers/userController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Login y registro local
router.post('/login', loginLocal);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // Generar JWT y redirigir al frontend
  const user = (req as any).user;
  res.redirect(`http://localhost:5173?token=${user.token}`);
});

// Ruta para obtener perfil del usuario
router.get('/me', authenticateJWT, getMe);

export default router;
