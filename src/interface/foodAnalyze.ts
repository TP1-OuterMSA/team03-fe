export interface Food {
  id: number;
  name: string;
}

export interface FoodInfo {
  name: string;
  nutrition: string;
  calorie: number;
  allergy: string;
  category: string;
  subCategory: string | null;
}

export interface FoodCount {
  count: number;
}

export interface FoodScore {
  start_date: string;
  end_date: string;
  scores: number[];
}

export interface FoodEvaluationSummary {
  foodName: string;
  summary: string | null;
  evaluationCount: number;
  error?: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ApiResponse<T> {
  httpStatusCode: number;
  message: string;
  data: T;
  resultType: string;
} 