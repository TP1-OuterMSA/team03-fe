import { api } from './axios';
import { DesiredFoodResponse, PeriodType } from '../interface/wantedMenu';
import { FrequencyData } from '../interface/dashboard';

// 날짜 포맷팅 함수
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 기간 타입에 따라 날짜 범위 계산
export const getDateRangeByPeriodType = (periodType: PeriodType): { startDate: string; endDate: string } => {
  const currentYear = new Date().getFullYear();

  // 학기별 날짜 계산
  if (periodType === 'FIRST_SEMESTER') {
    return {
      startDate: `${currentYear}-03-01`,
      endDate: `${currentYear}-08-31`,
    };
  }

  if (periodType === 'SECOND_SEMESTER') {
    return {
      startDate: `${currentYear}-09-01`,
      endDate: `${currentYear}-02-28`,
    };
  }

  // 월별 날짜 계산
  const monthMatch = periodType.match(/MONTH_(\d+)/);
  if (monthMatch) {
    const month = parseInt(monthMatch[1], 10) - 1; // JavaScript에서 월은 0부터 시작
    const startDate = new Date(currentYear, month, 1);
    const endDate = new Date(currentYear, month + 1, 0);

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  }

  // 기본값은 현재 달
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: formatDate(startOfMonth),
    endDate: formatDate(endOfMonth),
  };
};

// 직접 날짜를 지정하여 API 호출
export const getDesiredFoods = async (startDate: string, endDate: string): Promise<DesiredFoodResponse> => {
  const response = await api.get('/api/team3/analytics/statistics/desired-food', {
    params: { startDate, endDate },
  });
  return response.data;
};

// 기간 타입을 받아 날짜를 계산하여 API 호출
export const getDesiredFoodsByPeriod = async (periodType: PeriodType): Promise<DesiredFoodResponse> => {
  const { startDate, endDate } = getDateRangeByPeriodType(periodType);
  return getDesiredFoods(startDate, endDate);
};
