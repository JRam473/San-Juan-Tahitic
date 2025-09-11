import { Request, Response } from 'express';
import { query } from '../utils/db';
import { PlaceRating, CreatePlaceRatingInput, UpdatePlaceRatingInput } from '../models/PlaceRating';
import { calculateAverageRating, getRatingStatistics  } from '../utils/calculateAverageRating';

export const getRatings = async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT pr.*, u.username, p.name as place_name 
      FROM place_ratings pr 
      JOIN users u ON pr.user_id = u.id 
      JOIN places p ON pr.place_id = p.id 
      ORDER BY pr.created_at DESC
    `);
    res.json({ ratings: result.rows });
  } catch (error) {
    console.error('Error obteniendo calificaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getRatingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validar que id existe y es un string
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'ID de calificación requerido' });
    }
    
    const result = await query(`
      SELECT pr.*, u.username, p.name as place_name 
      FROM place_ratings pr 
      JOIN users u ON pr.user_id = u.id 
      JOIN places p ON pr.place_id = p.id 
      WHERE pr.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Calificación no encontrada' });
    }

    res.json({ rating: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo calificación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getUserRatings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Validar que userId existe y es un string
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'ID de usuario requerido' });
    }
    
    const result = await query(`
      SELECT pr.*, u.username, p.name as place_name 
      FROM place_ratings pr 
      JOIN users u ON pr.user_id = u.id 
      JOIN places p ON pr.place_id = p.id 
      WHERE pr.user_id = $1 
      ORDER BY pr.created_at DESC
    `, [userId]);

    res.json({ ratings: result.rows });
  } catch (error) {
    console.error('Error obteniendo calificaciones del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getPlaceRatings = async (req: Request, res: Response) => {
  try {
    const { placeId } = req.params;
    
    // Validar que placeId existe y es un string
    if (!placeId || typeof placeId !== 'string') {
      return res.status(400).json({ message: 'ID de lugar requerido' });
    }
    
    const result = await query(`
      SELECT pr.*, u.username 
      FROM place_ratings pr 
      JOIN users u ON pr.user_id = u.id 
      WHERE pr.place_id = $1 
      ORDER BY pr.created_at DESC
    `, [placeId]);

    res.json({ ratings: result.rows });
  } catch (error) {
    console.error('Error obteniendo calificaciones del lugar:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createRating = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { place_id, rating }: CreatePlaceRatingInput = req.body;

    // Validar que place_id existe
    if (!place_id || typeof place_id !== 'string') {
      return res.status(400).json({ message: 'ID de lugar requerido' });
    }

    // Verificar si ya existe una calificación del usuario a este lugar
    const existingRating = await query(
      'SELECT id FROM place_ratings WHERE user_id = $1 AND place_id = $2',
      [userId, place_id]
    );

    if (existingRating.rows.length > 0) {
      return res.status(400).json({ message: 'Ya has calificado este lugar' });
    }

    const result = await query(
      'INSERT INTO place_ratings (user_id, place_id, rating) VALUES ($1, $2, $3) RETURNING *',
      [userId, place_id, rating]
    );

    // Actualizar el promedio de calificaciones del lugar
    await calculateAverageRating(place_id);

    res.status(201).json({ message: 'Calificación creada', rating: result.rows[0] });
  } catch (error) {
    console.error('Error creando calificación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const updateRating = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating }: UpdatePlaceRatingInput = req.body;
    const userId = (req as any).user.userId;

    // Verificar que la calificación pertenece al usuario
    const ratingCheck = await query('SELECT user_id, place_id FROM place_ratings WHERE id = $1', [id]);
    if (ratingCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Calificación no encontrada' });
    }

    if (ratingCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta calificación' });
    }

    // Validar que place_id existe y es un string
    const placeId = ratingCheck.rows[0].place_id;
    if (!placeId || typeof placeId !== 'string') {
      return res.status(400).json({ message: 'ID de lugar inválido' });
    }

    const result = await query(
      `UPDATE place_ratings 
       SET rating = $1, updated_at = NOW()
       WHERE id = $2 
       RETURNING *`,
      [rating, id]
    );

    // Actualizar el promedio de calificaciones del lugar
    await calculateAverageRating(placeId); // ← Ahora placeId está validado

    res.json({ message: 'Calificación actualizada', rating: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando calificación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteRating = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    // Verificar que la calificación pertenece al usuario
    const ratingCheck = await query('SELECT user_id, place_id FROM place_ratings WHERE id = $1', [id]);
    if (ratingCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Calificación no encontrada' });
    }

    if (ratingCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta calificación' });
    }

    // Validar que place_id existe y es un string
    const placeId = ratingCheck.rows[0].place_id;
    if (!placeId || typeof placeId !== 'string') {
      return res.status(400).json({ message: 'ID de lugar inválido' });
    }

    const result = await query('DELETE FROM place_ratings WHERE id = $1 RETURNING *', [id]);

    // Actualizar el promedio de calificaciones del lugar
    await calculateAverageRating(placeId); // ← Ahora placeId está validado

    res.json({ message: 'Calificación eliminada' });
  } catch (error) {
    console.error('Error eliminando calificación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Nueva función para obtener estadísticas
// Agregar esta función al final del archivo
// Nueva función para obtener estadísticas
export const getPlaceRatingStats = async (req: Request, res: Response) => {
  try {
    const { placeId } = req.params;
    
    // Validar que placeId existe y es un string
    if (!placeId || typeof placeId !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: 'ID de lugar requerido' 
      });
    }

    const stats = await getRatingStatistics(placeId);
    res.json({ 
      success: true,
      stats 
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};