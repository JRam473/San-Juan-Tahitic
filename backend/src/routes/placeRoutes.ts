import express from 'express';
import { 
  getPlaces, 
  getPlaceById, 
  createPlace, 
  updatePlace, 
  deletePlace,
  getPlacesByCategory 
} from '../controllers/placeController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', getPlaces);
router.get('/category/:category', getPlacesByCategory);
router.get('/:id', getPlaceById);
router.post('/', authenticateToken, createPlace);
router.put('/:id', authenticateToken, updatePlace);
router.delete('/:id', authenticateToken, deletePlace);

export default router;