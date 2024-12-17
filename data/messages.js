import fetcher from './_fetcher'
import useSWR from 'swr'
import { API_URL } from '@/constants/Api'

export default function useReviews (restaurantId) {
  const { data, error, isLoading } = useSWR(restaurantId ? `${API_URL}/messages/restaurant/${restaurantId}` : null, fetcher)
 
  return {
    data,
    isLoading,
    isError: error
  }
}