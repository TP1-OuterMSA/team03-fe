import { api } from './axios';
import { MenuRankingResponse, RankingPeriod } from '../interface/menu';

export const getMenuRankings = async (period: RankingPeriod): Promise<MenuRankingResponse> => {
  const response = await api.get('/api/menu/rank', {
    params: { period },
  });
  return response.data;
};
