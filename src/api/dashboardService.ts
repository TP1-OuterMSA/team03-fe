import { api } from './axios';
import {
  satisfactionRatingResponse,
  SatisfactionTrendResponse,
  satisfactionRatingData,
  SatisfactionTrendData,
  CategoryRatingData
} from '../interface/dashboard';

const categoryNameMap: { [key: string]: string } = {
  RICE: '밥류',
  SOUP: '국',
  MAIN_DISH: '메인',
  SIDE_DISH: '사이드반찬',
  DESSERT: '디저트',
};

export const getCategoryRatings = async (
  startDate: Date,
  endDate?: Date
): Promise<CategoryRatingData[]> => {
  const response = await api.get('/api/team3/analytics/statistics/category', {
    params: {
      startDate: formatDate(startDate),
      ...(endDate && { endDate: formatDate(endDate) }),
    },
  });

  const rawData = response.data.data; // { category: string, totalScore: number }[]

  const mappedData = rawData.map((item: { category: string; totalScore: number }) => ({
    category: categoryNameMap[item.category] || item.category, // 혹시 매핑 없는 경우 대비
    score: item.totalScore,
  }));

  return mappedData;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; 
};

const localDate = new Date();
const formattedDate = formatDate(localDate);

export const getSatisfactionRating = async (): Promise<satisfactionRatingData[]> => {
  const response = await api.get<satisfactionRatingResponse>('/api/team3/analytics/statistics', {
    params: { localDate: formattedDate },  // date 대신 localDate로 수정
  });

  const { weekly, monthly } = response.data.data;

  const aggregateScores = (
    scores: { score: number; count: number }[],
    type: 'weekly' | 'monthly'
  ): satisfactionRatingData => {
    const result = { one: 0, two: 0, three: 0, four: 0, five: 0 };

    scores.forEach(({ score, count }) => {
      if (score <= 1.5) result.one += count;
      else if (score <= 2.5) result.two += count;
      else if (score <= 3.5) result.three += count;
      else if (score <= 4.5) result.four += count;
      else result.five += count;
    });

    return { type, ...result };
  };

  return [
    aggregateScores(weekly.scores, 'weekly'),
    aggregateScores(monthly.scores, 'monthly'),
  ];
};

export const getSatisfactionTrend = async (): Promise<{
  weekly: SatisfactionTrendData;
  monthly: SatisfactionTrendData;
}> => {
  const response = await api.get<SatisfactionTrendResponse>(
    '/api/team3/analytics/statistics/tracking',
    {
      params: { localDate: formattedDate }, 
    }
  );
  console.log(formattedDate);
  const weeklyLabels = ['월', '화', '수', '목', '금'];
  const monthlyLabels = (() => {
    const now = new Date();
    const labels: string[] = [];
    for (let i = 5; i >= 1; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(`${date.getMonth() + 1}월`);
    }
    return labels;
  })();

  return {
    weekly: {
      type: 'weekly',
      labels: weeklyLabels,
      data: response.data.data.weeklyScore,
    },
    monthly: {
      type: 'monthly',
      labels: monthlyLabels,
      data: response.data.data.monthlyScore,
    },
  };
};
