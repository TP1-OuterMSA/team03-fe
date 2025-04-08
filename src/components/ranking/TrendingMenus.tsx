import React from 'react';
import styled from 'styled-components';
import { MenuRankingItem } from '../../interface/menu';

interface TrendingMenusProps {
  items: MenuRankingItem[];
  title: string;
}

const TrendingMenus: React.FC<TrendingMenusProps> = ({ items = [], title }) => {
  if (!items || items.length === 0) {
    return (
      <Container>
        <Title>{title}</Title>
        <EmptyMessage>데이터가 없습니다.</EmptyMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{title}</Title>
      <MenuGrid>
        {items.map((item) => (
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

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;

export default TrendingMenus;
