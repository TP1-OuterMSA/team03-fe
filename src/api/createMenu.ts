import dayjs from 'dayjs';
import { api } from './axios';

export interface WeekInfo {
  label: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

export interface MealTypeDetails {
  menuId: string;
  RICE: string;
  SOUP: string;
  MAIN_DISH: string;
  SIDE_DISH: string;
  DESSERT: string;
  allergies: string[];
  hashtags: string[];
  score?: number | null;
}

export interface DailyMealPlan {
  BREAK_FAST?: MealTypeDetails;
  LUNCH?: MealTypeDetails;
  DINNER?: MealTypeDetails;
}

export type MealType = 'BREAK_FAST' | 'LUNCH' | 'DINNER';

export interface MenuOptions {
  RICE: string[];
  SOUP: string[];
  MAIN_DISH: string[];
  SIDE_DISH: string[];
  DESSERT: string[];
}


interface ApiResponse<T> {
  httpStatusCode: number;
  message: string;
  data: T; 
  resultType: string;
}


const dummyMenuOptions: MenuOptions = {
  RICE: ['쌀밥', '잡곡밥', '현미밥'],
  SOUP: ['김치찌개', '된장찌개', '미역국', '순두부찌개'],
  MAIN_DISH: ['불고기', '제육볶음', '닭갈비', '생선구이', '돈까스'],
  SIDE_DISH: ['김치', '콩나물무침', '시금치나물', '어묵볶음', '감자조림'],
  DESSERT: ['과일', '요거트', '푸딩', '식혜', '주스'],
};

const initialDummySavedMealPlans: { [date: string]: DailyMealPlan } = {
  [dayjs().add(1, 'day').format('YYYY-MM-DD')]: {
    LUNCH: {
      menuId: '1',
      RICE: '잡곡밥',
      SOUP: '된장찌개',
      MAIN_DISH: '제육볶음',
      SIDE_DISH: '김치',
      DESSERT: '요거트',
      allergies: ['돼지고기', '대두'],
      hashtags: ['잔반없는날'],
      score: null,
    },
    DINNER: {
      menuId: '2',
      RICE: '쌀밥',
      SOUP: '미역국',
      MAIN_DISH: '닭갈비',
      SIDE_DISH: '감자조림',
      DESSERT: '주스',
      allergies: ['닭고기'],
      hashtags: [],
      score: null,
    },
  },
  [dayjs().add(2, 'day').format('YYYY-MM-DD')]: {
    BREAK_FAST: {
      menuId: '3',
      RICE: '쌀밥',
      SOUP: '미역국',
      MAIN_DISH: '생선구이',
      SIDE_DISH: '시금치나물',
      DESSERT: '과일',
      allergies: ['생선'],
      hashtags: ['채식데이'],
      score: null,
    },
    LUNCH: {
      menuId: '4',
      RICE: '현미밥',
      SOUP: '순두부찌개',
      MAIN_DISH: '돈까스',
      SIDE_DISH: '어묵볶음',
      DESSERT: '푸딩',
      allergies: ['밀'],
      hashtags: ['특식'],
      score: null,
    },
  },
};

let currentDummySavedMealPlans = { ...initialDummySavedMealPlans };

export const fetchSavedMealPlans = async (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): Promise<{ [date: string]: DailyMealPlan }> => {
  try {
    const response = await api.get<ApiResponse<any>>('/api/team3/analytics/products/menus', {
      params: {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      },
    });

    const fetchedPlans: { [date: string]: DailyMealPlan } = {};
    const apiData = response.data.data;

    if (response.data.httpStatusCode !== 200 || response.data.resultType !== 'SUCCESS') {
      console.error('API Error fetching meal plans:', response.data.message);
      return {};
    }

    if (typeof apiData === 'object' && apiData !== null) {
      if (Array.isArray(apiData)) {
        apiData.forEach((plan: any) => {
          const dateKey = plan.date;
          const mealTypeFromServer = (plan.mealType as string).toUpperCase() as MealType;

          if (!fetchedPlans[dateKey]) {
            fetchedPlans[dateKey] = {};
          }
          fetchedPlans[dateKey][mealTypeFromServer] = {
            menuId: plan.menuId || '',
            RICE: plan.rice || '',
            SOUP: plan.soup || '',
            MAIN_DISH: plan.mainDish || '',
            SIDE_DISH: plan.sideDish || '',
            DESSERT: plan.dessert || '',
            allergies: plan.allergies || [],
            score: plan.score !== undefined ? plan.score : null,
            hashtags: plan.hashtags || [],
          };
        });
      } else {
        for (const dateKey in apiData) {
          if (Object.prototype.hasOwnProperty.call(apiData, dateKey)) {
            const mealDetails = apiData[dateKey];
            if (mealDetails && typeof mealDetails === 'object') {
              const mealTypeFromServer = (mealDetails.mealType as string)?.toUpperCase() as MealType;

              if (!fetchedPlans[dateKey]) {
                fetchedPlans[dateKey] = {};
              }

              if (mealTypeFromServer) {
                fetchedPlans[dateKey][mealTypeFromServer] = {
                  menuId: mealDetails.menuId || '',
                  RICE: mealDetails.rice || '',
                  SOUP: mealDetails.soup || '',
                  MAIN_DISH: mealDetails.mainDish || '',
                  SIDE_DISH: mealDetails.sideDish || '',
                  DESSERT: mealDetails.dessert || '',
                  allergies: mealDetails.allergies || [],
                  score: mealDetails.score !== undefined ? mealDetails.score : null,
                  hashtags: mealDetails.hashtags || [],
                };
              } else {
                console.warn(`Warning: Invalid mealType for date ${dateKey}:`, mealDetails.mealType);
              }
            }
          }
        }
      }
    } else {
      console.warn("API 응답의 'data' 속성이 예상된 배열이나 객체가 아닙니다:", apiData);
      return {};
    }
    console.log(fetchedPlans);
    return fetchedPlans;
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    throw error;
  }
};


export const createMealPlan = async (date: string, mealType: MealType, mealData: Omit<MealTypeDetails, 'allergies' | 'score' | 'menuId'>, hashtags: string[]): Promise<MealTypeDetails> => {
  console.log(`API: Creating meal plan for ${date}, ${mealType}`, mealData, `Hashtags: ${hashtags}`);
  try {
    const payload = {
      RICE: mealData.RICE,
      SOUP: mealData.SOUP,
      MAIN_DISH: mealData.MAIN_DISH,
      SIDE_DISH: mealData.SIDE_DISH,
      DESSERT: mealData.DESSERT,
      hashtags: hashtags,
    };

    const response = await api.post<ApiResponse<{ menuId: string, allergies: string[] }>>(
      `/api/team3/analytics/products/menus/${date}?mealType=${mealType.toUpperCase()}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
      }
    );

    if (response.data.httpStatusCode === 201 && response.data.resultType === 'SUCCESS') {
      const { menuId, allergies } = response.data.data;
      const createdMeal: MealTypeDetails = {
        menuId: menuId.toString(),
        RICE: mealData.RICE,
        SOUP: mealData.SOUP,
        MAIN_DISH: mealData.MAIN_DISH,
        SIDE_DISH: mealData.SIDE_DISH,
        DESSERT: mealData.DESSERT,
        allergies: allergies,
        hashtags: hashtags,
        score: null,
      };
      console.log('API: Meal plan created successfully:', createdMeal);
      return createdMeal;
    } else {
      console.error('API Error creating meal plan:', response.data.message);
      throw new Error(response.data.message || 'Failed to create meal plan.');
    }
  } catch (error) {
    console.error('Error creating meal plan:', error);
    throw error;
  }
};

export const updateMealPlan = async (menuId: string, mealData: Omit<MealTypeDetails, 'allergies' | 'score' | 'menuId'>, hashtags: string[]): Promise<MealTypeDetails> => {
  console.log(`API: Updating meal plan with menuId: ${menuId}`, mealData, `Hashtags: ${hashtags}`);
  try {
    const payload = {
      RICE: mealData.RICE, 
      SOUP: mealData.SOUP, 
      MAIN_DISH: mealData.MAIN_DISH, 
      SIDE_DISH: mealData.SIDE_DISH, 
      DESSERT: mealData.DESSERT, 
      hashtags: hashtags,
    };
    console.log("Update Payload:", payload); 

    const response = await api.put<ApiResponse<{ menuId: string, allergies: string[] }>>(
      `/api/team3/analytics/products/menus/${menuId}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
      }
    );

    if (response.data.httpStatusCode === 201 && response.data.resultType === 'SUCCESS') {
      const { allergies } = response.data.data;
      const updatedMeal: MealTypeDetails = {
        menuId: menuId,
        RICE: mealData.RICE,
        SOUP: mealData.SOUP,
        MAIN_DISH: mealData.MAIN_DISH,
        SIDE_DISH: mealData.SIDE_DISH,
        DESSERT: mealData.DESSERT,
        allergies: allergies,
        hashtags: hashtags,
        score: null, 
      };
      console.log('API: Meal plan updated successfully:', updatedMeal);
      return updatedMeal;
    } else {
      console.error('API Error updating meal plan:', response.data.message);
      throw new Error(response.data.message || 'Failed to update meal plan.');
    }
  } catch (error) {
    console.error('Error updating meal plan:', error);
    throw error;
  }
};


export const deleteMealPlan = async (menuId: string): Promise<void> => {
  console.log(`API: Deleting meal plan with menuId: ${menuId}`);
  try {
    const response = await api.delete<ApiResponse<any>>(
      `/api/team3/analytics/products/menus/${menuId}`,
      {
        headers: {
          'Accept': '*/*',
        },
      }
    );

    if (response.data.httpStatusCode === 200 && response.data.resultType === 'SUCCESS') {
      console.log(`API: Meal plan with menuId ${menuId} deleted successfully.`);
      return;
    } else {
      console.error('API Error deleting meal plan:', response.data.message);
      throw new Error(response.data.message || 'Failed to delete meal plan.');
    }
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    throw error;
  }
};


export const predictMealScore = async (mealData: Omit<MealTypeDetails, 'allergies' | 'hashtags' | 'score'>): Promise<number> => {
  console.log(`API: Requesting meal score prediction:`, mealData);
  return new Promise((resolve) => {
    setTimeout(() => {
      const dummyScore = Math.floor(Math.random() * 30) + 70; 
      console.log(`API: Predicted meal score: ${dummyScore}`);
      resolve(dummyScore);
    }, 700);
  });
};

export const deleteHashtag = async (date: string, mealType: MealType, hashtag: string): Promise<void> => {
  console.log(`API: Deleting hashtag: ${date}, ${mealType}, ${hashtag}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentDummySavedMealPlans[date] && currentDummySavedMealPlans[date][mealType]) {
        const mealDetails = currentDummySavedMealPlans[date][mealType];
        const initialLength = mealDetails!.hashtags.length;
        mealDetails!.hashtags = mealDetails!.hashtags.filter(h => h !== hashtag);

        if (mealDetails!.hashtags.length < initialLength) {
          currentDummySavedMealPlans = {
            ...currentDummySavedMealPlans,
            [date]: {
              ...(currentDummySavedMealPlans[date] || {}),
              [mealType]: mealDetails
            }
          };
          console.log(`API: Hashtag deleted: ${date}, ${mealType}, ${hashtag}`);
          resolve();
        } else {
          reject(new Error('해시태그를 찾을 수 없습니다.'));
        }
      } else {
        reject(new Error('해당 날짜와 식사 타입의 식단이 존재하지 않습니다.'));
      }
    }, 300);
  });
};

export const fetchMenuOptions = async (): Promise<MenuOptions> => {
  console.log('API: Fetching menu options');
  try {
    const response = await api.get<ApiResponse<any>>('/api/team3/analytics/products/foods');

    if (response.data.httpStatusCode === 200 && response.data.resultType === 'SUCCESS') {
      const apiData = response.data.data;
      const transformedOptions: MenuOptions = {
        RICE: [],
        SOUP: [], 
        MAIN_DISH: [],
        SIDE_DISH: [],
        DESSERT: [],
      };

      for (const category in apiData) {
        if (Object.prototype.hasOwnProperty.call(apiData, category)) {
          if (Array.isArray(apiData[category])) {
            const upperCaseCategory = category.toUpperCase() as keyof MenuOptions;
            if (transformedOptions[upperCaseCategory]) {
              transformedOptions[upperCaseCategory] = apiData[category].map((item: any) => item.foodName);
            } else {
              console.warn(`Warning: Unexpected category received from API: ${category}. Skipping.`);
            }
          } else {
            console.warn(`Warning: Expected array for category ${category}, but got:`, apiData[category]);
          }
        }
      }
      console.log('API: Successfully fetched and transformed menu options.', transformedOptions);
      return transformedOptions;
    } else {
      console.error('API Error fetching menu options:', response.data.message);
      return dummyMenuOptions;
    }
  } catch (error) {
    console.error('Error fetching menu options:', error);
    return dummyMenuOptions;
  }
};

export const predefinedHashtags: string[] = ['채식데이', '잔반없는날', '특식', '친환경'];