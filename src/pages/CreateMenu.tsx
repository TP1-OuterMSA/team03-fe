import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // dayjs 한국어 로케일 불러오기
import { parseStringPromise } from 'xml2js'; // XML 파싱을 위해 xml2js 임포트

dayjs.locale('ko'); // dayjs를 전역적으로 한국어 로케일로 설정

interface WeekInfo {
  label: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

// 오늘부터 몇 주간의 정보(월요일-금요일)를 가져오는 헬퍼 함수
const getWeeksFromToday = (count = 4): WeekInfo[] => {
  const today = dayjs();
  // 주의 시작을 월요일로 설정 (dayjs 기본값은 일요일인 경우가 있으므로 1일 추가)
  const startOfWeek = today.startOf('week').add(1, 'day');
  const weeks: WeekInfo[] = [];

  for (let i = 0; i < count; i++) {
    const weekStart = startOfWeek.add(i, 'week');
    const month = weekStart.month() + 1;
    // 월별 주차 계산 (정확도는 상황에 따라 다를 수 있음)
    const weekOfMonth = Math.ceil((weekStart.date() + weekStart.startOf('month').day()) / 7);

    weeks.push({
      label: `${month}월 ${weekOfMonth}주차`, // 예: "5월 4주차"
      startDate: weekStart,
      endDate: weekStart.add(4, 'day'), // 월요일부터 금요일까지
    });
  }

  return weeks;
};

// 공공 API에서 모든 메뉴 옵션을 가져와 카테고리별로 분류하는 커스텀 훅
// 이 훅은 모든 메뉴를 flat하게 (단일 배열로) 반환하거나,
// 여전히 카테고리별로 반환하되 각 카테고리 내에서 검색하도록 할 수 있습니다.
// 여기서는 모든 메뉴를 가져와서 나중에 필터링하는 방식으로 변경해봅시다.
const useAllMenuOptions = () => {
  const [allMenuNames, setAllMenuNames] = useState<string[]>([]);
  // 카테고리별로 분류된 옵션도 함께 제공 (UI에서 카테고리 라벨 사용)
  const [categorizedOptions, setCategorizedOptions] = useState<{ [key: string]: string[] }>({
    '밥류': [],
    '국/찌개류': [],
    '찜/구이/볶음/전/튀김류': [], // 메인 반찬에 해당하는 분류들을 통합
    '무침/김치/조림류': [], // 사이드 반찬에 해당하는 분류들을 통합
    '디저트/음료류': [], // 디저트에 해당하는 분류들을 통합
    '기타': [] // 분류되지 않는 항목
  });

  useEffect(() => {
    const fetchAllOptions = async () => {
      try {
        const YOUR_API_KEY = '8J9mK3RN2ZgKjGYqk3Q5IcVxg1O8nhH33N0WQWkEJyoQWD/St1OxPCKvKVkQMvyPGBOUn9iSFbJlp2DF0eULwg=='; // 여기에 새로 발급받은 API 키를 넣어주세요. [cite: 7]
        const Page_Size = 100; // 한 번에 가져올 데이터 수 [cite: 7]
        let allItems: any[] = [];
        let pageNo = 1;
        let totalCount = 0;

        do {
            // 새로운 API URL 사용 [cite: 4, 7]
            // 프록시 경로를 `/agrifood`로 가정 (vite.config.ts 설정에 따라 달라짐)
            const response = await axios.get(
                `/agrifood/1390802/AgriFood/MzenFoodCode/getKoreanFoodList?serviceKey=${YOUR_API_KEY}&Page_No=${pageNo}&Page_Size=${Page_Size}`
            );

            console.log(response);

            // XML 응답을 JSON으로 파싱 [cite: 7]
            const result = await parseStringPromise(response.data);
            const items = result.response.body[0].items[0].item || [];
            const rcdcnt = parseInt(result.response.body[0].rcdcnt[0]); // 현재 페이지의 아이템 수 [cite: 7]
            totalCount = parseInt(result.response.body[0].total_Count[0]); // 전체 아이템 수 [cite: 7]

            allItems = allItems.concat(items);
            pageNo++;

            // 가져올 데이터가 더 없으면 반복 중단
            if (allItems.length >= totalCount && totalCount !== 0) break;
            if (items.length === 0 && totalCount === 0) break; // 데이터가 아예 없는 경우
            if (items.length < Page_Size && totalCount !== 0) break; // 마지막 페이지일 경우 (가져온 데이터가 Page_Size보다 작음)

        } while (allItems.length < totalCount || totalCount === 0); // totalCount가 0이면 일단 한 번은 시도

        const uniqueMenuNames = Array.from(new Set(allItems.map((item: any) => item.food_Name[0]).filter(Boolean)));
        setAllMenuNames(uniqueMenuNames as string[]);

        // 대분류 (large_Name) 기준으로 카테고리 분류 [cite: 7]
        const newCategorizedOptions: { [key: string]: string[] } = {
          '밥류': [],
          '국/찌개류': [],
          '찜/구이/볶음/전/튀김류': [],
          '무침/김치/조림류': [],
          '디저트/음료류': [],
          '기타': []
        };

        const categoryMapping: { [key: string]: string } = {
          '밥류': '밥류', 
          '죽류': '밥류', 
          '국(탕)류': '국/찌개류', 
          '찌개류': '국/찌개류', 
          '찜류': '찜/구이/볶음/전/튀김류', 
          '구이류': '찜/구이/볶음/전/튀김류', 
          '볶음류': '찜/구이/볶음/전/튀김류', 
          '전류': '찜/구이/볶음/전/튀김류', 
          '튀김류': '찜/구이/볶음/전/튀김류', 
          '무침류': '무침/김치/조림류', 
          '김치류': '무침/김치/조림류',
          '조림류': '무침/김치/조림류', 
          '과일 및 과일가공품': '디저트/음료류', 
          '음료류': '디저트/음료류', 
          '과자 및 빵류': '디저트/음료류', 
          '떡류': '디저트/음료류', 
          '우유 및 유제품류': '디저트/음료류', 
          // 기타 분류는 필요에 따라 추가
        };


        allItems.forEach((item: any) => {
          const foodName = item.food_Name[0]; 
          const largeName = item.large_Name[0];

          if (foodName) {
            const mappedCategory = categoryMapping[largeName] || '기타';
            if (newCategorizedOptions[mappedCategory]) {
              newCategorizedOptions[mappedCategory].push(foodName);
            } else {
              newCategorizedOptions['기타'].push(foodName);
            }
          }
        });

        // 각 카테고리 내에서 중복 제거 및 정렬
        for (const category in newCategorizedOptions) {
          newCategorizedOptions[category] = Array.from(new Set(newCategorizedOptions[category])).sort();
        }

        setCategorizedOptions(newCategorizedOptions);

      } catch (error) {
        console.error('공공 API 호출 실패, 대체 데이터를 사용합니다:', error);
        // API 호출 실패 시 대체 데이터 (fallback)
        // 분류명도 새로운 API 분류에 맞게 조정 (임시 데이터)
        setAllMenuNames([
          '쌀밥', '잡곡밥', '김치찌개', '된장찌개', '불고기', '제육볶음', '김치', '콩나물무침',
          '과일', '요거트', '커피', '감자찌개', '두부조림', '돼지고기 김치찜', '닭갈비'
        ].sort());
        setCategorizedOptions({
          '밥류': ['쌀밥', '잡곡밥'],
          '국/찌개류': ['김치찌개', '된장찌개', '감자찌개'],
          '찜/구이/볶음/전/튀김류': ['불고기', '제육볶음', '돼지고기 김치찜', '닭갈비'],
          '무침/김치/조림류': ['김치', '콩나물무침', '두부조림'],
          '디저트/음료류': ['과일', '요거트', '커피'],
          '기타': []
        });
      }
    };

    fetchAllOptions();
  }, []); // 빈 배열은 컴포넌트 마운트 시 한 번만 실행됨을 의미

  return { allMenuNames, categorizedOptions }; // 두 가지 상태를 반환
};


// 급식 메뉴를 생성하는 메인 React 컴포넌트
const CreateMenu = () => {
  const weeks = getWeeksFromToday(4); // 다음 4주간의 정보를 가져옴
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0); // 현재 선택된 주차 인덱스 상태
  const { allMenuNames, categorizedOptions } = useAllMenuOptions(); // 모든 메뉴 데이터와 분류된 메뉴 데이터 가져오기

  // 각 요일, 각 카테고리별로 선택된 메뉴를 저장할 상태
  const [selectedMenus, setSelectedMenus] = useState<
    { [date: string]: { [category: string]: string } }
  >({});

  // 각 요일, 각 카테고리별로 현재 입력 중인 검색어와 필터링된 추천 목록을 관리
  const [searchStates, setSearchStates] = useState<
    { [date: string]: { [category: string]: { query: string; suggestions: string[]; showSuggestions: boolean } } }
  >({});

  // 추천 목록 외부 클릭 감지를 위한 Ref
  const suggestionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // 카테고리 라벨을 새로운 API 분류에 맞게 재정의
  const categoryLabels = ['밥류', '국/찌개류', '찜/구이/볶음/전/튀김류', '무침/김치/조림류', '디저트/음료류', '기타'];
  const selectedWeek = weeks[selectedWeekIdx];
  // 선택된 주차의 월요일부터 금요일까지의 날짜를 생성
  const weekdays = Array.from({ length: 5 }, (_, i) =>
    selectedWeek.startDate.add(i, 'day')
  );

  useEffect(() => {
    // 주차가 변경될 때마다 기존 선택 메뉴 초기화 (또는 저장된 메뉴 불러오기)
    setSelectedMenus({});
    setSearchStates({});
  }, [selectedWeekIdx]);

  useEffect(() => {
    // 외부 클릭 감지 핸들러
    const handleClickOutside = (event: MouseEvent) => {
      setSearchStates(prev => {
        const newStates = { ...prev };
        let changed = false;
        for (const dateKey in newStates) {
          for (const categoryKey in newStates[dateKey]) {
            if (newStates[dateKey][categoryKey].showSuggestions &&
                suggestionRefs.current[`${dateKey}-${categoryKey}`] &&
                !suggestionRefs.current[`${dateKey}-${categoryKey}`]?.contains(event.target as Node)) {
              newStates[dateKey][categoryKey].showSuggestions = false;
              changed = true;
            }
          }
        }
        return changed ? newStates : prev;
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleSearchInputChange = (
    date: string,
    category: string,
    query: string
  ) => {
    const lowerCaseQuery = query.toLowerCase();
    // 해당 카테고리에 맞는 메뉴만 필터링하거나, 전체 메뉴에서 필터링
    // 여기서는 allMenuNames (모든 메뉴)에서 필터링하지만,
    // 만약 해당 카테고리 내에서만 검색하고 싶다면 categorizedOptions[category] 사용
    const filteredSuggestions = allMenuNames.filter(menu =>
      menu.toLowerCase().includes(lowerCaseQuery)
    );

    setSearchStates(prev => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [category]: {
          query: query,
          suggestions: filteredSuggestions.slice(0, 10), // 최대 10개만 추천
          showSuggestions: true,
        },
      },
    }));
  };

  const handleSuggestionClick = (
    date: string,
    category: string,
    menu: string
  ) => {
    setSelectedMenus(prev => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [category]: menu,
      },
    }));
    setSearchStates(prev => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [category]: {
          ...prev[date]?.[category],
          query: menu, // 선택한 메뉴로 입력 필드 업데이트
          showSuggestions: false, // 추천 목록 숨기기
        },
      },
    }));
  };

  const handleInputFocus = (date: string, category: string) => {
    setSearchStates(prev => ({
        ...prev,
        [date]: {
            ...(prev[date] || {}),
            [category]: {
                ...(prev[date]?.[category] || {query: selectedMenus[date]?.[category] || '', suggestions: [], showSuggestions: false}), // 기존값 유지
                showSuggestions: true, // 포커스 시 추천 목록 보이기
            },
        },
    }));
  };


  return (
    <Wrapper>
      <Title>주차 선택</Title>
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
          return (
            <MenuCard key={dateKey}>
              <CardTitle>{date.format('M월 D일 (dd)')}</CardTitle>
              {categoryLabels.map((label) => {
                const searchState = searchStates[dateKey]?.[label] || { query: selectedMenus[dateKey]?.[label] || '', suggestions: [], showSuggestions: false };
                return (
                  <SelectRow key={label}>
                    <SelectLabel>{label}</SelectLabel>
                    <SearchContainer ref={el => suggestionRefs.current[`${dateKey}-${label}`] = el}> {/* ref 설정 */}
                      <MenuInput
                        type="text"
                        value={searchState.query}
                        onChange={(e) => handleSearchInputChange(dateKey, label, e.target.value)}
                        onFocus={() => handleInputFocus(dateKey, label)}
                        placeholder="메뉴 검색"
                      />
                      {searchState.showSuggestions && searchState.suggestions.length > 0 && (
                        <SuggestionList>
                          {searchState.suggestions.map((suggestion) => (
                            <SuggestionItem
                              key={suggestion}
                              onClick={() => handleSuggestionClick(dateKey, label, suggestion)}
                            >
                              {suggestion}
                            </SuggestionItem>
                          ))}
                        </SuggestionList>
                      )}
                    </SearchContainer>
                  </SelectRow>
                );
              })}
              <ButtonGroup>
                <ActionButton>저장</ActionButton>
                <ActionButton>수정</ActionButton>
                <ActionButton>삭제</ActionButton>
              </ButtonGroup>

              <PredictButton>선호 점수 예측</PredictButton>
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
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
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
  width: 320px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const CardTitle = styled.h3`
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #eee;
`;

const SelectRow = styled.div`
  margin-bottom: 1.2rem;
  position: relative; /* 자식 요소인 추천 목록을 위해 relative 설정 */
`;

const SelectLabel = styled.div`
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
`;

// SelectBox 대신 메뉴 입력을 위한 input 필드
const MenuInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fdfdfd;
  font-size: 1rem;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    outline: none;
  }
`;

// 추천 목록을 담을 컨테이너
const SuggestionList = styled.ul`
  position: absolute;
  top: 100%; /* 입력 필드 바로 아래 */
  left: 0;
  right: 0;
  z-index: 10;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px; /* 최대 높이 설정 */
  overflow-y: auto; /* 내용이 넘치면 스크롤 */
  list-style: none;
  padding: 0;
  margin-top: 5px; /* 입력창과의 간격 */
`;

// 추천 목록의 각 항목
const SuggestionItem = styled.li`
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const SearchContainer = styled.div`
    position: relative;
`;

const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 0.8rem;
  justify-content: center;
`;

const ActionButton = styled.button`
  padding: 0.8rem 1.2rem;
  border: none;
  background-color: #007bff;
  color: white;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:nth-child(2) {
    background-color: #ffc107;
    color: #333;
    &:hover {
      background-color: #e0a800;
    }
  }

  &:nth-child(3) {
    background-color: #dc3545;
    &:hover {
      background-color: #c82333;
    }
  }
`;

const PredictButton = styled.button`
  margin-top: auto;
  padding: 1rem 2rem;
  background-color: #28a745;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: center;
  width: 90%;

  &:hover {
    background-color: #218838;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;