import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

interface WeekInfo {
  label: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

interface MealPlan {
  RICE: string;
  SOUP: string;
  MAIN_DISH: string;
  SIDE_DISH: string;
  DESSERT: string;
  allergies: string[];
  hashtags: string[];
  score?: number | null; // 예측 점수 (null도 가능하도록 변경)
}

interface MenuOptions {
  RICE: string[];
  SOUP: string[];
  MAIN_DISH: string[];
  SIDE_DISH: string[];
  DESSERT: string[];
}

// 오늘부터 몇 주간의 정보(월요일-금요일)를 가져오는 헬퍼 함수
const getWeeksFromToday = (count = 4): WeekInfo[] => {
  const today = dayjs();
  const startOfWeek = today.startOf('week').add(1, 'day'); // 월요일부터 시작
  const weeks: WeekInfo[] = [];

  for (let i = 0; i < count; i++) {
    const weekStart = startOfWeek.add(i, 'week');
    const month = weekStart.month() + 1;
    // 월별 주차 계산 (정확도는 상황에 따라 다를 수 있음)
    const weekOfMonth = Math.ceil((weekStart.date() + weekStart.startOf('month').day()) / 7);

    weeks.push({
      label: `${month}월 ${weekOfMonth}주차`,
      startDate: weekStart,
      endDate: weekStart.add(4, 'day'), // 월요일부터 금요일까지
    });
  }

  return weeks;
};

// --- 더미 API 함수 정의 ---
// 실제 API 호출 시에는 axios 등을 사용하여 실제 엔드포인트에 요청을 보냅니다.

const dummyMenuOptions: MenuOptions = {
  RICE: ['쌀밥', '잡곡밥', '현미밥'],
  SOUP: ['김치찌개', '된장찌개', '미역국', '순두부찌개'],
  MAIN_DISH: ['불고기', '제육볶음', '닭갈비', '생선구이', '돈까스'],
  SIDE_DISH: ['김치', '콩나물무침', '시금치나물', '어묵볶음', '감자조림'],
  DESSERT: ['과일', '요거트', '푸딩', '식혜', '주스'],
};

const predefinedHashtags: string[] = ['채식데이', '잔반없는날', '특식', '친환경'];

// 더미 저장된 식단 데이터 (초기값)
const initialDummySavedMealPlans: { [date: string]: MealPlan } = {
  [dayjs().add(1, 'day').format('YYYY-MM-DD')]: {
    RICE: '잡곡밥',
    SOUP: '된장찌개',
    MAIN_DISH: '제육볶음',
    SIDE_DISH: '김치',
    DESSERT: '요거트',
    allergies: ['돼지고기', '대두'],
    hashtags: ['잔반없는날'],
    score: null,
  },
  [dayjs().add(2, 'day').format('YYYY-MM-DD')]: {
    RICE: '쌀밥',
    SOUP: '미역국',
    MAIN_DISH: '생선구이',
    SIDE_DISH: '시금치나물',
    DESSERT: '과일',
    allergies: ['생선'],
    hashtags: ['채식데이'],
    score: null,
  },
};

let currentDummySavedMealPlans = { ...initialDummySavedMealPlans };

const fetchSavedMealPlans = async (weekStart: dayjs.Dayjs, weekEnd: dayjs.Dayjs): Promise<{ [date: string]: MealPlan }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredPlans: { [date: string]: MealPlan } = {};
      let currentDate = weekStart;
      while (currentDate.isBefore(weekEnd.add(1, 'day'))) {
        const dateKey = currentDate.format('YYYY-MM-DD');
        if (currentDummySavedMealPlans[dateKey]) {
          filteredPlans[dateKey] = currentDummySavedMealPlans[dateKey];
        }
        currentDate = currentDate.add(1, 'day');
      }
      resolve(filteredPlans);
    }, 300);
  });
};

const saveMealPlan = async (date: string, mealData: Omit<MealPlan, 'allergies' | 'score'>, hashtags: string[]): Promise<string[]> => {
  console.log(`식단 저장 요청: ${date}`, mealData, `해시태그: ${hashtags}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const dummyAllergies = ['밀', '대두'];
      currentDummySavedMealPlans = {
        ...currentDummySavedMealPlans,
        [date]: { ...mealData, allergies: dummyAllergies, hashtags: hashtags || [], score: null }
      };
      console.log(`식단 저장 완료: ${date}`, currentDummySavedMealPlans[date]);
      resolve(dummyAllergies);
    }, 500);
  });
};

const updateMealPlan = async (date: string, mealData: Omit<MealPlan, 'allergies' | 'score'>, hashtags: string[]): Promise<string[]> => {
  console.log(`식단 수정 요청: ${date}`, mealData, `해시태그: ${hashtags}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const dummyAllergies = ['닭고기', '메밀'];
      currentDummySavedMealPlans = {
        ...currentDummySavedMealPlans,
        [date]: { ...mealData, allergies: dummyAllergies, hashtags: hashtags || [], score: null }
      };
      console.log(`식단 수정 완료: ${date}`, currentDummySavedMealPlans[date]);
      resolve(dummyAllergies);
    }, 500);
  });
};

const deleteMealPlan = async (date: string): Promise<void> => {
  console.log(`식단 삭제 요청: ${date}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const { [date]: _, ...rest } = currentDummySavedMealPlans;
      currentDummySavedMealPlans = rest;
      console.log(`식단 삭제 완료: ${date}`);
      resolve();
    }, 300);
  });
};

const predictMealScore = async (mealData: Omit<MealPlan, 'allergies' | 'hashtags' | 'score'>): Promise<number> => {
  console.log(`식단 점수 예측 요청:`, mealData);
  return new Promise((resolve) => {
    setTimeout(() => {
      const dummyScore = Math.floor(Math.random() * 30) + 70;
      console.log(`식단 점수 예측 결과: ${dummyScore}`);
      resolve(dummyScore);
    }, 700);
  });
};

const deleteHashtag = async (date: string, hashtag: string): Promise<void> => {
  console.log(`해시태그 삭제 요청: ${date}, ${hashtag}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentDummySavedMealPlans[date]) {
        const initialLength = currentDummySavedMealPlans[date].hashtags.length;
        currentDummySavedMealPlans[date].hashtags = currentDummySavedMealPlans[date].hashtags.filter(h => h !== hashtag);
        if (currentDummySavedMealPlans[date].hashtags.length < initialLength) {
          console.log(`해시태그 삭제 완료: ${date}, ${hashtag}`);
          resolve();
        } else {
          reject(new Error('해시태그를 찾을 수 없습니다.'));
        }
      } else {
        reject(new Error('해당 날짜의 식단이 존재하지 않습니다.'));
      }
    }, 300);
  });
};

// 9. 메뉴 정보 조회 (더미) - 클라이언트 사이드에서 미리 정의된 데이터를 반환
const fetchMenuOptions = (): MenuOptions => {
  return dummyMenuOptions;
};

// 급식 메뉴를 생성하는 메인 React 컴포넌트
const CreateMenu = () => {
  const weeks = getWeeksFromToday(4);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const [savedMealPlans, setSavedMealPlans] = useState<{ [date: string]: MealPlan }>({});
  const [editingMealPlan, setEditingMealPlan] = useState<{
    [date: string]: Omit<MealPlan, 'allergies' | 'score'>
  }>({});
  const menuOptions = fetchMenuOptions();

  const [editModeDate, setEditModeDate] = useState<string | null>(null);

  const selectedWeek = weeks[selectedWeekIdx];
  const weekdays = Array.from({ length: 5 }, (_, i) =>
    selectedWeek.startDate.add(i, 'day')
  );

  const fetchAndSetMealPlans = useCallback(async () => {
    try {
      const start = selectedWeek.startDate;
      const end = selectedWeek.endDate;
      const fetchedPlans = await fetchSavedMealPlans(start, end);
      setSavedMealPlans(fetchedPlans);

      if (editModeDate && !fetchedPlans[editModeDate]) {
        setEditModeDate(null);
        setEditingMealPlan({});
      }
      // 새 식단 추가 모드에서 주차를 바꾸면 편집 모드 해제
      // 이 로직은 `editingMealPlan`이 비어있지 않고, `editModeDate`가 null일 때 작동해야 합니다.
      if (!editModeDate && Object.keys(editingMealPlan).length > 0) {
        setEditingMealPlan({});
      }

    } catch (error) {
      console.error('식단 불러오기 실패:', error);
      setSavedMealPlans({});
      setEditingMealPlan({});
      setEditModeDate(null);
    }
  }, [selectedWeek.startDate, selectedWeek.endDate, editModeDate]);

  useEffect(() => {
    fetchAndSetMealPlans();
  }, [selectedWeekIdx]); // fetchAndSetMealPlans를 의존성 배열에 추가 (정확성 향상)

  const handleMenuSelectChange = useCallback((date: string, category: keyof Omit<MealPlan, 'allergies' | 'score' | 'hashtags'>, value: string) => {
    setEditingMealPlan(prev => ({
      ...prev,
      [date]: {
        ...(prev[date] || { RICE: '', SOUP: '', MAIN_DISH: '', SIDE_DISH: '', DESSERT: '', hashtags: [] }),
        [category]: value,
      },
    }));
  }, []);

  // 해시태그 추가/제거 핸들러 (편집 모드에서 사용)
  const handleHashtagToggle = useCallback((date: string, hashtag: string) => {
    setEditingMealPlan(prev => {
      const currentMeal = prev[date] || { RICE: '', SOUP: '', MAIN_DISH: '', SIDE_DISH: '', DESSERT: '', hashtags: [] };
      const newHashtags = currentMeal.hashtags.includes(hashtag)
        ? currentMeal.hashtags.filter(h => h !== hashtag) // 이미 있으면 제거
        : [...currentMeal.hashtags, hashtag]; // 없으면 추가

      return {
        ...prev,
        [date]: {
          ...currentMeal,
          hashtags: newHashtags,
        },
      };
    });
  }, []);

  const handleEditMode = useCallback((date: string) => {
    const planToEdit = savedMealPlans[date];
    if (planToEdit) {
      const { allergies, score, ...mealData } = planToEdit;
      setEditingMealPlan(prev => ({
        ...prev,
        [date]: mealData
      }));
    } else {
      setEditingMealPlan(prev => ({
        ...prev,
        [date]: { RICE: '', SOUP: '', MAIN_DISH: '', SIDE_DISH: '', DESSERT: '', hashtags: [] }
      }));
    }
    setEditModeDate(date);
  }, [savedMealPlans]);

  const handleCancelEdit = useCallback(() => {
    setEditModeDate(null);
    setEditingMealPlan({});
  }, []);

  const handleSaveMealPlan = useCallback(async (date: string) => {
    const mealData = editingMealPlan[date];
    if (!mealData || Object.values(mealData).slice(0, 5).some(menu => !menu)) {
      alert('모든 메뉴를 선택해주세요.');
      return;
    }
    try {
      const allergies = await saveMealPlan(date, mealData, mealData.hashtags || []);
      alert(`식단이 저장되었습니다!\n알레르기 정보: ${allergies.join(', ')}`);
      await fetchAndSetMealPlans();
      setEditModeDate(null);
      setEditingMealPlan({});
    } catch (error) {
      console.error('식단 저장 실패:', error);
      alert('식단 저장에 실패했습니다.');
    }
  }, [editingMealPlan, fetchAndSetMealPlans]);

  const handleUpdateMealPlan = useCallback(async (date: string) => {
    const mealDataToUpdate = editingMealPlan[date];
    if (!mealDataToUpdate || Object.values(mealDataToUpdate).slice(0, 5).some(menu => !menu)) {
      alert('모든 메뉴를 선택해주세요.');
      return;
    }

    try {
      const allergies = await updateMealPlan(date, mealDataToUpdate, mealDataToUpdate.hashtags || []);
      alert(`식단이 수정되었습니다!\n알레르기 정보: ${allergies.join(', ')}`);
      await fetchAndSetMealPlans();
      setEditModeDate(null);
      setEditingMealPlan({});
    } catch (error) {
      console.error('식단 수정 실패:', error);
      alert('식단 수정에 실패했습니다.');
    }
  }, [editingMealPlan, fetchAndSetMealPlans]);

  const handleDeleteMealPlan = useCallback(async (date: string) => {
    if (window.confirm('정말로 이 식단을 삭제하시겠습니까?')) {
      try {
        await deleteMealPlan(date);
        alert('식단이 삭제되었습니다.');
        await fetchAndSetMealPlans();
        setEditModeDate(null);
        setEditingMealPlan({});
      } catch (error) {
        console.error('식단 삭제 실패:', error);
        alert('식단 삭제에 실패했습니다.');
      }
    }
  }, [fetchAndSetMealPlans]);

  const handlePredictScore = useCallback(async (date: string) => {
    const mealDataToPredict = savedMealPlans[date];
    if (!mealDataToPredict || Object.values(mealDataToPredict).slice(0, 5).some(menu => !menu)) {
      alert('예측할 식단 정보가 부족합니다. 먼저 식단을 저장해주세요.');
      return;
    }
    try {
      const score = await predictMealScore(mealDataToPredict);
      setSavedMealPlans(prev => ({
        ...prev,
        [date]: {
          ...(prev[date] || mealDataToPredict),
          score: score,
        },
      }));
    } catch (error) {
      console.error('점수 예측 실패:', error);
      alert('점수 예측에 실패했습니다.');
    }
  }, [savedMealPlans]);

  // 해시태그 삭제 (해당 태그 클릭 시 삭제) - 저장된 식단에서만 동작
  const handleDeleteHashtag = useCallback(async (date: string, hashtag: string, fromEditing = false) => {
    if (window.confirm(`${hashtag} 해시태그를 삭제하시겠습니까?`)) {
      try {
        if (!fromEditing && savedMealPlans[date]) { // 저장된 식단일 경우만 API 호출
          await deleteHashtag(date, hashtag);
          alert(`${hashtag} 해시태그가 삭제되었습니다.`);
          await fetchAndSetMealPlans(); // Re-fetch to update the UI
        } else if (editingMealPlan[date]) { // 편집 중인 상태에서 삭제
          setEditingMealPlan(prev => {
            const newEditing = { ...prev };
            if (newEditing[date]) {
              newEditing[date].hashtags = newEditing[date].hashtags.filter(h => h !== hashtag);
            }
            return newEditing;
          });
          alert(`${hashtag} 해시태그가 삭제되었습니다.`);
        }
      } catch (error: any) {
        alert(`해시태그 삭제 실패: ${error.message}`);
      }
    }
  }, [savedMealPlans, editingMealPlan, fetchAndSetMealPlans]);


  return (
    <Wrapper>
      <Title>주차별 식단 관리</Title>
      <WeekSelector>
        {weeks.map((week, idx) => (
          <WeekButton
            key={week.label}
            selected={selectedWeekIdx === idx}
            onClick={() => setSelectedWeekIdx(idx)}
          >
            {week.label}
          </WeekButton>
        ))}
      </WeekSelector>

      <CardContainer>
        {weekdays.map((date) => {
          const dateKey = date.format('YYYY-MM-DD');
          const savedPlan = savedMealPlans[dateKey];
          const isEditing = editModeDate === dateKey;

          const currentMeal = isEditing ? editingMealPlan[dateKey] : savedPlan;

          const currentHashtags = currentMeal?.hashtags || [];

          return (
            <MenuCard key={dateKey}>
              <CardTitle>{date.format('M월 D일 (dd)')}</CardTitle>

              {isEditing ? (
                // 편집 모드 (생성 또는 수정)
                <>
                  <SelectRow>
                    <SelectLabel>밥류</SelectLabel>
                    <MenuSelect
                      value={currentMeal?.RICE || ''}
                      onChange={(e) => handleMenuSelectChange(dateKey, 'RICE', e.target.value)}
                    >
                      <option value="">선택</option>
                      {menuOptions.RICE.map((menu) => (
                        <option key={menu} value={menu}>{menu}</option>
                      ))}
                    </MenuSelect>
                  </SelectRow>
                  <SelectRow>
                    <SelectLabel>국/찌개류</SelectLabel>
                    <MenuSelect
                      value={currentMeal?.SOUP || ''}
                      onChange={(e) => handleMenuSelectChange(dateKey, 'SOUP', e.target.value)}
                    >
                      <option value="">선택</option>
                      {menuOptions.SOUP.map((menu) => (
                        <option key={menu} value={menu}>{menu}</option>
                      ))}
                    </MenuSelect>
                  </SelectRow>
                  <SelectRow>
                    <SelectLabel>메인반찬</SelectLabel>
                    <MenuSelect
                      value={currentMeal?.MAIN_DISH || ''}
                      onChange={(e) => handleMenuSelectChange(dateKey, 'MAIN_DISH', e.target.value)}
                    >
                      <option value="">선택</option>
                      {menuOptions.MAIN_DISH.map((menu) => (
                        <option key={menu} value={menu}>{menu}</option>
                      ))}
                    </MenuSelect>
                  </SelectRow>
                  <SelectRow>
                    <SelectLabel>사이드반찬</SelectLabel>
                    <MenuSelect
                      value={currentMeal?.SIDE_DISH || ''}
                      onChange={(e) => handleMenuSelectChange(dateKey, 'SIDE_DISH', e.target.value)}
                    >
                      <option value="">선택</option>
                      {menuOptions.SIDE_DISH.map((menu) => (
                        <option key={menu} value={menu}>{menu}</option>
                      ))}
                    </MenuSelect>
                  </SelectRow>
                  <SelectRow>
                    <SelectLabel>디저트</SelectLabel>
                    <MenuSelect
                      value={currentMeal?.DESSERT || ''}
                      onChange={(e) => handleMenuSelectChange(dateKey, 'DESSERT', e.target.value)}
                    >
                      <option value="">선택</option>
                      {menuOptions.DESSERT.map((menu) => (
                        <option key={menu} value={menu}>{menu}</option>
                      ))}
                    </MenuSelect>
                  </SelectRow>

                  {/* 해시태그 선택 및 표시 부분 */}
                  <SelectRow>
                    <SelectLabel>해시태그</SelectLabel>
                    <SelectedHashtagDisplay>
                      {currentHashtags.map(tag => (
                        <SelectedTag key={tag}>
                          #{tag}
                          <DeleteTagButton onClick={() => handleDeleteHashtag(dateKey, tag, true)}>x</DeleteTagButton>
                        </SelectedTag>
                      ))}
                      {/* 선택되지 않은 해시태그만 드롭다운에 표시 */}
                      <MenuSelect
                        value="" // 항상 빈 값으로 설정하여 플레이스홀더처럼 보이게
                        onChange={(e) => {
                          if (e.target.value) {
                            handleHashtagToggle(dateKey, e.target.value);
                            e.target.value = ''; // 선택 후 드롭다운 초기화
                          }
                        }}
                        style={{ flexGrow: 1, minWidth: '100px', maxWidth: '100%' }} // 선택 박스 스타일 조정
                      >
                        <option value="">해시태그 추가</option>
                        {predefinedHashtags.filter(tag => !currentHashtags.includes(tag)).map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </MenuSelect>
                    </SelectedHashtagDisplay>
                  </SelectRow>


                  <ButtonGroup>
                    {savedPlan ? (
                      <ActionButton onClick={() => handleUpdateMealPlan(dateKey)}>수정 완료</ActionButton>
                    ) : (
                      <ActionButton onClick={() => handleSaveMealPlan(dateKey)}>저장</ActionButton>
                    )}
                    <ActionButton danger onClick={handleCancelEdit}>취소</ActionButton>
                  </ButtonGroup>
                </>
              ) : (
                // 조회 모드
                <>
                  {savedPlan ? (
                    <>
                      <MenuList>
                        <MenuItem>밥류: **{savedPlan.RICE}**</MenuItem>
                        <MenuItem>국/찌개류: **{savedPlan.SOUP}**</MenuItem>
                        <MenuItem>메인반찬: **{savedPlan.MAIN_DISH}**</MenuItem>
                        <MenuItem>사이드반찬: **{savedPlan.SIDE_DISH}**</MenuItem>
                        <MenuItem>디저트: **{savedPlan.DESSERT}**</MenuItem>
                      </MenuList>
                      <InfoSection>
                        <InfoLabel>알레르기 정보:</InfoLabel>
                        <InfoContent>{savedPlan.allergies.length > 0 ? savedPlan.allergies.join(', ') : '없음'}</InfoContent>
                      </InfoSection>
                      <InfoSection>
                        <InfoLabel>해시태그:</InfoLabel>
                        <HashtagList>
                          {currentHashtags.map(tag => (
                            <HashtagItem key={tag} onClick={() => handleDeleteHashtag(dateKey, tag, false)}>
                              #{tag} <DeleteTagButtonSmall>x</DeleteTagButtonSmall>
                            </HashtagItem>
                          ))}
                        </HashtagList>
                      </InfoSection>

                      {savedPlan.score !== null && savedPlan.score !== undefined ? (
                        <ScoreDisplay>예측 선호 점수: **{savedPlan.score}**점</ScoreDisplay>
                      ) : (
                        <PredictButton onClick={() => handlePredictScore(dateKey)}>선호 점수 예측</PredictButton>
                      )}
                      <ButtonGroup>
                        <ActionButton onClick={() => handleEditMode(dateKey)}>수정</ActionButton>
                        <ActionButton danger onClick={() => handleDeleteMealPlan(dateKey)}>삭제</ActionButton>
                      </ButtonGroup>
                    </>
                  ) : (
                    // 저장된 식단이 없는 경우 (새 식단 생성 유도)
                    <EmptyMealPlan>
                      <p>해당 날짜에 저장된 식단이 없습니다.</p>
                      <ActionButton primary onClick={() => handleEditMode(dateKey)}>식단 추가</ActionButton>
                    </EmptyMealPlan>
                  )}
                </>
              )}
            </MenuCard>
          );
        })}
      </CardContainer>
    </Wrapper>
  );
};

export default CreateMenu;

// --- Styled Components 정의 ---

const Wrapper = styled.div`
  padding: 2rem;
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; /* 한글 폰트 적용 */
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: bold;
`;

const WeekSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
`;

const WeekButton = styled.button<{ selected: boolean }>`
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  border: 1px solid ${({ selected }) => (selected ? '#0056b3' : '#a7d9ff')};
  background-color: ${({ selected }) => (selected ? '#007bff' : '#e2f0ff')};
  color: ${({ selected }) => (selected ? 'white' : '#333')};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#0056b3' : '#cce5ff')};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

const MenuCard = styled.div`
  width: 340px; /* 카드 너비 조정 */
  padding: 2rem;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative; /* 점수 예측 텍스트를 위해 */
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #eee;
  font-weight: bold;
`;

const SelectRow = styled.div`
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
`;

const SelectLabel = styled.div`
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

// 셀렉트 박스 스타일
const MenuSelect = styled.select`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fdfdfd;
  font-size: 1rem;
  appearance: none; /* 기본 셀렉트 박스 화살표 숨김 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23333' d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592c.86 0 1.32 1.013.754 1.658L8.753 11.14a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 1em;
  cursor: pointer;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    outline: none;
  }
`;

// 기존 MenuSelectMultiple은 이제 사용하지 않음 (대신 SelectedHashtagDisplay와 MenuSelect 조합)
// const MenuSelectMultiple = styled(MenuSelect).attrs({ as: 'select' })`
//   height: auto;
//   min-height: 100px;
//   & option {
//     padding: 8px 10px;
//   }
// `;

const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ primary?: boolean; danger?: boolean }>`
  padding: 0.8rem 1.2rem;
  border: none;
  background-color: ${({ primary, danger }) =>
    primary ? '#28a745' : danger ? '#dc3545' : '#007bff'};
  color: white;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 1rem;

  &:hover {
    background-color: ${({ primary, danger }) =>
      primary ? '#218838' : danger ? '#c82333' : '#0056b3'};
    transform: translateY(-2px);
  }
`;

const PredictButton = styled.button`
  margin-top: auto;
  padding: 1rem 2rem;
  background-color: #6f42c1;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  align-self: center;
  width: 90%;
  margin-top: 1.5rem;
  font-size: 1.1rem;

  &:hover {
    background-color: #5c37a6;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
`;

const MenuItem = styled.li`
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
  &:last-child {
    margin-bottom: 0;
  }
  & strong {
    color: #007bff;
  }
`;

const InfoSection = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #555;
  margin-right: 0.5rem;
`;

const InfoContent = styled.span`
  color: #333;
  font-size: 0.95rem;
`;

const HashtagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const HashtagItem = styled.span`
  background-color: #e0f7fa;
  color: #00796b;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #b2ebf2;
  }
`;

// 새롭게 추가된 스타일드 컴포넌트
const SelectedHashtagDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fdfdfd;
  min-height: 40px; /* 최소 높이 설정 */
  align-items: center;
`;

const SelectedTag = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #e0f7fa;
  color: #00796b;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  white-space: nowrap; /* 태그 내용이 줄바꿈되지 않도록 */
  cursor: default; /* 드래그 방지 */
`;

const DeleteTagButton = styled.button`
  background: none;
  border: none;
  color: #00796b;
  font-size: 0.9rem;
  margin-left: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #d32f2f;
  }
`;

const DeleteTagButtonSmall = styled(DeleteTagButton)`
  font-size: 0.7rem;
  margin-left: 0.3rem;
  color: #00796b; /* Saved view maintains original color for X */
  &:hover {
    color: #d32f2f;
  }
`;

const ScoreDisplay = styled.div`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #28a745;
  margin-top: 1.5rem;
  padding: 0.8rem;
  border: 2px solid #28a745;
  border-radius: 10px;
  background-color: #e6ffed;
`;

const EmptyMealPlan = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: #777;
  font-size: 1.1rem;
  & p {
    margin-bottom: 1rem;
  }
  ${ActionButton} {
    margin-top: 1rem;
  }
`;