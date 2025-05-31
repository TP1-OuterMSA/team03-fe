import React from 'react';
import styled from 'styled-components';
import { Food } from '../../interface/foodAnalyze';

interface FoodGridProps {
  foods: Food[];
  onFoodSelect: (foodId: number) => void;
}

const FoodGrid: React.FC<FoodGridProps> = ({ foods, onFoodSelect }) => {
  // 음식들을 카테고리별로 그룹화
  const foodsByCategory = foods.reduce((acc, food) => {
    const category = (food as any).category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(food);
    return acc;
  }, {} as Record<string, Food[]>);

  const CATEGORY_LABELS: Record<string, string> = {
    RICE: '밥',
    MAIN_DISH: '메인 반찬',
    SIDE_DISH: '사이드 반찬',
    SOUP: '국',
    DESSERT: '디저트'
  };

  return (
    <GridContainer>
      {Object.entries(foodsByCategory).map(([category, foods]) => (
        <CategorySection key={category}>
          <CategoryTitle>{CATEGORY_LABELS[category]}</CategoryTitle>
          <FoodGridContainer>
            {foods.map((food) => (
              <FoodCard key={food.id} onClick={() => onFoodSelect(food.id)}>
                <FoodName>{food.name}</FoodName>
                {food.subCategory && (
                  <SubCategory>{food.subCategory}</SubCategory>
                )}
              </FoodCard>
            ))}
          </FoodGridContainer>
        </CategorySection>
      ))}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
`;

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
`;

const FoodGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const FoodCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const FoodName = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

const SubCategory = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

export default FoodGrid; 