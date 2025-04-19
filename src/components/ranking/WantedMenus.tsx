import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DesiredFoodItem, RankingPeriod } from '../../interface/menu';
import { getDesiredFoods } from '../../api/menuService';

interface WantedMenusProps {
  title: string;
  period: RankingPeriod;
}

const WantedMenus: React.FC<WantedMenusProps> = ({ title, period }) => {
  const [items, setItems] = useState<DesiredFoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // period에 따라 날짜 범위 계산
  const getDateRange = (selectedPeriod: RankingPeriod) => {
    const endDate = new Date();
    const startDate = new Date();
    const days = selectedPeriod === 'WEEKLY' ? 7 : 30;
    startDate.setDate(startDate.getDate() - days);

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { startDate, endDate } = getDateRange(period);
        const response = await getDesiredFoods(startDate, endDate);
        setItems(response.data);
      } catch (error) {
        console.error('먹고싶은 메뉴 데이터를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (loading) {
    return (
      <Container>
        <Title>{title}</Title>
        <EmptyMessage>로딩 중...</EmptyMessage>
      </Container>
    );
  }

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
        {items.slice(0, 3).map((item, index) => (
          <MenuItem key={`${item.foodName}-${index}`} $rank={index + 1}>
            <Medal>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</Medal>
            <MenuName>{item.foodName}</MenuName>
            <VoteCount>투표수: {Math.round(item.score)}</VoteCount>
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

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;

export default WantedMenus;
