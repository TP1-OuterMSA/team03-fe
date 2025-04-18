import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Chart from 'chart.js/auto';
import { satisfactionRatingData, SatisfactionTrendData } from '../interface/dashboard';
import { getSatisfactionRating, getSatisfactionTrend } from '../api/dashboardService';

const Dashboard = () => {
  const [graphStyle, setGraphStyle] = useState<'Circle' | 'Stick'>('Circle');
  const [trendType, setTrendType] = useState<'weekly' | 'monthly'>('weekly');

  const weeklyChartRef = useRef<HTMLCanvasElement>(null!);
  const monthlyChartRef = useRef<HTMLCanvasElement>(null!);
  const trendChartRef = useRef<HTMLCanvasElement>(null);

  const weeklyChartInstance = useRef<Chart | null>(null);
  const monthlyChartInstance = useRef<Chart | null>(null);
  const trendChartInstance = useRef<Chart | null>(null);

  const [weeklyData, setWeeklyData] = useState<satisfactionRatingData | null>(null);
  const [monthlyData, setMonthlyData] = useState<satisfactionRatingData | null>(null);
  const [weeklyTrendData, setWeeklyTrendData] = useState<SatisfactionTrendData | null>(null);
  const [monthlyTrendData, setMonthlyTrendData] = useState<SatisfactionTrendData | null>(null);

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

  return (
    <DashboardContainer>
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
    </DashboardContainer>
  );
};

const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
`;

const TrendTitle = styled.h2`
  margin-right: 800px;
  color: #333;
  font-size: 1.5rem;
`;

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ChartsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 5px;
  min-width: 500px;
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

const RateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 15px;
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
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

const TrendToggle = styled.div`
  display: flex;
  background: #f0f0f0;
  border-radius: 20px;
  padding: 4px;
`;

export default Dashboard;
