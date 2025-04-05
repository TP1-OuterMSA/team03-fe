import React from 'react';
import styled from 'styled-components';
import { MenuRankingItem } from '../../interface/menu';

interface RankingListProps {
  title: string;
  items: MenuRankingItem[];
  type: 'top' | 'bottom';
}

const RankingList: React.FC<RankingListProps> = ({ title, items, type }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <List>
        {items.map((item) => (
          <ListItem key={item.id}>
            <Rank>{item.rank}</Rank>
            <Name>{item.name}</Name>
            <Score>{item.score.toFixed(1)}</Score>
            <RankChange $change={item.rankChange}>
              {item.rankChange > 0 ? '↑' : item.rankChange < 0 ? '↓' : '-'}
            </RankChange>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
  cursor: pointer;
  &:hover {
    transform: translateX(4px);
  }
`;

const Rank = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  border-radius: 50%;
  margin-right: 1rem;
  font-weight: bold;
`;

const Name = styled.div`
  flex: 1;
  font-weight: 500;
`;

const Score = styled.div`
  margin: 0 1rem;
  color: #666;
`;

const RankChange = styled.div<{ $change: number }>`
  color: ${({ $change }) => {
    if ($change > 0) return '#28a745';
    if ($change < 0) return '#dc3545';
    return '#6c757d';
  }};
  font-weight: bold;
`;

export default RankingList;
