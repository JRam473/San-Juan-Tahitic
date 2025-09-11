import { Request, Response } from 'express';
import { query } from '../utils/db';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { generateToken } from '../utils/jwt';
import { User, CreateUserInput } from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {

    console.log('Body de registro:', req.body); // ✅ Para debugging
    const { username, email, password }: CreateUserInput = req.body;

    // Validar que el password esté presente
    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const result = await query(
      'INSERT INTO users (username, email, password, is_verified) VALUES ($1, $2, $3, $4) RETURNING id, username, email, is_verified, created_at',
      [username, email, hashedPassword, false]
    );

    const user = result.rows[0];

    // Generar token
    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_verified: user.is_verified
      },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {

    console.log('Body recibido:', req.body); // ✅ Para debugging
    console.log('Headers:', req.headers); // ✅ Para debugging
    const { email, password } = req.body;

    // Validar que los campos existan
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
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

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_verified: user.is_verified,
        avatar_url: user.avatar_url
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // req.user se establece en el middleware de autenticación
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

    const user = result.rows[0];
    res.json({ user });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};