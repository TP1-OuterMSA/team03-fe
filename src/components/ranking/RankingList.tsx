import React from 'react';
import styled from 'styled-components';
import { MenuRankingData } from '../../interface/menu';

interface RankingListProps {
  items: MenuRankingData[];
  title: string;
}

const RankingList: React.FC<RankingListProps> = ({ items = [], title }) => {
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
      <List>
        {items.map((item, index) => (
          <ListItem key={item.menuId}>
            <Rank>{index + 1}</Rank>
            <Name>{item.menuName}</Name>
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

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;

export default RankingList;
