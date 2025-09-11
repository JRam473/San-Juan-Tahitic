import { Request, Response } from 'express';
import { query } from '../utils/db';
import { Profile, CreateProfileInput, UpdateProfileInput } from '../models/Profile';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    const result = await query(`
      SELECT p.*, u.username, u.email 
      FROM profiles p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT p.*, u.username, u.email 
      FROM profiles p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { full_name, bio, avatar_url }: CreateProfileInput = req.body;

    // Verificar si el perfil ya existe
    const profileExists = await query('SELECT id FROM profiles WHERE user_id = $1', [userId]);
    if (profileExists.rows.length > 0) {
      return res.status(400).json({ message: 'El perfil ya existe' });
    }

    const result = await query(
      'INSERT INTO profiles (user_id, full_name, bio, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, full_name, bio, avatar_url]
    );

    res.status(201).json({ message: 'Perfil creado', profile: result.rows[0] });
  } catch (error) {
    console.error('Error creando perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { full_name, bio, avatar_url }: UpdateProfileInput = req.body;

    const result = await query(
      `UPDATE profiles 
       SET full_name = COALESCE($1, full_name), 
           bio = COALESCE($2, bio), 
           avatar_url = COALESCE($3, avatar_url),
           updated_at = NOW()
       WHERE id = $4 
       RETURNING *`,
      [full_name, bio, avatar_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json({ message: 'Perfil actualizado', profile: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM profiles WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json({ message: 'Perfil eliminado' });
  } catch (error) {
    console.error('Error eliminando perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};