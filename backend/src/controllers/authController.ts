// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import { query } from '../utils/db';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { generateToken } from '../utils/jwt';
import { CreateUserInput } from '../models/User';

// ================== REGISTRO ==================
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password }: CreateUserInput = req.body;

    // Log con contraseña censurada
    console.log('Body de registro:', { ...req.body, password: '******' });

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Formato de email inválido' });
    }

    // Validar fortaleza de contraseña
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si ya existe
    const userExists = await query(
      'SELECT id, email, username FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      const existingUser = userExists.rows[0];
      if (existingUser.email === email) {
        return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ success: false, message: 'El nombre de usuario ya está en uso' });
      }
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario (NO retornar password)
    const result = await query(
      `INSERT INTO users (username, email, password, is_verified) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, is_verified, created_at`,
      [username, email, hashedPassword, false]
    );

    const user = result.rows[0];

    // Generar token
    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        token,
        user // 🔥 este objeto ya no contiene password
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// ================== LOGIN ==================
export const login = async (req: Request, res: Response) => {
  try {
    // Log con password censurada
    console.log('Body recibido:', { ...req.body, password: '******' });
    console.log('Headers:', req.headers);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario (sin exponer password en respuesta)
    const result = await query(
      'SELECT id, username, email, password, is_verified, avatar_url FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken({ userId: user.id, email: user.email });

    // Retornar sin incluir la contraseña
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ================== PERFIL ==================
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const result = await query(`
      SELECT u.id, u.username, u.email, u.is_verified, u.avatar_url, u.created_at,
             p.full_name, p.bio
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
