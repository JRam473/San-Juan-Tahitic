// controllers/uploadController.ts
import { Request, Response } from 'express';
import { query } from '../utils/db';
import path from 'path';

export const uploadPlaceImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const { placeId } = req.params;
    
    // Verificar si el lugar existe
    const placeExists = await query('SELECT id FROM places WHERE id = $1', [placeId]);
    if (placeExists.rows.length === 0) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Actualizar la imagen del lugar
    const result = await query(
      'UPDATE places SET image_url = $1 WHERE id = $2 RETURNING *',
      [imageUrl, placeId]
    );

    res.json({
      message: 'Imagen subida exitosamente',
      imageUrl,
      place: result.rows[0]
    });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const uploadPlacePDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const { placeId } = req.params;
    
    // Verificar si el lugar existe
    const placeExists = await query('SELECT id FROM places WHERE id = $1', [placeId]);
    if (placeExists.rows.length === 0) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }

    const pdfUrl = `/uploads/${req.file.filename}`;

    // Actualizar el PDF del lugar
    const result = await query(
      'UPDATE places SET pdf_url = $1 WHERE id = $2 RETURNING *',
      [pdfUrl, placeId]
    );

    res.json({
      message: 'PDF subido exitosamente',
      pdfUrl,
      place: result.rows[0]
    });
  } catch (error) {
    console.error('Error subiendo PDF:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deletePlaceFile = async (req: Request, res: Response) => {
  try {
    // ✅ Usar type assertion para los parámetros
    const { placeId, fileType } = req.params as {
      placeId: string;
      fileType: 'image' | 'pdf';
    };

    if (!['image', 'pdf'].includes(fileType)) {
      return res.status(400).json({ message: 'Tipo de archivo inválido' });
    }

    const placeExists = await query('SELECT id FROM places WHERE id = $1', [placeId]);
    if (placeExists.rows.length === 0) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }

    const column = fileType === 'image' ? 'image_url' : 'pdf_url';

    const result = await query(
      `UPDATE places SET ${column} = NULL WHERE id = $1 RETURNING *`,
      [placeId]
    );

    res.json({
      message: `${fileType.toUpperCase()} eliminado exitosamente`,
      place: result.rows[0],
    });
  } catch (error) {
    console.error('Error eliminando archivo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};