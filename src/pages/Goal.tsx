import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { foodAnalyzeService } from '../api/foodAnalyzeService';
import { Food } from '../interface/foodAnalyze';
import FoodGrid from '../components/goal/FoodGrid';

const GoalPage: React.FC = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const data = await foodAnalyzeService.getAllFoods();
      setFoods(data);
      setError(null);
    } catch (error) {
      setError('음식 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSelect = (foodId: number) => {
    navigate(`/team3/admin/goals/${foodId}`);
  };

  if (loading) return <LoadingContainer>로딩 중...</LoadingContainer>;
  if (error) return <ErrorMessage>에러: {error}</ErrorMessage>;

  return (
    <PageContainer>
      <Title>음식 목표 관리</Title>
      <FoodGrid foods={foods} onFoodSelect={handleFoodSelect} />
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

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #f44336;
`;

export default GoalPage; 