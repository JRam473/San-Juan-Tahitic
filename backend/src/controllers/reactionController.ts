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
    console.log('=== INICIO addCommentReaction ===');
    console.log('Headers:', req.headers);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('User:', (req as any).user);

    const userId = (req as any).user.userId;
    const { commentId } = req.params;
    const { reaction_type }: CreateCommentReactionInput = req.body;

    if (!reaction_type) {
      console.log('ERROR: reaction_type es requerido');
      return res.status(400).json({ message: 'El tipo de reacción es requerido' });
    }

    console.log('Verificando si el comentario existe...');
    const commentCheck = await query('SELECT id FROM comments WHERE id = $1', [commentId]);
    if (commentCheck.rows.length === 0) {
      console.log('ERROR: Comentario no encontrado');
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    console.log('Verificando reacción existente...');
    const existingReaction = await query(
      'SELECT id FROM comment_reactions WHERE user_id = $1 AND comment_id = $2',
      [userId, commentId]
    );

    if (existingReaction.rows.length > 0) {
      console.log('ERROR: Ya existe una reacción');
      return res.status(400).json({ message: 'Ya has reaccionado a este comentario' });
    }

    console.log('Insertando nueva reacción...');
    const result = await query(
      'INSERT INTO comment_reactions (user_id, comment_id, reaction_type) VALUES ($1, $2, $3) RETURNING *',
      [userId, commentId, reaction_type]
    );

    console.log('Reacción insertada:', result.rows[0]);
    res.status(201).json({ message: 'Reacción agregada', reaction: result.rows[0] });

  } catch (error) {
    console.error('Error en addCommentReaction:', error);
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


// Nuevo endpoint para eliminar reacción por commentId y userId
// Asegúrate de tener ambos endpoints para eliminar reacciones
export const removeCommentReaction = async (req: Request, res: Response) => {
  try {
    const { reactionId } = req.params;
    const userId = (req as any).user.userId;

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

export const removeCommentReactionByComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = (req as any).user.userId;

    console.log(`Eliminando reacción para commentId: ${commentId}, userId: ${userId}`);

    const result = await query(
      'DELETE FROM comment_reactions WHERE comment_id = $1 AND user_id = $2 RETURNING *',
      [commentId, userId]
    );

    if (result.rows.length === 0) {
      console.log('Reacción no encontrada para eliminar');
      return res.status(404).json({ message: 'Reacción no encontrada' });
    }

    console.log('Reacción eliminada exitosamente:', result.rows[0]);
    res.json({ message: 'Reacción eliminada' });
  } catch (error) {
    console.error('Error eliminando reacción del comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};