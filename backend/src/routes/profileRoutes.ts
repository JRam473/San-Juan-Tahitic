import express from 'express';
import { 
  getProfile, 
  getProfileById, 
  createProfile, 
  updateProfile, 
  deleteProfile 
} from '../controllers/profileController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getProfile);
router.get('/:id', authenticateToken, getProfileById);
router.post('/', authenticateToken, createProfile);
router.put('/:id', authenticateToken, updateProfile);
router.delete('/:id', authenticateToken, deleteProfile);

export default router;