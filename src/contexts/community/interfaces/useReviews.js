import { useState, useCallback } from 'react';
import { useDependencies } from '../../../app/providers/DependencyProvider.jsx';

export function useReviews() {
  const container = useDependencies();
  const { reviewsHandler, publishHandler, canPublishHandler } = container.community;

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReviews = useCallback(async (huariqueId) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await reviewsHandler.execute(huariqueId);
      setReviews(result);
    } catch (err) {
      setError(err.message || 'Error al cargar reseñas');
    } finally {
      setIsLoading(false);
    }
  }, [reviewsHandler]);

  const publishReview = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await publishHandler.execute(data);
      return result;
    } catch (err) {
      setError(err.message || 'Error al publicar reseña');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [publishHandler]);

  const canPublish = useCallback(async (reservationId) => {
    try {
      const result = await canPublishHandler.execute({ reservationId });
      return result;
    } catch (err) {
      return { canPublish: false };
    }
  }, [canPublishHandler]);

  return { reviews, isLoading, error, loadReviews, publishReview, canPublish };
}
