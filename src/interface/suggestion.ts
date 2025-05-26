export type SuggestionCategory = 'RICE' | 'MAIN' | 'SIDE' | 'SOUP' | 'ETC';

export interface Suggestion {
  id: number;
  title: string;
  nickName: string | null;
  category: SuggestionCategory;
  content: string;
  createAt: string;
  foodId?: number;
}

export interface CreateSuggestionRequest {
  title: string;
  nickName: string | null;
  category: SuggestionCategory;
  content: string;
  foodId?: number;
}

export interface ApiResponse<T> {
  httpStatusCode: number;
  message: string;
  data: T;
  resultType: string;
} 