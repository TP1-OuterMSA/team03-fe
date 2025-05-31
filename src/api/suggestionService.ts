import { api } from './axios';
import { ApiResponse, CreateSuggestionRequest, Suggestion } from '../interface/suggestion';

export const suggestionService = {
  // 건의 목록 조회
  getSuggestions: async (): Promise<Suggestion[]> => {
    const response = await api.get<ApiResponse<Suggestion[]>>('/api/team3/analytics/suggestions');
    return response.data.data;
  },

  // 건의 상세 조회
  getSuggestionById: async (suggestionId: number): Promise<Suggestion> => {
    const response = await api.get<ApiResponse<Suggestion>>(`/api/team3/analytics/suggestions/${suggestionId}`);
    return response.data.data;
  },

  // 건의 등록
  createSuggestion: async (data: CreateSuggestionRequest): Promise<void> => {
    const requestData = {
      title: data.title.trim(),
      nickName: data.nickName ? data.nickName.trim() : null,
      category: data.category,
      content: data.content.trim(),
      foodId: data.foodId
    };
    
    await api.post<ApiResponse<{}>>('/api/team3/analytics/suggestions', requestData);
  },

  // 건의 수정
  updateSuggestion: async (suggestionId: number, data: CreateSuggestionRequest): Promise<void> => {
    const requestData = {
      title: data.title.trim(),
      nickName: data.nickName ? data.nickName.trim() : null,
      category: data.category,
      content: data.content.trim(),
      foodId: data.foodId
    };
    
    await api.put<ApiResponse<{}>>(`/api/team3/analytics/suggestions/${suggestionId}`, requestData);
  },

  // 건의 삭제
  deleteSuggestion: async (suggestionId: number): Promise<void> => {
    await api.delete<ApiResponse<{}>>(`/api/team3/analytics/suggestions/${suggestionId}`);
  },
}; 