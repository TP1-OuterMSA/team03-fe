export interface MenuRankingItem {
  id: number;
  name: string;
  score: number;
  rankChange: number;
  rank: number;
}

export type RankingPeriod = 'WEEKLY' | 'MONTHLY';

export interface MenuRankingData {
  topRankMenuResponse: MenuRankingItem[];
  bottomRankMenuResponse: MenuRankingItem[];
}

export interface ApiResponse<T> {
  httpStatusCode: number;
  message: string;
  data: T;
  resultType: string;
}

export interface MenuRankingResponse extends ApiResponse<MenuRankingData> {}
