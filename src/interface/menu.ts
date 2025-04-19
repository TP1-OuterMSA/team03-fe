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

export interface MenuRankingResponse {
  httpStatusCode: number;
  message: string;
  data: {
    topRankMenuResponseDto: MenuRankingItem[];
    bottomRankMenuResponseDto: MenuRankingItem[];
  };
  resultType: string;
}

export interface TrendingMenuData {
  menuId: number;
  menuName: string;
  score: number;
  rankChange: number;
}

export interface TrendingMenuResponse {
  httpStatusCode: number;
  message: string;
  data: MenuRankingItem[];
  resultType: string;
}

export interface DesiredFoodItem {
  rank: number;
  foodName: string;
  score: number;
}

export interface DesiredFoodResponse {
  httpStatusCode: number;
  message: string;
  data: DesiredFoodItem[];
  resultType: string;
}