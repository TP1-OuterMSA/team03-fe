export interface satisfactionRatingData {
  type: 'weekly' | 'monthly';
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface satisfactionRatingResponse {
  httpStatusCode: number;
  message: string;
  data: {
    weekly: {
      periodType: string;
      scores: { score: number; count: number }[];
    };
    monthly: {
      periodType: string;
      scores: { score: number; count: number }[];
    };
  };
  resultType: string;
}

export interface SatisfactionTrendData {
  type: 'weekly' | 'monthly';
  labels: string[];
  data: number[];
}

export interface SatisfactionTrendResponse {
  httpStatusCode: number;
  message: string;
  data: {
    weeklyScore: number[];
    monthlyScore: number[];
  };
  resultType: string;
}
