export type GoalCategory = 'RICE' | 'MAIN_DISH' | 'SIDE_DISH' | 'DESSERT' | 'SOUP';

export interface Goal {
  goalId: number;
  foodId: number;
  foodName: string;
  category: GoalCategory;
  targetScore: number;
  targetFrequency: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalRequest {
  foodId: number;
  targetScore: number;
  targetFrequency: number;
}

export interface UpdateGoalRequest {
  targetScore: number;
  targetFrequency: number;
}

export interface GoalResponse {
  httpStatusCode: number;
  message: string;
  data: Goal;
  resultType: string;
}

export interface GoalListResponse {
  httpStatusCode: number;
  message: string;
  data: Goal[];
  resultType: string;
}

export interface EmptyResponse {
  httpStatusCode: number;
  message: string;
  data: {};
  resultType: string;
}

export interface GoalStatusResponse {
  httpStatusCode: number;
  message: string;
  data: {
    totalGoals: number;
    achievedGoals: number;
    foodGoals: {
      foodId: number;
      foodName: string;
      category: GoalCategory;
      targetScore: number;
      currentScore: number;
      targetFrequency: number;
      currentFrequency: number;
      targetSatisfaction: number;
      currentSatisfaction: number;
      isAchieved: boolean;
    }[];
  };
  resultType: string;
}