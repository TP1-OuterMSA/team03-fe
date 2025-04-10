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
        satisfactionRatingResponseDto: satisfactionRatingData[];
    };
    resultType: string;
}