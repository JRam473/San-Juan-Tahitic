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

    console.log('🆕 Creando lugar:', { name, description, location, category });

    // Validación básica
    if (!name?.trim()) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    if (!description?.trim()) {
      return res.status(400).json({ message: 'La descripción es requerida' });
    }

    if (!category?.trim()) {
      return res.status(400).json({ message: 'La categoría es requerida' });
    }

    const result = await query(
      `INSERT INTO places (name, description, image_url, pdf_url, location, category) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, description, image_url || null, pdf_url || null, location, category]
    );

    console.log('✅ Lugar creado:', result.rows[0]);

    res.status(201).json({ 
      message: 'Lugar creado exitosamente', 
      place: result.rows[0] 
    });
  } catch (error) {
    console.error('❌ Error creando lugar:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// controllers/placeController.ts - VERSIÓN CORREGIDA
// controllers/placeController.ts - VERSIÓN CORREGIDA
export const updatePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, pdf_url, location, category }: UpdatePlaceInput = req.body;

    console.log('🔄 Actualizando lugar:', { id, name, description, location, category });

    // Verificar si el lugar existe
    const placeExists = await query('SELECT * FROM places WHERE id = $1', [id]);
    if (placeExists.rows.length === 0) {
      return res.status(404).json({ message: 'Lugar no encontrado' });
    }

    const currentPlace = placeExists.rows[0];
    
    // Usar los valores nuevos o mantener los existentes si son null/undefined
    const updateData = {
      name: name !== undefined ? name : currentPlace.name,
      description: description !== undefined ? description : currentPlace.description,
      image_url: image_url !== undefined ? image_url : currentPlace.image_url,
      pdf_url: pdf_url !== undefined ? pdf_url : currentPlace.pdf_url,
      location: location !== undefined ? location : currentPlace.location,
      category: category !== undefined ? category : currentPlace.category,
    };

    console.log('📊 Datos para actualizar:', updateData);

    // Validación básica
    if (!updateData.name?.trim()) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const result = await query(
      `UPDATE places 
       SET name = $1, 
           description = $2, 
           image_url = $3,
           pdf_url = $4,
           location = $5,
           category = $6
       WHERE id = $7 
       RETURNING *`,
      [
        updateData.name,
        updateData.description,
        updateData.image_url,
        updateData.pdf_url,
        updateData.location,
        updateData.category,
        id
      ]
    );

    console.log('✅ Lugar actualizado:', result.rows[0]);

    res.json({ 
      message: 'Lugar actualizado exitosamente', 
      place: result.rows[0] 
    });
  } catch (error) {
    console.error('❌ Error actualizando lugar:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
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