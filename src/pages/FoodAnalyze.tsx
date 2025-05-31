import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Food } from '../interface/foodAnalyze';
import { foodAnalyzeService } from '../api/foodAnalyzeService';

const FoodAnalyzePage = () => {
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
      console.error('음식 목록 조회 실패:', error);
      setError('음식 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFoodClick = (foodId: number) => {
    navigate(`/team3/admin/food-analyze/${foodId}`);
  };

  return (
    <Container>
      <Header>
        <Title>음식 통계</Title>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <LoadingContainer>
          <Spinner />
          <span>로딩 중...</span>
        </LoadingContainer>
      ) : foods.length === 0 ? (
        <EmptyMessage>음식 목록이 없습니다.</EmptyMessage>
      ) : (
        <FoodGrid>
          {foods.map((food) => (
            <FoodCard key={food.id} onClick={() => handleFoodClick(food.id)}>
              <FoodName>{food.name}</FoodName>
            </FoodCard>
          ))}
        </FoodGrid>
      )}
    </Container>
  );
};

const Container = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 2.5rem 2rem;
  max-width: 1090px;
  margin: 40px auto 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const FoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const FoodCard = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #e9ecef;
  }
`;

const FoodName = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: #fa5252;
  margin: 1rem 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 200px;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 5px solid #e7f5ff;
  border-top: 5px solid #228be6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  font-size: 1.1rem;
  margin-top: 2rem;
`;

export default FoodAnalyzePage; 