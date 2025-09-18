import express from 'express';
import { 
  getPhotos, 
  getPhotoById, 
  getUserPhotos, 
  getPlacePhotos, 
  createPhoto, 
  updatePhoto, 
  deletePhoto 
} from '../controllers/photoController';
import { 
  getPhotoReactions,
  addPhotoReaction,
  removePhotoReactionByPhoto,
  getPhotoReactionCount
} from '../controllers/reactionController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Photos
router.get('/', getPhotos);
router.get('/user/:userId', getUserPhotos);
router.get('/place/:placeId', getPlacePhotos);
router.get('/:id', getPhotoById);
router.post('/', authenticateToken, upload.single('photo'), createPhoto);
router.put('/:id', authenticateToken, updatePhoto);
router.delete('/:id', authenticateToken, deletePhoto);

// Photo reactions
router.get('/:photoId/reactions', getPhotoReactions);
router.post('/:photoId/reactions', authenticateToken, addPhotoReaction);
router.delete('/:photoId/reaction', authenticateToken, removePhotoReactionByPhoto);
router.get('/:photoId/reaction-count', getPhotoReactionCount);

export default router;
