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
    try {
      const requestData = {
        title: data.title,
        nickName: data.nickName,
        category: data.category,
        content: data.content,
        foodId: data.foodId || 0
      };

      console.log('건의 등록 요청 데이터:', requestData);
      
      const response = await api.post<ApiResponse<{}>>('/api/team3/analytics/suggestions', requestData);
      console.log('건의 등록 응답:', response.data);
    } catch (error: any) {
      console.error('건의 등록 상세 에러:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  },

  // 건의 수정
  updateSuggestion: async (suggestionId: number, data: CreateSuggestionRequest): Promise<void> => {
    try {
      console.log('건의 수정 요청 데이터:', { suggestionId, data });
      const response = await api.put<ApiResponse<{}>>(`/api/team3/analytics/suggestions/${suggestionId}`, {
        title: data.title,
        nickName: data.nickName || null,
        category: data.category,
        content: data.content,
        foodId: data.foodId || 0
      });
      console.log('건의 수정 응답:', response.data);
    } catch (error) {
      console.error('건의 수정 상세 에러:', error);
      throw error;
    }
  },

  // 건의 삭제
  deleteSuggestion: async (suggestionId: number): Promise<void> => {
    try {
      console.log('건의 삭제 요청:', suggestionId);
      const response = await api.delete<ApiResponse<{}>>(`/api/team3/analytics/suggestions/${suggestionId}`);
      console.log('건의 삭제 응답:', response.data);
    } catch (error) {
      console.error('건의 삭제 상세 에러:', error);
      throw error;
    }
  },
}; 