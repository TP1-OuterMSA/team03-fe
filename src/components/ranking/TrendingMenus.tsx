import React from 'react';
import styled from 'styled-components';
import { MenuRankingItem, RankingPeriod } from '../../interface/menu';

interface TrendingMenusProps {
  period: RankingPeriod;
  items?: MenuRankingItem[];
}

// 구현을 위한 mock data
const MOCK_DATA: Record<RankingPeriod, MenuRankingItem[]> = {
  WEEKLY: [
    { id: 1, name: '김치찌개', score: 4.8, rankChange: 5, rank: 1 },
    { id: 2, name: '비빔밥', score: 4.7, rankChange: 3, rank: 2 },
    { id: 3, name: '돈까스', score: 4.6, rankChange: 2, rank: 3 },
  ],
  MONTHLY: [
    { id: 4, name: '삼겹살', score: 4.9, rankChange: 7, rank: 1 },
    { id: 5, name: '치킨', score: 4.8, rankChange: 4, rank: 2 },
    { id: 6, name: '피자', score: 4.7, rankChange: 3, rank: 3 },
  ],
};

const TrendingMenus: React.FC<TrendingMenusProps> = ({ period, items }) => {
  const menuItems = items || MOCK_DATA[period];

  return (
    <Container>
      <Title>급상승 메뉴</Title>
      <MenuGrid>
        {menuItems.map((item) => (
          <MenuItem key={item.id}>
            <MenuImage>🍽️</MenuImage>
            <MenuInfo>
              <MenuName>{item.name}</MenuName>
              <MenuScore>{item.score.toFixed(1)}점</MenuScore>
              <RankChange>↑{item.rankChange}</RankChange>
            </MenuInfo>
          </MenuItem>
        ))}
      </MenuGrid>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
`;

const MenuItem = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`;

const MenuImage = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

const MenuInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const MenuName = styled.div`
  font-weight: 500;
  font-size: 1.1rem;
`;

const MenuScore = styled.div`
  color: #666;
`;

const RankChange = styled.div`
  color: #28a745;
  font-weight: bold;
`;

export default TrendingMenus;
