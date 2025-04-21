import { api } from './axios';
import {
  satisfactionRatingResponse,
  SatisfactionTrendResponse,
  satisfactionRatingData,
  SatisfactionTrendData,
} from '../interface/dashboard';

// 날짜 포맷팅 함수
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];  // "2024-04-13" 포맷
};

// 현재 날짜를 'localDate'로 포맷
const localDate = new Date();
const formattedDate = formatDate(localDate);

// 만족도 점수 조회
export const getSatisfactionRating = async (): Promise<satisfactionRatingData[]> => {
  const response = await api.get<satisfactionRatingResponse>('/api/team3/analytics/statistics', {
    params: { localDate: formattedDate },  // date 대신 localDate로 수정
  });

  const { weekly, monthly } = response.data.data;

  // 점수별로 집계하는 함수
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

// 만족도 트렌드 조회
export const getSatisfactionTrend = async (): Promise<{
  weekly: SatisfactionTrendData;
  monthly: SatisfactionTrendData;
}> => {
  const response = await api.get<SatisfactionTrendResponse>(
    '/api/team3/analytics/statistics/tracking',
    {
      params: { localDate: formattedDate },  // date 대신 localDate로 수정
    }
  );
  console.log(formattedDate);
  // 주간 라벨 (월~금)
  const weeklyLabels = ['월', '화', '수', '목', '금'];

  // 월간 라벨 (5개월 전부터 1개월 전까지)
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
