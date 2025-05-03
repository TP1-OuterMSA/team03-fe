import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Chart from 'chart.js/auto';
import { satisfactionRatingData, SatisfactionTrendData, CategoryRatingData } from '../interface/dashboard';
import { getSatisfactionRating, getSatisfactionTrend, getCategoryRatings } from '../api/dashboardService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Dashboard = () => {
  const [graphStyle, setGraphStyle] = useState<'Circle' | 'Stick'>('Circle');
  const [trendType, setTrendType] = useState<'weekly' | 'monthly'>('weekly');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const weeklyChartRef = useRef<HTMLCanvasElement>(null!);
  const monthlyChartRef = useRef<HTMLCanvasElement>(null!);
  const trendChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);

  const weeklyChartInstance = useRef<Chart | null>(null);
  const monthlyChartInstance = useRef<Chart | null>(null);
  const trendChartInstance = useRef<Chart | null>(null);
  const categoryChartInstance = useRef<Chart | null>(null);

  const [weeklyData, setWeeklyData] = useState<satisfactionRatingData | null>(null);
  const [monthlyData, setMonthlyData] = useState<satisfactionRatingData | null>(null);
  const [weeklyTrendData, setWeeklyTrendData] = useState<SatisfactionTrendData | null>(null);
  const [monthlyTrendData, setMonthlyTrendData] = useState<SatisfactionTrendData | null>(null);

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryRatingData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ratings = await getSatisfactionRating();
        setWeeklyData(ratings.find((r) => r.type === 'weekly') || null);
        setMonthlyData(ratings.find((r) => r.type === 'monthly') || null);
      } catch (err) {
        console.error('Rating 데이터 로드 실패:', err);
      }
    };

    const fetchTrendData = async () => {
      try {
        const { weekly, monthly } = await getSatisfactionTrend();
        setWeeklyTrendData(weekly);
        setMonthlyTrendData(monthly);
      } catch (err) {
        console.error('Trend 데이터 로드 실패:', err);
      }
    };

    fetchData();
    fetchTrendData();
  }, []);

  useEffect(() => {
    if (weeklyData && monthlyData) {
      createChart(weeklyChartRef, weeklyData, weeklyChartInstance);
      createChart(monthlyChartRef, monthlyData, monthlyChartInstance);
    }
  }, [weeklyData, monthlyData, graphStyle]);

  useEffect(() => {
    if (trendType === 'weekly' && weeklyTrendData) createTrendChart(weeklyTrendData);
    if (trendType === 'monthly' && monthlyTrendData) createTrendChart(monthlyTrendData);
  }, [trendType, weeklyTrendData, monthlyTrendData]);

  useEffect(() => {
    const fetchCategory = async () => {
      if (selectedDates.length !== 2 || !selectedDates[0] || !selectedDates[1]) return;
      const [start, end] = selectedDates;
      console.log('Start:', start);
      console.log('End:', end);
      try {
        const data = await getCategoryRatings(start, end);
        setCategoryData(data);
        createCategoryChart(data);
      } catch (err) {
        console.error('카테고리별 평점 로드 실패:', err);
      }
    };
  
    fetchCategory();
  }, [selectedDates]);
  

  const getCurrentMonthAndWeek = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const week = Math.ceil((now.getDate() + offset) / 7);
    return `${now.getMonth() + 1}월 ${week - 1}주차`;
  };

  const createChart = (
    ref: React.RefObject<HTMLCanvasElement>,
    data: satisfactionRatingData,
    instanceRef: React.MutableRefObject<Chart | null>
  ) => {
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d');
    if (!ctx) return;

    const labels = ['1점', '2점', '3점', '4점', '5점'];
    const chartData = [data.one, data.two, data.three, data.four, data.five];

    if (instanceRef.current) instanceRef.current.destroy();

    instanceRef.current = new Chart(ctx, {
      type: graphStyle === 'Circle' ? 'doughnut' : 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '평점 수',
            data: chartData,
            backgroundColor: [
              'rgba(208, 0, 255, 0.5)',
              'rgba(30, 255, 0, 0.5)',
              'rgba(255, 205, 86, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 99, 132, 0.5)',
            ],
            borderWidth: 1,
            hoverOffset: graphStyle === 'Circle' ? 15 : 4,
          },
        ],
      },
      options:
        graphStyle === 'Circle'
          ? { responsive: true, cutout: '40%' }
          : {
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, max: 50 } },
            },
    });
  };

  const createTrendChart = (trendData: SatisfactionTrendData) => {
    if (!trendChartRef.current) return;
    const ctx = trendChartRef.current.getContext('2d');
    if (!ctx) return;

    if (trendChartInstance.current) trendChartInstance.current.destroy();

    trendChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trendData.labels,
        datasets: [
          {
            data: trendData.data,
            fill: false,
            borderColor: trendData.type === 'weekly' ? 'rgb(75, 192, 192)' : 'rgb(255, 159, 64)',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 5 } },
      },
    });
  };

  const createCategoryChart = (data: CategoryRatingData[]) => {
    if (!categoryChartRef.current) return;
    const ctx = categoryChartRef.current.getContext('2d');
    if (!ctx) return;
  
    if (categoryChartInstance.current) categoryChartInstance.current.destroy();
  
    const backgroundColors = [
      'rgba(255, 99, 132, 0.2)', 
      'rgba(54, 162, 235, 0.2)',  
      'rgba(255, 206, 86, 0.2)', 
      'rgba(75, 192, 192, 0.2)', 
      'rgba(153, 102, 255, 0.2)', 
    ];
  
    const borderColors = [
      'rgba(255, 99, 132, 1)',   
      'rgba(54, 162, 235, 1)',    
      'rgba(255, 206, 86, 1)',    
      'rgba(75, 192, 192, 1)',    
      'rgba(153, 102, 255, 1)',  
    ];
  
    categoryChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.category),
        datasets: [
          {
            label: '평점',
            data: data.map((d) => d.score),
            backgroundColor: backgroundColors, 
            borderColor: borderColors,     
            borderWidth: 1,
            borderRadius: 12, 
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            ticks: {
              font: {
                size: 14, 
              },
              color: '#333',
            },
            grid: {
              color: '#f0f0f0', 
              lineWidth: 1,
            },
          },
          x: {
            ticks: {
              font: {
                size: 14,
              },
              color: '#333',
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false, 
          },
        },
        layout: {
          padding: {
            top: 20,
            left: 20,
            right: 20,
          },
        },
        animation: {
          duration: 800,
          easing: 'easeInOutQuad',
        },
      },
    });
  };
  
  

  return (
    <DashboardContainer>
      <style>
      {`
      .react-datepicker {
        font-size: 16px;
      }

      .react-datepicker__month-container {
        width: 360px;
      }

      .react-datepicker__day {
        width: 40px;
        height: 40px;
        line-height: 2rem;
      }

      .react-datepicker__header {
        background-color: #ffffff;
        border-bottom: 1px solid #ececec;
      }

      .react-datepicker__day--selected,
      .react-datepicker__day--range-start,
      .react-datepicker__day--range-end,
      .react-datepicker__day--in-range,
      .react-datepicker__day--in-selecting-range {
        background: #228be6;
        border-width: 10%;
        border-radius: 50px;
        color: #ffffff;
      }

      .react-datepicker__day-name,
      .react-datepicker__day {
        width: 2.7rem;
        height: 2.7rem;
        line-height: 2.7rem;
      }

      .react-datepicker__header {
        background-color: #ffffff;
        border-bottom: 1px solid #ececec;
      }

      .react-datepicker__day--selected {
        background: #228be6;
        border-radius: 50%;
        color: white;
      }

      .react-datepicker__month-container {
        width: 360px;
      }

      .react-datepicker__day--selected {
        background: #228be6;
        color: white;
      }
      `}
    </style>


      <h1>대시보드</h1>

      <RateHeader>
        <Title>주/월간 만족도 통계</Title>
        <StyleToggle>
          <ToggleButton $active={graphStyle === 'Circle'} onClick={() => setGraphStyle('Circle')}>
            원형
          </ToggleButton>
          <ToggleButton $active={graphStyle === 'Stick'} onClick={() => setGraphStyle('Stick')}>
            막대형
          </ToggleButton>
        </StyleToggle>
      </RateHeader>

      <ChartsWrapper>
        <ChartContainer>
          <h2>{getCurrentMonthAndWeek()} 평점</h2>
          <canvas ref={weeklyChartRef}></canvas>
        </ChartContainer>
        <ChartContainer>
          <h2>{`${new Date().getMonth() === 0 ? 12 : new Date().getMonth()}월 월간 평점`}</h2>
          <canvas ref={monthlyChartRef}></canvas>
        </ChartContainer>
      </ChartsWrapper>

      <TrendWrapper>
        <RateHeader>
          <TrendTitle>
            {trendType === 'weekly' ? `${getCurrentMonthAndWeek()} 변화 추이` : '최근 5개월 변화 추이'}
          </TrendTitle>
          <TrendToggle>
            <ToggleButton $active={trendType === 'weekly'} onClick={() => setTrendType('weekly')}>
              주간
            </ToggleButton>
            <ToggleButton $active={trendType === 'monthly'} onClick={() => setTrendType('monthly')}>
              월간
            </ToggleButton>
          </TrendToggle>
        </RateHeader>
        <canvas ref={trendChartRef}></canvas>
      </TrendWrapper>

      <CategoryHeader>
        <CategoryTitle>카테고리별 평점 조회</CategoryTitle>
        <SelectButton onClick={() => setIsCalendarOpen(!isCalendarOpen)}>📅 날짜 선택</SelectButton>
        {isCalendarOpen && (
          <CalendarPopup>
            <DatePicker
              selected={selectedDates[0] || null}
              onChange={(dates: any) => setSelectedDates(dates)}
              startDate={selectedDates[0]}
              endDate={selectedDates[1]}
              selectsRange
              inline
              dateFormat="yyyy-MM-dd"
            />
          </CalendarPopup>
        )}
      </CategoryHeader>

      <CategoryWrapper>
        <ChartArea>
          {selectedDates.length === 0 ? (
            <EmptyMessage>날짜를 선택하세요</EmptyMessage>
          ) : (
            <canvas ref={categoryChartRef}></canvas>
          )}
        </ChartArea>
      </CategoryWrapper>
    </DashboardContainer>
  );
};

const SelectButton = styled.button`
  background: #e7f5ff;
  color:rgba(0, 0, 0, 1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1.25rem;
  margin-left: 790px;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;

  &:hover {
    border:1px solid #228be6;
    background: #e7f5ff;
  }
`;

const CalendarPopup = styled.div`
  position: absolute;
  margin-top: 405px;
  z-index: 100;
  border-radius: 1rem;
  padding: 1rem;
  margin-left: 810px;
`;

const CategoryWrapper = styled.div`
  margin-top: 1rem;
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const RateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ChartsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 5px;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;
  padding: 2rem;

  canvas {
    max-width: 300px;
    max-height: 300px;
  }
`;

const StyleToggle = styled.div`
  display: flex;
  background: #f0f0f0;
  border-radius: 20px;
  padding: 4px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 16px;
  border: none;
  background: ${(props) => (props.$active ? '#fff' : 'transparent')};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.$active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none')};
`;

const TrendWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  canvas {
    max-width: 1300px;
    max-height: 400px;
  }
`;

const TrendTitle = styled.h2`
  margin-right: 800px;
  color: #333;
  font-size: 1.5rem;
`;

const TrendToggle = styled.div`
  display: flex;
  background: #f0f0f0;
  border-radius: 20px;
  padding: 4px;
`;

const CategoryTitle = styled.h2`
  color: #333;
  font-size: 1.5rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3rem;
  gap: 1rem;
`;

const ChartArea = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
`;


const EmptyMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
  font-size: 1.2rem;
`;

export default Dashboard;
