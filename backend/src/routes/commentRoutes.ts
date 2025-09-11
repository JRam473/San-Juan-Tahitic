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
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', getComments);
router.get('/place/:placeId', getPlaceComments);
router.get('/user/:userId', getUserComments);
router.get('/:id', getCommentById);
router.post('/', authenticateToken, createComment);
router.put('/:id', authenticateToken, updateComment);
router.delete('/:id', authenticateToken, deleteComment);

export default router;