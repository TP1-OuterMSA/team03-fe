export type PeriodType = 'FIRST_SEMESTER' | 'SECOND_SEMESTER' | 'MONTH_1' | 'MONTH_2' | 'MONTH_3' | 'MONTH_4' | 'MONTH_5' | 'MONTH_6' | 'MONTH_7' | 'MONTH_8' | 'MONTH_9' | 'MONTH_10' | 'MONTH_11' | 'MONTH_12';

export interface Period {
  label: string;
  value: PeriodType;
  startDate: string;
  endDate: string;
}

export interface DesiredFoodItem {
  rank: number;
  foodName: string;
  score: number;
}

export interface DesiredFoodResponse {
  httpStatusCode: number;
  message: string;
  data: DesiredFoodItem[];
  resultType: string;
} 