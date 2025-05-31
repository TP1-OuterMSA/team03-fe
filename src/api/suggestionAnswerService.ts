import { api } from './axios';
import { CreateSuggestionAnswerRequest, UpdateSuggestionAnswerRequest } from '../interface/suggestionAnswer';

const suggestionAnswerService = {
  // 건의 답변 등록
  createAnswer: async (suggestionId: number, data: CreateSuggestionAnswerRequest) => {
    const response = await api.post(`/api/team3/analytics/suggestions/${suggestionId}/answers`, {
      managerName: data.managerName.trim(),
      content: data.content.trim()
    });
    return response.data;
  },

  // 건의 답변 수정
  updateAnswer: async (suggestionId: number, answerId: number, data: UpdateSuggestionAnswerRequest) => {
    const response = await api.put(`/api/team3/analytics/suggestions/${suggestionId}/answers/${answerId}`, {
      managerName: data.managerName.trim(),
      content: data.content.trim()
    });
    return response.data;
  },

  // 건의 답변 삭제
  deleteAnswer: async (suggestionId: number, answerId: number) => {
    const response = await api.delete(`/api/team3/analytics/suggestions/${suggestionId}/answers/${answerId}`);
    return response.data;
  }
};

export { suggestionAnswerService }; 