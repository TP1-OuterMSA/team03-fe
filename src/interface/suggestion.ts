export type SuggestionCategory = 'RICE' | 'MAIN_DISH' | 'SIDE_DISH' | 'DESSERT' | 'SOUP';

export interface Suggestion {
  id: number;
  title: string;
  nickName: string | null;
  category: SuggestionCategory;
  content: string;
  createAt: string;
  foodName: string;
}

export interface CreateSuggestionRequest {
  title: string;
  nickName: string | null;
  category: SuggestionCategory;
  content: string;
  foodName: string;
}

export interface ApiResponse<T> {
  httpStatusCode: number;
  message: string;
  data: T;
  resultType: string;
} 