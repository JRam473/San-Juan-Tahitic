import express from 'express';
import { 
  getComments, 
  getCommentById, 
  getPlaceComments, 
  getUserComments, 
  createComment, 
  updateComment, 
  deleteComment 
} from '../controllers/commentController';
import { 
  getCommentReactions, 
  addCommentReaction, 
  removeCommentReaction, 
  removeCommentReactionByComment 
} from '../controllers/reactionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Comments
router.get('/', getComments);
router.get('/place/:placeId', getPlaceComments);
router.get('/user/:userId', getUserComments);
router.get('/:id', getCommentById);
router.post('/', authenticateToken, createComment);
router.put('/:id', authenticateToken, updateComment);
router.delete('/:id', authenticateToken, deleteComment);

// Comment reactions
router.get('/:commentId/reactions', getCommentReactions);
router.post('/:commentId/reactions', authenticateToken, addCommentReaction);
router.delete('/reactions/:reactionId', authenticateToken, removeCommentReaction); // por ID de reacción
router.delete('/:commentId/reactions', authenticateToken, removeCommentReactionByComment); // todas de un comment

export default router;
