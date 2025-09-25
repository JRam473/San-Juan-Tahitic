// routes/placeRoutes.ts
import express from 'express';
import { 
  getPlaces, 
  getPlaceById, 
  createPlace, 
  updatePlace, 
  deletePlace,
  getPlacesByCategory 
} from '../controllers/placeController';
import { 
  uploadPlaceImage, 
  uploadPlacePDF, 
  deletePlaceFile 
} from '../controllers/uploadController'; // ✅ Esta importación debe coincidir
import { uploadImage, uploadPDF } from '../middleware/upload';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Rutas públicas
router.get('/', getPlaces);
router.get('/category/:category', getPlacesByCategory);
router.get('/:id', getPlaceById);

// Rutas protegidas (CRUD)
router.post('/', authenticateToken, createPlace);
router.put('/:id', authenticateToken, updatePlace);
router.delete('/:id', authenticateToken, deletePlace);

// Rutas para uploads de archivos
router.post('/:placeId/upload-image', authenticateToken, uploadImage, uploadPlaceImage);
router.post('/:placeId/upload-pdf', authenticateToken, uploadPDF, uploadPlacePDF);
router.delete('/:placeId/files/:fileType', authenticateToken, deletePlaceFile);

export default router;