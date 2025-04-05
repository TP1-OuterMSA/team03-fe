import React from 'react';
import styled from 'styled-components';
import { MenuRankingItem, RankingPeriod } from '../../interface/menu';

interface WantedMenusProps {
  period: RankingPeriod;
  items?: MenuRankingItem[];
}

// 구현을 위한 mock data
const MOCK_DATA: Record<RankingPeriod, MenuRankingItem[]> = {
  WEEKLY: [
    { id: 1, name: '삼겹살', score: 234, rankChange: 0, rank: 1 },
    { id: 2, name: '치킨', score: 187, rankChange: 0, rank: 2 },
    { id: 3, name: '피자', score: 156, rankChange: 0, rank: 3 },
  ],
  MONTHLY: [
    { id: 4, name: '김치찌개', score: 892, rankChange: 0, rank: 1 },
    { id: 5, name: '비빔밥', score: 745, rankChange: 0, rank: 2 },
    { id: 6, name: '돈까스', score: 621, rankChange: 0, rank: 3 },
  ],
};

const WantedMenus: React.FC<WantedMenusProps> = ({ period, items }) => {
  const menuItems = items || MOCK_DATA[period];
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Container>
      <Title>먹고싶은 메뉴 TOP 3</Title>
      <MenuGrid>
        {menuItems.map((item, index) => (
          <MenuItem key={item.id} $rank={index + 1}>
            <Medal>{medals[index]}</Medal>
            <MenuName>{item.name}</MenuName>
            <VoteCount>투표수: {item.score}</VoteCount>
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

const MenuItem = styled.div<{ $rank: number }>`
  background: ${(props) => (props.$rank === 1 ? '#fff3dc' : '#f8f9fa')};
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-4px);
  }
`;

const Medal = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const MenuName = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const VoteCount = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

export default WantedMenus;
