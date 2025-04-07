export interface MenuRankingItem {
  id: number;
  name: string;
  score: number;
  rankChange: number;
  rank: number;
}

export type RankingPeriod = 'WEEKLY' | 'MONTHLY';

export interface MenuRankingData {
  menuId: number;
  menuName: string;
  score: number;
  rankChange: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface MenuRankingResponse
  extends ApiResponse<{
    topRankMenuResponse: MenuRankingData[];
    bottomRankMenuResponse: MenuRankingData[];
  }> {}

export interface TrendingMenuData {
  menuId: number;
  menuName: string;
  score: number;
  rankChange: number;
}

export interface TrendingMenuResponse extends ApiResponse<TrendingMenuData[]> {}
