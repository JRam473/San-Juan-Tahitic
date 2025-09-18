import { Request, Response } from 'express';
import { query } from '../utils/db';
import { Comment, CreateCommentInput, UpdateCommentInput } from '../models/Comment';

// En tu commentController.ts - Modificar getComments y similares
export const getComments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId; // Obtener userId si está autenticado
    
    const queryStr = `
      SELECT 
        c.*, 
        u.username, 
        u.avatar_url, 
        p.name as place_name,
        COUNT(cr.id) as reaction_count,
        ${userId ? `EXISTS(
          SELECT 1 FROM comment_reactions cr2 
          WHERE cr2.comment_id = c.id AND cr2.user_id = '${userId}'
        ) as user_has_reacted` : 'false as user_has_reacted'}
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      LEFT JOIN places p ON c.place_id = p.id 
      LEFT JOIN comment_reactions cr ON cr.comment_id = c.id
      GROUP BY c.id, u.id, p.id
      ORDER BY c.created_at DESC
    `;

    const result = await query(queryStr);
    res.json({ comments: result.rows });
  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const getCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT c.*, u.username, u.avatar_url, p.name as place_name 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      LEFT JOIN places p ON c.place_id = p.id 
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    res.json({ comment: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getPlaceComments = async (req: Request, res: Response) => {
  try {
    const { placeId } = req.params;
    
    const result = await query(`
      SELECT c.*, u.username, u.avatar_url 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.place_id = $1 
      ORDER BY c.created_at DESC
    `, [placeId]);

    res.json({ comments: result.rows });
  } catch (error) {
    console.error('Error obteniendo comentarios del lugar:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getUserComments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const result = await query(`
      SELECT c.*, u.username, u.avatar_url, p.name as place_name 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      LEFT JOIN places p ON c.place_id = p.id 
      WHERE c.user_id = $1 
      ORDER BY c.created_at DESC
    `, [userId]);

    res.json({ comments: result.rows });
  } catch (error) {
    console.error('Error obteniendo comentarios del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { place_id, content, parent_comment_id }: CreateCommentInput = req.body;

    if (!content) {
      return res.status(400).json({ message: 'El contenido es requerido' });
    }

    const result = await query(
      'INSERT INTO comments (user_id, place_id, content, parent_comment_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, place_id, content, parent_comment_id]
    );

    res.status(201).json({ message: 'Comentario creado', comment: result.rows[0] });
  } catch (error) {
    console.error('Error creando comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content }: UpdateCommentInput = req.body;
    const userId = (req as any).user.userId;

    // Verificar que el comentario pertenece al usuario
    const commentCheck = await query('SELECT user_id FROM comments WHERE id = $1', [id]);
    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (commentCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar este comentario' });
    }

    const result = await query(
      `UPDATE comments 
       SET content = $1, updated_at = NOW()
       WHERE id = $2 
       RETURNING *`,
      [content, id]
    );

    res.json({ message: 'Comentario actualizado', comment: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    console.log('Intentando eliminar comentario:', id, 'Usuario:', userId);

    // Verificar que el comentario pertenece al usuario
    const commentCheck = await query('SELECT user_id FROM comments WHERE id = $1', [id]);
    console.log('Resultado de verificación:', commentCheck.rows);
    
    if (commentCheck.rows.length === 0) {
      console.log('Comentario no encontrado');
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (commentCheck.rows[0].user_id !== userId) {
      console.log('Permiso denegado. Usuario del comentario:', commentCheck.rows[0].user_id, 'Usuario actual:', userId);
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
    }

    const result = await query('DELETE FROM comments WHERE id = $1 RETURNING *', [id]);
    console.log('Comentario eliminado:', result.rows[0]);

    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    console.error('Error eliminando comentario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

