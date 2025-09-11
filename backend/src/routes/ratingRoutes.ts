import express from 'express';
import { 
  getRatings, 
  getRatingById, 
  getUserRatings, 
  getPlaceRatings, 
  createRating, 
  updateRating, 
  deleteRating,
  getPlaceRatingStats  // ← Agregar esta importación
} from '../controllers/ratingController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', getRatings);
router.get('/user/:userId', getUserRatings);
router.get('/place/:placeId', getPlaceRatings);
router.get('/stats/place/:placeId', getPlaceRatingStats); // ← Agregar esta ruta
router.get('/:id', getRatingById);
router.post('/', authenticateToken, createRating);
router.put('/:id', authenticateToken, updateRating);
router.delete('/:id', authenticateToken, deleteRating);

export default router;