import { api } from './axios';

export type PeriodType = 'MONTHLY' | 'SEMESTER';
export type Semester = 'FIRST' | 'SECOND';
export type Month =
  | 'JANUARY' | 'FEBRUARY' | 'MARCH' | 'APRIL' | 'MAY' | 'JUNE'
  | 'JULY' | 'AUGUST' | 'SEPTEMBER' | 'OCTOBER' | 'NOVEMBER' | 'DECEMBER';

export interface SelectedPeriod {
  periodType: PeriodType;
  year: number;
  month?: Month;        
  semester?: Semester;  
}

export interface FrequencyItem {
  category: string;
  subCategory: string;
  count: number;
}

export const getFrequency = async (selectedPeriod: SelectedPeriod): Promise<ResponseData> => {
  const { periodType, year, month, semester } = selectedPeriod;

  const query: any = {
    periodType,
    year,
    validForPeriod: true,
  };

  if (periodType === 'MONTHLY' && month) {
    query.month = month;
    query.semester = semester || 'FIRST'; 
  }

  if (periodType === 'SEMESTER' && semester) {
    query.semester = semester;
  }

  const response = await api.get<ResponseData>(
    '/api/team3/analytics/statistics/food/frequency',
    { params: query }
  );
  return response.data;
};

export interface FrequencyData {
    MAIN_DISH: Record<string, number>;
    SIDE_DISH: Record<string, number>;
    SOUP: Record<string, number>;
    DESSERT: Record<string, number>;
    RICE: Record<string, number>;
}
  
export interface ResponseData {
    data: { category: string; subCategory: string; count: number }[];
};