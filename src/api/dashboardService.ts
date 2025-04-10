import { api } from './axios';
import { satisfactionRatingResponse } from '../interface/dashboard';

export const getSatisfactionRating = async (): Promise<satisfactionRatingResponse> => {
  const response = await api.get('/api/team3/analytics/statistics/satisfactionRating');
  return response.data;
};