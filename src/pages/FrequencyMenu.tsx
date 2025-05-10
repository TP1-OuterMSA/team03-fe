import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import PeriodSelector from '../components/common/PeriodSelector';
import { PeriodType } from '../interface/wantedMenu';

import { SelectedPeriod, FrequencyData, Month, getFrequency } from '../api/frequencyMenu';
import Chart from 'chart.js/auto';


const frequencyMenu: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [graphStyle, setGraphStyle] = useState<'Line' | 'Percent'>('Line');
  const [items, setItems] = useState<FrequencyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod>({
    periodType: 'SEMESTER',
    year: currentYear,
    semester: 'FIRST',
  });
  const [periodCategory, setPeriodCategory] = useState<'semester' | 'month'>('semester');

  const mainChartRef = useRef<HTMLCanvasElement | null>(null);
  const sideChartRef = useRef<HTMLCanvasElement | null>(null);
  const riceChartRef = useRef<HTMLCanvasElement | null>(null);
  const soupChartRef = useRef<HTMLCanvasElement | null>(null);
  const dessertChartRef = useRef<HTMLCanvasElement | null>(null);
  const mainChartInstance = useRef<Chart | null>(null);
  const sideChartInstance = useRef<Chart | null>(null);
  const riceChartInstance = useRef<Chart | null>(null);
  const soupChartInstance = useRef<Chart | null>(null);
  const dessertChartInstance = useRef<Chart | null>(null);

  const parseSelectedPeriod = (period: string): SelectedPeriod => {
    if (period === 'FIRST_SEMESTER') {
      return { periodType: 'SEMESTER', year: currentYear, semester: 'FIRST' };
    }
    if (period === 'SECOND_SEMESTER') {
      return { periodType: 'SEMESTER', year: currentYear, semester: 'SECOND' };
    }
    // MONTH_N
    const match = period.match(/^MONTH_(\d+)$/);
    if (match) {
      const monthNum = parseInt(match[1], 10);
      const monthNames: Record<number, Month> = {
        1: 'JANUARY', 2: 'FEBRUARY', 3: 'MARCH', 4: 'APRIL',
        5: 'MAY', 6: 'JUNE', 7: 'JULY', 8: 'AUGUST',
        9: 'SEPTEMBER', 10: 'OCTOBER', 11: 'NOVEMBER', 12: 'DECEMBER'
      };
      return {
        periodType: 'MONTHLY',
        year: currentYear,
        month: monthNames[monthNum],
        semester: 'FIRST',  
      };
    }
    return { periodType: 'SEMESTER', year: currentYear, semester: 'FIRST' };
  };

  const handlePeriodChange = (periodStr: string) => {
    setSelectedPeriod(parseSelectedPeriod(periodStr));
  };
  const handleCategoryChange = (cat: 'semester' | 'month') => {
    setPeriodCategory(cat);
    handlePeriodChange(cat === 'semester' ? 'FIRST_SEMESTER' : 'MONTH_1');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getFrequency(selectedPeriod); 
        const formatted = formatFrequencyData(data); 
        setItems(formatted);
      } catch (error) {
        console.error('출현 빈도 데이터를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPeriod]); 
  
  // 데이터 포맷팅 함수
  interface ResponseData {
  data: { category: string; subCategory: string; count: number }[];
}

function formatFrequencyData(response: ResponseData): FrequencyData {
  const formatted: FrequencyData = {
    MAIN_DISH: {},
    SIDE_DISH: {},
    SOUP: {},
    DESSERT: {},
    RICE: {},
  };

  // response.data 배열을 순회하면서 각 항목을 처리
  response.data.forEach(item => {
    const { category, subCategory, count } = item;

    // formatted 객체에 해당 카테고리와 서브카테고리로 값을 할당
    if (formatted[category as keyof FrequencyData] && subCategory) {
      formatted[category as keyof FrequencyData][subCategory] = count;
    }
  });

  return formatted;
}

  const getPeriodName = () => {
    if (selectedPeriod.periodType === 'SEMESTER') {
      return selectedPeriod.semester === 'FIRST' ? '1학기' : '2학기';
    } else {
      // MONTHLY
      const monthMap: Record<Month, number> = {
        JANUARY:1, FEBRUARY:2, MARCH:3, APRIL:4,
        MAY:5, JUNE:6, JULY:7, AUGUST:8,
        SEPTEMBER:9, OCTOBER:10, NOVEMBER:11, DECEMBER:12
      };
      return `${monthMap[selectedPeriod.month!]}월`;
    }
  };


  useEffect(() => {
    if (!items) return;
    const mapping: Array<[React.RefObject<HTMLCanvasElement|null>, React.MutableRefObject<Chart|null>, Record<string,number>, string]> = [
      [riceChartRef,   riceChartInstance,   items.RICE,      '밥류 빈도'],
      [mainChartRef,   mainChartInstance,   items.MAIN_DISH,  '메인디쉬 빈도'],
      [sideChartRef,   sideChartInstance,   items.SIDE_DISH,  '사이드디쉬 빈도'],
      [soupChartRef,   soupChartInstance,   items.SOUP,      '국/찌개 빈도'],
      [dessertChartRef,dessertChartInstance,items.DESSERT,   '디저트 빈도'],
    ];
  
    const timeout = setTimeout(() => {
      mapping.forEach(([ref, inst, data]) => {
        if (!ref.current) return;
        if (graphStyle === 'Line') {
          createLineChart(ref, inst, data);
        } else {
          createDoughnutChart(ref, inst, data);
        }
      });
    }, 100); 
  
    return () => clearTimeout(timeout);
  }, [items, graphStyle]);
  
  

  const CATEGORY_LABELS: Record<string, string> = {
    WHITE_RICE: '흰쌀밥',
    MIXED_GRAIN_RICE: '잡곡밥',
    FRIED_RICE: '볶음밥',
    SPECIAL_RICE: '김밥, 비빔밥',
  
    MEAT: '육류',
    POULTRY: '가금류',
    FISH: '생선류',
    FRIED: '튀김류',
    STEAMED_OR_BOILED: '찜/조림류',
    VEGETARIAN_MAIN: '채식 메인',
  
    KIMCHI_VARIANT: '김치류',
    NAMUL: '나물류',
    PICKLED: '장아찌류',
    EGG_BASED: '계란류',
    TOFU_OR_BEAN: '두부/콩류',
    SMALL_MEAT: '소량 육류 반찬',
  
    CLEAR_SOUP: '맑은국',
    SPICY_SOUP: '얼큰한 국/찌개',
    STEW: '찌개류',

    FRUIT: '과일',
    DAIRY : '유제품',
    BAKED: '빵/케이크',
    BEVERAGE: '음료',
    SNACK: '과자류'
  };
  

  const formatPeriodSelectorValue = (): PeriodType => {
    if (selectedPeriod.periodType === 'SEMESTER') {
      return selectedPeriod.semester === 'FIRST'
        ? 'FIRST_SEMESTER'
        : 'SECOND_SEMESTER';
    } else {
      const monthNumber = {
        JANUARY: 1,   FEBRUARY: 2, MARCH: 3,   APRIL: 4,
        MAY: 5,       JUNE: 6,     JULY: 7,    AUGUST: 8,
        SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12,
      }[selectedPeriod.month!];
  
      return (`MONTH_${monthNumber}`) as PeriodType;
    }
  };


  const createLineChart = (
    ref: React.RefObject<HTMLCanvasElement | null>,
    chartInstance: React.MutableRefObject<Chart | null>,
    data: Record<string, number>,
  ) => {
    if (!ref.current || !data) return;
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
  
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;
  
    const keys = Object.keys(data);
    if (keys.length === 0) return;
  
    // 최대값을 구하고, 이를 3배로 설정
    const maxValue = Math.max(...Object.values(data));
    const maxY = maxValue * 3;
  
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: keys.map((key) => CATEGORY_LABELS[key] || key),
        datasets: [{
          label: '',
          data: keys.map((key) => data[key]),
          fill: true,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(74, 182, 182, 0.2)',
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: false },
        },
        scales: {
          x: {
            ticks: {
              font: { size: 15 },  // X축 라벨 폰트 크기
            }
          },
          y: { 
            beginAtZero: true, 
            max: maxY,  // Y축 최대값을 3배로 설정
            ticks: { precision: 0 },
          },
        },
      }
    });
  };
  
  
  const createDoughnutChart = (
    ref: React.RefObject<HTMLCanvasElement | null>,
    chartInstance: React.MutableRefObject<Chart | null>,
    data: Record<string, number>
  ) => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    if (chartInstance.current) chartInstance.current.destroy();
    if (!ref.current || !data) return;             
    const keys = Object.keys(data);
    if (keys.length === 0) return; 
    const values = keys.map((key) => data[key]);
    const total = values.reduce((sum, val) => sum + val, 0);
    const percentages = values.map((v) => ((v / total) * 100).toFixed(1));

    const chartColors = [
      'rgba(208, 0, 255, 0.5)',
      'rgba(30, 255, 0, 0.5)',
      'rgba(255, 205, 86, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 99, 132, 0.5)',
      'rgba(255, 159, 64, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(231, 233, 237, 0.5)',
      'rgba(201, 203, 207, 0.5)',
      'rgba(100, 100, 255, 0.5)'
    ];

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: keys.map((key, idx) => `${CATEGORY_LABELS[key] || key} (${percentages[idx]}%)`),
        datasets: [{
          label: '', 
          data: values,
          backgroundColor: chartColors.slice(0, keys.length),
          hoverOffset: 10,
        }]
      },
      options: {
        responsive: true,
        cutout: '40%', 
        plugins: {
          legend: { 
            position: 'bottom', 
            labels: {
            font: { size: 17 },  // 레전드 라벨 폰트 크기
          }, },
          title: { display: false }, 
        },
      }
    });
  };

  return (
    <PageContainer>
      <Title>카테고리별 제공 빈도</Title>

      <PeriodSelector
        periodCategory={periodCategory}
        selectedPeriod={formatPeriodSelectorValue()}
        onCategoryChange={handleCategoryChange}
        onPeriodChange={handlePeriodChange}
      />

      <SelectedPeriodDisplay>
        <CalendarIcon>📅</CalendarIcon>
        <SelectedPeriodText>
          {currentYear}년 {getPeriodName()} 카테고리별 제공 빈도
        </SelectedPeriodText>

        <ToggleWrapper>
          <ToggleButton $active={graphStyle === 'Line'} onClick={() => setGraphStyle('Line')}>
            선형
          </ToggleButton>
          <ToggleButton $active={graphStyle === 'Percent'} onClick={() => setGraphStyle('Percent')}>
            퍼센트
          </ToggleButton>
        </ToggleWrapper>
      </SelectedPeriodDisplay>

      {loading ? (
        <LoadingContainer>로딩 중...</LoadingContainer>
      ) : !items ? (
        <EmptyMessage>데이터가 없습니다.</EmptyMessage>
      ) : (
        <ChartRow>
    <ChartBox>
      <h3>밥류</h3>
      {items.RICE && Object.keys(items.RICE).length > 0 ? (
        <canvas ref={riceChartRef} />
      ) : (
        <EmptyMessage>데이터가 없습니다.</EmptyMessage>
      )}
    </ChartBox>
    <ChartBox>
      <h3>메인디쉬</h3>
      {items.MAIN_DISH && Object.keys(items.MAIN_DISH).length > 0 ? (
        <canvas ref={mainChartRef} />
      ) : (
        <EmptyMessage>데이터가 없습니다.</EmptyMessage>
      )}
    </ChartBox>
    <ChartBox>
      <h3>사이드디쉬</h3>
      {items.SIDE_DISH && Object.keys(items.SIDE_DISH).length > 0 ? (
        <canvas ref={sideChartRef} />
      ) : (
        <EmptyMessage>데이터가 없습니다.</EmptyMessage>
      )}
    </ChartBox>
    <ChartBox>
      <h3>국/찌개</h3>
      {items.SOUP && Object.keys(items.SOUP).length > 0 ? (
        <canvas ref={soupChartRef} />
      ) : (
        <EmptyMessage>데이터가 없습니다.</EmptyMessage>
      )}
    </ChartBox>
    <ChartBox>
      <h3>디저트</h3>
      {items.DESSERT && Object.keys(items.DESSERT).length > 0 ? (
        <canvas ref={dessertChartRef} />
      ) : (
        <EmptyMessage>데이터가 없습니다.</EmptyMessage>
      )}
    </ChartBox>
  </ChartRow>
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SelectedPeriodDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
`;

const CalendarIcon = styled.span`
  margin-right: 0.75rem;
  margin-left: 320px;
  font-size: 1.5rem;
`;

const SelectedPeriodText = styled.div``;

const ToggleWrapper = styled.div`
  display: flex;
  background-color: #f4f4f4;
  border-radius: 999px;
  padding: 4px;
  width: fit-content;
  margin-left: 300px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  border: none;
  background-color: ${(props) => (props.$active ? '#ffffff' : 'transparent')};
  color: #000;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: ${(props) => (props.$active ? '0 0 4px rgba(0,0,0,0.1)' : 'none')};
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: ${(props) => (props.$active ? '#fff' : '#eaeaea')};
  }
`;

const ChartRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ChartBox = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h3 {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: #444;
  }

  canvas {
    width: 100%;
    height: auto;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

export default frequencyMenu;
