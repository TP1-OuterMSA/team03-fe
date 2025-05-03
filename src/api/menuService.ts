import { api } from './axios';
import { MenuRankingResponse, RankingPeriod, TrendingMenuResponse } from '../interface/menu';

export const getMenuRankings = async (period: RankingPeriod): Promise<MenuRankingResponse> => {
  const response = await api.get('/api/team3/analytics/statistics/rank', {
    params: { periodType: period },
  });
  return response.data;
};

export const getTrendingMenus = async (period: RankingPeriod): Promise<TrendingMenuResponse> => {
  const response = await api.get('/api/team3/analytics/statistics/trending', {
    params: { periodType: period },
  });
  return response.data;
};
