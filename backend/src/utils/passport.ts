import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { pool } from './db';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile: GoogleProfile, done) => {
    try {
      // Validación segura del email
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No se encontró el email del usuario'));
      }

      // Buscar usuario en la base de datos
      const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
      let user = result.rows[0];

      // Crear usuario si no existe
      if (!user) {
        const insert = await pool.query(
          'INSERT INTO users (email, provider, provider_id) VALUES ($1, $2, $3) RETURNING *',
          [email, 'google', profile.id]
        );
        user = insert.rows[0];
      }

      // Generar JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

      // Pasar usuario + token al callback
      done(null, { ...user, token });
    } catch (err) {
      done(err as Error, undefined);
    }
  }
));

// No usamos sesiones, pero passport necesita serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
