import { api } from './axios';
import {
  Goal,
  CreateGoalRequest,
  UpdateGoalRequest,
  GoalResponse,
  GoalListResponse,
  EmptyResponse
} from '../interface/goal';

export const goalService = {
  // 목표 목록 조회
  getGoals: async (): Promise<Goal[]> => {
    const response = await api.get<GoalListResponse>('/api/team3/analytics/statistics/goals');
    return response.data.data || [];
  },

  // 특정 메뉴의 목표 조회
  getGoalByFoodId: async (foodId: number): Promise<Goal | null> => {
    try {
      const response = await api.get<GoalResponse>(`/api/team3/analytics/statistics/goals/${foodId}`);
      return response.data.data || null;
    } catch (error) {
      if ((error as any).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // 목표 생성
  createGoal: async (data: CreateGoalRequest): Promise<void> => {
    await api.post<EmptyResponse>('/api/team3/analytics/statistics/goals', data);
  },

  // 목표 수정
  updateGoal: async (goalId: number, data: UpdateGoalRequest): Promise<void> => {
    await api.put<EmptyResponse>(`/api/team3/analytics/statistics/goals/${goalId}`, data);
  },

  // 목표 삭제
  deleteGoal: async (goalId: number): Promise<void> => {
    await api.delete<EmptyResponse>(`/api/team3/analytics/statistics/goals/${goalId}`);
  }
}; 