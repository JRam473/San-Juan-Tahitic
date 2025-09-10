import { Request, Response } from 'express';
import { pool } from '../utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// =====================
// REGISTRO LOCAL
// =====================
export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  // Verificar si el usuario ya existe
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (result.rows.length > 0) {
    return res.status(400).json({ message: 'Usuario ya registrado' });
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertar en la base de datos
  const insertResult = await pool.query(
    'INSERT INTO users (email, password, username, provider) VALUES ($1, $2, $3, $4) RETURNING *',
    [email, hashedPassword, username || null, 'local']
  );

  const user = insertResult.rows[0];

  // Generar JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

  res.status(201).json({ token, user });
};

// =====================
// LOGIN LOCAL
// =====================
export const loginLocal = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = result.rows[0];

  if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
  if (!user.password) return res.status(400).json({ message: 'Usuario registrado con OAuth' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: 'Contraseña incorrecta' });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

  res.json({ token, user });
};

// =====================
// OBTENER PERFIL DEL USUARIO
// =====================
export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const result = await pool.query('SELECT * FROM users WHERE id=$1', [userId]);
  const user = result.rows[0];

  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  res.json(user);
};
