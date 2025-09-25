// controllers/placeController.ts
import { Request, Response } from 'express';
import { query } from '../utils/db';
import { Place, CreatePlaceInput, UpdatePlaceInput } from '../models/Place';

export const getPlaces = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM places ORDER BY created_at DESC');
    res.json({ places: result.rows });
  } catch (error) {
    console.error('Error obteniendo lugares:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getPlacesByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const result = await query('SELECT * FROM places WHERE category = $1 ORDER BY created_at DESC', [category]);
    res.json({ places: result.rows });
  } catch (error) {
    console.error('Error obteniendo lugares por categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getPlaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM places WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }

    res.json({ place: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo lugar:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const createPlace = async (req: Request, res: Response) => {
  try {
    const { name, description, image_url, pdf_url, location, category }: CreatePlaceInput = req.body;

    // Validación básica
    if (!name) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const result = await query(
      'INSERT INTO places (name, description, image_url, pdf_url, location, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, image_url, pdf_url, location, category]
    );

    res.status(201).json({ 
      message: 'Lugar creado exitosamente', 
      place: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creando lugar:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updatePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, pdf_url, location, category }: UpdatePlaceInput = req.body;

    // Verificar si el lugar existe
    const placeExists = await query('SELECT id FROM places WHERE id = $1', [id]);
    if (placeExists.rows.length === 0) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }

    const result = await query(
      `UPDATE places 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description), 
           image_url = COALESCE($3, image_url),
           pdf_url = COALESCE($4, pdf_url),
           location = COALESCE($5, location),
           category = COALESCE($6, category),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [name, description, image_url, pdf_url, location, category, id]
    );

    res.json({ 
      message: 'Lugar actualizado exitosamente', 
      place: result.rows[0] 
    });
  } catch (error) {
    console.error('Error actualizando lugar:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const deletePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si el lugar existe
    const placeExists = await query('SELECT id FROM places WHERE id = $1', [id]);
    if (placeExists.rows.length === 0) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }

    const result = await query('DELETE FROM places WHERE id = $1 RETURNING *', [id]);

    res.json({ 
      message: 'Lugar eliminado exitosamente',
      deletedPlace: result.rows[0] 
    });
  } catch (error) {
    console.error('Error eliminando lugar:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};