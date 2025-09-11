import { Request, Response } from 'express';
import { query } from '../utils/db';
import { hashPassword } from '../utils/hashPassword';
import { User, UpdateUserInput } from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, username, email, is_verified, avatar_url, created_at FROM users');
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT u.id, u.username, u.email, u.is_verified, u.avatar_url, u.created_at,
             p.full_name, p.bio
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, password, avatar_url }: UpdateUserInput = req.body;

    // Verificar si el usuario existe
    const userExists = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    const result = await query(
      `UPDATE users 
       SET username = COALESCE($1, username), 
           email = COALESCE($2, email), 
           password = COALESCE($3, password), 
           avatar_url = COALESCE($4, avatar_url),
           updated_at = NOW()
       WHERE id = $5 
       RETURNING id, username, email, is_verified, avatar_url, created_at, updated_at`,
      [username, email, hashedPassword, avatar_url, id]
    );

    res.json({ message: 'Usuario actualizado', user: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const userExists = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};