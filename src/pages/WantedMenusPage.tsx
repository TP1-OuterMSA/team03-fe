import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PeriodSelector from '../components/common/PeriodSelector';
import { DesiredFoodItem, PeriodType } from '../interface/wantedMenu';
import { getDesiredFoodsByPeriod } from '../api/wantedMenuService';

const WantedMenusPage: React.FC = () => {
  const [items, setItems] = useState<DesiredFoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('FIRST_SEMESTER');
  const [periodCategory, setPeriodCategory] = useState<'semester' | 'month'>('semester');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getDesiredFoodsByPeriod(selectedPeriod);
        setItems(response.data);
      } catch (error) {
        console.error('먹고싶은 메뉴 데이터를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
  };

  const handleCategoryChange = (category: 'semester' | 'month') => {
    setPeriodCategory(category);
    // 카테고리 변경 시 해당 카테고리의 첫 번째 옵션 선택
    if (category === 'semester') {
      setSelectedPeriod('FIRST_SEMESTER');
    } else {
      setSelectedPeriod('MONTH_1');
    }
  };

  // 현재 선택된 기간 이름 표시용
  const getPeriodName = (): string => {
    if (selectedPeriod === 'FIRST_SEMESTER') return '1학기';
    if (selectedPeriod === 'SECOND_SEMESTER') return '2학기';

    const monthMatch = selectedPeriod.match(/MONTH_(\d+)/);
    if (monthMatch) {
      return `${monthMatch[1]}월`;
    }

    return '';
  };

  // 현재 연도 가져오기
  const currentYear = new Date().getFullYear();

  return (
    <PageContainer>
      <Title>먹고싶은 메뉴 순위</Title>
      
      <PeriodSelector
        periodCategory={periodCategory}
        selectedPeriod={selectedPeriod}
        onCategoryChange={handleCategoryChange}
        onPeriodChange={handlePeriodChange}
      />

      <SelectedPeriodDisplay>
        <CalendarIcon>📅</CalendarIcon>
        <SelectedPeriodText>
          {currentYear}년 {getPeriodName()} 먹고싶은 메뉴 순위
        </SelectedPeriodText>
      </SelectedPeriodDisplay>

      {loading ? (
        <LoadingContainer>로딩 중...</LoadingContainer>
      ) : !items || items.length === 0 ? (
        <EmptyMessage>데이터가 없습니다.</EmptyMessage>
      ) : (
        <RankingContainer>
          <TopThreeContainer>
            {items.slice(0, 3).map((item, index) => (
              <TopMenuItem key={`${item.foodName}-${index}`} $rank={index + 1}>
                <Medal>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</Medal>
                <MenuName>{item.foodName}</MenuName>
                <VoteCount>투표수: {Math.round(item.score)}</VoteCount>
              </TopMenuItem>
            ))}
          </TopThreeContainer>

          {items.length > 3 && (
            <OtherRankingsContainer>
              {items.slice(3).map((item, index) => (
                <RankingItem key={`${item.foodName}-${index + 3}`}>
                  <RankNumber>{index + 4}</RankNumber>
                  <ItemName>{item.foodName}</ItemName>
                  <ItemScore>{Math.round(item.score)}</ItemScore>
                </RankingItem>
              ))}
            </OtherRankingsContainer>
          )}
        </RankingContainer>
      )}
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


const SelectedPeriodDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
`;

const CalendarIcon = styled.span`
  margin-right: 0.75rem;
  font-size: 1.5rem;
`;

const SelectedPeriodText = styled.div``;

const RankingContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TopThreeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 2rem;
  background-color: #f8f9fa;
`;

const TopMenuItem = styled.div<{ $rank: number }>`
  background: ${(props) => (props.$rank === 1 ? '#fff3dc' : 'white')};
  border-radius: 8px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: transform 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
  }
`;

const Medal = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const MenuName = styled.div`
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const VoteCount = styled.div`
  color: #666;
  font-size: 1rem;
`;

const OtherRankingsContainer = styled.div`
  padding: 1rem 2rem;
`;

const RankingItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const RankNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
`;

const ItemName = styled.div`
  flex: 1;
  font-weight: 500;
`;

const ItemScore = styled.div`
  color: #666;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export default WantedMenusPage;
