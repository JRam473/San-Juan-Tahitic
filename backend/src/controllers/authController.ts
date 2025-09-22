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
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Validar fortaleza de contraseña
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // ✅ SOLO VERIFICAR EMAIL (eliminar verificación de username)
    const userExists = await query(
      'SELECT id, email FROM users WHERE email = $1',
      [email] // Solo verificar por email
    );

    if (userExists.rows.length > 0) {
      console.log('❌ REGISTRO - Email ya existe:', email);
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // ✅ Generar username automáticamente si no se proporciona
    const finalUsername = username || email.split('@')[0]; // Usar parte del email como username

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const result = await query(
      `INSERT INTO users (username, email, password, is_verified) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, is_verified, created_at, avatar_url`,
      [finalUsername, email, hashedPassword, false]
    );

    const user = result.rows[0];
    console.log('✅ REGISTRO - Usuario creado:', { id: user.id, email: user.email });

    // Generar token
    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      token
    });
  } catch (error) {
    console.error('❌ REGISTRO - Error interno:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ================== LOGIN ==================
export const login = async (req: Request, res: Response) => {
  try {
    console.log('🔐 LOGIN - Body recibido:', { 
      email: req.body.email, 
      passwordLength: req.body.password?.length 
    });

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ LOGIN - Faltan credenciales');
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    console.log('🔍 LOGIN - Buscando usuario con email:', email);
    
    const result = await query(
      'SELECT id, username, email, password, is_verified, avatar_url FROM users WHERE email = $1',
      [email]
    );

    console.log('👥 LOGIN - Usuarios encontrados:', result.rows.length);

    if (result.rows.length === 0) {
      console.log('❌ LOGIN - Usuario no encontrado');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    console.log('✅ LOGIN - Usuario encontrado:', { id: user.id, email: user.email });

    // Verificar contraseña
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      console.log('❌ LOGIN - Contraseña incorrecta');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken({ userId: user.id, email: user.email });

    // Retornar sin incluir la contraseña
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ LOGIN - Login exitoso para usuario:', user.email);
    
    res.json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('💥 LOGIN - Error interno:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ================== PERFIL ==================
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    console.log('👤 PERFIL - Obteniendo perfil para user ID:', userId);

    const result = await query(`
      SELECT u.id, u.username, u.email, u.is_verified, u.avatar_url, u.created_at,
             p.full_name, p.bio
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      console.log('❌ PERFIL - Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log('✅ PERFIL - Perfil obtenido exitosamente');
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('❌ PERFIL - Error obteniendo perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};