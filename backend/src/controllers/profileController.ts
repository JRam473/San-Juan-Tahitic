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
    
    // Verificar que id no sea undefined
    if (!id) {
      return res.status(400).json({ message: 'ID de usuario requerido' });
    }
    
    // Verificar si el id es "me" y obtener el perfil del usuario autenticado
    if (id === 'me') {
      const userId = (req as any).user.userId;
      
      const result = await query(`
        SELECT u.id, u.username, u.email, u.avatar_url, u.created_at,
               COUNT(DISTINCT c.id) as comment_count,
               COUNT(DISTINCT p.id) as photo_count
        FROM users u
        LEFT JOIN comments c ON u.id = c.user_id
        LEFT JOIN user_photos p ON u.id = p.user_id
        WHERE u.id = $1
        GROUP BY u.id
      `, [userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      return res.json({ profile: result.rows[0] });
    }

    // Si no es "me", tratar como UUID normal
    if (!isValidUUID(id)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const result = await query(`
      SELECT u.id, u.username, u.email, u.avatar_url, u.created_at,
             COUNT(DISTINCT c.id) as comment_count,
             COUNT(DISTINCT p.id) as photo_count
      FROM users u
      LEFT JOIN comments c ON u.id = c.user_id
      LEFT JOIN user_photos p ON u.id = p.user_id
      WHERE u.id = $1
      GROUP BY u.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función auxiliar para validar UUID
// Función auxiliar para validar UUID
function isValidUUID(uuid: string | undefined): boolean {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

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
    
    // Verificar que id no sea undefined
    if (!id) {
      return res.status(400).json({ message: 'ID de perfil requerido' });
    }
    
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
    
    // Verificar que id no sea undefined
    if (!id) {
      return res.status(400).json({ message: 'ID de perfil requerido' });
    }

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

