export interface SuggestionAnswer {
  answerId: number;
  suggestionId: number;
  managerName: string;
  content: string;
  createDate: string;
}

export interface CreateSuggestionAnswerRequest {
  managerName: string;
  content: string;
}

export interface UpdateSuggestionAnswerRequest {
  managerName: string;
  content: string;
}

export interface ApiResponse<T> {
  httpStatusCode: number;
  message: string;
  data: T;
  resultType: string;
} 