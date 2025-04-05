import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getMenuRankings } from '../api/menuService';
import { MenuRankingItem, RankingPeriod } from '../interface/menu';
import RankingList from '../components/ranking/RankingList';
import TrendingMenus from '../components/ranking/TrendingMenus';
import WantedMenus from '../components/ranking/WantedMenus';

const MenuRanking = () => {
  const [period, setPeriod] = useState<RankingPeriod>('WEEKLY');
  const [topRankings, setTopRankings] = useState<MenuRankingItem[]>([]);
  const [bottomRankings, setBottomRankings] = useState<MenuRankingItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const response = await getMenuRankings(period);
        setTopRankings(response.data.topRankMenuResponse);
        setBottomRankings(response.data.bottomRankMenuResponse);
      } catch (error) {
        console.error('랭킹 데이터를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [period]);

  return (
    <MenuRankingContainer>
      <RankingHeader>
        <h1>메뉴 랭킹</h1>
        <PeriodToggle>
          <ToggleButton $active={period === 'WEEKLY'} onClick={() => setPeriod('WEEKLY')}>
            주간
          </ToggleButton>
          <ToggleButton $active={period === 'MONTHLY'} onClick={() => setPeriod('MONTHLY')}>
            월간
          </ToggleButton>
        </PeriodToggle>
      </RankingHeader>

      {loading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : (
        <>
          <RankingsContainer>
            <RankingList title="인기 메뉴 TOP 5" items={topRankings} type="top" />
            <RankingList title="하위 메뉴 TOP 5" items={bottomRankings} type="bottom" />
          </RankingsContainer>
          <TrendingMenus period={period} />
          <WantedMenus period={period} />
        </>
      )}
    </MenuRankingContainer>
  );
};

const MenuRankingContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const RankingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PeriodToggle = styled.div`
  display: flex;
  background: #f0f0f0;
  border-radius: 20px;
  padding: 4px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 16px;
  border: none;
  background: ${(props) => (props.$active ? '#fff' : 'transparent')};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.$active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none')};
`;

const RankingsContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

export default MenuRanking;
