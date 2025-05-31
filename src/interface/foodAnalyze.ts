export interface Food {
  id: number;
  name: string;
  category: string;
  subCategory: string | null;
}

export interface FoodInfo {
  id: number;
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
  dates: string[];
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