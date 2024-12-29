import fetcher from './_fetcher';
import useSWR from 'swr';
import { API_URL } from '@/constants/Api';

export default function useReviews(restaurantId) {
  const { data, error, isLoading } = useSWR(
    restaurantId && restaurantId.length === 24
      ? `${API_URL}/reviews/${restaurantId}`
      : null,  // If the ID is invalid, don't trigger the request
    fetcher
  );

  // Return empty array if no data is available or if the request fails
  return {
    data: data || [],
    isLoading,
    isError: error,
  };
}
