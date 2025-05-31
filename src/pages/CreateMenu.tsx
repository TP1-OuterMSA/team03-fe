import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {
  WeekInfo,
  MealTypeDetails,
  DailyMealPlan,
  MealType,
  fetchSavedMealPlans,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  deleteHashtag,
  fetchMenuOptions,
  predefinedHashtags,
  MenuOptions,
} from '../api/createMenu';
dayjs.locale('ko');


const getWeeks = (startOffset = 0, count = 5): WeekInfo[] => {
  const today = dayjs();
  const startOfCurrentWeek = today.startOf('week').add(1, 'day'); 
  const weeks: WeekInfo[] = [];

  for (let i = 0; i < count; i++) {
    const weekStart = startOfCurrentWeek.add(startOffset + i, 'week');
    const month = weekStart.month() + 1;

    const weekOfMonth = Math.ceil((weekStart.date() + weekStart.startOf('month').day()) / 7);

    weeks.push({
      label: `${month}월 ${weekOfMonth}주차`,
      startDate: weekStart,
      endDate: weekStart.add(4, 'day'),
    });
  }

  return weeks;
};


const CreateMenu = () => {
  const [startWeekOffset, setStartWeekOffset] = useState(0); 
  const displayWeekCount = 5;
  const weeks = getWeeks(startWeekOffset, displayWeekCount);

  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const [savedMealPlans, setSavedMealPlans] = useState<{ [date: string]: DailyMealPlan }>({});

 
  const [menuOptions, setMenuOptions] = useState<MenuOptions>({
    RICE: [],
    SOUP: [],
    MAIN_DISH: [],
    SIDE_DISH: [],
    DESSERT: [],
  });

  const [editingMealPlan, setEditingMealPlan] = useState<{
    [date: string]: {
      [mealType in MealType]?: Omit<MealTypeDetails, 'allergies' | 'score'>;
    };
  }>({});

  const [selectedMealTypesPerDate, setSelectedMealTypesPerDate] = useState<{
    [date: string]: MealType;
  }>({});

  const [editModeDate, setEditModeDate] = useState<string | null>(null);

  const selectedWeek = weeks[selectedWeekIdx];
  const weekdays = Array.from({ length: 5 }, (_, i) =>
    selectedWeek.startDate.add(i, 'day')
  );

  useEffect(() => {
    const loadMenuOptions = async () => {
      try {
        const options = await fetchMenuOptions();
        setMenuOptions(options); 
      } catch (error) {
        console.error("메뉴 옵션 불러오기 실패:", error);
        setMenuOptions({
          RICE: [],
          SOUP: [],
          MAIN_DISH: [],
          SIDE_DISH: [],
          DESSERT: [],
        });
      }
    };
    loadMenuOptions();
  }, []);

  useEffect(() => {
    const initialMealTypes: { [date: string]: MealType } = {};
    weekdays.forEach(date => {
      const dateKey = date.format('YYYY-MM-DD');
      if (savedMealPlans[dateKey]?.LUNCH) {
        initialMealTypes[dateKey] = 'LUNCH';
      } else if (savedMealPlans[dateKey]?.BREAK_FAST) {
        initialMealTypes[dateKey] = 'BREAK_FAST';
      } else if (savedMealPlans[dateKey]?.DINNER) {
        initialMealTypes[dateKey] = 'DINNER';
      } else {
        initialMealTypes[dateKey] = 'LUNCH';
      }
    });
    setSelectedMealTypesPerDate(initialMealTypes);
  }, [savedMealPlans]);

  const fetchAndSetMealPlans = useCallback(async () => {
    try {
      const start = selectedWeek.startDate;
      const end = selectedWeek.endDate;
      const fetchedPlans = await fetchSavedMealPlans(start, end);
      setSavedMealPlans(fetchedPlans);

      if (editModeDate) {
        const currentMealType = selectedMealTypesPerDate[editModeDate] || 'LUNCH';
        if (!fetchedPlans[editModeDate] || !fetchedPlans[editModeDate][currentMealType]) {
          setEditModeDate(null);
          setEditingMealPlan({});
        }
      }
      if (!editModeDate && Object.keys(editingMealPlan).length > 0) {
        setEditingMealPlan({});
      }

    } catch (error) {
      console.error('식단 불러오기 실패:', error);
      setSavedMealPlans({});
      setEditingMealPlan({});
      setEditModeDate(null);
    }
  }, [selectedWeek.startDate, selectedWeek.endDate, editModeDate, selectedMealTypesPerDate, editingMealPlan]);

  useEffect(() => {
    fetchAndSetMealPlans();
  }, [selectedWeekIdx, startWeekOffset]); 

  const handleMenuSelectChange = useCallback((date: string, mealType: MealType, category: keyof Omit<MealTypeDetails, 'allergies' | 'score' | 'hashtags'>, value: string) => {
    setEditingMealPlan(prev => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [mealType]: {
          ...(prev[date]?.[mealType] || { RICE: '', SOUP: '', MAIN_DISH: '', SIDE_DISH: '', DESSERT: '', hashtags: [] }),
          [category]: value,
        },
      },
    }));
  }, []);


const handleHashtagToggle = useCallback((date: string, mealType: MealType, hashtag: string) => {
  setEditingMealPlan(prev => {
    const currentDailyMeal = prev[date] || {};

    const currentMeal: Omit<MealTypeDetails, 'allergies' | 'score'> = currentDailyMeal[mealType] || {
      menuId: '',
      RICE: '',
      SOUP: '',
      MAIN_DISH: '',
      SIDE_DISH: '',
      DESSERT: '',
      hashtags: []
    };

    const newHashtags = currentMeal.hashtags.includes(hashtag)
      ? currentMeal.hashtags.filter(h => h !== hashtag)
      : [...currentMeal.hashtags, hashtag];

    return {
      ...prev,
      [date]: {
        ...currentDailyMeal,
        [mealType]: {
          ...currentMeal,
          hashtags: newHashtags,
        },
      },
    };
  });
}, []);

  const handleEditMode = useCallback((date: string, mealType: MealType) => {
    const planToEdit = savedMealPlans[date]?.[mealType];
    if (planToEdit) {
      const { allergies, score, ...mealData } = planToEdit;
      setEditingMealPlan(prev => ({
        ...prev,
        [date]: {
          ...(prev[date] || {}),
          [mealType]: mealData
        }
      }));
    } else {
      setEditingMealPlan(prev => ({
        ...prev,
        [date]: {
          ...(prev[date] || {}),
          [mealType]: { RICE: '', SOUP: '', MAIN_DISH: '', SIDE_DISH: '', DESSERT: '', hashtags: [] }
        }
      }));
    }
    setEditModeDate(date);
    setSelectedMealTypesPerDate(prev => ({
      ...prev,
      [date]: mealType
    }));
  }, [savedMealPlans]);

  const handleCancelEdit = useCallback(() => {
    setEditModeDate(null);
    setEditingMealPlan({});
  }, []);

  const handleSaveMealPlan = useCallback(async (date: string, mealType: MealType) => {
    const mealData = editingMealPlan[date]?.[mealType];
    if (!mealData || Object.values(mealData).slice(0, 5).some(menu => !menu)) {
      alert('모든 메뉴를 선택해주세요.');
      return;
    }
    try {      
      await createMealPlan(date, mealType, mealData, mealData.hashtags);
      alert('식단이 저장되었습니다!');
      await fetchAndSetMealPlans();
      setEditModeDate(null);
      setEditingMealPlan({});
    } catch (error) {
      console.error('식단 저장 실패:', error);
      alert('식단 저장에 실패했습니다.');
    }
  }, [editingMealPlan, fetchAndSetMealPlans]);


  const handleUpdateMealPlan = useCallback(async (date: string, mealType: MealType) => {
    const mealDataToUpdate = editingMealPlan[date]?.[mealType];
    if (!mealDataToUpdate || Object.values(mealDataToUpdate).slice(0, 5).some(menu => !menu)) {
      alert('모든 메뉴를 선택해주세요.');
      return;
    }

    const currentMenuId = savedMealPlans[date]?.[mealType]?.menuId;

    if (!currentMenuId) {
        alert('수정할 식단의 ID를 찾을 수 없습니다.');
        console.error('Error: menuId is missing for update operation.');
        return;
    }

    try {
      await updateMealPlan(
        currentMenuId, 
        mealDataToUpdate,
        mealDataToUpdate.hashtags || []
      );

      alert('식단이 수정되었습니다!');
      await fetchAndSetMealPlans();
      setEditModeDate(null);
      setEditingMealPlan({});
    } catch (error) {
      console.error('식단 수정 실패:', error);
      alert('식단 수정에 실패했습니다.');
    }
  }, [editingMealPlan, fetchAndSetMealPlans, savedMealPlans]);

 const handleDeleteMealPlan = useCallback(async (currentMenuId: string) => {
  if (window.confirm('정말로 이 식단을 삭제하시겠습니까?')) {
    try {
      await deleteMealPlan(currentMenuId);
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

  const handleDeleteHashtag = useCallback(async (date: string, mealType: MealType, hashtag: string, fromEditing = false) => {
    if (window.confirm(`${hashtag} 해시태그를 삭제하시겠습니까?`)) {
      try {
        if (!fromEditing && savedMealPlans[date]?.[mealType]) {
          await deleteHashtag(date, mealType, hashtag);
          alert(`${hashtag} 해시태그가 삭제되었습니다.`);
          await fetchAndSetMealPlans();
        } else if (editingMealPlan[date]?.[mealType]) {
          setEditingMealPlan(prev => {
            const newEditing = { ...prev };
            if (newEditing[date]?.[mealType]) {
              newEditing[date][mealType]!.hashtags = newEditing[date][mealType]!.hashtags.filter(h => h !== hashtag);
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


  const handlePrevWeeks = () => {
    setStartWeekOffset(prev => Math.max(0, prev - 1)); 
    setSelectedWeekIdx(2); 
  };

  const handleNextWeeks = () => {
    setStartWeekOffset(prev => prev + 1);
    setSelectedWeekIdx(2); 
  };


  return (
    <Wrapper>
      <Title>주차별 식단 관리</Title>
      <WeekSelector>
        <WeekNavigationButton onClick={handlePrevWeeks} disabled={startWeekOffset === 0}>{'<'}</WeekNavigationButton>
        {weeks.map((week, idx) => (
          <WeekButton
            key={week.label}
            selected={selectedWeekIdx === idx}
            onClick={() => setSelectedWeekIdx(idx)}
          >
            {week.label}
          </WeekButton>
        ))}
        <WeekNavigationButton onClick={handleNextWeeks}>{'>'}</WeekNavigationButton>
      </WeekSelector>

      <CardContainer>
        {weekdays.map((date) => {
          const dateKey = date.format('YYYY-MM-DD');
          const dailyPlan = savedMealPlans[dateKey] || {};
          const isEditing = editModeDate === dateKey;

          const currentSelectedMealType = selectedMealTypesPerDate[dateKey] || 'LUNCH';

          const currentMeal = isEditing
            ? editingMealPlan[dateKey]?.[currentSelectedMealType]
            : dailyPlan[currentSelectedMealType];

          const currentHashtags = currentMeal?.hashtags || [];

          return (
            <MenuCard key={dateKey}>
              <CardTitle>{date.format('M월 D일 (dd)')}</CardTitle>
              <MealTypeSelector>
                <MealTypeButton
                  selected={currentSelectedMealType === 'BREAK_FAST'}
                  onClick={() => {
                    if (!isEditing) {
                      setSelectedMealTypesPerDate(prev => ({ ...prev, [dateKey]: 'BREAK_FAST' }));
                    }
                  }}
                  disabled={isEditing && currentSelectedMealType !== 'BREAK_FAST'}
                >
                  조식
                </MealTypeButton>
                <MealTypeButton
                  selected={currentSelectedMealType === 'LUNCH'}
                  onClick={() => {
                    if (!isEditing) {
                      setSelectedMealTypesPerDate(prev => ({ ...prev, [dateKey]: 'LUNCH' }));
                    }
                  }}
                  disabled={isEditing && currentSelectedMealType !== 'LUNCH'}
                >
                  중식
                </MealTypeButton>
                <MealTypeButton
                  selected={currentSelectedMealType === 'DINNER'}
                  onClick={() => {
                    if (!isEditing) {
                      setSelectedMealTypesPerDate(prev => ({ ...prev, [dateKey]: 'DINNER' }));
                    }
                  }}
                  disabled={isEditing && currentSelectedMealType !== 'DINNER'}
                >
                  석식
                </MealTypeButton>
              </MealTypeSelector>

              <MealTypeTitle>{currentSelectedMealType === 'BREAK_FAST' ? '조식' : currentSelectedMealType === 'LUNCH' ? '중식' : '석식'}</MealTypeTitle>


              {isEditing ? (
                <>
                  <SelectRow>
                    <SelectLabel>밥류</SelectLabel>
                    <MenuSelect
                      value={currentMeal?.RICE || ''}
                      onChange={(e) => handleMenuSelectChange(dateKey, currentSelectedMealType, 'RICE', e.target.value)}
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
                      onChange={(e) => handleMenuSelectChange(dateKey, currentSelectedMealType, 'SOUP', e.target.value)}
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
                      onChange={(e) => handleMenuSelectChange(dateKey, currentSelectedMealType, 'MAIN_DISH', e.target.value)}
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
                      onChange={(e) => handleMenuSelectChange(dateKey, currentSelectedMealType, 'SIDE_DISH', e.target.value)}
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
                      onChange={(e) => handleMenuSelectChange(dateKey, currentSelectedMealType, 'DESSERT', e.target.value)}
                    >
                      <option value="">선택</option>
                      {menuOptions.DESSERT.map((menu) => (
                        <option key={menu} value={menu}>{menu}</option>
                      ))}
                    </MenuSelect>
                  </SelectRow>

                  <SelectRow>
                    <SelectLabel>해시태그</SelectLabel>
                    <SelectedHashtagDisplay>
                      {currentHashtags.map(tag => (
                        <SelectedTag key={tag}>
                          #{tag}
                          <DeleteTagButton onClick={() => handleDeleteHashtag(dateKey, currentSelectedMealType, tag, true)}>x</DeleteTagButton>
                        </SelectedTag>
                      ))}
                      <MenuSelect
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleHashtagToggle(dateKey, currentSelectedMealType, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        style={{ flexGrow: 1, minWidth: '100px', maxWidth: '100%' }}
                      >
                        <option value="">해시태그 추가</option>
                        {predefinedHashtags.filter(tag => !currentHashtags.includes(tag)).map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </MenuSelect>
                    </SelectedHashtagDisplay>
                  </SelectRow>

                  <ButtonGroup>
                    {dailyPlan[currentSelectedMealType] ? (
                      <ActionButton onClick={() => handleUpdateMealPlan(dateKey, currentSelectedMealType)}>수정 완료</ActionButton>
                    ) : (
                      <ActionButton onClick={() => handleSaveMealPlan(dateKey, currentSelectedMealType)}>저장</ActionButton>
                    )}
                    <ActionButton danger onClick={handleCancelEdit}>취소</ActionButton>
                  </ButtonGroup>
                </>
              ) : (
                <>
                  {currentMeal ? (
                    <>
                      <MenuList>
                        <MenuItem>밥류: {currentMeal.RICE}</MenuItem>
                        <MenuItem>국/찌개류: {currentMeal.SOUP}</MenuItem>
                        <MenuItem>메인반찬: {currentMeal.MAIN_DISH}</MenuItem>
                        <MenuItem>사이드반찬: {currentMeal.SIDE_DISH}</MenuItem>
                        <MenuItem>디저트: {currentMeal.DESSERT}</MenuItem>
                      </MenuList>
                      <InfoSection>
                        <InfoLabel>알레르기 정보:</InfoLabel>
                       <InfoContent>{'allergies' in currentMeal && Array.isArray(currentMeal.allergies) && currentMeal.allergies.length > 0
                            ? currentMeal.allergies.join(', ')
                            : '없음'}</InfoContent>
                      </InfoSection>
                      <InfoSection>
                        <HashtagList>
                          {currentHashtags.map(tag => (
                            <HashtagItem key={tag}>
                              {isEditing ? (
                               <>
                              #{tag} <DeleteTagButtonSmall onClick={() => handleDeleteHashtag(dateKey, currentSelectedMealType, tag, false)}>x</DeleteTagButtonSmall>
                              </> ) : (
                                <>
                                #{tag}
                                </>
                              )}
                            </HashtagItem>
                          ))}
                        </HashtagList>
                      </InfoSection>
                      <ButtonGroup>
                        <ActionButton onClick={() => handleEditMode(dateKey, currentSelectedMealType)}>수정</ActionButton>
                        <ActionButton danger onClick={() => handleDeleteMealPlan(currentMeal.menuId)}>삭제</ActionButton>
                      </ButtonGroup>
                    </>
                  ) : (
                    <EmptyMealPlan>
                      <p>해당 날짜 {currentSelectedMealType === 'BREAK_FAST' ? '조식' : currentSelectedMealType === 'LUNCH' ? '중식' : '석식'}에</p>
                      <p>저장된 식단이 없습니다.</p>
                      <ActionButton primary onClick={() => handleEditMode(dateKey, currentSelectedMealType)}>식단 추가</ActionButton>
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

const WeekNavigationButton = styled.button`
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* Fixed width for consistent look */
  height: 40px; /* Fixed height */

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #cccccc;
    border-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

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
  align-items: start;
`;

const MenuCard = styled.div`
  width: 280px; /* 카드 너비 조정 */
  padding: 2rem;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative; 
  height: auto;
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

const MealTypeSelector = styled.div`
  display: flex;
  justify-content: center; /* 버튼들을 오른쪽으로 붙임 */
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  width: 100%; /* 부모 카드 너비에 맞춤 */
`;

const MealTypeButton = styled.button<{ selected: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ selected }) => (selected ? '#007bff' : '#ccc')};
  background-color: ${({ selected }) => (selected ? '#007bff' : '#f0f0f0')};
  color: ${({ selected }) => (selected ? 'white' : '#333')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ selected }) => (selected ? '#0056b3' : '#e0e0e0')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MealTypeTitle = styled.h4`
  font-size: 1.25rem;
  color: #444;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
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


const MenuSelect = styled.select`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fdfdfd;
  font-size: 1rem;
  appearance: none;
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

const ButtonGroup = styled.div`
  margin-top: 1rem;
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

const SelectedHashtagDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
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