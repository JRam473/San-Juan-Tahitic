// middleware/upload.ts - VERSIÓN MEJORADA
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Crear directorio uploads si no existe
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Crear directorio uploads si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Directorio uploads creado:', uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'place-' + uniqueSuffix + '-' + sanitizedName + extension);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo imágenes y PDFs son permitidos.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Middlewares específicos
export const uploadImage = upload.single('file'); // Cambiado a 'file'
export const uploadPDF = upload.single('file');   // Cambiado a 'file'