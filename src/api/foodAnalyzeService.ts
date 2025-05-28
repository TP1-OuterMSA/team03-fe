import { api } from './axios';
import { 
  Food, 
  FoodCount, 
  FoodInfo, 
  FoodScore, 
  FoodEvaluationSummary,
  DateRange 
} from '../interface/foodAnalyze';

const BASE_URL = 'http://localhost:8080/api/team3/analytics';

export const foodAnalyzeService = {
  // 모든 음식 목록 조회
  getAllFoods: async (): Promise<Food[]> => {
    try {
      const response = await api.get(`${BASE_URL}/food-analyze/get-all-foods`);
      return response.data;
    } catch (error) {
      console.error('음식 목록 조회 실패:', error);
      throw error;
    }
  },

  // 음식 상세 정보 조회
  getFoodInfo: async (foodId: number): Promise<FoodInfo> => {
    try {
      const response = await api.post(`${BASE_URL}/food-analyze/get-food-info`, {
        food_id: foodId
      });
      return response.data;
    } catch (error) {
      console.error('음식 정보 조회 실패:', error);
      throw error;
    }
  },

  // 특정 기간 동안의 음식 출현 횟수 조회
  getFoodCount: async (foodId: number, dateRange: DateRange): Promise<FoodCount> => {
    try {
      const response = await api.post(`${BASE_URL}/food-analyze/get-food-count`, {
        food_id: foodId,
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      });
      return response.data;
    } catch (error) {
      console.error('음식 출현 횟수 조회 실패:', error);
      throw error;
    }
  },

  // 특정 기간 동안의 음식 평점 조회
  getFoodScores: async (foodId: number, dateRange: DateRange): Promise<FoodScore> => {
    try {
      const response = await api.post(`${BASE_URL}/food-analyze/get-food-scores`, {
        food_id: foodId,
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      });
      return response.data;
    } catch (error) {
      console.error('음식 평점 조회 실패:', error);
      throw error;
    }
  },

  // 음식 피드백 요약 조회
  getFoodEvaluationSummary: async (foodId: number, dateRange: DateRange): Promise<FoodEvaluationSummary> => {
    try {
      const response = await api.post(`${BASE_URL}/food-analyze/get-food-evaluation-summary`, {
        food_id: foodId,
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      });
      return response.data;
    } catch (error) {
      console.error('음식 평가 요약 조회 실패:', error);
      throw error;
    }
  }
}; 