import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Chart from 'chart.js/auto';
import { satisfactionRatingData } from '../interface/dashboard';
import { getSatisfactionRating } from '../api/dashboardService';

const Dashboard = () => {
  const weeklyChartRef = useRef(null);
  const monthlyChartRef = useRef(null);
  const [weeklyData, setWeeklyData] = useState<satisfactionRatingData | null>(null);
  const [monthlyData, setMonthlyData] = useState<satisfactionRatingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // const fetchData = async () => {
    //  setLoading(true);
    //  setError(null);
    //   try {
    //     const data: satisfactionRatingData[] = getSatisfactionRating();

    //     const weekly = data.find(item => item.type === 'weekly');
    //     const monthly = data.find(item => item.type === 'monthly');

    //     setWeeklyData(weekly || null);
    //     setMonthlyData(monthly || null);
    //   } catch (error) {
    //     console.error('데이터를 불러오는데 실패했습니다:', err);
    //     setError('데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    //   } finally {
    //    setLoading(false);
    //  }
    // };

    // fetchData();

    // 더미 데이터
    setWeeklyData({ type: 'weekly', five: 300, four: 50, three: 100, two: 200, one: 150 });
    setMonthlyData({ type: 'monthly', five: 100, four: 300, three: 500, two: 800, one: 600 });
  }, []);

  useEffect(() => {
    const createChart = (ref, data) => {
      if (ref.current && data) {
        const ctx = ref.current.getContext('2d');
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['5점', '4점', '3점', '2점', '1점'],
            datasets: [{
              label: '평점 수',
              data: [data.five, data.four, data.three, data.two, data.one],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(30, 255, 0)',
                'rgb(208, 0, 255)'
              ],
              hoverOffset: 5
            }]
          }
        });
      }
    };

    createChart(weeklyChartRef, weeklyData);
    createChart(monthlyChartRef, monthlyData);
  }, [weeklyData, monthlyData]);

  return (
    <DashboardContainer>
      <h1>대시보드</h1>
      <Title>주/월간 만족도 통계</Title>
      <ChartsWrapper>
        <ChartContainer>
          <h2>주간 평점</h2>
          <canvas ref={weeklyChartRef}></canvas>
        </ChartContainer>
        <ChartContainer>
          <h2>월간 평점</h2>
          <canvas ref={monthlyChartRef}></canvas>
        </ChartContainer>
      </ChartsWrapper>
    </DashboardContainer>
  );
};

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  margin-top: 20px;
`;

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ChartsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
  min-width: 300px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;

  canvas {
    max-width: 300px;
    max-height: 300px;
  }
`;

export default Dashboard;