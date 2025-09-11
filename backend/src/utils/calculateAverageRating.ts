import { query } from './db';

/**
 * Calcula y actualiza el promedio de calificaciones de un lugar
 * @param placeId - ID del lugar a actualizar
 * @returns Objeto con el promedio y total de calificaciones
 */
export const calculateAverageRating = async (placeId: string): Promise<{
  average_rating: number;
  total_ratings: number;
}> => {
  try {
    // Validación adicional por seguridad
    if (!placeId || typeof placeId !== 'string' || placeId.trim() === '') {
      throw new Error('ID de lugar inválido');
    }
    
    console.log(`Calculando promedio de calificaciones para lugar: ${placeId}`);
    
    // Calcular el promedio y el total de calificaciones
    const ratingResult = await query(
      `SELECT 
        COALESCE(AVG(rating), 0) as average_rating, 
        COALESCE(COUNT(*), 0) as total_ratings 
       FROM place_ratings 
       WHERE place_id = $1`,
      [placeId]
    );

    const average_rating = parseFloat(ratingResult.rows[0].average_rating);
    const total_ratings = parseInt(ratingResult.rows[0].total_ratings);

    console.log(`Resultados - Promedio: ${average_rating}, Total: ${total_ratings}`);

    // Actualizar el lugar con los nuevos valores
    const updateResult = await query(
      'UPDATE places SET average_rating = $1, total_ratings = $2 WHERE id = $3 RETURNING id',
      [average_rating, total_ratings, placeId]
    );

    if (updateResult.rows.length === 0) {
      throw new Error(`No se pudo actualizar el lugar con ID: ${placeId}`);
    }

    console.log(`Lugar ${placeId} actualizado exitosamente`);

    return { 
      average_rating: Math.round(average_rating * 10) / 10, // Redondear a 1 decimal
      total_ratings 
    };
  } catch (error) {
    console.error('Error calculando promedio de calificaciones:', error);
    throw new Error('No se pudo calcular el promedio de calificaciones');
  }
};

/**
 * Función para recalcular promedios de todos los lugares (útil para mantenimiento)
 */
export const recalculateAllAverages = async (): Promise<void> => {
  try {
    console.log('Recalculando promedios de todos los lugares...');
    
    // Obtener todos los IDs de lugares
    const placesResult = await query('SELECT id FROM places');
    
    for (const place of placesResult.rows) {
      await calculateAverageRating(place.id);
    }
    
    console.log('Todos los promedios han sido recalculados');
  } catch (error) {
    console.error('Error recalculando todos los promedios:', error);
    throw error;
  }
};

/**
 * Obtiene las estadísticas detalladas de calificaciones de un lugar
 * @param placeId - ID del lugar
 * @returns Estadísticas detalladas de calificaciones
 */
export const getRatingStatistics = async (placeId: string): Promise<{
  average_rating: number;
  total_ratings: number;
  rating_distribution: { rating: number; count: number }[];
}> => {
  try {
    // Obtener promedio y total
    const avgResult = await query(
      `SELECT 
        COALESCE(AVG(rating), 0) as average_rating, 
        COALESCE(COUNT(*), 0) as total_ratings 
       FROM place_ratings 
       WHERE place_id = $1`,
      [placeId]
    );

    // Obtener distribución de calificaciones
    const distributionResult = await query(
      `SELECT 
        rating, 
        COUNT(*) as count 
       FROM place_ratings 
       WHERE place_id = $1 
       GROUP BY rating 
       ORDER BY rating DESC`,
      [placeId]
    );

    const average_rating = parseFloat(avgResult.rows[0].average_rating);
    const total_ratings = parseInt(avgResult.rows[0].total_ratings);
    const rating_distribution = distributionResult.rows.map(row => ({
      rating: parseInt(row.rating),
      count: parseInt(row.count)
    }));

    // Llenar calificaciones faltantes con count 0
    const completeDistribution = [];
    for (let i = 5; i >= 1; i--) {
      const existing = rating_distribution.find(item => item.rating === i);
      completeDistribution.push({
        rating: i,
        count: existing ? existing.count : 0
      });
    }

    return {
      average_rating: Math.round(average_rating * 10) / 10,
      total_ratings,
      rating_distribution: completeDistribution
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas de calificaciones:', error);
    throw error;
  }
};

export default calculateAverageRating;