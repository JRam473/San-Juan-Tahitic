import express from 'express';
import { 
  getCommentReactions, 
  getPhotoReactions, 
  addCommentReaction, 
  addPhotoReaction, 
  removeCommentReaction, 
  removePhotoReaction 
} from '../controllers/reactionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Comment reactions
router.get('/comments/:commentId', getCommentReactions);
router.post('/comments/:commentId', authenticateToken, addCommentReaction);
router.delete('/comments/:reactionId', authenticateToken, removeCommentReaction);

// Photo reactions
router.get('/photos/:photoId', getPhotoReactions);
router.post('/photos/:photoId', authenticateToken, addPhotoReaction);
router.delete('/photos/:reactionId', authenticateToken, removePhotoReaction);

export default router;