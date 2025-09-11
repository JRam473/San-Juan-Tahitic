import { Request, Response } from 'express';
import { query } from '../utils/db';
import { CreateCommentReactionInput } from '../models/CommentReaction';
import { CreatePhotoReactionInput } from '../models/PhotoReaction';

export const getCommentReactions = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    
    const result = await query(`
      SELECT cr.*, u.username 
      FROM comment_reactions cr 
      JOIN users u ON cr.user_id = u.id 
      WHERE cr.comment_id = $1 
      ORDER BY cr.created_at DESC
    `, [commentId]);

    res.json({ reactions: result.rows });
  } catch (error) {
    console.error('Error obteniendo reacciones del comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getPhotoReactions = async (req: Request, res: Response) => {
  try {
    const { photoId } = req.params;
    
    const result = await query(`
      SELECT pr.*, u.username 
      FROM photo_reactions pr 
      JOIN users u ON pr.user_id = u.id 
      WHERE pr.photo_id = $1 
      ORDER BY pr.created_at DESC
    `, [photoId]);

    res.json({ reactions: result.rows });
  } catch (error) {
    console.error('Error obteniendo reacciones de la foto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const addCommentReaction = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { commentId } = req.params;
    const { reaction_type }: CreateCommentReactionInput = req.body;

    // Verificar si ya existe una reacción del usuario a este comentario
    const existingReaction = await query(
      'SELECT id FROM comment_reactions WHERE user_id = $1 AND comment_id = $2',
      [userId, commentId]
    );

    if (existingReaction.rows.length > 0) {
      return res.status(400).json({ message: 'Ya has reaccionado a este comentario' });
    }

    const result = await query(
      'INSERT INTO comment_reactions (user_id, comment_id, reaction_type) VALUES ($1, $2, $3) RETURNING *',
      [userId, commentId, reaction_type]
    );

    res.status(201).json({ message: 'Reacción agregada', reaction: result.rows[0] });
  } catch (error) {
    console.error('Error agregando reacción al comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const addPhotoReaction = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { photoId } = req.params;
    const { reaction_type }: CreatePhotoReactionInput = req.body;

    // Verificar si ya existe una reacción del usuario a esta foto
    const existingReaction = await query(
      'SELECT id FROM photo_reactions WHERE user_id = $1 AND photo_id = $2',
      [userId, photoId]
    );

    if (existingReaction.rows.length > 0) {
      return res.status(400).json({ message: 'Ya has reaccionado a esta foto' });
    }

    const result = await query(
      'INSERT INTO photo_reactions (user_id, photo_id, reaction_type) VALUES ($1, $2, $3) RETURNING *',
      [userId, photoId, reaction_type]
    );

    res.status(201).json({ message: 'Reacción agregada', reaction: result.rows[0] });
  } catch (error) {
    console.error('Error agregando reacción a la foto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const removeCommentReaction = async (req: Request, res: Response) => {
  try {
    const { reactionId } = req.params;
    const userId = (req as any).user.userId;

    // Verificar que la reacción pertenece al usuario
    const reactionCheck = await query('SELECT user_id FROM comment_reactions WHERE id = $1', [reactionId]);
    if (reactionCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Reacción no encontrada' });
    }

    if (reactionCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta reacción' });
    }

    const result = await query('DELETE FROM comment_reactions WHERE id = $1 RETURNING *', [reactionId]);

    res.json({ message: 'Reacción eliminada' });
  } catch (error) {
    console.error('Error eliminando reacción del comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const removePhotoReaction = async (req: Request, res: Response) => {
  try {
    const { reactionId } = req.params;
    const userId = (req as any).user.userId;

    // Verificar que la reacción pertenece al usuario
    const reactionCheck = await query('SELECT user_id FROM photo_reactions WHERE id = $1', [reactionId]);
    if (reactionCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Reacción no encontrada' });
    }

    if (reactionCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta reacción' });
    }

    const result = await query('DELETE FROM photo_reactions WHERE id = $1 RETURNING *', [reactionId]);

    res.json({ message: 'Reacción eliminada' });
  } catch (error) {
    console.error('Error eliminando reacción de la foto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};