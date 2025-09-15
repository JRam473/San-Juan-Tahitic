import { Request, Response } from 'express';
import { query } from '../utils/db';
import { CreateUserPhotoInput, UpdateUserPhotoInput } from '../models/UserPhoto';
import { buildPhotoUrl } from '../utils/photoUrl';

export const getPhotos = async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT up.*, u.username, p.name as place_name 
      FROM user_photos up 
      JOIN users u ON up.user_id = u.id 
      LEFT JOIN places p ON up.place_id = p.id 
      ORDER BY up.created_at DESC
    `);

    const photosWithFullUrls = result.rows.map(photo => ({
      ...photo,
      photo_url: buildPhotoUrl(req, photo.photo_url),
    }));

    res.json({ photos: photosWithFullUrls });
  } catch (error) {
    console.error('Error obteniendo fotos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getPhotoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT up.*, u.username, p.name as place_name 
      FROM user_photos up 
      JOIN users u ON up.user_id = u.id 
      LEFT JOIN places p ON up.place_id = p.id 
      WHERE up.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }

    const photoWithFullUrl = {
      ...result.rows[0],
      photo_url: buildPhotoUrl(req, result.rows[0].photo_url),
    };

    res.json({ photo: photoWithFullUrl });
  } catch (error) {
    console.error('Error obteniendo foto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getUserPhotos = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await query(`
      SELECT up.*, u.username, p.name as place_name 
      FROM user_photos up 
      JOIN users u ON up.user_id = u.id 
      LEFT JOIN places p ON up.place_id = p.id 
      WHERE up.user_id = $1 
      ORDER BY up.created_at DESC
    `, [userId]);

    const photosWithFullUrls = result.rows.map(photo => ({
      ...photo,
      photo_url: buildPhotoUrl(req, photo.photo_url),
    }));

    res.json({ photos: photosWithFullUrls });
  } catch (error) {
    console.error('Error obteniendo fotos del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getPlacePhotos = async (req: Request, res: Response) => {
  try {
    const { placeId } = req.params;

    const result = await query(`
      SELECT up.*, u.username, p.name as place_name 
      FROM user_photos up 
      JOIN users u ON up.user_id = u.id 
      LEFT JOIN places p ON up.place_id = p.id 
      WHERE up.place_id = $1 
      ORDER BY up.created_at DESC
    `, [placeId]);

    const photosWithFullUrls = result.rows.map(photo => ({
      ...photo,
      photo_url: buildPhotoUrl(req, photo.photo_url),
    }));

    res.json({ photos: photosWithFullUrls });
  } catch (error) {
    console.error('Error obteniendo fotos del lugar:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createPhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { caption, place_id }: CreateUserPhotoInput = req.body;

    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    const storage_path = req.file ? req.file.path : null;

    if (!photo_url) {
      return res.status(400).json({ message: 'Se requiere una imagen' });
    }

    const result = await query(
      'INSERT INTO user_photos (user_id, photo_url, caption, place_id, storage_path) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, photo_url, caption, place_id, storage_path]
    );

    const newPhoto = {
      ...result.rows[0],
      photo_url: buildPhotoUrl(req, result.rows[0].photo_url),
    };

    res.status(201).json({ message: 'Foto creada', photo: newPhoto });
  } catch (error) {
    console.error('Error creando foto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updatePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { caption, place_id }: UpdateUserPhotoInput = req.body;

    const result = await query(
      `UPDATE user_photos 
       SET caption = COALESCE($1, caption), 
           place_id = COALESCE($2, place_id)
       WHERE id = $3 
       RETURNING *`,
      [caption, place_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }

    const updatedPhoto = {
      ...result.rows[0],
      photo_url: buildPhotoUrl(req, result.rows[0].photo_url),
    };

    res.json({ message: 'Foto actualizada', photo: updatedPhoto });
  } catch (error) {
    console.error('Error actualizando foto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM user_photos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }

    res.json({ message: 'Foto eliminada' });
  } catch (error) {
    console.error('Error eliminando foto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
