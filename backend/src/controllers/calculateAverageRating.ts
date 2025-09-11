import { query } from '../utils/db';

export const calculateAverageRating = async (placeId: string) => {
  try {
    // Calcular el promedio y el total de calificaciones
    const ratingResult = await query(
      `SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings 
       FROM place_ratings 
       WHERE place_id = $1`,
      [placeId]
    );

    const average_rating = parseFloat(ratingResult.rows[0].average_rating) || 0;
    const total_ratings = parseInt(ratingResult.rows[0].total_ratings) || 0;

    // Actualizar el lugar con los nuevos valores
    await query(
      'UPDATE places SET average_rating = $1, total_ratings = $2 WHERE id = $3',
      [average_rating, total_ratings, placeId]
    );

    return { average_rating, total_ratings };
  } catch (error) {
    console.error('Error calculando promedio de calificaciones:', error);
    throw error;
  }
};