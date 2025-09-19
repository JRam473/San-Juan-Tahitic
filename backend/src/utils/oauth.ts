// backend/src/utils/oauth.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { query } from './db';
import { generateToken } from './jwt';
import { Request } from 'express';

// Usa la interfaz Profile de passport-google-oauth20 en lugar de la personalizada
import { Profile } from 'passport-google-oauth20';

export const configureGoogleOAuth = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️ Google OAuth no configurado - faltan variables de entorno');
    return;
  }

  // Configuración de Google Strategy - CORREGIDO
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback',
    scope: ['profile', 'email'],
    passReqToCallback: true
  }, async (
    req: Request, 
    accessToken: string, 
    refreshToken: string, 
    params: any, // ✅ Parámetro params requerido
    profile: Profile, // ✅ Usar Profile de passport-google-oauth20
    done: (error: any, user?: any) => void
  ) => {
    try {
      console.log('🔐 Google OAuth profile received:', profile);

      // Buscar usuario por Google ID
      let userResult = await query(
        'SELECT * FROM users WHERE provider_id = $1 AND provider = $2',
        [profile.id, 'google']
      );

      let user = userResult.rows[0];

      // Si no existe, buscar por email
      if (!user && profile.emails && profile.emails[0]?.value) {
        const emailResult = await query(
          'SELECT * FROM users WHERE email = $1',
          [profile.emails[0].value]
        );
        user = emailResult.rows[0];

        // Si existe por email pero no por Google, actualizar
        if (user) {
          await query(
            'UPDATE users SET provider = $1, provider_id = $2 WHERE id = $3',
            ['google', profile.id, user.id]
          );
        }
      }

      // Si no existe, crear nuevo usuario
      if (!user) {
        const newUserResult = await query(
          `INSERT INTO users 
           (email, username, provider, provider_id, is_verified, avatar_url) 
           VALUES ($1, $2, $3, $4, $5, $6) 
           RETURNING *`,
          [
            profile.emails?.[0]?.value,
            profile.displayName,
            'google',
            profile.id,
            true, // Google verifica el email
            profile.photos?.[0]?.value
          ]
        );
        user = newUserResult.rows[0];
      }

      return done(null, user);

    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      return done(error as Error);
    }
  }));

  // Serialización simple para sesiones
  passport.serializeUser((user: any, done: (err: any, id?: string) => void) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
    try {
      const result = await query('SELECT id, email, username FROM users WHERE id = $1', [id]);
      done(null, result.rows[0]);
    } catch (error) {
      done(error as Error);
    }
  });
};

export const checkGoogleConfig = () => {
  const requiredVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn('⚠️ Google OAuth no configurado. Variables faltantes:', missingVars);
    return false;
  }

  console.log('✅ Google OAuth configurado correctamente');
  return true;
};